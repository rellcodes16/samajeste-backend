const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  path: String,
  referrer: String,
  ip: String,
  userAgent: String,
  visitorId: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
