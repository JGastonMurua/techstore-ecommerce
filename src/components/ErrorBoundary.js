import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--ts-bg)'
        }}>
          <div style={{ textAlign: 'center', maxWidth: 420, padding: '2rem' }}>
            <FaExclamationTriangle size={44} style={{ color: '#F59E0B', marginBottom: '1rem' }} />
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Algo salió mal</h3>
            <p style={{ color: 'var(--ts-text-muted)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              Ocurrió un error inesperado. Recargá la página para continuar.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--ts-teal)', border: 'none', color: 'white',
                padding: '0.65rem 1.5rem', borderRadius: 8, fontWeight: 700,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: '0.9rem'
              }}
            >
              <FaRedo size={13} /> Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
