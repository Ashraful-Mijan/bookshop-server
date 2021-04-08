const express = require('express')
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = 4000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = "mongodb+srv://Bookshopadmin:6sAETwyDuB8uEMF@cluster0.vjryr.mongodb.net/bookshopdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const bookCollection = client.db("bookshopdb").collection("bookstore");
    const ordersCollection = client.db("ordershopdb").collection("orderbookstore");

    // insert single Data
    app.post('/addBooks', (req, res) => {
        const bookReq = req.body;
        bookCollection.insertOne(bookReq)
            .then(result => {
                console.log(result)
            })
    })

    //read data from mongodb
    app.get('/books', (req, res) => {
        bookCollection.find({})
            .toArray((err, books) => {
                res.send(books)
            })
    })

    //read data using filter by id from mongodb
    app.get('/checkout/:id', (req, res) => {
        const id = req.params.id
        bookCollection.find({ _id: ObjectId(id) })
            .toArray((err, items) => {
                res.send(items)
            })
    })

    //inset data for order making new db collection
    app.post('/order', (req, res) => {
        ordersCollection.insertOne(req.body)
        .then(result => console.log(result))
    })

    //read data using filter by email from mongodb
    app.get('/getOrder', (req, res) => {
        ordersCollection.find({email: req.query.email})
        .toArray((err, items) => {
            res.send(items)
        })
    })

    //delete data from mongodb 
    app.delete('/delete/:id', (req, res) => {
        bookCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            console.log(result)
            res.send(result.deletedCount > 0)
        })
    })

    console.log("db connected")
});

app.listen(port)

// const DB_USER = 'Bookshopadmin';
// const DB_PASS = '6sAETwyDuB8uEMF';
// const DB_NAME = 'bookshopdb'
