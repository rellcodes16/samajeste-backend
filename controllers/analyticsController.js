const { v4: uuidv4 } = require('uuid');
const Visit = require('../models/Analytics');

exports.recordVisit = async (req, res) => {
  try {
    const visitorId = req.cookies.visitor_id || uuidv4();

    if (!req.cookies.visitor_id) {
      res.cookie('visitor_id', visitorId, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30 
      });
    }

    await Visit.create({
      path: req.body.path || req.originalUrl,
      referrer: req.body.referrer || req.get('Referrer') || '',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      visitorId
    });

    res.status(204).end();
  } catch (err) {
    console.error('Error recording visit:', err);
    res.status(500).json({ message: 'Failed to record visit' });
  }
};


exports.getStats = async (req, res) => {
  try {
    const total = await Visit.countDocuments();
    const unique = await Visit.distinct('visitorId');
    res.json({ totalVisits: total, uniqueVisitors: unique.length });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};
