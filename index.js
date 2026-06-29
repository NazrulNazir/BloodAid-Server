const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// midlewire
app.use(express.json());
app.use(
  cors({
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
    const db = client.db("BloodAid");
    const districtsCollection = db.collection("districts");
    const upazilaCollection = db.collection("upazilas");
    const userCollection = db.collection("user");
    const createDonationRequest = db.collection("donationRequest");

    // ================= ROUTES =================

    // districts
    app.get("/districts", async (req, res) => {
      const result = await districtsCollection.find().toArray();
      res.send(result);
    });

    // upazilas
    app.get("/upazilas", async (req, res) => {
      const result = await upazilaCollection.find().toArray();
      res.send(result);
    });

    // all users
    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // all Data dekha jabe
    app.get("/donationRequest", async (req, res) => {
      const result = await createDonationRequest.find().toArray();
      console.log(result);
      res.send(result);
    });

    // gmail match kora data gula dekha jabe
    app.get("/donationRequest/:email", async (req, res) => {
      const { email } = req.params;
      const result = await createDonationRequest
        .find({ requesterEmail: email })
        .toArray();
      res.send(result);
    });

    app.get("/donationRequest/status/:status", async (req, res) => {
      const { status } = req.params;
      const result = await createDonationRequest
        .find({ donationStatus: status })
        .toArray();
      res.send(result);
    });

    // recent 3 get data
    // app.get("/manageFacilities/:email", verifyToken, async (req, res) => {
    //   const { email } = req.params;

    //   const result = await facilityCollection.find({ email }).toArray();
    //   res.send(result);
    // });

    // app.get("/recentDonationRequest", async (req, res) => {
    //   const recentDonationRequest = await createDonationRequest
    //     .find({})
    //     .sort({ _id: -1 })
    //     .limit(3)
    //     .toArray();
    //   res.send(recentDonationRequest);
    // });

    app.get("/recentDonationRequest/:email", async (req, res) => {
      const { email } = req.params;

      const result = await createDonationRequest
        .find({ requesterEmail: email })
        .sort({ _id: -1 })
        .limit(3)
        .toArray();

      res.send(result);
    });

    // Create data
    app.post("/createDonationRequest", async (req, res) => {
      const donationRequest = req.body;
      const result = await createDonationRequest.insertOne(donationRequest);
      res.send(result);
    });

    // update Profile
    app.patch("/user/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const modifyProfile = req.body;

        console.log("ID:", id);
        console.log("Body:", modifyProfile);

        const result = await userCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: modifyProfile },
        );

        console.log(result);

        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
      }
    });

    // my donation request page edit
    app.patch("/donation-request/Edit/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const modifyProfile = req.body;

        console.log("ID:", id);
        console.log("Body:", modifyProfile);

        const result = await createDonationRequest.updateOne(
          { _id: new ObjectId(id) },
          { $set: modifyProfile },
        );

        console.log(result);

        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
      }
    });

    // status update
    app.patch("/donation-request/status/:id", async (req, res) => {
      const { id } = req.params;
      const { donationStatus } = req.body;

      const result = await createDonationRequest.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            donationStatus,
          },
        },
      );

      res.send(result);
    });

    // DELETE Area
    app.delete("/recentDonationRequest/:id", async (req, res) => {
      const { id } = req.params;

      const result = await createDonationRequest.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // Details
    app.get("/donation-request/:id", async (req, res) => {
      const id = req.params.id;

      const result = await createDonationRequest.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
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
