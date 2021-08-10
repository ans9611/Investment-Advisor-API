const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  balance: {
    type: String,
  },
  risk: {
    type: String,
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
