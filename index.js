"use strict";

require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
// const morgan = require('morgan');
const app = express();
const datasets = require('./datasets');
const { Parser } = require('json2csv');
const aws = require('aws-sdk');

const PORT = process.env.PORT || 3333;
const S3_BUCKET = process.env.S3_BUCKET;

aws.config.region = 'us-east-2';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// use morgan logger middleware
// app.use(morgan('dev'));

app.get('/', (req, res)=>{
    res.json({
        "Greetings": "Welcome to this API"
    });
});

app.post('/webhook', (req, res)=>{
    const params = req.body.text.split(" ");
    if(params[0] === "list"){
        const fetchData = datasets(parseInt(params[1]));
        if (fetchData){
            res.json({
                "attachments": [{"text": `ID: ${params[1]}`}, {"text": `NAME: ${fetchData.name}`}, {"text": `HABITAT: ${fetchData.habitat}`}]
            })
        }else{
            res.json({
                "text": "No data found"
            })
        }
    }else if(params[0] === "sheet"){
        const fetchData = datasets(parseInt(params[1]));
        if (fetchData){
            const fields = ['ID', 'NAME', 'HABITAT'];
            const json2csvParser = new Parser({ fields });
            const animalList = {'ID': params[1], 'NAME': fetchData.name, 'HABITAT': fetchData.habitat}
            const csv = json2csvParser.parse(animalList);
            const s3 = new aws.S3();
            const fileName = 'animals/animal-' + Date.now() + '-' + params[1] + '.csv';

            const s3Params = {
                Bucket: S3_BUCKET,
                Key: fileName,
                ACL: 'public-read',
                Body: csv
            };

            // May be needed to handle space complexity
            // s3.getSignedUrl('putObject', s3Params, (err, data) => {
            //     if(err){
            //     console.log(err);
            //     return res.end();
            //     }
            //     res.json({
            //         "text": `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
            //     })
            // });

            // call S3 to retrieve upload file to specified bucket
            s3.putObject(s3Params, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } if (data) {
                    console.log("Upload Success", data);
                    res.json({
                        "text": `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
                    })
                }
            });
        }else{
            res.json({
                "text": "No data found"
            })
        }
        
    }else{
        res.json({
            "text": "No found option"
        })
    }
    
})

app.listen(PORT, ()=>{
    console.log(`Server has started, App is listening to PORT ${PORT}`);
})