import { Request, Response } from 'express'
import { evaluatePicture } from './analysis.service'

export const analyzePicture = async (req: Request, res: Response) => {
    try {
        const picture = req.body.file

        // Logic to analyze the image
        //Commenting this to test with the app
        const { predictions: [prediction] } = await evaluatePicture(picture)
        const diagnosisIndex = prediction.confidences.indexOf(Math.max(...prediction.confidences))
        const diagnosis = prediction.displayNames[diagnosisIndex]
        const confidence = prediction.confidences[diagnosisIndex]


        //Dummy valies for testing
        // const diagnosis = 'malignant'
        // const confidence = 0.8

        const approvedConfidenceThreshold = 0.7
        const risk = diagnosis == 'malignant' && confidence > approvedConfidenceThreshold ? 'High Risk' : diagnosis == 'malignant' ? 'Uncertain Risk' : 'Low Risk'
        const descriptions = {
            'High Risk': "Based on the results from our AI analysis, it appears that your lesion exhibits traits that may warrant further evaluation.",
            'Uncertain Risk': "The image couldn't be analyzed appropriately. Please retake the image with better lighting, and make sure the image is focused.",
            'Low Risk': 'Based on the results from our AI, your lesion has traits that are consistent with a benign (non-cancerous) lesion.'
        }
        const recommendationTitles = {
            'High Risk': 'See Healthcare Provider',
            'Uncertain Risk': 'Retake Photo',
            'Low Risk': 'Continue to Monitor'
        }
        const recommendationDescriptions = {
            'High Risk': 'We recommend seeking evaluation from a certified Dermatologist. While our AI analysis has identified traits that are potentially concerning, only a qualified provider can provide a definitive diagnosis. ',
            'Uncertain Risk': 'Please make sure that the image is focused and has good lighting. Retake the image and try again.',
            'Low Risk': 'We recommend to continue to monitor for changes in size, texture, color and bleeding. Consult your healthcare provider if any of these changes occur. Repeat scan monthly. '
        }

        const riskTitles = {
            'High Risk': 'Potentially Concerning',
            'Uncertain Risk': 'Unable to Determine',
            'Low Risk': 'Not Concerning'
        }

        return res.status(200).json({
            diagnosis,
            confidence,
            risk,
            riskTitle: riskTitles[risk],
            description: descriptions[risk],
            recommendationTitle: recommendationTitles[risk],
            recommendationDescription: recommendationDescriptions[risk],
        })
    }
    catch (error: any) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getHistory = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            message: 'History'
        })
    }
    catch (error: any) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// export const labelData = async (req: Request, res: Response) => {
//     try {
//         // Step 1: Get the data from the bucket
//         // const bucket = admin.storage().bucket('gs://2018-skin-lesions')
//         // const files = await bucket.getFiles()

//         // Step 2: Get the CSV from the files folder
//         const file = path.join(__dirname, '../../../files/metadata.csv');

//         const metadata = await new Promise((resolve, reject) => {
//             const results: any = []
//             fs.createReadStream(file)
//                 .pipe(parse({
//                     columns: true, // Assume first row of CSV are column-names
//                     skip_empty_lines: true,
//                 }))
//                 .on('data', (data) => {
//                     results.push(data);
//                 })
//                 .on('end', () => {
//                     resolve(results)
//                 })
//                 .on('error', (error) => {
//                     reject(error)
//                 })
//                 .on('finish', () => {
//                     resolve(results)
//                 })
//         })

//         return res.status(200).json({
//             metadata
//         })
//     }
//     catch (error: any) {

//     }
// }