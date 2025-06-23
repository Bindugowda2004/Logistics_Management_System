import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';

const DeliveryDriverDashboard = () => {
  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Delivery Driver Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Today's Deliveries</Card.Title>
              <Card.Text className="h2">8</Card.Text>
              <Button variant="primary" size="sm">View Route</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Completed Today</Card.Title>
              <Card.Text className="h2">3</Card.Text>
              <Button variant="primary" size="sm">View Details</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Vehicle Status</Card.Title>
              <Card.Text className="text-success h5">Ready for Delivery</Card.Text>
              <Button variant="primary" size="sm">Report Issue</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Delivery Schedule</Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Address</th>
                    <th>Package ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>09:00 AM</td>
                    <td>123 Main St, City</td>
                    <td>#D123</td>
                    <td><span className="badge bg-success">Delivered</span></td>
                    <td><Button variant="link" size="sm">Details</Button></td>
                  </tr>
                  <tr>
                    <td>10:30 AM</td>
                    <td>456 Oak Ave, Town</td>
                    <td>#D124</td>
                    <td><span className="badge bg-warning">Pending</span></td>
                    <td>
                      <Button variant="primary" size="sm">Start Delivery</Button>
                    </td>
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
                <Button variant="primary" className="mb-2">Start New Delivery</Button>
                <Button variant="outline-primary" className="mb-2">Update Status</Button>
                <Button variant="outline-primary" className="mb-2">View Map</Button>
                <Button variant="outline-primary">Contact Dispatch</Button>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>Current Stats</Card.Header>
            <Card.Body>
              <p className="mb-2">Distance Covered: 45 km</p>
              <p className="mb-2">Fuel Level: 75%</p>
              <p className="mb-0">Next Break: 12:30 PM</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DeliveryDriverDashboard; 