import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// field image_uuid must be set by the post-creating endpoint
export type RequestWithUUID = Request & { image_uuid: string };

export const supportedMimeTypeToFileExtension: { [key: string]: string } = {
    // https://www.w3docs.com/learn-html/html-img-tag.html#supported-image-formats-21
    "image/apng": "apng",
    "image/bmp": "bmp",
    "image/gif": "gif",
    // TODO: handle image/heic and image/heif with conversion to a different image format
    "image/jpeg": "jpg",
    "image/png": "png",
    // SVG is supported by <img> but multer strangely leaves req.file === undefined for it.
    // "image/svg": "svg",
    "image/webp": "webp",
};

export const UgcStorage = multer.diskStorage({
    destination: (req: RequestWithUUID, file, callback) => {
        callback(null, path.resolve(__dirname, '../../ugc-images', req.image_uuid.slice(0, 2)));
    },
    filename: (req: RequestWithUUID, file, callback) => {
        if (file.mimetype in supportedMimeTypeToFileExtension) {
            callback(null, `${req.image_uuid.slice(2)}.${supportedMimeTypeToFileExtension[file.mimetype]}`);
        }
        else {
            callback(new Error(`unsupported MIME type: ${file.mimetype}`), '');
        }
    }
});
