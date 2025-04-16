
import axios from 'axios';
import https from 'https';
import Config from 'react-native-config';

const BASE_URL = Config.API_URL || 'https://192.81.212.133:9448';
const matcherCompareUrl = `${BASE_URL}/api/v1/facematchercompare`;

interface ICompareFacesResult {
    cosine_dist: any;
    similarity: any;
    comparison_result: any;
}

export const compareFaces = async (
    imageData: string,
    imageCandidate: string
): Promise<ICompareFacesResult> => {
    console.log('Getting Face Comparison Result...');
    const payload = {
        search_image: imageData,
        candidate_image: imageCandidate,
    };

    try {
        const response = await axios.post<ICompareFacesResult>(
            matcherCompareUrl,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                // Handle SSL certificate validation
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false // Only use this in development
                })
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error comparing faces:', error);
        throw error;
    }
};