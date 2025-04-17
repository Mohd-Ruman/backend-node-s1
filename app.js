import express from "express";
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptonRouter from './routes/subscription.routes.js';

import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/subscriptions', subscriptonRouter )

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Welcome to the subscription tracking api');
})


app.listen(PORT, async () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    await connectToDatabase();
})

export default app;