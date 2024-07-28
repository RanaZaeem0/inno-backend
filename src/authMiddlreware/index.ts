
const jwt = require('jsonwebtoken')
import {  Request,Response} from "express"
import dotenv from 'dotenv';
import { string } from "zod";
import { log } from "console";

dotenv.config({
  path:'../env'
});

const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret';
async function  authMiddleware(req:Request,res:Response,next:any) {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token ,"dasd");
    
    if (!token) {
      return res.status(401).json({ message: 'Access token is missing or invalid' });
    }
  
    try {
  
      const decoded = await jwt.verify(token, JWT_SECRET);
      console.log(decoded);
       req.userId  = decoded.id; 
      console.log(decoded.id);
      
       next();

    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
}

export default authMiddleware