// THIS MUST BE IMPORTED FIRST TO INITIALIZE OTEL
import './otel.js';
import app from './app.js';
import { connectDB } from './db/connection.js';




const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/isadevdays2025';
const PORT = process.env.PORT || 3000;
connectDB(MONGO_URI);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API docs available at http://localhost:${PORT}/docs`);
});