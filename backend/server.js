require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { Resend } = require('resend');

const app    = express();
const PORT   = process.env.PORT || 3001;
const resend = new Resend(process.env.RESEND_API_KEY);

// ── CORS ──────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'https://jgastonmurua.github.io',
    'http://localhost:3000',
    'http://localhost:3001',
  ]
}));
app.use(express.json());

// ── Endpoint: enviar email de confirmacion ────────────────────
app.post('/api/send-email', async (req, res) => {
  console.log('📧 Peticion recibida en /api/send-email');
  const { to_name, to_email, order_id, order_total, delivery_address, payment_method } = req.body;

  if (!to_email) return res.status(400).json({ error: 'Email requerido' });

  console.log(`📤 Enviando email a: ${to_email}`);
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Resend timeout after 20s')), 20000)
    );
    const sendPromise = resend.emails.send({
      from:    'onboarding@resend.dev',
      to:      to_email,
      subject: `Pedido confirmado ${order_id} — TechStore`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden">

          <!-- Header -->
          <div style="background:#5C2D91;padding:24px;text-align:center">
            <h1 style="color:white;margin:0;font-size:1.6rem;letter-spacing:-1px">TechStore</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:0.9rem">Tu tienda de tecnología online</p>
          </div>

          <!-- Cuerpo -->
          <div style="padding:28px;background:#f9f9f9">
            <h2 style="color:#111;margin-top:0">¡Pedido confirmado! 🎉</h2>
            <p style="color:#444">Hola <strong>${to_name}</strong>, recibimos tu pedido y está en proceso.</p>

            <!-- Detalle del pedido -->
            <div style="background:white;border-radius:8px;padding:20px;margin:20px 0;border:1px solid #e0e0e0">
              <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
                <tr><td style="padding:6px 0;color:#767676">Número de orden</td><td style="padding:6px 0;text-align:right;font-weight:700">${order_id}</td></tr>
                <tr><td style="padding:6px 0;color:#767676">Total</td><td style="padding:6px 0;text-align:right;font-weight:700">${order_total}</td></tr>
                <tr><td style="padding:6px 0;color:#767676">Dirección</td><td style="padding:6px 0;text-align:right">${delivery_address}</td></tr>
                <tr><td style="padding:6px 0;color:#767676">Método de pago</td><td style="padding:6px 0;text-align:right;text-transform:capitalize">${payment_method}</td></tr>
                <tr><td style="padding:6px 0;color:#767676">Entrega estimada</td><td style="padding:6px 0;text-align:right">3-5 días hábiles</td></tr>
              </table>
            </div>

            <p style="color:#666;font-size:0.88rem">
              Ante cualquier consulta respondé este email o escribinos por WhatsApp.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#1A0A2E;padding:14px;text-align:center">
            <p style="color:rgba(255,255,255,0.5);font-size:0.78rem;margin:0">
              TechStore © ${new Date().getFullYear()} — Este es un email automático.
            </p>
          </div>

        </div>
      `
    });

    await Promise.race([sendPromise, timeoutPromise]);
    console.log('✅ Email enviado correctamente');
    res.json({ success: true, message: 'Email enviado correctamente' });

  } catch (error) {
    console.error('❌ Error enviando email:', error.message);
    res.status(500).json({ error: 'Error al enviar email', detail: error.message });
  }
});

// ── Health check ─────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'TechStore Backend' }));

app.listen(PORT, () => console.log(`✅ Backend TechStore corriendo en puerto ${PORT}`));
