const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());


//MongoDB database

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hxgse1v.mongodb.net/?retryWrites=true&w=majority`;

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

        const brandsCollections = client.db('brandWheelsDB').collection('brands');
        const brandsProductsCollections = client.db('brandWheelsDB').collection('brandsProducts');
        const advertisementsCollections = client.db('brandWheelsDB').collection('advertisements');
        const myCartsCollections = client.db('brandWheelsDB').collection('myCarts');

        app.get('/brands', async (req, res) => {
            const cursor = brandsCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/brandsProducts', async (req, res) => {
            const addNewProduct = req.body;
            const result = await brandsProductsCollections.insertOne(addNewProduct);
            res.send(result);
        })

        app.get('/brandsProducts', async (req, res) => {
            const cursor = brandsProductsCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/advertisements', async(req, res) => {
            const cursor = advertisementsCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/myCarts', async (req, res) => {
            const addTOCart = req.body;
            const result = await myCartsCollections.insertOne(addTOCart);
            res.send(result);
        })


        app.get('/myCarts', async (req, res) => {
            const cursor = myCartsCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Brand shop server is running');
})


app.listen(port, () => {
    console.log(`Brand shop server is running on port ${port}`);
})