import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// field image_uuid must be set by the post-creating endpoint
export type RequestWithUUID = Request & { image_uuid: string };

export const UgcStorage = multer.diskStorage({
    destination: (req: RequestWithUUID, file, callback) => {
        callback(null, path.resolve(__dirname, '../../ugc-images', req.image_uuid.slice(0, 2)));
    },
    filename: (req: RequestWithUUID, file, callback) => {
        // TODO: add file extension based on file.mimetype
        callback(null, req.image_uuid.slice(2) + '.jpg');
    }
});
