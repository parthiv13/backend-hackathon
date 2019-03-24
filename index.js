const express = require('express'),
app = express(),
mongodb = require('mongodb'),
morgan = require('morgan'),
cors = require('cors'),
bodyParser = require('body-parser');

const MongoClient = mongodb.MongoClient,
databaseUrl = require('./database/config').url,
collection_name = require('./database/config').collection_name,
database_name = require('./database/config').database_name,
port = process.env.PORT || 8080;

let TOTAL_DOCS;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use(cors());

app.get('/', (req, res) => {
    res.send('FO');
});

MongoClient.connect(databaseUrl, { useNewUrlParser: true })
.then(client => [
    client.db(database_name).collection(collection_name).countDocuments({})
    .then(count => {
        TOTAL_DOCS = count;
        console.log(TOTAL_DOCS);
    })
]);

app.get('/channels', (req, res) => {
    let page = req.query.page;
    MongoClient.connect(databaseUrl, { useNewUrlParser: true })
        .then(client => {
            client.db(database_name).collection(collection_name).find({}).limit(15).skip(page*15).toArray()
            .then(docs => {
                res.setHeader('X-Total-Count', TOTAL_DOCS);
                res.send(docs);
                console.log('sent')
            }).catch(err => {
                console.log(err);
                res.send('Error at fetching docs');
            })
        }).catch(err => {
            console.log(err);
            res.send('Error connecting to Mongo server');
        });
});

app.get('/channels/:name', (req, res) => {
    console.log(req.params.name)
    MongoClient.connect(databaseUrl, { useNewUrlParser: true })
    .then(client => {
        client.db(database_name).collection(collection_name).findOne({ name: req.params.name})
        .then(doc => {
            if(doc === null) {
                res.send("Couldn't find any");
                console.log("no record");
            } else {
                res.send(doc);
                console.log(doc);
            }
        }).catch(err => {
            console.log(err);
            res.send('Couldnt find any');
        })
    }).catch(err => {
        console.log(err);
        res.send('Error connecting to Mongo server');
    })
})

app.listen(port, () => {
    console.log('http://localhost:' + port + '/');
});