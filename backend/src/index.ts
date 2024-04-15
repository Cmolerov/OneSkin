import express from 'express'
import dotenv from 'dotenv'
import analyzeRoutes from './endpoints/analysis'
import { analyzePicture } from './endpoints/analysis/analysis.controller'

dotenv.config({
    path: '.env'
})

const app = express()

app.use(express.json())

app.use('/analyze', analyzeRoutes)

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Healthy' })
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})