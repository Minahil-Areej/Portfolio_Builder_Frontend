// src/pages/ApplicationSuccess.jsx
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ApplicationSuccess = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow-sm text-center" style={{ maxWidth: '500px' }}>
        <h2 className="text-success mb-3">Application Submitted!</h2>
        <p>Thank you for completing the application form. We’ll get in touch with you soon.</p>
        <Button onClick={() => navigate('/')}>Go to Homepage</Button>
      </Card>
    </Container>
  );
};

export default ApplicationSuccess;
