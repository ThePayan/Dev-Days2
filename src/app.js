import express from 'express';
import userRouter from './routes/user.routes.js';
import swaggerUi from 'swagger-ui-express';
import { bundle } from '@readme/openapi-parser';
import { issueRouter } from './routes/issue.routes.js';
import { auditRouter } from './routes/audit.routes.js';
import { aiRouter } from './routes/ai.routes.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('APP: Hello, ISA DevDays 2025!');
});

app.use('/api/v1', userRouter);
app.use('/api/v1', issueRouter);
app.use('/api/v1', auditRouter);
app.use('/api/v1', aiRouter);
export default app;