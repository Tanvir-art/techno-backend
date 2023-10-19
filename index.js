const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


 //technoDb  L2jST9EsjtU4gXyC

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crzw9rp.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;

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

        // Connect to the "insertDB" database and access its "haiku" collection
        const productCollection = client.db("productDb").collection("coffee");

        
        app.post('/add-product', async(req, res)=>{
            const newCoffee = req.body;
            const result = await productCollection.insertOne(newCoffee);
            res.send(result);
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

app.get('/', (req, res)=>{
    res.send('product making server');
})

app.listen(port, ()=>{
    console.log(`Product server running at ${port}`);
})
