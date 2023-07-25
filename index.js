require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.SCRIPT_USER}:${process.env.SCRIPT_PASS}@cluster0.mu4fgop.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const scriptCollection = client.db('scriptDB').collection('scripts');

    app.get('/scripts', async (req, res) => {
        const cursor = scriptCollection.find();
        const result = await cursor.toArray();
        res.send(result);

    });

    app.post('/script', async (req, res) => {
        const script = req.body;
        const result = await scriptCollection.insertOne(script);
        res.send(result)
    })

    app.delete('/script/:id', async (req, res) => {
        const id = req.params.id;           
        const query = { _id: new ObjectId(id) }   
        const result = await scriptCollection.deleteOne(query);
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


app.get('/', (req, res) => {
    res.send('script writing is running server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})