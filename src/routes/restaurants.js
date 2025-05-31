const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");
const validate = require("../middleware/validators");
const { restaurantValidationRules } = require("../middleware/validationRules");

// Get restaurant recommendations based on coordinates
router.get("/recommendations", auth, restaurantValidationRules.getRecommendations, validate, async (req, res) => {
    try {
        const { latitude, longitude, radius = 100 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        // Google Places API endpoint
        const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
            params: {
                location: `${latitude},${longitude}`,
                radius: radius,
                type: "restaurant",
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });

        // Handle different API response statuses
        if (response.data.status === "ZERO_RESULTS") {
            return res.status(200).json({
                message: "No restaurants found in the specified area",
                restaurants: [],
                total: 0,
                suggestions: ["Try increasing the search radius", "Check if the coordinates are correct", "Try a different location"],
            });
        }

        if (response.data.status !== "OK") {
            throw new Error(`Google Places API error: ${response.data.status}`);
        }

        // Get details for each place
        const restaurants = await Promise.all(
            response.data.results.map(async (place) => {
                try {
                    const details = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
                        params: {
                            place_id: place.place_id,
                            fields: "formatted_phone_number,website,opening_hours,editorial_summary",
                            key: process.env.GOOGLE_MAPS_API_KEY,
                        },
                    });

                    return {
                        id: place.place_id,
                        name: place.name,
                        rating: place.rating,
                        address: place.vicinity,
                        location: {
                            lat: place.geometry.location.lat,
                            lng: place.geometry.location.lng,
                        },
                        types: place.types,
                        photos: place.photos?.map(
                            (photo) =>
                                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
                        ),
                        details: {
                            website: details.data.result?.website,
                            phone: details.data.result?.formatted_phone_number,
                            openingHours: details.data.result?.opening_hours?.weekday_text,
                            description: details.data.result?.editorial_summary?.overview,
                        },
                    };
                } catch (error) {
                    console.error(`Error fetching details for place ${place.place_id}:`, error);
                    return null;
                }
            })
        );

        // Filter out any null results from failed detail fetches
        const validRestaurants = restaurants.filter((place) => place !== null);

        // If no valid restaurants after fetching details
        if (validRestaurants.length === 0) {
            return res.status(200).json({
                message: "No detailed restaurant information available",
                restaurants: [],
                total: 0,
                suggestions: ["Try a different location", "The restaurants in this area might not have detailed information available"],
            });
        }

        res.json({
            restaurants: validRestaurants,
            total: validRestaurants.length,
            message: validRestaurants.length === 1 ? "Found 1 restaurant" : `Found ${validRestaurants.length} restaurants`,
        });
    } catch (error) {
        console.error("Error fetching restaurant recommendations:", error);
        res.status(500).json({
            message: "Error fetching restaurant recommendations",
            error: error.message,
            suggestions: ["Check your internet connection", "Verify the API key is valid", "Try again in a few moments"],
        });
    }
});

module.exports = router;
