import React from "react";
import { Navigate } from "react-router-dom";
import { Container, Row, Col, Card } from 'react-bootstrap';
import AuthService from "../services/authService";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header as="h4" className="bg-primary text-white">
              User Profile
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center mb-4 mb-md-0">
                  <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                       style={{ width: "150px", height: "150px" }}>
                    <span className="display-4 text-secondary">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </Col>
                <Col md={8}>
                  <div className="mb-3">
                    <h5>Username:</h5>
                    <p className="lead">{currentUser.username}</p>
                  </div>
                  <div className="mb-3">
                    <h5>Email:</h5>
                    <p className="lead">{currentUser.email}</p>
                  </div>
                  <div className="mb-3">
                    <h5>Role:</h5>
                    <p className="lead">
                      <span className="badge bg-info text-dark">
                        {currentUser.role.replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
