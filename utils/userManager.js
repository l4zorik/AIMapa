const supabase = require('./supabase');

/**
 * Synchronizuje uživatele z Auth0 do Supabase
 * @param {Object} user - Auth0 uživatelský objekt
 * @returns {Object} - Supabase uživatelský objekt
 */
async function syncUserWithSupabase(user) {
  if (!user) return null;

  try {
    // Zkontrolujeme, zda uživatel již existuje v Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth0_id', user.sub)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Chyba při hledání uživatele:', fetchError);
      return null;
    }

    // Pokud uživatel neexistuje, vytvoříme ho
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from('user_profiles')
        .insert([
          {
            auth0_id: user.sub,
            email: user.email,
            name: user.name || user.nickname || user.email,
            picture: user.picture,
            last_login: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Chyba při vytváření uživatele:', insertError);
        return null;
      }

      return newUser;
    }

    // Aktualizujeme existujícího uživatele
    const { data: updatedUser, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        email: user.email,
        name: user.name || user.nickname || existingUser.name,
        picture: user.picture || existingUser.picture,
        last_login: new Date().toISOString()
      })
      .eq('auth0_id', user.sub)
      .select()
      .single();

    if (updateError) {
      console.error('Chyba při aktualizaci uživatele:', updateError);
      return existingUser; // Vrátíme původního uživatele, pokud aktualizace selže
    }

    return updatedUser;
  } catch (error) {
    console.error('Neočekávaná chyba při synchronizaci uživatele:', error);
    return null;
  }
}

/**
 * Získá uživatelský profil z Supabase
 * @param {string} auth0Id - Auth0 ID uživatele
 * @returns {Object} - Uživatelský profil
 */
async function getUserProfile(auth0Id) {
  if (!auth0Id) return null;

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth0_id', auth0Id)
      .single();

    if (error) {
      console.error('Chyba při získávání uživatelského profilu:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Neočekávaná chyba při získávání uživatelského profilu:', error);
    return null;
  }
}

module.exports = {
  syncUserWithSupabase,
  getUserProfile
};
