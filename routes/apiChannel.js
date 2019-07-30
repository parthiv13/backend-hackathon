const express = require('express'),
    router = express.Router(),
    mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    databaseUrl = require('../database/config').url,
    database_name = require('../database/config').database_name,
    collection_name = require('../database/config').collection_name;

router.get('/channel/:id', (req, res) => {
    MongoClient.connect(databaseUrl, { useNewUrlParser: true })
    .then(client => {
        client.db(database_name).collection(collection_name).findOne({ id: req.param.id })
        .then(doc => {
            res.send(doc);
        }).catch(err => {
            console.log(err);
            res.send("Couldn't find Channel with id: " + req.param.id);
        })
    }).catch(err => {
        console.log(err);
        res.send('Error connecting to Mongo server');
    });
})

router.get('/channel/search/:searchString', (req, res) => {
    let searchString = req.params.searchString;
    console.log(searchString);
    MongoClient.connect(databaseUrl, { useNewUrlParser: true })
    .then(client => {
        client.db(database_name).collection(collection_name).find({ $text: {
            $search: searchString,
            $diacriticSensitive: true
        }}).toArray()
        .then(docs => {
            res.send(docs);
            console.log(docs.length);
        }).catch(err => {
            console.log(err);
            res.send("Couldn't");
        })
    }).catch(err => {
        console.log(err);
        res.send('Error connecting to Mongo server');
    })
}) 

router.put('/channel', (req, res) => {
    MongoClient.connect(databaseUrl, { useNewUrlParser: true })
    .then(client => {
        client.db(database_name).collection(collection_name).updateOne(req.body.channel)
        .then(doc => {
            res.send({ success: true });
        }).catch(err => {
            res.send({ success: false });
        })
    }).catch(err => {
        console.log(err);
        res.send({ success: false });
    })
});

router.delete('/channel/:id', (req, res) => {
    MongoClient.connect(databaseUrl, { useNewUrlParser: true })
    .then(client => {
        client.db(database_name).collection(collection_name).remove({ id: req.params.id })
        .then(res => {
            res.send({ success: true });
        }).catch(err => {
            res.send({ success: false });
        })
    }).catch(err => {
        console.log(err);
        res.send({ success: false });
    })
})

module.exports = router;