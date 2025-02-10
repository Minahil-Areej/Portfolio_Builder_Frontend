// AssessorPortfolio.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import './ViewPortfolio.css'; // Custom CSS for styling

const AssessorPortfolio = () => {
  const { id } = useParams();  // Get portfolio ID from URL
  const [portfolio, setPortfolio] = useState(null);
  const [feedback, setFeedback] = useState('');  // For assessor feedback
  const [status, setStatus] = useState('');  // Track portfolio status

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/portfolios/assessor/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPortfolio(data);
        setFeedback(data.assessorComments || '');  // Set initial feedback if exists
        setStatus(data.status);  // Set current status
      } catch (error) {
        console.error('Error fetching portfolio', error);
      }
    };

    fetchPortfolio();
  }, [id]);

  // const handleFeedbackSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post(
  //       `http://localhost:5000/api/portfolios/${id}/feedback`,
  //       { assessorComments: feedback, status: 'Reviewed' },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  //     alert('Feedback submitted successfully');
  //     //setOriginalFeedback(feedback); // Update original feedback with the latest submitted feedback
  //     setStatus('Reviewed'); // Update status locally
  //     //setFeedbackSubmitted(true);
  //   } catch (error) {
  //     console.error('Error submitting feedback', error);
  //   }
  // };

  const handleFeedbackSubmit = async (statusToUpdate) => {
    try {
      await axios.post(
        `${API_URL}/api/portfolios/${id}/feedback`,
        { assessorComments: feedback, status: statusToUpdate },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert(statusToUpdate === 'Reviewed' ? 'Feedback submitted successfully' : 'Feedback saved successfully');
      setStatus(statusToUpdate); // Update status locally
    } catch (error) {
      console.error(`Error ${statusToUpdate === 'Reviewed' ? 'submitting' : 'saving'} feedback`, error);
    }
  };
  
  // const markAsDone = async () => {

  //   try {
  //     await axios.post(
  //       `http://localhost:5000/api/portfolios/${id}/feedback`, {
  //       status: 'Done',
  //     }, {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });
  //     alert('Portfolio marked as done');
  //     setStatus('Done'); // Update status locally
  //   } catch (error) {
  //     console.error('Error marking portfolio as done', error);
  //   }
  // };

  const markAsUndone = async () => {
    try {
      await axios.post(
        `${API_URL}/api/portfolios/${id}/feedback`,
        { status: 'Reviewed' },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Portfolio marked as undone');
      setPortfolio({ ...portfolio, status: 'Reviewed' }); // Update the status locally
    } catch (error) {
      console.error('Error marking portfolio as undone', error);
    }
  };

  
  if (!portfolio) return <p>Loading...</p>;

  return (
    <Container>
     <Row className="mb-4">
        <Col>
          <h1 className="text-center portfolio-title">{portfolio.title}</h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Card className="portfolio-card mb-3">
            <Card.Body>
              <Card.Title className="portfolio-section-title">Portfolio Details</Card.Title>
              <Card.Text className="portfolio-text">
                <strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}
              </Card.Text>
              <Card.Text className="portfolio-text">
                <strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}
              </Card.Text>
              <Card.Text className="portfolio-text">
                <strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}
              </Card.Text>
              <Card.Text className="portfolio-text">
                <strong>Location:</strong> {portfolio.postcode}
              </Card.Text>
              <Card.Text className="portfolio-text">
                <strong>Task Description:</strong> {portfolio.taskDescription || 'N/A'}
              </Card.Text>
              <Card.Text className="portfolio-text">
                <strong>Job Type:</strong> {portfolio.jobType || 'N/A'}
              </Card.Text>
              <Card.Text className="portfolio-text">
                <strong>Reason for Task:</strong> {portfolio.reasonForTask || 'N/A'}
              </Card.Text>
              <Card.Text className="portfolio-text">
                <strong>Objective of Job:</strong> {portfolio.objectiveOfJob || 'N/A'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="portfolio-card mb-3">
            <Card.Body>
              <Card.Title className="portfolio-section-title">Comments & Feedback</Card.Title>
              <h5 className="portfolio-subtitle">Comments</h5>
              <Card.Text className="portfolio-text">{portfolio.comments}</Card.Text>
              <h5 className="portfolio-subtitle">Assessor Feedback</h5>
              <Form onSubmit={handleFeedbackSubmit}>
        <Form.Group controlId="feedback">
          <Form.Label>Assessor Feedback</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              // Check if feedback is different from original feedback
              //setFeedbackSubmitted(e.target.value === originalFeedback);
            }}
            readOnly={portfolio.status === 'Done'}
          />
        </Form.Group>
        {portfolio.status === 'Done' ? (
          <Button variant="warning" onClick={markAsUndone}>
          Mark as Undone
        </Button>
          ) : (
            <>
            <Button 
              variant="primary" 
              onClick={(e) => {
                e.preventDefault();
                handleFeedbackSubmit('Reviewed');
              }}
              className="mt-2 me-2"
              >
              Submit Feedback
            </Button>
            <Button 
              variant="info" 
              className="mt-2"
              onClick={(e) => {
                e.preventDefault();
                handleFeedbackSubmit('To Be Reviewed');
              }}
            >
              Save Feedback
            </Button>
          </>
        )}
      </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h2 className="portfolio-section-title">Images</h2>
          <div className="d-flex flex-wrap">
            {portfolio.images.map((image, index) => (
              <div key={index} className="portfolio-image-container">
                <img
                  src={`${API_URL}/${image}`}
                  alt="Portfolio"
                  className="portfolio-image"
                  onClick={() => handleImageClick(`${API_URL}/${image}`)}
                />
                <FaSearchPlus
                  className="portfolio-image-icon"
                  onClick={() => handleImageClick(`${API_URL}/${image}`)}
                  size={20}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <Button variant="primary" className="mt-3">
            Export as PDF
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleModalClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Enlarged Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={selectedImage} alt="Enlarged" style={{ width: '100%' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <Button variant="success" onClick={markAsDone} style={{ marginTop: '10px' }}
        disabled={!feedbackSubmitted} // Disable if feedback hasn't been submitted
      >
        Mark as Done
      </Button> */}
    </Container>
  );
};
export default AssessorPortfolio;