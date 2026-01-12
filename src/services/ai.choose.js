import * as openAIService from './openai.service.js';
import * as ollamaService from './ollama.service.js';

export const getAIService = () => {
    const provider = process.env.AI_PROVIDER || 'ollama';

    switch (provider.toLowerCase()) {
        case 'ollama':
            return ollamaService;
        case 'openai':
            return openAIService;
        default:
            throw new Error('Invalid AI provider');
    }
};
