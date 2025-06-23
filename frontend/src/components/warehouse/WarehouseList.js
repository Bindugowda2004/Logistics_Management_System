import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Card, Container, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import authHeader from '../../services/authHeader';

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/warehouses', { headers: authHeader() });
      setWarehouses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch warehouses. Please try again later.');
      setLoading(false);
      console.error('Error fetching warehouses:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await axios.delete(`http://localhost:8080/api/warehouses/${id}`, { headers: authHeader() });
        fetchWarehouses(); // Refresh the list
      } catch (err) {
        setError('Failed to delete warehouse. Please try again later.');
        console.error('Error deleting warehouse:', err);
      }
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
      <Row className="mb-4">
        <Col>
          <h2>Warehouse Management</h2>
        </Col>
        <Col className="text-end">
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager') && (
            <Link to="/warehouses/add">
              <Button variant="primary">Add New Warehouse</Button>
            </Link>
          )}
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {warehouses.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No Warehouses Found</Card.Title>
            <Card.Text>
              There are no warehouses in the system yet.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((warehouse) => (
                  <tr key={warehouse.warehouseId}>
                    <td>{warehouse.warehouseId}</td>
                    <td>{warehouse.name}</td>
                    <td>{warehouse.location}</td>
                    <td>{warehouse.capacity}</td>
                    <td>{warehouse.managerName || 'Not Assigned'}</td>
                    <td>
                      {warehouse.isActive ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="danger">Inactive</Badge>
                      )}
                    </td>
                    <td>
                      <Link to={`/warehouses/${warehouse.warehouseId}`}>
                        <Button variant="info" size="sm" className="me-2">
                          View
                        </Button>
                      </Link>
                      {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager') && (
                        <>
                          <Link to={`/warehouses/edit/${warehouse.warehouseId}`}>
                            <Button variant="warning" size="sm" className="me-2">
                              Edit
                            </Button>
                          </Link>
                          {currentUser.role === 'admin' && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(warehouse.warehouseId)}
                            >
                              Delete
                            </Button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default WarehouseList;
