/**
 * User API Routes
 * Verze 0.4.1
 */

const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

/**
 * @route GET /api/user/profile
 * @desc Získá profil přihlášeného uživatele
 * @access Private
 */
router.get('/profile', requiresAuth(), async (req, res) => {
  try {
    // Získání Supabase uživatele podle Auth0 ID
    const { data: user, error } = await req.supabaseClient
      .from('users')
      .select('*')
      .eq('auth0_id', req.oidc.user.sub)
      .single();
    
    if (error) {
      console.error('Chyba při získávání uživatelského profilu:', error);
      return res.status(500).json({ 
        error: 'Chyba při získávání uživatelského profilu',
        message: error.message
      });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'Uživatel nenalezen' });
    }
    
    // Odstranění citlivých údajů
    delete user.app_metadata;
    
    res.json(user);
  } catch (error) {
    console.error('Neočekávaná chyba při získávání uživatelského profilu:', error);
    res.status(500).json({ 
      error: 'Neočekávaná chyba při získávání uživatelského profilu',
      message: error.message
    });
  }
});

/**
 * @route PUT /api/user/profile
 * @desc Aktualizuje profil přihlášeného uživatele
 * @access Private
 */
router.put('/profile', requiresAuth(), async (req, res) => {
  try {
    const { name, picture, user_metadata } = req.body;
    
    // Validace vstupních dat
    const updateData = {};
    if (name) updateData.name = name;
    if (picture) updateData.picture = picture;
    if (user_metadata) updateData.user_metadata = user_metadata;
    
    // Přidání časového razítka aktualizace
    updateData.updated_at = new Date().toISOString();
    
    // Aktualizace uživatele v Supabase
    const { data: updatedUser, error } = await req.supabaseClient
      .from('users')
      .update(updateData)
      .eq('auth0_id', req.oidc.user.sub)
      .select()
      .single();
    
    if (error) {
      console.error('Chyba při aktualizaci uživatelského profilu:', error);
      return res.status(500).json({ 
        error: 'Chyba při aktualizaci uživatelského profilu',
        message: error.message
      });
    }
    
    // Odstranění citlivých údajů
    delete updatedUser.app_metadata;
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Neočekávaná chyba při aktualizaci uživatelského profilu:', error);
    res.status(500).json({ 
      error: 'Neočekávaná chyba při aktualizaci uživatelského profilu',
      message: error.message
    });
  }
});

/**
 * @route GET /api/user/settings
 * @desc Získá uživatelská nastavení
 * @access Private
 */
router.get('/settings', requiresAuth(), async (req, res) => {
  try {
    // Získání uživatele z Supabase
    const { data: user, error } = await req.supabaseClient
      .from('users')
      .select('user_metadata')
      .eq('auth0_id', req.oidc.user.sub)
      .single();
    
    if (error) {
      console.error('Chyba při získávání uživatelských nastavení:', error);
      return res.status(500).json({ 
        error: 'Chyba při získávání uživatelských nastavení',
        message: error.message
      });
    }
    
    // Vrácení nastavení nebo prázdného objektu
    res.json(user?.user_metadata || {});
  } catch (error) {
    console.error('Neočekávaná chyba při získávání uživatelských nastavení:', error);
    res.status(500).json({ 
      error: 'Neočekávaná chyba při získávání uživatelských nastavení',
      message: error.message
    });
  }
});

/**
 * @route PUT /api/user/settings
 * @desc Aktualizuje uživatelská nastavení
 * @access Private
 */
router.put('/settings', requiresAuth(), async (req, res) => {
  try {
    // Získání aktuálních metadat
    const { data: user, error: fetchError } = await req.supabaseClient
      .from('users')
      .select('user_metadata')
      .eq('auth0_id', req.oidc.user.sub)
      .single();
    
    if (fetchError) {
      console.error('Chyba při získávání uživatelských metadat:', fetchError);
      return res.status(500).json({ 
        error: 'Chyba při získávání uživatelských metadat',
        message: fetchError.message
      });
    }
    
    // Sloučení stávajících a nových metadat
    const currentMetadata = user?.user_metadata || {};
    const newMetadata = { ...currentMetadata, ...req.body };
    
    // Aktualizace metadat
    const { data: updatedUser, error: updateError } = await req.supabaseClient
      .from('users')
      .update({
        user_metadata: newMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('auth0_id', req.oidc.user.sub)
      .select('user_metadata')
      .single();
    
    if (updateError) {
      console.error('Chyba při aktualizaci uživatelských nastavení:', updateError);
      return res.status(500).json({ 
        error: 'Chyba při aktualizaci uživatelských nastavení',
        message: updateError.message
      });
    }
    
    res.json(updatedUser.user_metadata);
  } catch (error) {
    console.error('Neočekávaná chyba při aktualizaci uživatelských nastavení:', error);
    res.status(500).json({ 
      error: 'Neočekávaná chyba při aktualizaci uživatelských nastavení',
      message: error.message
    });
  }
});

module.exports = router;
