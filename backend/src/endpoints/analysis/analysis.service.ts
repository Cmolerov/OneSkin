import axios from "axios"
import { GoogleAuth } from "google-auth-library"

export const evaluatePicture = async (image: string, confidenceThreshold = 0.5, maxPredictions = 15) => {
    // Hit the model hosted on Vertex
    const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    })
    const client = await auth.getClient()
    const { token } = await client.getAccessToken()

    const response = await axios({
        method: 'POST',
        url: `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.PROJECT_ID}/locations/us-central1/endpoints/${process.env.ENDPOINT_ID}:predict`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: {
            instances: [{
                content: image
            }],
            parameters: [{
                maxPredictions,
                confidenceThreshold
            }]
        }
    })

    return response.data
}