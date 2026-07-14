/**
 * API Route: Create Asaas Checkout
 * Rota: /api/payments/create-checkout
 * Cria um link de pagamento no Asaas para o plano Noivos Pro
 */

import { NextResponse } from 'next/server'

const ASAAS_API_KEY = process.env.ASAAS_API_KEY
const ASAAS_API_URL = process.env.ASAAS_API_URL
const PLAN_PRICE = 9.90

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome_noiva, nome_noivo, email_noiva, email_noivo } = body

    // 1. Criar ou localizar o cliente no Asaas
    const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY || ''
      },
      body: JSON.stringify({
        name: `${nome_noiva} & ${nome_noivo}`,
        email: email_noiva, // Usamos o e-mail da noiva como principal para o faturamento
        notificationDisabled: false
      })
    })

    const customerData = await customerResponse.json()
    
    if (!customerResponse.ok) {
      throw new Error(customerData.errors?.[0]?.description || 'Erro ao criar cliente no Asaas')
    }

    // 2. Criar a cobrança (Payment)
    // Pix e Cartão de Crédito habilitados
    const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY || ''
      },
      body: JSON.stringify({
        customer: customerData.id,
        billingType: 'UNDEFINED', // Permite que o usuário escolha no checkout
        value: PLAN_PRICE,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0], // 24h de validade
        description: 'Assinatura Noivos Pro - Planejamento de Casamento',
        externalReference: email_noiva,
      })
    })

    const paymentData = await paymentResponse.json()

    if (!paymentResponse.ok) {
      throw new Error(paymentData.errors?.[0]?.description || 'Erro ao criar cobrança no Asaas')
    }

    // Retorna o link do checkout
    return NextResponse.json({ 
      checkoutUrl: paymentData.invoiceUrl,
      paymentId: paymentData.id 
    })

  } catch (error) {
    console.error('Erro no checkout Asaas:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}
