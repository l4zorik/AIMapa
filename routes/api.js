/**
 * AIMapa - API Routes
 * Verze 0.3.5.7
 */

const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'API funguje!' });
});

// Virtuální práce API
router.use('/virtual-work', require('./virtual-work'));

// Export routeru
module.exports = router;
