import { Request, Response, NextFunction } from "express";
import admin, { auth } from "../utils/firebase";
import multer from 'multer'
import sharp from "sharp";

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
        const user = await admin.auth().verifyIdToken(token)

        if (user) {
            req.body.user = user
            return next()
        }
        else {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
    }
    catch (error: any) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const parseFiles = multer({ storage: multer.memoryStorage() })

export const uploadFileToStorage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bucket = admin.storage().bucket('gs://oneskin-ai.appspot.com')
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded'
            })
        }
        const resizedFile = await sharp(req.file.buffer)
            .resize(500, 500, {
                // fit: sharp.fit.inside
            })
            .jpeg()
            .toBuffer()
        req.body.file = resizedFile.toString('base64')
        // const file = bucket.file(`${req.file.originalname.split('.')[0]}.jpeg`)
        // const fileResponse = await file.save(resizedFile, {
        //     metadata: {
        //         contentType: 'image/jpeg'
        //     }
        // })
        next()
    }
    catch (error: any) {
        console.error("ERROR IN FILE UPLOAD MIDDLEWARE: ", error)
        return res.status(500).json({
            message: error.message
        })
    }
}