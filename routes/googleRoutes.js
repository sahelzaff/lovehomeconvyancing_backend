// Import necessary modules
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const apiKey = 'AIzaSyAyDkB4N0m0fIqaYObioiFrvOrY3Ij9S0w'; // Replace with your actual Google API key
const placeId = 'ChIJuVZASW-tEmsRfyvvBn4Maxk'; // Replace with your business Place ID

// Route to fetch Google reviews with pagination
router.get('/google-reviews', async (req, res) => {
    try {
        let allReviews = [];

        let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;

        // Fetch initial reviews
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch Google reviews');
        }

        let data = await response.json();
        if (data.result && data.result.reviews) {
            allReviews = data.result.reviews;
        }

        // Fetch additional reviews using pagination
        while (data.next_page_token) {
            // Wait for a few seconds as per Google's recommendation before making the next request
            await new Promise(resolve => setTimeout(resolve, 2000));

            url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&pagetoken=${data.next_page_token}`;
            response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch Google reviews with pagination');
            }

            data = await response.json();
            if (data.result && data.result.reviews) {
                allReviews = [...allReviews, ...data.result.reviews];
            } else {
                throw new Error('No reviews found in paginated response');
            }
        }

        res.json(allReviews);
    } catch (error) {
        console.error('Error fetching Google reviews:', error);
        res.status(500).json({ error: 'Failed to fetch Google reviews' });
    }
});

export default router;
