// Supabase Edge Function pro sledování využití LLM
// Verze 0.3.8.7

// Sleduje využití LLM a ukládá statistiky do databáze
// Tato funkce je volána po každém požadavku na LLM API

// deno-lint-ignore-file
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Zpracování CORS preflight požadavků
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Vytvoření Supabase klienta
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Získání uživatele z JWT tokenu
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    // Kontrola, zda je uživatel přihlášen
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Neautorizovaný přístup' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Získání dat z požadavku
    const { provider, model, inputTokens, outputTokens, latency, cost } = await req.json()

    // Validace dat
    if (!provider || !model || !inputTokens || !outputTokens) {
      return new Response(
        JSON.stringify({ error: 'Chybějící povinné parametry' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Uložení záznamu o využití LLM do databáze
    const { data, error } = await supabaseClient
      .from('llm_usage')
      .insert([
        {
          user_id: user.id,
          provider,
          model,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          total_tokens: inputTokens + outputTokens,
          latency,
          cost,
          created_at: new Date().toISOString(),
        },
      ])

    if (error) {
      console.error('Chyba při ukládání záznamu o využití LLM:', error)
      
      return new Response(
        JSON.stringify({ error: 'Chyba při ukládání záznamu o využití LLM' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Aktualizace agregovaných statistik
    const today = new Date().toISOString().split('T')[0]
    
    // Získání existujícího záznamu pro dnešní den
    const { data: existingStats, error: statsError } = await supabaseClient
      .from('llm_usage_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .eq('model', model)
      .eq('date', today)
      .single()
    
    if (statsError && statsError.code !== 'PGRST116') { // PGRST116 = Žádný záznam nenalezen
      console.error('Chyba při získávání statistik využití LLM:', statsError)
    }
    
    if (existingStats) {
      // Aktualizace existujícího záznamu
      const { error: updateError } = await supabaseClient
        .from('llm_usage_stats')
        .update({
          request_count: existingStats.request_count + 1,
          input_tokens: existingStats.input_tokens + inputTokens,
          output_tokens: existingStats.output_tokens + outputTokens,
          total_tokens: existingStats.total_tokens + inputTokens + outputTokens,
          total_cost: existingStats.total_cost + cost,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingStats.id)
      
      if (updateError) {
        console.error('Chyba při aktualizaci statistik využití LLM:', updateError)
      }
    } else {
      // Vytvoření nového záznamu
      const { error: insertError } = await supabaseClient
        .from('llm_usage_stats')
        .insert([
          {
            user_id: user.id,
            provider,
            model,
            date: today,
            request_count: 1,
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            total_tokens: inputTokens + outputTokens,
            total_cost: cost,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
      
      if (insertError) {
        console.error('Chyba při vytváření statistik využití LLM:', insertError)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Chyba při zpracování požadavku:', error)
    
    return new Response(
      JSON.stringify({ error: 'Interní chyba serveru' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
