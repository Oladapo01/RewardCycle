const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  userId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  points: { type: Number, required: true },
  updatedAt:{type:Date, default:()=>Date.now(),}
},
{
  timestamps: true
}
);

module.exports = mongoose.model('Product', productSchema);

exports.addPoint = async (req, res) => {
  try {
    const newPoints = new Product({ 
        userId: req.body.userId,
        points: req.body.points,
        quantity: req.body.quantity,
        points: req.body.points 
    });
    await newPoints.save();
    res.status(200).json({ message: 'Points added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
