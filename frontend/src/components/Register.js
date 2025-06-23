import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Form } from 'react-bootstrap';
import AuthService from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("warehouse_staff");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeRole = (e) => {
    setRole(e.target.value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setMessage("");
    setSuccessful(false);
    setValidated(true);

    AuthService.register(username, email, password, role).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h3 className="text-center mb-4">Sign Up</h3>

              {message && (
                <Alert variant={successful ? "success" : "danger"} className="mb-4">
                  {message}
                </Alert>
              )}

              {!successful && (
                <Form noValidate validated={validated} onSubmit={handleRegister}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={onChangeUsername}
                      required
                      minLength="3"
                      maxLength="20"
                    />
                    <Form.Control.Feedback type="invalid">
                      Username must be between 3 and 20 characters
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={onChangeEmail}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={onChangePassword}
                      required
                      minLength="6"
                      maxLength="40"
                    />
                    <Form.Control.Feedback type="invalid">
                      Password must be between 6 and 40 characters
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Select 
                      value={role}
                      onChange={onChangeRole}
                    >
                      <option value="admin">Admin</option>
                      <option value="logistics_manager">Logistics Manager</option>
                      <option value="warehouse_staff">Warehouse Staff</option>
                      <option value="delivery_driver">Delivery Driver</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="form-group text-center">
                    <Button variant="primary" type="submit" className="btn-block w-100">
                      Sign Up
                    </Button>
                  </div>
                </Form>
              )}
              
              <div className="mt-3 text-center">
                <p>Already have an account? <a href="/login">Login</a></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
