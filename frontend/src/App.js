import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/authService";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import DashboardRouter from "./components/DashboardRouter";
import TestLogin from "./components/TestLogin";

// Warehouse components
import WarehouseList from "./components/warehouse/WarehouseList";
import WarehouseForm from "./components/warehouse/WarehouseForm";
import WarehouseDetail from "./components/warehouse/WarehouseDetail";

// Inventory components
import InventoryList from "./components/inventory/InventoryList";
import InventoryForm from "./components/inventory/InventoryForm";
import InventoryDetail from "./components/inventory/InventoryDetail";

import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const location = useLocation();

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Logistics Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active" : ""}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/test-login" className={location.pathname === "/test-login" ? "active" : ""}>
                Test Login
              </Nav.Link>
              {currentUser && (
                <>
                  <Nav.Link as={Link} to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                    Dashboard
                  </Nav.Link>
                  <NavDropdown title="Warehouse" id="warehouse-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/warehouses">
                      Warehouse List
                    </NavDropdown.Item>
                    {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager') && (
                      <NavDropdown.Item as={Link} to="/warehouses/add">
                        Add Warehouse
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                  <NavDropdown title="Inventory" id="inventory-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/inventory">
                      Inventory List
                    </NavDropdown.Item>
                    {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager' || currentUser.role === 'warehouse_staff') && (
                      <NavDropdown.Item as={Link} to="/inventory/add">
                        Add Inventory
                      </NavDropdown.Item>
                    )}
                    {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager') && (
                      <NavDropdown.Item as={Link} to="/inventory/reorder">
                        Reorder Items
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                </>
              )}
            </Nav>

            {currentUser ? (
              <Nav>
                <Nav.Link as={Link} to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
                  {currentUser.username}
                </Nav.Link>
                <Nav.Link onClick={logOut}>
                  Logout
                </Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link as={Link} to="/login" className={location.pathname === "/login" ? "active" : ""}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className={location.pathname === "/register" ? "active" : ""}>
                  Sign Up
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/test-login" element={<TestLogin />} />
          
          {/* Warehouse Routes */}
          <Route path="/warehouses" element={<WarehouseList />} />
          <Route path="/warehouses/add" element={<WarehouseForm />} />
          <Route path="/warehouses/edit/:id" element={<WarehouseForm />} />
          <Route path="/warehouses/:id" element={<WarehouseDetail />} />
          
          {/* Inventory Routes */}
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/inventory/add" element={<InventoryForm />} />
          <Route path="/inventory/edit/:id" element={<InventoryForm />} />
          <Route path="/inventory/:id" element={<InventoryDetail />} />
          <Route path="/inventory/reorder" element={<InventoryList />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
