import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Container, Row, Col, Badge, Button, Spinner, Alert, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import authHeader from '../../services/authHeader';

const InventoryDetail = () => {
  const { id } = useParams();
  const [inventory, setInventory] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);
  
  // Transfer modal state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferQuantity, setTransferQuantity] = useState(1);
  const [destinationWarehouseId, setDestinationWarehouseId] = useState('');
  const [transferError, setTransferError] = useState('');
  const [transferring, setTransferring] = useState(false);

  // Quantity update modal state
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantityChange, setQuantityChange] = useState(0);
  const [quantityError, setQuantityError] = useState('');
  const [updatingQuantity, setUpdatingQuantity] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
    fetchInventoryData();
    fetchWarehouses();
  }, [id]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/inventory/${id}`, { headers: authHeader() });
      setInventory(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch inventory data. Please try again later.');
      setLoading(false);
      console.error('Error fetching inventory data:', err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/warehouses', { headers: authHeader() });
      setWarehouses(response.data.filter(warehouse => warehouse.isActive));
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setTransferError('');
    
    if (!destinationWarehouseId) {
      setTransferError('Please select a destination warehouse.');
      return;
    }
    
    if (destinationWarehouseId === inventory.warehouseId.toString()) {
      setTransferError('Source and destination warehouses cannot be the same.');
      return;
    }
    
    if (transferQuantity <= 0) {
      setTransferError('Transfer quantity must be greater than zero.');
      return;
    }
    
    if (transferQuantity > inventory.quantity) {
      setTransferError(`Cannot transfer more than available quantity (${inventory.quantity}).`);
      return;
    }
    
    try {
      setTransferring(true);
      await axios.post(
        'http://localhost:8080/api/inventory/transfer',
        {
          sourceInventoryId: inventory.inventoryId,
          destinationWarehouseId: parseInt(destinationWarehouseId),
          quantity: parseInt(transferQuantity)
        },
        { headers: authHeader() }
      );
      
      setShowTransferModal(false);
      fetchInventoryData(); // Refresh data
      setTransferring(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to transfer inventory. Please try again.';
      setTransferError(errorMessage);
      setTransferring(false);
      console.error('Error transferring inventory:', err);
    }
  };

  const handleQuantitySubmit = async (e) => {
    e.preventDefault();
    setQuantityError('');
    
    if (quantityChange === 0) {
      setQuantityError('Quantity change cannot be zero.');
      return;
    }
    
    if (quantityChange < 0 && Math.abs(quantityChange) > inventory.quantity) {
      setQuantityError(`Cannot reduce more than available quantity (${inventory.quantity}).`);
      return;
    }
    
    try {
      setUpdatingQuantity(true);
      await axios.patch(
        `http://localhost:8080/api/inventory/${inventory.inventoryId}/quantity`,
        { quantityChange: parseInt(quantityChange) },
        { headers: authHeader() }
      );
      
      setShowQuantityModal(false);
      fetchInventoryData(); // Refresh data
      setUpdatingQuantity(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update quantity. Please try again.';
      setQuantityError(errorMessage);
      setUpdatingQuantity(false);
      console.error('Error updating quantity:', err);
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

  if (!inventory) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Inventory item not found or you don't have permission to view it.
        </Alert>
        <Link to="/inventory">
          <Button variant="primary">Back to Inventory</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <h2>Inventory Item Details</h2>
        </Col>
        <Col className="text-end">
          <Link to="/inventory">
            <Button variant="secondary" className="me-2">Back to List</Button>
          </Link>
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager' || currentUser.role === 'warehouse_staff') && (
            <Link to={`/inventory/edit/${inventory.inventoryId}`}>
              <Button variant="warning">Edit Item</Button>
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
                <Col md={4} className="fw-bold">Item Name:</Col>
                <Col md={8}>{inventory.itemName}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">SKU:</Col>
                <Col md={8}>{inventory.sku}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Description:</Col>
                <Col md={8}>{inventory.description || 'No description available'}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Unit Price:</Col>
                <Col md={8}>${inventory.unitPrice}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Warehouse:</Col>
                <Col md={8}>{inventory.warehouseName}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Last Updated:</Col>
                <Col md={8}>{new Date(inventory.updatedAt).toLocaleString()}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Inventory Status</Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Current Quantity:</Col>
                <Col md={8}>
                  <span className="h4">{inventory.quantity}</span>
                  {' '}
                  {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager' || currentUser.role === 'warehouse_staff') && (
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => setShowQuantityModal(true)}
                    >
                      Update
                    </Button>
                  )}
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Reorder Point:</Col>
                <Col md={8}>{inventory.reorderPoint}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Reorder Quantity:</Col>
                <Col md={8}>{inventory.reorderQuantity}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Status:</Col>
                <Col md={8}>
                  {inventory.needsRestock ? (
                    <Badge bg="warning">Restock Needed</Badge>
                  ) : (
                    <Badge bg="success">In Stock</Badge>
                  )}
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">Total Value:</Col>
                <Col md={8}>${(inventory.quantity * inventory.unitPrice).toFixed(2)}</Col>
              </Row>
              
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'logistics_manager' || currentUser.role === 'warehouse_staff') && (
                <div className="mt-3">
                  <Button 
                    variant="primary" 
                    onClick={() => setShowTransferModal(true)}
                    disabled={inventory.quantity === 0}
                  >
                    Transfer to Another Warehouse
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transfer Modal */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Transfer Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {transferError && <Alert variant="danger">{transferError}</Alert>}
          
          <Form onSubmit={handleTransferSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Source Warehouse</Form.Label>
              <Form.Control
                type="text"
                value={inventory.warehouseName}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Destination Warehouse</Form.Label>
              <Form.Select
                value={destinationWarehouseId}
                onChange={(e) => setDestinationWarehouseId(e.target.value)}
                required
              >
                <option value="">Select destination warehouse</option>
                {warehouses
                  .filter(warehouse => warehouse.warehouseId !== inventory.warehouseId)
                  .map(warehouse => (
                    <option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                      {warehouse.name} ({warehouse.location})
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Item</Form.Label>
              <Form.Control
                type="text"
                value={`${inventory.itemName} (${inventory.sku})`}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Available Quantity</Form.Label>
              <Form.Control
                type="text"
                value={inventory.quantity}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Transfer Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={inventory.quantity}
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(e.target.value)}
                required
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowTransferModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={transferring}>
                {transferring ? 'Processing...' : 'Transfer'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Quantity Update Modal */}
      <Modal show={showQuantityModal} onHide={() => setShowQuantityModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Inventory Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {quantityError && <Alert variant="danger">{quantityError}</Alert>}
          
          <Form onSubmit={handleQuantitySubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Item</Form.Label>
              <Form.Control
                type="text"
                value={`${inventory.itemName} (${inventory.sku})`}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Current Quantity</Form.Label>
              <Form.Control
                type="text"
                value={inventory.quantity}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Quantity Change</Form.Label>
              <Form.Control
                type="number"
                value={quantityChange}
                onChange={(e) => setQuantityChange(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Enter a positive number to add inventory or a negative number to remove inventory.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>New Quantity</Form.Label>
              <Form.Control
                type="text"
                value={inventory.quantity + parseInt(quantityChange || 0)}
                disabled
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowQuantityModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={updatingQuantity}>
                {updatingQuantity ? 'Updating...' : 'Update Quantity'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default InventoryDetail;
