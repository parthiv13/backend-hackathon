const express = require('express'),
    app = express(),
    mongodb = require('mongodb'),
    csv = require('fast-csv');

let flag = 0;
const databaseUrl = require('./database/config').url;

const MongoClient = mongodb.MongoClient;

MongoClient.connect(databaseUrl, { useNewUrlParser: true })
    .then(client => {
        csv.fromPath('./database/channels_yt1e0298c.csv', { headers: true })
            .on('data', (data) => {
                client.db('Channels').collection('channel').insertOne({
                    rank: data.rank,
                    grade: data.grade,
                    name: data.channel_name,
                    video_uploads: data.video_uploads,
                    subscribers: data.subscribers,
                    video_views: data.video_views
                }).then(result => {
                    console.log(flag++);
                    //client.close();
                }).catch(err => console.log(err));
            }).on('end', () => {
                console.log('done');
                client.close();
            })
    }).catch(err => console.log(err));
