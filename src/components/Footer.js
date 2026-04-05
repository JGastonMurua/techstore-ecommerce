import React from 'react';
import { Container } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer-ts" style={{ padding: '0' }}>

      {/* Banner CTA */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem 0', background: 'rgba(255,255,255,0.04)' }}>
        <Container>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
              Este proyecto es una <strong style={{ color: 'rgba(255,255,255,0.9)' }}>demo de e-commerce</strong> construida con React.
              &nbsp;¿Tu empresa necesita algo así? Lo desarrollamos juntos.
            </span>
            <a
              href="mailto:gastton.murua@gmail.com"
              style={{
                background: 'var(--ts-teal)',
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: 20,
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s'
              }}
            >
              Hablame
            </a>
          </div>
        </Container>
      </div>

      {/* Linea principal */}
      <div style={{ padding: '0.75rem 0' }}>
        <Container>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              TechStore &nbsp;·&nbsp; © {new Date().getFullYear()} Gaston Murua
            </span>
            <div className="d-flex align-items-center gap-3">
              <a href="mailto:gastton.murua@gmail.com" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <FaEnvelope size={14} />
              </a>
              <a href="https://github.com/JGastonMurua" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <FaGithub size={14} />
              </a>
              <a href="https://linkedin.com/in/jgastonmurua" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <FaLinkedin size={14} />
              </a>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Talento Tech · React 2025</span>
            </div>
          </div>
        </Container>
      </div>

    </footer>
  );
}

export default Footer;
