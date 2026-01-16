import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('http-metrics');

const httpRequestDuration = meter.createHistogram('http_request_duration_seconds', {
    description: 'Duration of HTTP requests',
    unit: 's',
});

export const responseTimeMiddleware = (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        // Calculate duration in seconds
        const diff = process.hrtime(start);
        const durationInSeconds = diff[0] + diff[1] / 1e9;

        const attributes = {
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode,
        };

        httpRequestDuration.record(durationInSeconds, attributes);
    });

    next();
};
