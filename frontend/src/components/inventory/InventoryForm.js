import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import authHeader from '../../services/authHeader';

const InventoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAddMode = !id;
  
  // Get warehouseId from query params if provided (for adding inventory directly from warehouse page)
  const queryParams = new URLSearchParams(location.search);
  const preselectedWarehouseId = queryParams.get('warehouseId');

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    sku: '',
    quantity: '',
    reorderPoint: '',
    reorderQuantity: '',
    unitPrice: '',
    warehouseId: preselectedWarehouseId || ''
  });
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    // Fetch available warehouses
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/warehouses', { headers: authHeader() });
        setWarehouses(response.data.filter(warehouse => warehouse.isActive));
      } catch (err) {
        console.error('Error fetching warehouses:', err);
        setError('Failed to load warehouses. Please try again later.');
      }
    };

    // If editing, fetch the inventory data
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/inventory/${id}`, { headers: authHeader() });
        const inventory = response.data;
        setFormData({
          itemName: inventory.itemName,
          description: inventory.description || '',
          sku: inventory.sku,
          quantity: inventory.quantity,
          reorderPoint: inventory.reorderPoint,
          reorderQuantity: inventory.reorderQuantity,
          unitPrice: inventory.unitPrice,
          warehouseId: inventory.warehouseId
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to load inventory data. Please try again later.');
        console.error('Error fetching inventory:', err);
      }
    };

    fetchWarehouses();
    if (!isAddMode) {
      fetchInventory();
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
      // Create a payload with proper data types for the backend
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity),
        reorderPoint: parseInt(formData.reorderPoint),
        reorderQuantity: parseInt(formData.reorderQuantity),
        // Send unitPrice as a string to be compatible with BigDecimal on the backend
        unitPrice: formData.unitPrice ? formData.unitPrice.toString() : "0",
        warehouseId: parseInt(formData.warehouseId)
      };
      
      console.log('Inventory payload to submit:', payload);

      if (isAddMode) {
        await axios.post('http://localhost:8080/api/inventory', payload, { headers: authHeader() });
      } else {
        await axios.put(`http://localhost:8080/api/inventory/${id}`, payload, { headers: authHeader() });
      }
      
      navigate('/inventory');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      setSubmitting(false);
      console.error('Error saving inventory:', err);
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
              {isAddMode ? 'Add New Inventory Item' : 'Edit Inventory Item'}
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="itemName">
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    placeholder="Enter item name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide an item name.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter item description (optional)"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="sku">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    placeholder="Enter SKU (Stock Keeping Unit)"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a SKU.
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="quantity">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="Enter quantity"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid quantity.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="unitPrice">
                      <Form.Label>Unit Price ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Enter unit price"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid unit price.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="reorderPoint">
                      <Form.Label>Reorder Point</Form.Label>
                      <Form.Control
                        type="number"
                        name="reorderPoint"
                        value={formData.reorderPoint}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="Enter reorder point"
                      />
                      <Form.Text className="text-muted">
                        Minimum quantity before reordering
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid reorder point.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="reorderQuantity">
                      <Form.Label>Reorder Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        name="reorderQuantity"
                        value={formData.reorderQuantity}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="Enter reorder quantity"
                      />
                      <Form.Text className="text-muted">
                        Quantity to order when restocking
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid reorder quantity.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="warehouseId">
                  <Form.Label>Warehouse</Form.Label>
                  <Form.Select
                    name="warehouseId"
                    value={formData.warehouseId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a warehouse</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                        {warehouse.name} ({warehouse.location})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a warehouse.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={() => navigate('/inventory')}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Inventory Item'}
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

export default InventoryForm;
