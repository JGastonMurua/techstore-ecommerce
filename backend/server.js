require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const crypto  = require('crypto');
const { Resend } = require('resend');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { createClient } = require('@supabase/supabase-js');

const app    = express();
const PORT   = process.env.PORT || 3001;
const resend = new Resend(process.env.RESEND_API_KEY);
const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

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

// ── Endpoint: crear preferencia MercadoPago ───────────────────
app.post('/api/create-preference', async (req, res) => {
  console.log('💳 Creando preferencia MercadoPago');
  const { items, payer, orderId, backUrl, orderData } = req.body;
  try {
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: items.map(item => ({
          id: String(item.id),
          title: item.nombre,
          quantity: Number(item.quantity),
          unit_price: Number(item.precio),
          currency_id: 'ARS',
        })),
        payer: {
          name: payer.nombre,
          surname: payer.apellido,
          // En sandbox MP el payer email NO puede ser el mismo que el vendedor.
          // Usá el email de tu usuario test COMPRADOR de MP (crealo en developers/panel/test-users)
          email: process.env.MP_TEST_BUYER_EMAIL || payer.email,
        },
        back_urls: {
          success: backUrl,
          failure: backUrl,
          pending: backUrl,
        },
        auto_return: 'approved',
        external_reference: orderId,
      }
    });
    console.log('✅ Preferencia creada:', result.id);

    // Guardar orden en Supabase con estado 'pending'
    if (orderData) {
      const { error: dbError } = await supabase.from('orders').insert([{
        order_id:        orderId,
        customer_name:   `${orderData.nombre} ${orderData.apellido}`,
        customer_email:  orderData.email,
        customer_phone:  orderData.telefono,
        address:         orderData.direccion,
        city:            orderData.ciudad,
        province:        orderData.provincia,
        payment_method:  'mercadopago',
        total:           orderData.total,
        shipping:        orderData.shipping,
        status:          'pending',
        mp_preference_id: result.id,
        items:           items.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, quantity: i.quantity })),
      }]);
      if (dbError) console.error('⚠️ Error guardando orden en BD:', dbError.message);
      else console.log('💾 Orden guardada en BD:', orderId);
    }

    res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (error) {
    console.error('❌ Error creando preferencia MP:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── Endpoint: guardar orden manual (transferencia / efectivo) ─
app.post('/api/orders/manual', async (req, res) => {
  const { orderId, orderData, items } = req.body;
  if (!orderId || !orderData || !items) return res.status(400).json({ error: 'Datos incompletos' });
  try {
    const { error } = await supabase.from('orders').insert([{
      order_id:       orderId,
      customer_name:  `${orderData.nombre} ${orderData.apellido}`,
      customer_email: orderData.email,
      customer_phone: orderData.telefono,
      address:        orderData.direccion,
      city:           orderData.ciudad,
      province:       orderData.provincia,
      payment_method: orderData.metodoPago,
      total:          orderData.total,
      shipping:       orderData.shipping,
      status:         'pending_manual',
      items:          items.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, quantity: i.quantity })),
    }]);
    if (error) throw error;
    console.log('💾 Orden manual guardada:', orderId);

    // Decrementar stock de cada producto
    for (const item of items) {
      const { data: prod } = await supabase
        .from('productos')
        .select('stock')
        .eq('id', item.id)
        .single();
      if (prod) {
        await supabase
          .from('productos')
          .update({ stock: Math.max(0, (prod.stock || 0) - item.quantity) })
          .eq('id', item.id);
      }
    }
    console.log('📦 Stock actualizado para orden manual:', orderId);

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error guardando orden manual:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── Endpoint: listar órdenes (admin) ─────────────────────────
app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('❌ Error obteniendo órdenes:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── Helpers webhook ───────────────────────────────────────────
function verificarFirmaMP(req) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // si no configuraron secret, no bloquear (dev sin clave)

  const xSignature = req.headers['x-signature'];
  const xRequestId = req.headers['x-request-id'];
  const dataId     = req.query['data.id'];

  if (!xSignature) return false;

  // MP firma con: "id:{data.id};request-id:{x-request-id};"
  const manifest = `id:${dataId};request-id:${xRequestId};`;
  const parts     = xSignature.split(',');
  const sigPart   = parts.find(p => p.startsWith('v1='));
  if (!sigPart) return false;

  const receivedHash = sigPart.split('=')[1];
  const expectedHash = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(receivedHash), Buffer.from(expectedHash));
}

// ── Endpoint: webhook MercadoPago ─────────────────────────────
// MP notifica aquí los cambios de estado de pago (approved, rejected, etc.)
// Configurar la URL en https://www.mercadopago.com.ar/developers/panel/notifications
app.post('/api/webhook', async (req, res) => {
  // En modo productivo validar firma; en test/simulación MP no la envía
  const isLiveMode = req.body?.live_mode === true;
  if (isLiveMode && !verificarFirmaMP(req)) {
    console.warn('⚠️  Webhook rechazado: firma inválida');
    return res.sendStatus(401);
  }

  const { type, data, action } = req.body;
  console.log(`🔔 Webhook MP recibido — type: ${type}, action: ${action}`);

  if (type === 'payment' && data?.id) {
    try {
      // Verificar el pago directamente con la API de MP (no confiar solo en el webhook)
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      });
      const payment = await response.json();
      console.log(`💰 Pago ${data.id}: status=${payment.status}, external_ref=${payment.external_reference}`);

      // Actualizar estado de la orden en Supabase
      if (payment.external_reference) {
        const { data: orderData, error: dbError } = await supabase
          .from('orders')
          .update({
            status:        payment.status,
            mp_payment_id: String(data.id),
            updated_at:    new Date().toISOString(),
          })
          .eq('order_id', payment.external_reference)
          .select()
          .single();

        if (dbError) {
          console.error('⚠️ Error actualizando orden en BD:', dbError.message);
        } else {
          console.log(`✅ Orden ${payment.external_reference} actualizada a: ${payment.status}`);

          // Decrementar stock cuando el pago es aprobado
          if (payment.status === 'approved' && orderData?.items) {
            const orderItems = Array.isArray(orderData.items) ? orderData.items : [];
            for (const item of orderItems) {
              const { data: prod } = await supabase
                .from('productos')
                .select('stock')
                .eq('id', item.id)
                .single();
              if (prod) {
                await supabase
                  .from('productos')
                  .update({ stock: Math.max(0, (prod.stock || 0) - item.quantity) })
                  .eq('id', item.id);
              }
            }
            console.log(`📦 Stock actualizado para orden MP: ${payment.external_reference}`);
          }

          // Enviar email de confirmación solo cuando el pago es aprobado
          if (payment.status === 'approved' && orderData?.customer_email) {
            const totalFmt = new Intl.NumberFormat('es-AR', {
              style: 'currency', currency: 'ARS', maximumFractionDigits: 0
            }).format((orderData.total || 0) + (orderData.shipping || 0));
            try {
              await resend.emails.send({
                from:    'onboarding@resend.dev',
                to:      orderData.customer_email,
                subject: `Pago aprobado ${payment.external_reference} — TechStore`,
                html: `
                  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden">
                    <div style="background:#5C2D91;padding:24px;text-align:center">
                      <h1 style="color:white;margin:0;font-size:1.6rem">TechStore</h1>
                      <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:0.9rem">Tu tienda de tecnología online</p>
                    </div>
                    <div style="padding:28px;background:#f9f9f9">
                      <h2 style="color:#111;margin-top:0">¡Tu pago fue aprobado! 🎉</h2>
                      <p style="color:#444">Hola <strong>${orderData.customer_name}</strong>, tu pago fue procesado correctamente y tu pedido está en camino.</p>
                      <div style="background:white;border-radius:8px;padding:20px;margin:20px 0;border:1px solid #e0e0e0">
                        <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
                          <tr><td style="padding:6px 0;color:#767676">Número de orden</td><td style="padding:6px 0;text-align:right;font-weight:700">${payment.external_reference}</td></tr>
                          <tr><td style="padding:6px 0;color:#767676">Total pagado</td><td style="padding:6px 0;text-align:right;font-weight:700">${totalFmt}</td></tr>
                          <tr><td style="padding:6px 0;color:#767676">Dirección de entrega</td><td style="padding:6px 0;text-align:right">${orderData.address}, ${orderData.city}</td></tr>
                          <tr><td style="padding:6px 0;color:#767676">Entrega estimada</td><td style="padding:6px 0;text-align:right">3-5 días hábiles</td></tr>
                        </table>
                      </div>
                      <p style="color:#666;font-size:0.88rem">Ante cualquier consulta respondé este email o escribinos por WhatsApp.</p>
                    </div>
                    <div style="background:#1A0A2E;padding:14px;text-align:center">
                      <p style="color:rgba(255,255,255,0.5);font-size:0.78rem;margin:0">TechStore © ${new Date().getFullYear()} — Email automático.</p>
                    </div>
                  </div>
                `
              });
              console.log(`📧 Email confirmación MP enviado a: ${orderData.customer_email}`);
            } catch (emailErr) {
              console.error('⚠️ Error enviando email MP:', emailErr.message);
            }
          }
        }
      }

    } catch (error) {
      console.error('❌ Error verificando pago en webhook:', error.message);
    }
  }

  // Siempre responder 200 para que MP no reintente
  res.sendStatus(200);
});

// ── Health check ─────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'TechStore Backend' }));

app.listen(PORT, () => console.log(`✅ Backend TechStore corriendo en puerto ${PORT}`));
