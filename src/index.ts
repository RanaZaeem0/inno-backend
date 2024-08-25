import express,{Request,Response} from "express"
import mainRoute from "./route"
import { PrismaClient } from "@prisma/client"
import { log } from "console"
const cors  = require('cors')

const clinet = new PrismaClient()



const app = express()
const port  =process.env.PORT || 3000
app.use(express.json())
app.use(cors())
app.use('/api',mainRoute)

app.get('/',(req:Request,res:Response)=>{
   res.json({
     username:"zain",
     email:"zain@gmail.com"
   })
})



clinet.$connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });






app.listen(port,()=>{
  console.log(`servesr is rungung on port ${port}`);
  
})
