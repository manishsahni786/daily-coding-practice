import dotenv from "dotenv";
dotenv.config();
import express from "express";
import prisma from "../REST_CRUD/configs/db.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { errorHandler } from "./middlewares/errorHandler.js";

// import {req, res} from "express"
const app = express();

const PORT = process.env.PORT || 4000;


app.use(express.json());
//routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes)
app.use(errorHandler)



// health route 
app.get('/api/health', (req, res) =>{
    res.status(200).json({Status: 'ok'});
})


//starting server
const startServer = async function(){
    try{
        // await dbConnect();
        await prisma.$connect();
        console.log('Connected to MySQL via Prisma');
        app.listen(PORT, ()=>{
            console.log(`Server started on port :`, process.env.PORT);
        })

    }catch (err){
        console.log('Failed to start server:', err);
    }
}

startServer();












