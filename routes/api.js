/**
 * AIMapa - API Routes
 * Verze 0.3.8.5
 */

const express = require('express');
const router = express.Router();
const { checkRole, checkPermission, checkOwnership } = require('../middleware/roleAuth');
const { validateRequest } = require('../middleware/requestValidator');
const { AppError } = require('../middleware/errorHandler');

// Dočasná náhrada za Auth0 middleware pro debugging
const requiresAuth = () => (req, res, next) => {
  console.log('DEBUG AUTH: requiresAuth middleware called');

  // Přidáme dočasný objekt user do req
  if (!req.user) {
    console.log('DEBUG AUTH: Přidávám dočasného uživatele');
    req.user = {
      sub: 'temp-user-id',
      email: 'temp@example.com',
      name: 'Temporary User',
      roles: ['user']
    };
  }

  // Přidáme dočasný objekt oidc do req pro zpětnou kompatibilitu
  if (!req.oidc) {
    console.log('DEBUG AUTH: Přidávám dočasný oidc objekt');
    req.oidc = {
      user: {
        sub: req.user.sub,
        email: req.user.email,
        name: req.user.name,
        'https://aimapa.cz/roles': req.user.roles
      },
      isAuthenticated: () => true
    };
  }

  console.log('DEBUG AUTH: User:', JSON.stringify(req.user));
  console.log('DEBUG AUTH: OIDC User:', JSON.stringify(req.oidc.user));

  next();
};

// Schémata pro validaci
const userProfileSchema = {
    body: {
        name: { type: 'string', required: true, minLength: 2 },
        bio: { type: 'string', maxLength: 500 },
        preferences: { type: 'object' }
    }
};

const routeSchema = {
    body: {
        name: { type: 'string', required: true },
        points: { type: 'array', required: true },
        description: { type: 'string' },
        isPublic: { type: 'boolean' }
    }
};

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'API funguje!' });
});

// Virtuální práce API
router.use('/virtual-work', require('./virtual-work'));

// Uživatelský profil
router.get('/profile',
    requiresAuth(),
    async (req, res, next) => {
        try {
            const userId = req.oidc.user.sub;
            const { data, error } = await req.supabaseClient
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw new AppError(500, 'Chyba při získávání profilu', error);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

router.put('/profile',
    requiresAuth(),
    validateRequest(userProfileSchema),
    async (req, res, next) => {
        try {
            const userId = req.oidc.user.sub;
            const { data, error } = await req.supabaseClient
                .from('profiles')
                .update(req.body)
                .eq('user_id', userId);

            if (error) throw new AppError(500, 'Chyba při aktualizaci profilu', error);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

// Trasy
router.post('/routes',
    requiresAuth(),
    checkPermission('write:content'),
    validateRequest(routeSchema),
    async (req, res, next) => {
        try {
            const routeData = {
                ...req.body,
                user_id: req.oidc.user.sub,
                created_at: new Date()
            };

            const { data, error } = await req.supabaseClient
                .from('routes')
                .insert([routeData])
                .select()
                .single();

            if (error) throw new AppError(500, 'Chyba při vytváření trasy', error);
            res.status(201).json(data);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/routes',
    requiresAuth(),
    async (req, res, next) => {
        try {
            let query = req.supabaseClient
                .from('routes')
                .select('*');

            // Filtrování podle vlastníka nebo veřejných tras
            if (!req.oidc.user['https://aimapa.cz/roles'].includes('admin')) {
                query = query.or(`user_id.eq.${req.oidc.user.sub},isPublic.eq.true`);
            }

            const { data, error } = await query;
            if (error) throw new AppError(500, 'Chyba při získávání tras', error);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/routes/:id',
    requiresAuth(),
    async (req, res, next) => {
        try {
            const { data, error } = await req.supabaseClient
                .from('routes')
                .select('*')
                .eq('id', req.params.id)
                .single();

            if (error) throw new AppError(500, 'Chyba při získávání trasy', error);
            if (!data) throw new AppError(404, 'Trasa nenalezena');

            // Kontrola přístupu
            if (!data.isPublic && data.user_id !== req.oidc.user.sub &&
                !req.oidc.user['https://aimapa.cz/roles'].includes('admin')) {
                throw new AppError(403, 'Nemáte přístup k této trase');
            }

            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

router.put('/routes/:id',
    requiresAuth(),
    checkOwnership('routes'),
    validateRequest(routeSchema),
    async (req, res, next) => {
        try {
            const { data, error } = await req.supabaseClient
                .from('routes')
                .update(req.body)
                .eq('id', req.params.id)
                .select()
                .single();

            if (error) throw new AppError(500, 'Chyba při aktualizaci trasy', error);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/routes/:id',
    requiresAuth(),
    checkOwnership('routes'),
    async (req, res, next) => {
        try {
            const { error } = await req.supabaseClient
                .from('routes')
                .delete()
                .eq('id', req.params.id);

            if (error) throw new AppError(500, 'Chyba při mazání trasy', error);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
);

// Admin endpoints
router.get('/admin/users',
    requiresAuth(),
    checkRole('admin'),
    async (req, res, next) => {
        try {
            const { data, error } = await req.supabaseClient
                .from('profiles')
                .select('*');

            if (error) throw new AppError(500, 'Chyba při získávání uživatelů', error);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/admin/logs',
    requiresAuth(),
    checkRole('admin'),
    async (req, res, next) => {
        try {
            const { data, error } = await req.supabaseClient
                .from('api_logs')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(100);

            if (error) throw new AppError(500, 'Chyba při získávání logů', error);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

// Export routeru
module.exports = router;
