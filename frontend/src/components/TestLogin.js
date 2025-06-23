import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';

const TestLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestAuth = async () => {
    try {
      setLoading(true);
      setError('');
      setTestResult(null);
      
      const result = await axios.get('http://localhost:8080/api/auth/test');
      setTestResult({
        success: true,
        message: result.data
      });
    } catch (err) {
      console.error('Test auth error:', err);
      setTestResult({
        success: false,
        message: err.message,
        details: err.response ? `Status: ${err.response.status}, Data: ${JSON.stringify(err.response.data)}` : 'No response details'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEcho = async () => {
    try {
      setLoading(true);
      setError('');
      setResponse(null);
      
      const result = await axios.post('http://localhost:8080/api/test/echo', {
        username,
        password
      });
      setResponse(result.data);
    } catch (err) {
      console.error('Test echo error:', err);
      setError(err.message + (err.response ? ` (Status: ${err.response.status})` : ''));
    } finally {
      setLoading(false);
    }
  };

  const handleDirectLogin = async () => {
    try {
      setLoading(true);
      setError('');
      setResponse(null);
      
      console.log('Sending direct login request with:', { username, password });
      
      const result = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });
      
      console.log('Direct login response:', result);
      setResponse(result.data);
      
      if (result.data.token) {
        localStorage.setItem('user', JSON.stringify(result.data));
      }
    } catch (err) {
      console.error('Direct login error:', err);
      setError(err.message + (err.response ? ` (Status: ${err.response.status})` : ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h4">Authentication Test Tool</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>
            
            <div className="d-flex gap-2 mb-4">
              <Button 
                variant="primary" 
                onClick={handleDirectLogin}
                disabled={loading || !username || !password}
              >
                Test Direct Login
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={handleTestEcho}
                disabled={loading}
              >
                Test Echo
              </Button>
              
              <Button 
                variant="info" 
                onClick={handleTestAuth}
                disabled={loading}
              >
                Test Auth Endpoint
              </Button>
            </div>
          </Form>
          
          {error && (
            <Alert variant="danger">
              <strong>Error:</strong> {error}
            </Alert>
          )}
          
          {testResult && (
            <Alert variant={testResult.success ? "success" : "danger"}>
              <strong>Test Result:</strong><br />
              {testResult.message}<br />
              {testResult.details && <small>{testResult.details}</small>}
            </Alert>
          )}
          
          {response && (
            <div>
              <h5>Response:</h5>
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestLogin;
