import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';

const WarehouseStaffDashboard = () => {
  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Warehouse Staff Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Pending Orders</Card.Title>
              <Card.Text className="h2">15</Card.Text>
              <Button variant="primary" size="sm">Process Orders</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Items to Pack</Card.Title>
              <Card.Text className="h2">34</Card.Text>
              <Button variant="primary" size="sm">View Packing List</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Low Stock Items</Card.Title>
              <Card.Text className="h2">8</Card.Text>
              <Button variant="primary" size="sm">Check Inventory</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Today's Tasks</Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#5678</td>
                    <td>5 items</td>
                    <td><span className="badge bg-danger">High</span></td>
                    <td>Pending</td>
                    <td><Button variant="primary" size="sm">Process</Button></td>
                  </tr>
                  <tr>
                    <td>#5679</td>
                    <td>3 items</td>
                    <td><span className="badge bg-warning">Medium</span></td>
                    <td>Packing</td>
                    <td><Button variant="primary" size="sm">Complete</Button></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Quick Actions</Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="primary" className="mb-2">Scan New Items</Button>
                <Button variant="outline-primary" className="mb-2">Print Labels</Button>
                <Button variant="outline-primary" className="mb-2">Update Stock</Button>
                <Button variant="outline-primary">Report Issue</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WarehouseStaffDashboard; 