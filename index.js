const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
require("dotenv").config();




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mcjrvhr.mongodb.net/?retryWrites=true&w=majority`;

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

    const toysCollection = client.db("toysMarket").collection("toys")

    app.get('/alltoys/:orders',async(req,res)=>{
        const order =req.params.orders;
        const limitquery = parseInt(req.query.limit)
    
        console.log(limitquery);
        if(order=== 'true'){
            const toys = await toysCollection.find({}).sort({createdAt: 1}).limit(limitquery).toArray()
            res.send(toys)
        }

       else if(order==='false'){
        const toys = await toysCollection.find({}).sort({createdAt: -1}).limit(limitquery).toArray()
        res.send(toys)
       }
        


    })

    app.post('/addtoy',async(req,res)=>{
        const body = req.body
        body.createdAt = new Date();
        const result = await toysCollection.insertOne(body);
        res.status(200).send(result);

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



















app.get('/',(req,res)=>{
    res.send('Khelaghor server running')
})

app.listen(port,()=>{
    console.log(`khelaghor running in ${port}`);
})