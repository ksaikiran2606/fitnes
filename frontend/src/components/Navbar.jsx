import React from 'react'
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Icons
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalDrinkIcon from '@mui/icons-material/LocalDrink'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonIcon from '@mui/icons-material/Person'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const getNavLinkClass = (path) => {
    const baseClass = "nav-link position-relative px-3 py-2 mx-1 rounded-pill transition-all"
    return isActive(path) 
      ? `${baseClass} active-nav-link fw-semibold` 
      : `${baseClass} text-muted hover-nav-link`
  }

  return (
    <BootstrapNavbar 
      bg={theme === 'dark' ? 'dark' : 'white'} 
      variant={theme === 'dark' ? 'dark' : 'light'} 
      expand="lg" 
      className="navbar-modern shadow-sm border-bottom"
      style={{ 
        backdropFilter: 'blur(10px)',
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <Container>
        {/* Brand Logo */}
        <BootstrapNavbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bold d-flex align-items-center brand-logo"
        >
          <div className="brand-icon-wrapper me-2">
            <FitnessCenterIcon className="brand-icon" />
          </div>
          <span className="brand-text">
            Fitness<span className="brand-accent">Tracker</span>
          </span>
        </BootstrapNavbar.Brand>
        
        {/* Mobile Toggle */}
        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="border-0"
        >
          <MenuIcon />
        </BootstrapNavbar.Toggle>
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {user ? (
            <>
              {/* Navigation Links */}
              <Nav className="mx-auto d-flex align-items-center">
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  className={getNavLinkClass('/dashboard')}
                >
                  <DashboardIcon className="nav-icon me-2" />
                  <span className="nav-text">Dashboard</span>
                  {isActive('/dashboard') && <div className="nav-indicator"></div>}
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/workouts" 
                  className={getNavLinkClass('/workouts')}
                >
                  <FitnessCenterIcon className="nav-icon me-2" />
                  <span className="nav-text">Workouts</span>
                  {isActive('/workouts') && <div className="nav-indicator"></div>}
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/diet" 
                  className={getNavLinkClass('/diet')}
                >
                  <RestaurantIcon className="nav-icon me-2" />
                  <span className="nav-text">Diet</span>
                  {isActive('/diet') && <div className="nav-indicator"></div>}
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/water" 
                  className={getNavLinkClass('/water')}
                >
                  <LocalDrinkIcon className="nav-icon me-2" />
                  <span className="nav-text">Water</span>
                  {isActive('/water') && <div className="nav-indicator"></div>}
                </Nav.Link>
              </Nav>
              
              {/* Right Side Actions */}
              <Nav className="d-flex align-items-center gap-3">
                {/* Theme Toggle */}
                <Button
                  variant="outline-secondary"
                  onClick={toggleTheme}
                  className="theme-toggle border-0 rounded-circle d-flex align-items-center justify-content-center"
                  size="sm"
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? 
                    <LightModeIcon fontSize="small" /> : 
                    <DarkModeIcon fontSize="small" />
                  }
                </Button>

                {/* Notifications Bell */}
                <Button
                  variant="outline-secondary"
                  className="notifications-btn border-0 rounded-circle d-flex align-items-center justify-content-center position-relative"
                  size="sm"
                >
                  <NotificationsIcon fontSize="small" />
                  <span className="notification-badge"></span>
                </Button>

                {/* User Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="outline-primary" 
                    id="user-dropdown"
                    className="user-dropdown-toggle border-0 d-flex align-items-center gap-2"
                  >
                    <div className="user-avatar d-flex align-items-center justify-content-center">
                      <AccountCircleIcon fontSize="small" />
                    </div>
                    <span className="user-name d-none d-md-inline">
                      {user.first_name || user.username}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-modern">
                    <Dropdown.Item 
                      as={Link} 
                      to="/profile" 
                      className="d-flex align-items-center gap-2 py-2"
                    >
                      <PersonIcon fontSize="small" />
                      <span>Profile</span>
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item 
                      onClick={handleLogout}
                      className="d-flex align-items-center gap-2 py-2 text-danger"
                    >
                      <LogoutIcon fontSize="small" />
                      <span>Logout</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
          ) : (
            /* Unauthenticated Navigation */
            <Nav className="ms-auto d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                onClick={toggleTheme}
                className="theme-toggle border-0 rounded-circle d-flex align-items-center justify-content-center"
                size="sm"
              >
                {theme === 'dark' ? 
                  <LightModeIcon fontSize="small" /> : 
                  <DarkModeIcon fontSize="small" />
                }
              </Button>
              
              <Nav.Link 
                as={Link} 
                to="/login" 
                className="nav-link-auth px-3 py-2 rounded-pill"
              >
                Sign In
              </Nav.Link>
              
              <Button 
                as={Link}
                to="/register"
                variant="primary" 
                className="px-3 py-2 rounded-pill fw-semibold"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                Get Started
              </Button>
            </Nav>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar