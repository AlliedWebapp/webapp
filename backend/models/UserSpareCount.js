const mongoose = require("mongoose");

const userSpareCountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  collectionName: {
    type: String,
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  spareCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Compound index to ensure unique combination of userId, collectionName, and itemId
userSpareCountSchema.index({ userId: 1, collectionName: 1, itemId: 1 }, { unique: true });

const UserSpareCount = mongoose.model("UserSpareCount", userSpareCountSchema);
module.exports = UserSpareCount;