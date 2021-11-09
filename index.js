const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.845tn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("doctorsPortal");
        const userCollection = database.collection("users");
        const appoinmentCollection = database.collection("appoinment");


        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await userCollection.insertOne(users);
            console.log(result);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            console.log(result);
            res.json(result);
        });
        app.put('/users/admin', async (req, res) => {
            const admin = req.body;
            const filter = { email: admin.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.json(result);
        });

        app.post('/appoinments', async (req, res) => {
            const appoinment = req.body;
            const result = await appoinmentCollection.insertOne(appoinment);
            console.log(result);
            res.json(result);
        });

        app.get('/appoinments', async (req, res) => {
            const email = req.query.email;
            // const date = req.query.date;
            const date = new Date(req.query.date).toLocaleDateString();
            console.log(date);
            const query = { email: email, date: date };
            console.log(query);
            const cursor = appoinmentCollection.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.json(result);
        });


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`localhost start ${port}`);
})


        // app.get('/users');
        // app.post('/users');
        // app.get('/user/:id');
        // app.put('/user/:id');
        // app.delete('/users/:id')