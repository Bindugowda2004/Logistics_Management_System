import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import authHeader from '../../services/authHeader';

const WarehouseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAddMode = !id;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    managerId: '',
    contactPhone: '',
    contactEmail: ''
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    // Fetch available managers (users with logistics_manager role)
    const fetchManagers = async () => {
      try {
        console.log('Fetching managers...');
        const response = await axios.get('http://localhost:8080/api/users/managers', { headers: authHeader() });
        console.log('Managers response:', response.data);
        setManagers(response.data);
      } catch (err) {
        console.error('Error fetching managers:', err);
        setError('Failed to load managers. Please try again later.');
      }
    };

    // If editing, fetch the warehouse data
    const fetchWarehouse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/warehouses/${id}`, { headers: authHeader() });
        const warehouse = response.data;
        setFormData({
          name: warehouse.name,
          location: warehouse.location,
          capacity: warehouse.capacity,
          managerId: warehouse.managerId || '',
          contactPhone: warehouse.contactPhone || '',
          contactEmail: warehouse.contactEmail || ''
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to load warehouse data. Please try again later.');
        console.error('Error fetching warehouse:', err);
      }
    };

    fetchManagers();
    if (!isAddMode) {
      fetchWarehouse();
    }
  }, [id, isAddMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setSubmitting(true);
    setError('');

    try {
      console.log('Submitting form data:', formData);
      
      // Validate required fields
      if (!formData.name || !formData.location || !formData.capacity) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }
      
      // Create a payload with proper data types for the backend
      const payload = {
        ...formData,
        // Send capacity as a string to be compatible with BigDecimal on the backend
        capacity: formData.capacity ? formData.capacity.toString() : "0",
        managerId: formData.managerId ? parseInt(formData.managerId) : null
      };
      
      console.log('Payload to submit:', payload);

      let response;
      if (isAddMode) {
        response = await axios.post('http://localhost:8080/api/warehouses', payload, { headers: authHeader() });
        console.log('Create warehouse response:', response.data);
      } else {
        response = await axios.put(`http://localhost:8080/api/warehouses/${id}`, payload, { headers: authHeader() });
        console.log('Update warehouse response:', response.data);
      }
      
      // If we got here, the operation was successful
      navigate('/warehouses');
    } catch (err) {
      console.error('Error saving warehouse:', err);
      console.error('Error response:', err.response?.data);
      
      // Extract error message from response if available
      let errorMessage = 'An error occurred. Please try again.';
      
      if (err.response) {
        if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4" className="bg-primary text-white">
              {isAddMode ? 'Add New Warehouse' : 'Edit Warehouse'}
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Warehouse Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter warehouse name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a warehouse name.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Enter warehouse location"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a location.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="capacity">
                  <Form.Label>Capacity (in cubic meters)</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter warehouse capacity"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid capacity.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="managerId">
                  <Form.Label>Warehouse Manager</Form.Label>
                  <Form.Select
                    name="managerId"
                    value={formData.managerId}
                    onChange={handleChange}
                  >
                    <option value="">Select a manager (optional)</option>
                    {managers.length > 0 ? (
                      managers.map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.username} ({manager.email})
                        </option>
                      ))
                    ) : (
                      <option disabled>No managers available</option>
                    )}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="contactPhone">
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="Enter contact phone (optional)"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="contactEmail">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="Enter contact email (optional)"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={() => navigate('/warehouses')}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Warehouse'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WarehouseForm;
