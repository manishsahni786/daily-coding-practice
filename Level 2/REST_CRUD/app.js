import dotenv from "dotenv";
dotenv.config();
import express from "express";
import prisma from "./configs/db.js";                 // fixed path
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';           // 127.0.0.1 locally via .env

app.use(express.json());

// ---- public utility routes ----
app.get('/api/health', (req, res) => {
    res.status(200).json({ Status: 'ok' });
});

// test-only routes: not available in production
if (process.env.NODE_ENV !== 'production') {
    app.get('/api/whoami', (req, res) => {
        res.status(200).json({ port: PORT, pid: process.pid });
    });

    app.get('/api/slow', async (req, res) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        res.status(200).json({ port: PORT, pid: process.pid, slow: true });
    });
}

// ---- application routes ----
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

// error handler must be last
app.use(errorHandler);

// starting server
const startServer = async function () {
    try {
        await prisma.$connect();
        console.log('Connected to MySQL via Prisma');

        const server = app.listen(PORT, HOST, () => {
            console.log(`Server started on ${HOST}:${PORT}`);
        });

        // containers are stopped with SIGTERM: finish requests, close DB, exit
        const shutdown = async (signal) => {
            console.log(`${signal} received, shutting down`);
            server.close(async () => {
                await prisma.$disconnect();
                process.exit(0);
            });
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (err) {
        console.log('Failed to start server:', err);
        process.exit(1);                               // let Docker see the failure and restart
    }
};

startServer();












