const express=require('express')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const db=require ('./config/connection')
const app=express()
const UserRoute=require('./routes/userRouter')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const corsOptions={
    Origin:'https://localhost:5173',
    credential:true
}
app.use(cors(corsOptions))
db.connectMongoClient()

const PORT=3000

app.use('/',UserRoute)
app.listen(PORT,()=>{console.log(`Server running at ${PORT}`);
})