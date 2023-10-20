const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const userCollection = client.db("productDb").collection("user");
        const cartCollection = client.db("productDb").collection("cart");

        
        app.post('/add-product', async(req, res)=>{
            const newCoffee = req.body;
            const result = await productCollection.insertOne(newCoffee);
            res.send(result);
    })

    app.get('/get-product', async(req, res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/get-product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })


    app.get('/productDetails/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.put('/update/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateProduct = req.body;
      const product = {
        $set: {
          image:updateProduct.image,
           nam:updateProduct.nam,
           brand:updateProduct.brand,
           type:updateProduct.type,
          price:updateProduct.price,
           rating:updateProduct.rating
        }
      }

      const result = await productCollection.updateOne(filter, product, options);
      res.send(result)
    })

    //cart api

    app.post('/cart', async(req, res)=>{
      const cart = req.body;
      console.log(cart)
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    })

    app.get('/cart-product', async(req, res)=>{
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete('/cart-product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: id}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })



    //user api 

    app.post('/user', async(req, res)=>{
      const user = req.body;
      console.log(user)
      const result = await userCollection.insertOne(user);
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
