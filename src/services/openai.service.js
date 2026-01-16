import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateText = async (prompt) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
};

export const generateWeatherSummary = async (weatherData) => {
    const prompt = `Analyze the following weather data for the last 7 days and provide a concise, engaging summary suitable for an audio report. Focus on trends and average temperature. Data: ${JSON.stringify(weatherData)}`;
    // const prompt = `Analyze the following weather data for the last 7 days and provide a concise, engaging summary suitable for an audio report. Do it in Spanish. Focus on trends and average temperature. Data: ${JSON.stringify(weatherData)}`;
    
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: 'You are a helpful weather reporter.' }, { role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
};

export const generateAudio = async (text) => {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1", // Preferible al gpt-4o-mini-tts, dado a que es de lectura y no de chat
        voice: "alloy",
        input: text,
    });
    return Buffer.from(await mp3.arrayBuffer());
};