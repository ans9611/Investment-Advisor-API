const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  balance: {
    type: String,
    required: true
  },
  risk: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  timestamps: true
}
)

module.exports = mongoose.model('Client', memberSchema)
