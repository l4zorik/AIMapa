const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const { AppError } = require('../middleware/errorHandler');

// DELETE API key endpoint
router.delete('/:id',
    requiresAuth(),
    async (req, res, next) => {
        try {
            const userId = req.oidc.user.sub;
            const keyId = req.params.id;

            // Delete the API key from Supabase
            const { data, error } = await req.supabaseClient
                .from('api_keys')
                .delete()
                .eq('id', keyId)
                .eq('user_id', userId);

            if (error) {
                return res.status(500).json({ error: 'Chyba při mazání API klíče', details: error });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'API klíč nenalezen nebo nemáte oprávnění' });
            }

            res.json({ message: 'API klíč byl úspěšně odstraněn' });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
