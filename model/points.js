const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointsSchema = new Schema({
  userId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  points: { type: Number, required: true },
  updatedAt:{type: Date, default:()=>Date.now(),}
},
{
  timestamps: true
}
);

module.exports = mongoose.model('Points', pointsSchema);

exports.addPoints = async (req, res) => {
  try {
    const newPoints = new Points({ 
        userId: req.session.user,
        productName: req.body.productName,
        points: req.body.points,
        quantity: req.body.quantity
    });
    await newPoints.save();
    res.status(200).json({ message: 'Points added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
