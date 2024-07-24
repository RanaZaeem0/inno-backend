import express,{Request,Response} from "express"
import mainRoute from "./route"
const cors  = require('cors')


const app = express()
const port  =   3000
app.use(express.json())
app.use(cors())
app.use('/api',mainRoute)

app.get('/',(req:Request,res:Response)=>{
   res.json({
     username:"zain",
     email:"zain@gmail.com"
   })
})


app.listen(port,()=>{
  console.log(`servesr is rungung on port ${port}`);
  
})