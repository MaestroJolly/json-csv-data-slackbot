"use strict";

require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
// const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3333;
const datasets = require('./datasets');

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
        res.json({
            "text": "Work In Progress"
        })
    }else{
        res.json({
            "text": "No found option"
        })
    }
    
})

app.listen(PORT, ()=>{
    console.log(`Server has started, App is listening to PORT ${PORT}`);
})