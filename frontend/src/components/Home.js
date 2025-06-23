import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container className="mt-4">
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <h1>Welcome to Logistics Management System</h1>
            <p className="lead">
              Efficiently manage your logistics operations with our comprehensive solution
            </p>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Warehouse Management</Card.Title>
              <Card.Text>
                Track inventory levels, manage warehouse space, and optimize storage locations.
              </Card.Text>
              <div className="mt-auto">
                <Button as={Link} to="/login" variant="outline-primary">Learn More</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Shipment Tracking</Card.Title>
              <Card.Text>
                Real-time tracking of shipments from origin to destination with detailed status updates.
              </Card.Text>
              <div className="mt-auto">
                <Button as={Link} to="/login" variant="outline-primary">Learn More</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Fleet Management</Card.Title>
              <Card.Text>
                Manage delivery trucks, assign drivers, and optimize delivery routes.
              </Card.Text>
              <div className="mt-auto">
                <Button as={Link} to="/login" variant="outline-primary">Learn More</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={6} className="text-center">
          <h3>Ready to get started?</h3>
          <p>Create an account or log in to access the full features of our logistics management system.</p>
          <div className="mt-4">
            <Button as={Link} to="/register" variant="primary" className="me-3">Sign Up</Button>
            <Button as={Link} to="/login" variant="outline-primary">Login</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
