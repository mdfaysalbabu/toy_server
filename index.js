const express=require('express')
const cors=require('cors')
require('dotenv').config()
const app=express()
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json())
// mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bx18cif.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const carCollection=client.db("carsDB").collection('cars');
    const carsGallery=client.db("carsDB").collection('gallery');
     
    // allCars
    app.get('/allCars/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)}
        const result=await carCollection.findOne(query);
        res.send(result);
    })

    // galleyCars
    app.get('/gallery',async(req,res)=>{
        const carCursor=carsGallery.find();
        const result=carCursor.toArray();
        res.send(result)
    })
    // myCars
    app.get('/myCars/:email',async(req,res)=>{
       const query={email:req.params.email};
       const result=await carCollection.find(query).toArray();
       res.send(result);
    })
    // postCars
    app.post('postCar',async(req,res)=>{
      const body=req.body;
      const result=await carCollection.insertOne(body);
      res.send(result)
    })
    // updateCars
    app.put('/cars/:id',async(req,res)=>{
        const id=req.params.id;
        const filter={_id :new ObjectId(id)};
        const options={upsert:true};
        const carsUpdate=req.body;
        const user={
            $set:{
                sellerName:carsUpdate.sellerName,
                quantity:carsUpdate.quantity,
                details:carsUpdate.details,
                price:carsUpdate.price
            }
        }
        const result=await carCollection.updateOne(filter,user,options);
        res.send(result)
    })
    // deleteCars
    app.delete('/myCars/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id : new ObjectId(id)};
        const result=await carCollection.deleteOne(query);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("dream toys running")
})
app.listen(port,()=>{
    console.log(`dream toys running${port}`)
})