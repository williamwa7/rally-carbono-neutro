// src/components/Layout.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import NavBar from './NavBar';
import Head from 'next/head';

const Layout = ({ children, title = "Rally Carbono Neutro" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Aplicativo do Rally Carbono Neutro" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      </Head>

      <NavBar />

      <Container className="mb-5 mt-5 pt-5">
        {children}
      </Container>

      <footer className="bg-light pt-3 mt-auto border-top">
        <Container className="text-center text-muted">
          <small>{new Date().getFullYear()} Rally Carbono Neutro</small>
          <p className='small'><small>Este aplicativo foi desenvolvido pela FAU Agricultura e Meio Ambiente para uso exclusivo em coleta de dados do Rally Carbono Neutro, no Rally Internacional de Erechim</small></p>
        </Container>
      </footer>
    </>
  );
};

export default Layout;