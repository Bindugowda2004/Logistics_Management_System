import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Card, Container, Row, Col, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import authHeader from '../../services/authHeader';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
    fetchWarehouses();
    fetchInventory();
  }, []);

  useEffect(() => {
    if (selectedWarehouse === 'all') {
      fetchInventory();
    } else {
      fetchInventoryByWarehouse(selectedWarehouse);
    }
  }, [selectedWarehouse, showLowStock]);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/warehouses', { headers: authHeader() });
      setWarehouses(response.data);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:8080/api/inventory';
      
      if (showLowStock) {
        url = 'http://localhost:8080/api/inventory/reorder';
      }
      
      const response = await axios.get(url, { headers: authHeader() });
      setInventory(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch inventory. Please try again later.');
      setLoading(false);
      console.error('Error fetching inventory:', err);
    }
  };

  const fetchInventoryByWarehouse = async (warehouseId) => {
    try {
      setLoading(true);
      let url = `http://localhost:8080/api/inventory/warehouse/${warehouseId}`;
      
      if (showLowStock) {
        url = `http://localhost:8080/api/inventory/reorder/warehouse/${warehouseId}`;
      }
      
      const response = await axios.get(url, { headers: authHeader() });
      setInventory(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch inventory. Please try again later.');
      setLoading(false);
      console.error('Error fetching inventory:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await axios.delete(`http://localhost:8080/api/inventory/${id}`, { headers: authHeader() });
        if (selectedWarehouse === 'all') {
          fetchInventory();
        } else {
          fetchInventoryByWarehouse(selectedWarehouse);
        }
      } catch (err) {
        setError('Failed to delete inventory item. Please try again later.');
        console.error('Error deleting inventory item:', err);
      }
    }
  };

  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);
  };

  const handleLowStockChange = (e) => {
    setShowLowStock(e.target.checked);
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
          <h2>Inventory Management</h2>
        </Col>
        <Col className="text-end">
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager' || currentUser.role === 'warehouse_staff') && (
            <Link to="/inventory/add">
              <Button variant="primary">Add New Inventory Item</Button>
            </Link>
          )}
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Warehouse</Form.Label>
            <Form.Select value={selectedWarehouse} onChange={handleWarehouseChange}>
              <option value="all">All Warehouses</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                  {warehouse.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mt-4">
            <Form.Check 
              type="checkbox" 
              label="Show only items below reorder point" 
              checked={showLowStock}
              onChange={handleLowStockChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {inventory.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No Inventory Items Found</Card.Title>
            <Card.Text>
              {showLowStock 
                ? "There are no items below reorder point."
                : "There are no inventory items in the system yet."}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Item Name</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Reorder Point</th>
                  <th>Unit Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.inventoryId}>
                    <td>{item.sku}</td>
                    <td>{item.itemName}</td>
                    <td>{item.warehouseName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.reorderPoint}</td>
                    <td>${item.unitPrice}</td>
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
                        <>
                          <Link to={`/inventory/edit/${item.inventoryId}`}>
                            <Button variant="warning" size="sm" className="me-2">
                              Edit
                            </Button>
                          </Link>
                          {(currentUser.role === 'admin' || currentUser.role === 'logistics_manager') && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(item.inventoryId)}
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

export default InventoryList;
