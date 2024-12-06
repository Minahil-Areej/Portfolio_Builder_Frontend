// AssessorPortfolio.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portfolios`;

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
      <h1>Review Portfolio: {portfolio.title}</h1>
      <p>
        <strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}
      </p>
      <p>
        <strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}
      </p>
      <p>
        <strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}
      </p>
      <p><strong>Statement:</strong> {portfolio.statement}</p>
      <p><strong>Postcode:</strong> {portfolio.postcode}</p>

      <h2>Images</h2>
      {portfolio.images.map((image, index) => (
        <img key={index} src={`${API_URL}/${image}`} alt="Portfolio" style={{ width: '200px', margin: '10px' }} />
      ))}

      <h2>Student Comments</h2>
      <p>{portfolio.comments}</p>

      
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
              className="me-2"
            >
              Submit Feedback
            </Button>
            <Button 
              variant="info" 
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

      {/* <Button variant="success" onClick={markAsDone} style={{ marginTop: '10px' }}
        disabled={!feedbackSubmitted} // Disable if feedback hasn't been submitted
      >
        Mark as Done
      </Button> */}
    </Container>
  );
};

export default AssessorPortfolio;
