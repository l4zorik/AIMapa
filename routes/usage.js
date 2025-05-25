/**
 * API Routes for Usage Statistics
 */
const express = require('express');
const router = express.Router();
const Auth0Service = require('../auth/auth0-service'); // Assuming auth0-service is in auth/
const { getUsageStats } = require('../llm/llm-usage-tracker'); // Adjust path as necessary

// Initialize Auth0Service to get the middleware and user ID utility
// This might need to be a shared instance if your app initializes it once globally
const auth0Service = new Auth0Service();

/**
 * GET /api/usage/llm
 * Retrieves LLM usage statistics for the authenticated user.
 */
router.get('/llm', auth0Service.requireAuth(), async (req, res) => {
  try {
    const userId = auth0Service.getUserId(req);
    if (!userId) {
      // This case should ideally not be reached if requireAuth() works correctly
      return res.status(401).json({ error: 'User not authenticated or ID not found.' });
    }

    // TODO: Add support for query parameters for filtering (provider, model, startDate, endDate)
    // const { provider, model, startDate, endDate } = req.query;

    const result = await getUsageStats({ 
      userId
      // Pass other filters here once supported: provider, model, startDate, endDate 
    });

    if (result.success) {
      res.json(result.stats);
    } else {
      console.error(`Error fetching LLM usage stats for user ${userId}:`, result.error);
      res.status(500).json({ error: result.error || 'Failed to get usage stats' });
    }
  } catch (error) {
    console.error('Exception in GET /api/usage/llm:', error);
    res.status(500).json({ error: 'Internal server error while fetching usage stats.' });
  }
});

module.exports = router;
