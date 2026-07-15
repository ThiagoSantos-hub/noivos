import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Rota API para registro seguro de casal
 * POST /api/auth/register
 * 
 * Usa SERVICE_ROLE_KEY para contornar RLS na inserção da tabela couples
 * pois o usuário ainda não está autenticado no momento do cadastro
 */

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      nome_noiva,
      nome_noivo,
      email_noiva,
      email_noivo,
      data_casamento,
      orcamento_total,
      noiva_user_id,
      noivo_user_id,
    } = body

    // Validar dados obrigatórios
    if (!nome_noiva || !nome_noivo || !email_noiva || !email_noivo || !data_casamento || !noiva_user_id || !noivo_user_id) {
      return NextResponse.json(
        { error: 'Dados incompletos para o registro' },
        { status: 400 }
      )
    }

    // Criar cliente Supabase com SERVICE_ROLE_KEY para contornar RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Inserir dados na tabela couples usando o cliente admin
    const { data, error } = await supabaseAdmin
      .from('couples')
      .insert({
        nome_noiva,
        nome_noivo,
        email_noiva,
        email_noivo,
        data_casamento,
        total_budget: orcamento_total || 0,
        noiva_user_id,
        noivo_user_id,
        bride_name: nome_noiva,
        groom_name: nome_noivo,
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao inserir couple:', error)
      return NextResponse.json(
        { error: `Erro ao salvar dados do casal: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, couple: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro na rota de registro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar registro' },
      { status: 500 }
    )
  }
}
