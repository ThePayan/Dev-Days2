import { getAIService } from '../services/ai.choose.js';

export const generateAIResponse = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        const aiService = getAIService();
        const aiResponse = await aiService.generateText(prompt);
        res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error('Error in generateAIResponse:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};