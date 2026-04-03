import React from 'react';
import { Container } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer-ts" style={{ padding: '0.9rem 0' }}>
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
    </footer>
  );
}

export default Footer;
