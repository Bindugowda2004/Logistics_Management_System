import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Container, Row, Col, Badge, Button, Spinner, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import authHeader from '../../services/authHeader';

const WarehouseDetail = () => {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
    fetchWarehouseData();
  }, [id]);

  const fetchWarehouseData = async () => {
    try {
      setLoading(true);
      const warehouseResponse = await axios.get(`http://localhost:8080/api/warehouses/${id}`, { headers: authHeader() });
      setWarehouse(warehouseResponse.data);
      
      // Fetch inventory for this warehouse
      const inventoryResponse = await axios.get(`http://localhost:8080/api/inventory/warehouse/${id}`, { headers: authHeader() });
      setInventory(inventoryResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch warehouse data. Please try again later.');
      setLoading(false);
      console.error('Error fetching warehouse data:', err);
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

  if (!warehouse) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Warehouse not found or you don't have permission to view it.
        </Alert>
        <Link to="/warehouses">
          <Button variant="primary">Back to Warehouses</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <h2>Warehouse Details</h2>
        </Col>
        <Col className="text-end">
          <Link to="/warehouses">
            <Button variant="secondary" className="me-2">Back to List</Button>
          </Link>
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager') && (
            <Link to={`/warehouses/edit/${warehouse.warehouseId}`}>
              <Button variant="warning">Edit Warehouse</Button>
            </Link>
          )}
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">General Information</Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">ID:</Col>
                <Col md={8}>{warehouse.warehouseId}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Name:</Col>
                <Col md={8}>{warehouse.name}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Location:</Col>
                <Col md={8}>{warehouse.location}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Capacity:</Col>
                <Col md={8}>{warehouse.capacity} cubic meters</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Status:</Col>
                <Col md={8}>
                  {warehouse.isActive ? (
                    <Badge bg="success">Active</Badge>
                  ) : (
                    <Badge bg="danger">Inactive</Badge>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Contact Information</Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Manager:</Col>
                <Col md={8}>{warehouse.managerName || 'Not Assigned'}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Phone:</Col>
                <Col md={8}>{warehouse.contactPhone || 'Not Available'}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Email:</Col>
                <Col md={8}>{warehouse.contactEmail || 'Not Available'}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Inventory Items</h5>
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager' || currentUser.role === 'warehouse_staff') && (
                <Link to={`/inventory/add?warehouseId=${warehouse.warehouseId}`}>
                  <Button variant="primary" size="sm">Add Inventory Item</Button>
                </Link>
              )}
            </Card.Header>
            <Card.Body>
              {inventory.length === 0 ? (
                <p className="text-center">No inventory items found in this warehouse.</p>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Reorder Point</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.inventoryId}>
                        <td>{item.sku}</td>
                        <td>{item.itemName}</td>
                        <td>{item.quantity}</td>
                        <td>{item.reorderPoint}</td>
                        <td>
                          {item.needsRestock ? (
                            <Badge bg="warning">Restock Needed</Badge>
                          ) : (
                            <Badge bg="success">In Stock</Badge>
                          )}
                        </td>
                        <td>
                          <Link to={`/inventory/${item.inventoryId}`}>
                            <Button variant="info" size="sm" className="me-2">
                              View
                            </Button>
                          </Link>
                          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager' || currentUser.role === 'warehouse_staff') && (
                            <Link to={`/inventory/edit/${item.inventoryId}`}>
                              <Button variant="warning" size="sm">
                                Edit
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WarehouseDetail;
