import { generateText } from '../services/openai.service.js' ; // or '../services/ollama.service.js' if we want to try Ollama
// import { generateText } from '../services/ollama.service.js';
export const generateAIResponse = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        const aiResponse = await generateText(prompt);
        res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error('Error in generateAIResponse:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};