import { getAIService } from '../services/ai.choose.js';
import { generateWeatherAudioReport } from '../services/weather.service.js';

export const generateAIResponse = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        const aiService = getAIService();
        const aiResponse = await aiService.generateText(prompt);

        return res.status(201).json({ response: aiResponse });
    } catch (error) {
        console.error('Error in generateAIResponse:', error);
        return res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
};


export const getWeatherAudioSummary = async (req, res) => {
    try {
        const { city } = req.body;

        if (!city) {
            return res.status(400).json({ message: 'City is required' });
        }
        const audioBuffer = await generateWeatherAudioReport(city);
        res.set({
            'Content-Type': 'audio/mp3',
            'Content-Length': audioBuffer.length,
        });
        return res.send(audioBuffer);

    } catch (error) {
        console.error('Error in getWeatherAudioSummary:', error);
        return res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
};