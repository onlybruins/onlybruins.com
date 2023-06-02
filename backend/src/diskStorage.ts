import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// field image_uuid must be set by the post-creating endpoint
export type RequestWithUUID = Request & { image_uuid: string };

export const UgcStorage = multer.diskStorage({
    destination: (req: RequestWithUUID, file, callback) => {
        // TODO: create the two-letter directory if it doesn't exist. multer won't do it for us.
        console.log('UgcStorage:destination: returning', path.resolve(__dirname, '../../ugc-images', req.image_uuid.slice(0, 2)));
        callback(null, path.resolve(__dirname, '../../ugc-images', req.image_uuid.slice(0, 2)));
    },
    filename: (req: RequestWithUUID, file, callback) => {
        // TODO: add file extension based on file.mimetype
        console.log('UgcStorage:filename: returning', req.image_uuid.slice(2) + '.jpg');
        callback(null, req.image_uuid.slice(2) + '.jpg');
    }
});
