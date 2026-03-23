import React from 'react'
import { Container } from 'react-bootstrap'

type FooterProps = React.HTMLAttributes<HTMLDivElement>

function Footer({ className }: FooterProps) {
  return (
    <footer className={`bg-body-tertiary py-2 text-center shadow-sm ${className}`} >
      <Container>
        {/* Tagline */}
        <p className="text-muted mb-2">
          Designed to make tracking course enrollment simple.
        </p>
        
        {/* Copyright with Dynamic Year */}
        <small className="text-muted">
          © {new Date().getFullYear()} Course Track
        </small>
      </Container>
    </footer>
  )
}

export default Footer