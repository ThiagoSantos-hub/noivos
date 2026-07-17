/**
 * Cliente Supabase para o browser (Client Components)
 * Usa createBrowserClient do @supabase/ssr para gerenciar cookies corretamente
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Instância singleton para uso em Client Components
 * Mantém compatibilidade com imports existentes: import { supabase } from '@/services/supabase'
 */
export const supabase = createClient()
