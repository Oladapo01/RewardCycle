const points = require('../model/points');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



exports.create = async (req, res) => {
    try {
        const points = await points.create({
            userId: req.session.userId,
            product: req.body.productName,
            quantity: req.body.quantity,
            points: req.body.points
        });
        await points.save();
        res.status(201).json(points);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
