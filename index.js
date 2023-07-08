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
  },
  useNewUrlParser:true,
  useUnifiedTopology:true,
  maxPoolSize:10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect()
     client.connect((error)=>{
      if(error){
        console.error(error);
        return
      }
    });

    const toysCollection = client.db("toysMarket").collection("toys")


//     const indexKeys ={name:1};
//     const indexOptions = {name:'toyname'}
// const result= await toysCollection.createIndex(indexKeys,indexOptions)


    app.get('/alltoys/:orders',async(req,res)=>{
        const order =req.params.orders;
        const limitquery = parseInt(req.query.limit)
    
        // console.log(limitquery);
        if(order=== 'true'){
            const toys = await toysCollection.find({}).sort({price: 1}).limit(limitquery).toArray()
            res.send(toys)
        }

       else if(order==='false'){
        const toys = await toysCollection.find({}).sort({price: -1}).limit(limitquery).toArray()
        res.send(toys)
       }
        


    })

    app.get('/alltoy/:text',async(req,res)=>{

        const text = req.params.text;
        // console.log(text);
        const result = await toysCollection.find({
            $or:[
                {name:{$regex: text,$options: "i"}}
            ],
        }).toArray();
        res.send(result)


    })


    app.get('/toy/:id',async(req,res)=>{
      const id = req.params.id;
      const result=await toysCollection.findOne({_id: new ObjectId(id)});
      res.send(result)
    })

    app.get('/mytoy/:email',async(req,res)=>{
      const email = req.params.email;
        const result= await toysCollection.find({email: email}).toArray();
        res.send(result)
    })

    app.get('/toys/:categroy',async(req,res)=>{

      const categroy = req.params.categroy;
      // console.log(categroy);
      const result = await toysCollection.find({category: categroy}).toArray();
      res.send(result)

    })
    app.get('/toyphoto',async(req,res)=>{

      const query={};
      const options = {
        projection:{
          toyphoto:1,
          name:1,price:1
        }
      }
      const result= await toysCollection.find(query,options).toArray();
      res.send(result)
      
    })


    app.post('/addtoy',async(req,res)=>{
        const body = req.body
        body.createdAt = new Date();
        const result = await toysCollection.insertOne(body);
        res.status(200).send(result);

    })

    app.put('/updateData/:id',async(req,res)=>{
      const id = req.params.id;
      const updateBody = req.body;
      // console.log(id,updateBody);
      const filter = {_id: new ObjectId(id)};
      const option = {upsert:true};
      const updateDoc ={
        $set:{
          price: updateBody.price,
          quantity: updateBody.quantity,
          details: updateBody.details
        }
      }
      const result = await toysCollection.updateOne(filter,updateDoc,option);
      res.send(result)

    })

    app.delete('/deleteToy/:id',async(req,res)=>{

      const id = req.params.id;
      const result= await toysCollection.deleteOne({_id: new ObjectId(id)});
      res.send(result)


    })


    // FOR TEST 
    app.get('/test',async(req,res)=>{
      res.send('server working')
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