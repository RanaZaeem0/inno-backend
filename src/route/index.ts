import  express,{Request,Response}  from "express";
import userRoute from "./user";
import blogRoute from "./blog";

const mainRoute  = express.Router()

mainRoute.use('/user',userRoute)
mainRoute.use('/post',blogRoute)

mainRoute.get('/',(req:Request,res:Response)=>{
    res.json({
      msg:"fine !"
    })
 })

export default mainRoute