const express=require('express')
const cors=require('cors')
require('dotenv').config()

const app=express()
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("dream toys running")
})
app.listen(port,()=>{
    console.log(`dream toys running${port}`)
})