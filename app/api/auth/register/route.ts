import { createClient, PostgrestError } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

interface RegisterRequestBody {
  nome_noiva?: string
  nome_noivo?: string
  email_noiva?: string
  email_noivo?: string
  data_casamento?: string
  orcamento_total?: number
  noiva_user_id?: string
  noivo_user_id?: string
}

interface CoupleInsertPayload {
  nome_noiva: string
  nome_noivo: string
  email_noiva: string
  email_noivo: string
  data_casamento: string
  total_budget: number
  noiva_user_id: string
  noivo_user_id: string
  bride_name: string
  groom_name: string
}

const REQUIRED_FIELDS: Array<keyof RegisterRequestBody> = [
  'nome_noiva',
  'nome_noivo',
  'email_noiva',
  'email_noivo',
  'data_casamento',
  'noiva_user_id',
  'noivo_user_id',
]

function getMissingFields(body: RegisterRequestBody): string[] {
  return REQUIRED_FIELDS.filter(field => !body[field])
}

function logInsertError(error: PostgrestError, payload: CoupleInsertPayload): void {
  const databaseErrorText = [error.message, error.details, error.hint]
    .filter(Boolean)
    .join(' ')
  const suspectedFields = Object.keys(payload).filter(field =>
    databaseErrorText.includes(field)
  )

  console.error('Erro ao inserir casal na tabela couples', {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
    suspectedFields,
    payloadFields: Object.keys(payload),
    fieldTypes: Object.fromEntries(
      Object.entries(payload).map(([field, value]) => [field, typeof value])
    ),
    userIdsPresent: {
      noiva_user_id: Boolean(payload.noiva_user_id),
      noivo_user_id: Boolean(payload.noivo_user_id),
    },
  })
}

/**
 * Rota API para registro seguro de casal
 * POST /api/auth/register
 *
 * Usa SERVICE_ROLE_KEY para contornar RLS na inserção da tabela couples
 * pois o usuário ainda não está autenticado no momento do cadastro
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json() as RegisterRequestBody
    const missingFields = getMissingFields(body)

    if (missingFields.length > 0) {
      console.error('Dados incompletos recebidos na rota de registro', {
        missingFields,
        receivedFields: Object.keys(body),
        noivaUserIdPresent: Boolean(body.noiva_user_id),
        noivoUserIdPresent: Boolean(body.noivo_user_id),
      })

      return NextResponse.json(
        {
          error: 'Dados incompletos para o registro',
          missingFields,
        },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const finalKey = serviceRoleKey || anonKey

    if (!supabaseUrl || !finalKey) {
      const missingEnvironmentVariables = [
        !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_URL' : null,
        !finalKey ? 'SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY' : null,
      ].filter((variable): variable is string => Boolean(variable))

      console.error('Configuração incompleta do Supabase na rota de registro', {
        missingEnvironmentVariables,
      })

      return NextResponse.json(
        { error: 'Configuração do servidor incompleta para concluir o registro' },
        { status: 500 }
      )
    }

    if (!serviceRoleKey) {
      console.warn('Aviso: SUPABASE_SERVICE_ROLE_KEY ausente. Usando anon key para o registro. Isso pode falhar se o RLS estiver ativado.')
    }

    const payload: CoupleInsertPayload = {
      nome_noiva: body.nome_noiva as string,
      nome_noivo: body.nome_noivo as string,
      email_noiva: body.email_noiva as string,
      email_noivo: body.email_noivo as string,
      data_casamento: body.data_casamento as string,
      total_budget: body.orcamento_total ?? 0,
      noiva_user_id: body.noiva_user_id as string,
      noivo_user_id: body.noivo_user_id as string,
      bride_name: body.nome_noiva as string,
      groom_name: body.nome_noivo as string,
    }

    const supabaseAdmin = createClient(supabaseUrl, finalKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data, error } = await supabaseAdmin
      .from('couples')
      .insert(payload)
      .select()
      .single()

    if (error) {
      logInsertError(error, payload)

      return NextResponse.json(
        {
          error: `Erro ao salvar dados do casal: ${error.message}`,
          errorCode: error.code,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, couple: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro inesperado na rota de registro', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      { error: 'Erro ao processar registro' },
      { status: 500 }
    )
  }
}
