const points = require('../model/points');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



exports.create = async (req, res) => {
    try {
        const points = new Points({
            userId: req.session.user,
            product: req.body.productName,
            points: req.body.points,    
            quantity: req.body.quantity
        });
        await newPoints.save();
        res.status(201).json(points);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
