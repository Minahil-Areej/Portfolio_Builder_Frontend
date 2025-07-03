import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ViewApplication = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/application-form/${id}`);
        setApplication(response.data);
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    };
    fetchApplication();
  }, [id]);

  if (!application) return <p>Loading...</p>;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Full Application View</h2>
      <Card className="p-4 shadow-sm">
        <Row>
          <Col><h5>Family Name: {application.familyName}</h5></Col>
          <Col><h5>First Name: {application.firstName}</h5></Col>
        </Row>
        <hr />
        <Row>
          <Col><p><strong>Date of Birth:</strong> {application.dateOfBirth}</p></Col>
          <Col><p><strong>Course:</strong> {application.courseToStudy}</p></Col>
        </Row>
        <Row>
          <Col><p><strong>Email:</strong> {application.email}</p></Col>
          <Col><p><strong>Phone:</strong> {application.mobile}</p></Col>
        </Row>
        {/* Similarly, you can add more sections for English, Previous Studies, etc */}
      </Card>
    </Container>
  );
};

export default ViewApplication;
