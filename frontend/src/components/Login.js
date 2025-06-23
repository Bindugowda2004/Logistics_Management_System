import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import { Container, Row, Col, Card, Button, Alert, Form } from 'react-bootstrap';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setMessage("");
    setLoading(true);
    setValidated(true);

    AuthService.login(username, password).then(
      (response) => {
        if (response.token) {
          // Successful login
          setMessage("Login successful! Redirecting...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          // Login failed
          setMessage(response.message || "Login failed. Please try again.");
          setLoading(false);
        }
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setLoading(false);
      }
    );
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header as="h4" className="text-center bg-primary text-white">
              Login
            </Card.Header>
            <Card.Body>
              {message && (
                <Alert variant={message.includes("successful") ? "success" : "danger"}>
                  {message}
                </Alert>
              )}
              <Form noValidate validated={validated} onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={onChangeUsername}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your username
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={onChangePassword}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your password
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="text-center">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </div>
              </Form>
              <div className="mt-3 text-center">
                <p>Don't have an account? <a href="/register">Sign Up</a></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
