import express, { Request, Response } from 'express'
import axios from 'axios'
import { analyzePicture, getHistory } from './analysis.controller'
import { parseFiles, uploadFileToStorage } from '../../services/middleware'

const router = express.Router()

router.post('/picture', parseFiles.single('file'), uploadFileToStorage, analyzePicture)
router.get('/history', getHistory)
// router.post('/label', labelData)

export default router