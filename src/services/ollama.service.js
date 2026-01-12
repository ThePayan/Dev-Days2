import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
    apiKey: 'ollama',
});

export const generateText = async (prompt) => {
    const response = await openai.chat.completions.create({
        model: process.env.OLLAMA_MODEL || 'llama3.2:1b',
        messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content; // Por lo visto, puede generar más de una respuesta, nos quedamos con la primera
};