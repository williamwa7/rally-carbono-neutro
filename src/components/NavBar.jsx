// src/components/NavBar.jsx
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { useDatabase } from '../contexts/DatabaseContext';
import { useGeneralContext } from '../contexts/GeneralContext';

const NavBar = () => {
  const { isOnline } = useDatabase();
  const { texts, language, setLanguage } = useGeneralContext();

  return (
    <Navbar variant="light" expand="lg" className="mb-4 text-white shadow custom-navbar fixed-top">
      <Container>
        <div className="col-10 col-md-12  d-flex justify-content-between">
          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand className="d-flex align-items-center text-white fw-bold">
              {/* <i className="bi bi-flag-fill me-2"></i> */}
              <img src="/selo_branco.png" alt="" width={40} className="me-4" />
              <img src="/rally.png" alt="" width={140} className="d-none d-md-block" />
              <img src="/rally.png" alt="" width={100} className="d-md-none" />
            </Navbar.Brand>
          </Link>

          <div className="d-flex align-items-center me-md-3">
            {/* btn group */}
            {/* <div className="btn-group" role="group"> */}
            <span
              type="button"
              className={`${language === "pt" ? "border-bottom border-3" : ""} m-0 p-2`}
              onClick={() => setLanguage("pt")}
            >
              <img src="/brasil.png" alt="" width={20} />
            </span>
            <span
              type="button"
              className={`${language === "en" ? "border-bottom border-3" : ""} m-0 p-2`}
              onClick={() => setLanguage("en")}
            >
              <img src="/eua.png" alt="" width={20} />
            </span>
            <span
              type="button"
              className={`${language === "es" ? "border-bottom border-3" : ""} m-0 p-2`}
              onClick={() => setLanguage("es")}
            >
              <img src="/espanha.png" alt="" width={20} />
            </span>
          </div>
          {/* </div> */}
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" data-bs-theme="dark" className='border-0' />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <div className="col-12 d-flex justify-content-between mt-4 d-md-none">
              <Badge
                bg={isOnline ? "success" : "danger"}
                className="d-flex align-items-center"
              >
                {isOnline ? "Online" : "Offline"}
              </Badge>
              <Link href="/vehicleManagement" passHref legacyBehavior className=' btn btn-outline-light'>
                <Nav.Link className="text-white">
                  {/* icone de carro */}
                  <i className="me-2 bi bi-car-front"></i>
                  Gerenciar Veículos
                </Nav.Link>
              </Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;