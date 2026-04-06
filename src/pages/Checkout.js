import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaShoppingCart, FaMapMarkerAlt, FaCreditCard, FaLock, FaEnvelope, FaUniversity, FaMoneyBillWave } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CONFIG } from '../config/cliente';

const STEPS = ['Datos', 'Pago', 'Confirmacion'];

function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderId] = useState(() => Math.floor(Math.random() * 90000) + 10000);
  const [emailSent, setEmailSent] = useState(false);
  const [form, setForm] = useState({
    nombre: user?.name || '',
    apellido: user?.lastName || '',
    email: user?.email || '',
    telefono: '',
    direccion: '', ciudad: '', provincia: '',
    metodoPago: 'mercadopago'
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);

  const sendConfirmationEmail = async () => {
    const total = getTotalPrice();
    const shipping = total > CONFIG.envioGratisDesde ? 0 : CONFIG.costoEnvio;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(`${CONFIG.backendUrl}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          to_name:          `${form.nombre} ${form.apellido}`,
          to_email:         form.email,
          order_id:         `TS-${orderId}`,
          order_total:      formatPrice(total + shipping),
          delivery_address: `${form.direccion}, ${form.ciudad}`,
          payment_method:   form.metodoPago,
        })
      });
      clearTimeout(timeout);
      if (res.ok) setEmailSent(true);
    } catch (error) {
      console.error('Error enviando email:', error.name, error.message);
      setEmailSent(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.apellido.trim()) e.apellido = 'Requerido';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email invalido';
    if (!form.telefono.trim()) e.telefono = 'Requerido';
    if (!form.direccion.trim()) e.direccion = 'Requerido';
    if (!form.ciudad.trim()) e.ciudad = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => true;

  const payWithMercadoPago = async () => {
    setSending(true);
    try {
      const res = await fetch(`${CONFIG.backendUrl}/api/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          payer: { nombre: form.nombre, apellido: form.apellido, email: form.email },
          orderId: `TS-${orderId}`,
          backUrl: 'https://jgastonmurua.github.io/techstore-ecommerce/',
        }),
      });
      const data = await res.json();
      if (data.sandbox_init_point) {
        clearCart();
        window.location.href = data.sandbox_init_point;
      } else {
        throw new Error('No se recibio URL de pago');
      }
    } catch (error) {
      console.error('Error iniciando pago MP:', error.message);
      setSending(false);
    }
  };

  const handleNext = async () => {
    if (sending) return;
    if (step === 1 && !validateStep1()) return;
    if (step === 3) { clearCart(); navigate('/'); return; }
    if (step === 2) {
      if (form.metodoPago === 'mercadopago') {
        await payWithMercadoPago();
        return;
      }
      setSending(true);
      await sendConfirmationEmail();
      setSending(false);
    }
    setStep(s => s + 1);
  };

  if (cartItems.length === 0 && step < 3) {
    navigate('/carrito');
    return null;
  }

  const total = getTotalPrice();
  const shipping = total > 50000 ? 0 : 5000;

  return (
    <>
      <Helmet><title>Checkout - TechStore</title></Helmet>

      <div style={{ background: 'white', borderBottom: '1px solid var(--ts-border)', padding: '1rem 0' }}>
        <Container>
          <div style={{ color: 'var(--ts-purple)', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaShoppingCart size={18} /> Finalizar compra
          </div>
        </Container>
      </div>

      <Container className="py-4">

        {/* Stepper */}
        <div className="checkout-stepper" style={{ maxWidth: 480, margin: '0 auto 2.5rem' }}>
          {STEPS.map((label, i) => (
            <div key={i} className={`checkout-step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
              <div className="checkout-step-circle">
                {step > i + 1 ? <FaCheck size={12} /> : i + 1}
              </div>
              <span className="checkout-step-label">{label}</span>
            </div>
          ))}
        </div>

        <Row className="g-4 justify-content-center">

          {/* Formulario */}
          <Col lg={7}>

            {/* Step 1: Datos */}
            {step === 1 && (
              <div style={{ background: 'white', borderRadius: 10, border: '1px solid var(--ts-border)', padding: '1.5rem' }}>
                <h5 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaMapMarkerAlt style={{ color: 'var(--ts-teal)' }} /> Datos de entrega
                </h5>
                <Row className="g-3">
                  <Col sm={6}>
                    <Form.Label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nombre *</Form.Label>
                    <Form.Control name="nombre" value={form.nombre} onChange={handleChange} isInvalid={!!errors.nombre} size="sm" />
                    <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                  </Col>
                  <Col sm={6}>
                    <Form.Label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Apellido *</Form.Label>
                    <Form.Control name="apellido" value={form.apellido} onChange={handleChange} isInvalid={!!errors.apellido} size="sm" />
                    <Form.Control.Feedback type="invalid">{errors.apellido}</Form.Control.Feedback>
                  </Col>
                  <Col sm={6}>
                    <Form.Label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email *</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} isInvalid={!!errors.email} size="sm" />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Col>
                  <Col sm={6}>
                    <Form.Label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Telefono *</Form.Label>
                    <Form.Control name="telefono" value={form.telefono} onChange={handleChange} isInvalid={!!errors.telefono} size="sm" />
                    <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
                  </Col>
                  <Col sm={12}>
                    <Form.Label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Direccion *</Form.Label>
                    <Form.Control name="direccion" value={form.direccion} onChange={handleChange} isInvalid={!!errors.direccion} size="sm" placeholder="Calle, numero, piso..." />
                    <Form.Control.Feedback type="invalid">{errors.direccion}</Form.Control.Feedback>
                  </Col>
                  <Col sm={6}>
                    <Form.Label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Ciudad *</Form.Label>
                    <Form.Control name="ciudad" value={form.ciudad} onChange={handleChange} isInvalid={!!errors.ciudad} size="sm" />
                    <Form.Control.Feedback type="invalid">{errors.ciudad}</Form.Control.Feedback>
                  </Col>
                  <Col sm={6}>
                    <Form.Label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Provincia</Form.Label>
                    <Form.Select name="provincia" value={form.provincia} onChange={handleChange} size="sm">
                      <option value="">Seleccionar...</option>
                      {['Buenos Aires','CABA','Cordoba','Santa Fe','Mendoza','Tucuman','Salta','Misiones','Neuquen','Rio Negro','Chubut','Santa Cruz','Tierra del Fuego','Corrientes','Entre Rios','Formosa','Chaco','La Rioja','San Juan','San Luis','Santiago del Estero','Catamarca','Jujuy','La Pampa'].map(p => <option key={p}>{p}</option>)}
                    </Form.Select>
                  </Col>
                </Row>
              </div>
            )}

            {/* Step 2: Pago */}
            {step === 2 && (
              <div style={{ background: 'white', borderRadius: 10, border: '1px solid var(--ts-border)', padding: '1.5rem' }}>
                <h5 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaCreditCard style={{ color: 'var(--ts-teal)' }} /> Metodo de pago
                </h5>

                <div className="d-flex flex-column gap-2 mb-3">
                  {[
                    { value: 'mercadopago',  label: 'Mercado Pago', sub: 'Tarjeta, debito, efectivo y mas', badge: 'Recomendado' },
                    { value: 'transferencia', label: 'Transferencia bancaria', sub: 'CBU / Alias', badge: null },
                    { value: 'efectivo',      label: 'Pago en efectivo', sub: 'Rapipago / Pago Facil', badge: null },
                  ].map(opt => (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '0.75rem 1rem',
                      border: `2px solid ${form.metodoPago === opt.value ? 'var(--ts-teal)' : 'var(--ts-border)'}`,
                      borderRadius: 8, cursor: 'pointer', transition: 'border-color 0.15s',
                      background: form.metodoPago === opt.value ? 'rgba(0,137,123,0.04)' : 'white'
                    }}>
                      <input type="radio" name="metodoPago" value={opt.value} checked={form.metodoPago === opt.value} onChange={handleChange} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                          {opt.label}
                          {opt.badge && <span style={{ fontSize: '0.7rem', background: 'var(--ts-teal)', color: 'white', padding: '1px 7px', borderRadius: 10, fontWeight: 700 }}>{opt.badge}</span>}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--ts-text-muted)' }}>{opt.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {form.metodoPago === 'mercadopago' && (
                  <div style={{ background: '#f0faf9', border: '1px solid var(--ts-teal)', borderRadius: 8, padding: '0.85rem 1rem', fontSize: '0.83rem', color: 'var(--ts-text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FaLock size={12} style={{ color: 'var(--ts-teal)', flexShrink: 0 }} />
                    Al confirmar, seras redirigido a Mercado Pago para completar el pago de forma segura.
                  </div>
                )}

                {form.metodoPago === 'transferencia' && (
                  <div style={{ background: 'var(--ts-bg)', borderRadius: 8, padding: '1rem', fontSize: '0.85rem', color: 'var(--ts-text-muted)', lineHeight: 1.8 }}>
                    <FaUniversity size={13} style={{ marginRight: 6 }} />
                    <strong style={{ color: 'var(--ts-text)' }}>Datos bancarios:</strong><br />
                    CBU: 0000 0000 0000 0000 0000 00<br />
                    Alias: TECHSTORE.TIENDA<br />
                    Titular: TechStore S.A.
                  </div>
                )}

                {form.metodoPago === 'efectivo' && (
                  <div style={{ background: 'var(--ts-bg)', borderRadius: 8, padding: '1rem', fontSize: '0.85rem', color: 'var(--ts-text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FaMoneyBillWave size={13} />
                    Te enviaremos el codigo de pago por email una vez confirmado el pedido.
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirmacion */}
            {step === 3 && (
              <div style={{ background: 'white', borderRadius: 10, border: '1px solid var(--ts-border)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, background: 'var(--ts-teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <FaCheck size={28} color="white" />
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Pedido confirmado</h4>
                <p style={{ color: 'var(--ts-text-muted)', marginBottom: '1rem' }}>
                  Gracias <strong>{form.nombre}</strong>! Tu pedido fue confirmado.
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: emailSent ? 'rgba(0,137,123,0.08)' : 'var(--ts-bg)',
                  border: `1px solid ${emailSent ? 'var(--ts-teal)' : 'var(--ts-border)'}`,
                  borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem'
                }}>
                  <FaEnvelope size={13} style={{ color: emailSent ? 'var(--ts-teal)' : 'var(--ts-text-muted)', flexShrink: 0 }} />
                  {emailSent
                    ? <span>Te enviamos un email de confirmacion a <strong>{form.email}</strong></span>
                    : <span style={{ color: 'var(--ts-text-muted)' }}>Revisá tu casilla <strong>{form.email}</strong> para ver el comprobante</span>
                  }
                </div>
                <div style={{ background: 'var(--ts-bg)', borderRadius: 8, padding: '1rem 1.25rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  {[
                    ['Numero de orden', `#TS-${orderId}`],
                    ['Entrega estimada', '3-5 dias habiles'],
                    ['Direccion de envio', `${form.direccion}, ${form.ciudad}`],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--ts-text-muted)' }}>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de navegacion */}
            <div className="d-flex justify-content-between mt-3">
              {step > 1 && step < 3 ? (
                <button
                  onClick={() => setStep(s => s - 1)}
                  style={{ background: 'none', border: '1px solid var(--ts-border)', padding: '0.6rem 1.5rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  Volver
                </button>
              ) : <div />}
              <button
                onClick={handleNext}
                style={{ background: 'var(--ts-teal)', border: 'none', color: 'white', padding: '0.7rem 2rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', marginLeft: 'auto' }}
              >
                {step === 3 ? 'Volver a la tienda' : step === 2
                  ? (sending ? 'Procesando...' : form.metodoPago === 'mercadopago' ? 'Pagar con Mercado Pago' : 'Confirmar pedido')
                  : 'Continuar'}
              </button>
            </div>
          </Col>

          {/* Resumen del pedido */}
          {step < 3 && (
            <Col lg={4}>
              <div style={{ background: 'white', borderRadius: 10, border: '1px solid var(--ts-border)', padding: '1.25rem', position: 'sticky', top: '1.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--ts-border-light)', fontSize: '0.95rem' }}>
                  Resumen del pedido
                </div>
                <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                  {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', fontSize: '0.83rem' }}>
                      <span style={{ color: 'var(--ts-text-mid)', flex: 1, marginRight: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.nombre} <span style={{ color: 'var(--ts-text-muted)' }}>x{item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: 600, flexShrink: 0 }}>{formatPrice(item.precio * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--ts-border-light)', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--ts-text-muted)' }}>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--ts-text-muted)' }}>Envio</span>
                    <span style={{ color: shipping === 0 ? 'var(--ts-success)' : undefined, fontWeight: shipping === 0 ? 600 : undefined }}>
                      {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem' }}>
                    <span>Total</span>
                    <span>{formatPrice(total + shipping)}</span>
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Checkout;
