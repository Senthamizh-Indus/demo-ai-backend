import multer from 'multer';
import * as path from 'path';
// import { Request, Response, NextFunction } from 'express';

// const imageFilter = function (req: Request, file: Express.Multer.File, cb): void {
//     // accept image only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };

// const upload = multer({ dest: '/', fileFilter: imageFilter });

// const upload = multer({ dest: path.resolve(__dirname, '..', 'uploads')});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '..', 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

export { upload }