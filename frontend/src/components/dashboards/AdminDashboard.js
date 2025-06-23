import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../services/authService';

const AdminDashboard = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWarehouses: 0,
    totalInventory: 0,
    lowStockItems: 0
  });

  const currentUser = AuthService.getCurrentUser();
  const token = currentUser?.token;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Configure headers with JWT token
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Fetch warehouses
        const warehousesResponse = await axios.get('http://localhost:8080/api/warehouses', config);
        setWarehouses(warehousesResponse.data);

        // Fetch inventory
        const inventoryResponse = await axios.get('http://localhost:8080/api/inventory', config);
        setInventory(inventoryResponse.data);

        // Update stats
        setStats({
          totalUsers: 150, // This would be replaced with actual API call
          totalWarehouses: warehousesResponse.data.length,
          totalInventory: inventoryResponse.data.length,
          lowStockItems: inventoryResponse.data.filter(item => item.quantity < item.reorderLevel).length
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="h2">{stats.totalUsers}</Card.Text>
              <Button as={Link} to="/users" variant="outline-primary" size="sm">Manage Users</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Warehouses</Card.Title>
              <Card.Text className="h2">{loading ? '...' : stats.totalWarehouses}</Card.Text>
              <Button as={Link} to="/warehouses" variant="outline-primary" size="sm">View Warehouses</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Inventory Items</Card.Title>
              <Card.Text className="h2">{loading ? '...' : stats.totalInventory}</Card.Text>
              <Button as={Link} to="/inventory" variant="outline-primary" size="sm">View Inventory</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Low Stock Items</Card.Title>
              <Card.Text className="h2">{loading ? '...' : stats.lowStockItems}</Card.Text>
              <Button as={Link} to="/inventory/reorder" variant="outline-primary" size="sm">Reorder Items</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Recent Warehouses</span>
              <Button as={Link} to="/warehouses/add" variant="primary" size="sm">Add Warehouse</Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading warehouses...</p>
              ) : warehouses.length === 0 ? (
                <p>No warehouses found.</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouses.slice(0, 5).map(warehouse => (
                      <tr key={warehouse.id}>
                        <td>{warehouse.id}</td>
                        <td>{warehouse.name}</td>
                        <td>{warehouse.location}</td>
                        <td>
                          <Button as={Link} to={`/warehouses/${warehouse.id}`} variant="link" size="sm">View</Button>
                          <Button as={Link} to={`/warehouses/edit/${warehouse.id}`} variant="link" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Low Stock Inventory</span>
              <Button as={Link} to="/inventory/add" variant="primary" size="sm">Add Inventory</Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading inventory...</p>
              ) : inventory.length === 0 ? (
                <p>No inventory items found.</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Reorder Level</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory
                      .filter(item => item.quantity < item.reorderLevel)
                      .slice(0, 5)
                      .map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>
                            <span className={item.quantity < item.reorderLevel ? "text-danger" : ""}>
                              {item.quantity}
                            </span>
                          </td>
                          <td>{item.reorderLevel}</td>
                          <td>
                            <Button as={Link} to={`/inventory/${item.id}`} variant="link" size="sm">View</Button>
                            <Button as={Link} to={`/inventory/edit/${item.id}`} variant="link" size="sm">Edit</Button>
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

export default AdminDashboard;