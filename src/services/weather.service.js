import { getAIService } from './ai.choose.js'; 

export const getCoordinates = async (city) => {
    const params = new URLSearchParams({
        name: city,
        count: '1',
        language: 'en',
        format: 'json'
    });
    const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error(`Coordinates not found for city: ${city}`);
        }
        
        return {
            latitude: data.results[0].latitude,
            longitude: data.results[0].longitude,
            name: data.results[0].name,
            country: data.results[0].country
        };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
};

export const getWeeklyWeather = async (city, days = 7) => {
    try {
        const { latitude, longitude } = await getCoordinates(city);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const formatDate = (date) => date.toISOString().split('T')[0];

        const params = new URLSearchParams({
            latitude,
            longitude,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            daily: 'temperature_2m_mean',
            timezone: 'auto'
        });

        const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`;

        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (!data.daily || !data.daily.time || !data.daily.temperature_2m_mean) {
            throw new Error('Invalid data from OpenMeteo');
        }

        return data.daily.time.map((time, index) => ({
            date: time,
            temp: data.daily.temperature_2m_mean[index]
        }));

    } catch (error) {
        console.error('Error fetching weekly weather:', error);
        throw error;
    }
};



export const generateWeatherAudioReport = async (city) => {

    const weatherData = await getWeeklyWeather(city, 7);

    const aiService = getAIService();


    if (!aiService.generateWeatherSummary || !aiService.generateAudio) {
        throw new Error('Current AI Provider does not support weather summary or audio generation.');
    }

    const summary = await aiService.generateWeatherSummary(weatherData);

    // 5. Generate Audio
    const audioBuffer = await aiService.generateAudio(summary);

    return audioBuffer;
};
