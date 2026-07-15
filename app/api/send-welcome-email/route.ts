import { NextResponse } from 'next/server'

/**
 * Rota API para envio de e-mails de boas-vindas via Brevo
 * POST /api/send-welcome-email
 * Usa a API REST do Brevo diretamente
 */

const SENDER = {
  name: process.env.BREVO_SENDER_NAME || 'Noivos',
  email: process.env.BREVO_SENDER_EMAIL || 'digitalalpha24@gmail.com',
}

const APP_URL = 'https://noivosapp.store'
const LOGO_URL = `${APP_URL}/images/aliancas.png`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome_noiva, nome_noivo, email_noiva, email_noivo, password } = body

    if (!nome_noiva || !nome_noivo || !email_noiva || !email_noivo || !password) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const recipients = [
      { name: nome_noiva, email: email_noiva },
      { name: nome_noivo, email: email_noivo },
    ]

    const emailPromises = recipients.map(async (recipient) => {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY || '',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: SENDER,
          to: [{ email: recipient.email, name: recipient.name }],
          subject: `💍 Bem-vindos ao Noivos, ${nome_noiva} e ${nome_noivo}!`,
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Bem-vindos ao Noivos</title>
              <style>
                body { font-family: sans-serif; background-color: #FFFFFF; color: #1E293B; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; }
                .logo { width: 120px; height: auto; }
                .content { padding: 20px; line-height: 1.6; }
                .title { color: #1E3A8A; font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
                .quote { font-style: italic; color: #1E3A8A; text-align: center; padding: 20px; background-color: #EFF6FF; border-radius: 8px; margin: 20px 0; }
                .credentials { background-color: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .button-container { text-align: center; margin: 30px 0; }
                .button { background-color: #22C55E; color: #FFFFFF !important; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; }
                .footer { text-align: center; color: #64748B; font-size: 14px; padding: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <img src="${LOGO_URL}" alt="Noivos" class="logo">
                </div>
                <div class="content">
                  <h1 class="title">Sua jornada rumo ao altar começa agora! 💍</h1>
                  <p>Olá, <strong>${recipient.name}</strong>!</p>
                  <p>É com muita alegria que damos as boas-vindas a vocês no <strong>Noivos</strong> — o app feito especialmente para casais que querem organizar cada detalhe do dia mais especial das suas vidas.</p>
                  
                  <div class="quote">
                    "O amor é paciente, o amor é bondoso. [...] O amor nunca falha." <br>
                    <strong>— 1 Coríntios 13:4,8</strong>
                  </div>

                  <div class="credentials">
                    <h3 style="margin-top: 0; color: #1E3A8A;">Seus dados de acesso:</h3>
                    <p style="margin-bottom: 5px;"><strong>Email:</strong> ${recipient.email}</p>
                    <p style="margin-top: 0;"><strong>Senha do Casal:</strong> ${password}</p>
                  </div>

                  <div class="button-container">
                    <a href="${APP_URL}" class="button">Acessar o App</a>
                  </div>

                  <p>Se precisarem de qualquer ajuda, estamos à disposição.</p>
                </div>
                <div class="footer">
                  <p>Com amor, Equipe Noivos 💍</p>
                </div>
              </div>
            </body>
            </html>
          `
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Erro Brevo (${recipient.email}): ${JSON.stringify(errorData)}`)
      }

      return response.json()
    })

    await Promise.all(emailPromises)

    return NextResponse.json({ message: 'E-mails enviados com sucesso' })
  } catch (error) {
    console.error('Erro ao enviar e-mail via Brevo:', error)
    return NextResponse.json({ error: 'Falha ao enviar e-mails' }, { status: 500 })
  }
}
