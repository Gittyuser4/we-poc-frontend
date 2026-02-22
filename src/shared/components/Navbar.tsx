import React, { useState } from 'react';
import { Navbar, Container, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const AppNavbar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();

  // Show language switcher ONLY on survey page
  const showLanguageSwitcher = location.pathname === '/';

  const handleBrandClick = () => {
    navigate('/');
    setExpanded(false);
  };

  return (
    <Navbar
      expanded={expanded}
      onToggle={setExpanded}
      expand="lg"
      bg="light"
      variant="light"
      className="navbar-custom"
    >
      <Container fluid className="px-3 px-md-4 px-sm-2">
        <Navbar.Brand
          as="div"
          onClick={handleBrandClick}
          className="d-flex align-items-center"
          style={{ cursor: 'pointer' }}
        >
          <img
            src="/Emblem_of_Telangana.svg"
            alt="Telangana Emblem"
            height="40"
            className="d-inline-block align-top me-3"
          />
          <span className="navbar-title fw-bold">
            {language === 'te' ? 'మహిళా సాధికారత సర్వే' : 'Women Empowerment Survey'}
          </span>
        </Navbar.Brand>

        {/* Language Switcher */}
        {showLanguageSwitcher && (
          <ButtonGroup className="ms-auto me-2">
            <Button
              variant={language === 'en' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => language === 'te' && toggleLanguage()}
              style={{ minWidth: '60px' }}
            >
              English
            </Button>
            <Button
              variant={language === 'te' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => language === 'en' && toggleLanguage()}
              style={{ minWidth: '60px' }}
            >
              తెలుగు
            </Button>
          </ButtonGroup>
        )}

        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />                 */}
        {/* <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              onClick={() => setExpanded(false)}
              className="nav-link-custom"
            >
              Survey
            </Nav.Link>
            <Nav.Link
              onClick={handleLoginClick}
              className="nav-link-custom btn-login"
            >
              <i className="bi bi-person-circle me-2"></i>
              Admin Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
