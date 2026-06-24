const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// midlewire
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {

    const db = client.db('BloodAid');
    const districtsCollection = db.collection('districts');
    const upazilaCollection = db.collection('upazilas');
    
    // ================= ROUTES =================

    // districts
    app.get('/districts', async (req, res)=> {
      const result = await districtsCollection.find().toArray();
      res.send(result);
    })
    
    // upazilas
    app.get('/upazilas', async (req, res)=> {
      const result = await upazilaCollection.find().toArray();
      res.send(result);
    })
    


    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!",);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Server is running");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
