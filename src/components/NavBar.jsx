// src/components/NavBar.jsx
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { useDatabase } from '../contexts/DatabaseContext';

const NavBar = () => {
  const { isOnline } = useDatabase();
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Navbar.Brand className="d-flex align-items-center">
            <i className="bi bi-flag-fill me-2"></i>
            Rally Carbono Neutro
          </Navbar.Brand>
        </Link>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Badge
              bg={isOnline ? "success" : "danger"}
              className="d-flex align-items-center p-2"
            >
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;