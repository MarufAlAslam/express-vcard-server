const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const app = express();
const port = 8000;

// cors
app.use(cors());

// body parser
app.use(express.json());

const uri =
  "mongodb+srv://vcard_admin:h3qrb6FGPUAkXn0g@cluster0.t32itgc.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // create a collection for cards
    const cardCollection = client.db("vcard").collection("cards");

    // get all cards
    app.get("/api/v1/cards", async (req, res) => {
      const cursor = cardCollection.find({});
      const cards = await cursor.toArray();
      res.send(cards);
    });

    // create a card
    app.post("/api/v1/cards", async (req, res) => {
      const card = req.body;
      const result = await cardCollection.insertOne(card);

      console.log(
        `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`
      );
      res.send(result);
    });

    // update a card and add a new field
    app.put("/api/v1/cards/:id", async (req, res) => {
      const cardId = req.params.id;

      console.log("updating card with id:", cardId);

      const updatedCard = req.body;

      const filter = { _id: new ObjectId(cardId) };

      const options = { upsert: true };

      const updateDoc = {
        $set: {
          ...updatedCard,
        },
      };

      cardCollection.updateOne(filter, updateDoc, options);

      res.send(updatedCard);
    });

    // get a card by id
    app.get("/api/v1/cards/:id", async (req, res) => {
      const cardId = req.params.id;

      console.log("fetching card with id:", cardId);

      const card = await cardCollection.findOne({ _id: new ObjectId(cardId) });

      res.send(card);
    });
  } finally {
  }
}

run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Server is Running');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
