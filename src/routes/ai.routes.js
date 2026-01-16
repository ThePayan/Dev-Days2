import { generateAIResponse, getWeatherAudioSummary } from '../controllers/ai.controller.js';
import { Router } from 'express';

const aiRouter = Router();

aiRouter.post('/ai/chat', generateAIResponse);
aiRouter.post('/ai/weather-summary', getWeatherAudioSummary);

export { aiRouter };