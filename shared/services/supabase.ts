/**
 * Ponto de entrada do cliente Supabase
 *
 * - Para Client Components: import { supabase } from '@/services/supabase'
 * - Para Server Components / Route Handlers: import { createClient } from '@/services/supabase/server'
 * - Para o middleware: import { updateSession } from '@/services/supabase/middleware'
 */

export { supabase, createClient } from './supabase/client'
