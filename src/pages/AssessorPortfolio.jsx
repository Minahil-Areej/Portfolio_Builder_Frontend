// AssessorPortfolio.jsx before Claude UI
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
// import { FaSearchPlus } from 'react-icons/fa';
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// import './ViewPortfolio.css'; // Custom CSS for styling

// const AssessorPortfolio = () => {
//   const { id } = useParams();  // Get portfolio ID from URL
//   const [portfolio, setPortfolio] = useState(null); 
//   const [showModal, setShowModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState('');
//   const [feedback, setFeedback] = useState('');  // For assessor feedback
//   const [status, setStatus] = useState('');  // Track portfolio status

//   useEffect(() => {
//     const fetchPortfolio = async () => {
//       try {
//         const { data } = await axios.get(`${API_URL}/api/portfolios/assessor/${id}`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         setPortfolio(data);
//         setFeedback(data.assessorComments || '');  // Set initial feedback if exists
//         setStatus(data.status);  // Set current status
//       } catch (error) {
//         console.error('Error fetching portfolio', error);
//       }
//     };

//     fetchPortfolio();
//   }, [id]);

//   // const handleFeedbackSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     await axios.post(
//   //       `http://localhost:5000/api/portfolios/${id}/feedback`,
//   //       { assessorComments: feedback, status: 'Reviewed' },
//   //       {
//   //         headers: {
//   //           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//   //         },
//   //       }
//   //     );
//   //     alert('Feedback submitted successfully');
//   //     //setOriginalFeedback(feedback); // Update original feedback with the latest submitted feedback
//   //     setStatus('Reviewed'); // Update status locally
//   //     //setFeedbackSubmitted(true);
//   //   } catch (error) {
//   //     console.error('Error submitting feedback', error);
//   //   }
//   // };

//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//     setShowModal(true);
//   };

//   const handleModalClose = () => setShowModal(false);

//   const handleFeedbackSubmit = async (statusToUpdate) => {
//     try {
//       await axios.post(
//         `${API_URL}/api/portfolios/${id}/feedback`,
//         { assessorComments: feedback, status: statusToUpdate },
//         {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       alert(statusToUpdate === 'Reviewed' ? 'Feedback submitted successfully' : 'Feedback saved successfully');
//       setStatus(statusToUpdate); // Update status locally
//     } catch (error) {
//       console.error(`Error ${statusToUpdate === 'Reviewed' ? 'submitting' : 'saving'} feedback`, error);
//     }
//   };

//   // const markAsDone = async () => {

//   //   try {
//   //     await axios.post(
//   //       `http://localhost:5000/api/portfolios/${id}/feedback`, {
//   //       status: 'Done',
//   //     }, {
//   //       headers: {
//   //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//   //       },
//   //     });
//   //     alert('Portfolio marked as done');
//   //     setStatus('Done'); // Update status locally
//   //   } catch (error) {
//   //     console.error('Error marking portfolio as done', error);
//   //   }
//   // };

//   const markAsUndone = async () => {
//     try {
//       await axios.post(
//         `${API_URL}/api/portfolios/${id}/feedback`,
//         { status: 'Reviewed' },
//         {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       alert('Portfolio marked as undone');
//       setPortfolio({ ...portfolio, status: 'Reviewed' }); // Update the status locally
//     } catch (error) {
//       console.error('Error marking portfolio as undone', error);
//     }
//   };

//   const exportPdf = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/portfolios/${id}/export-pdf`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Error exporting PDF');
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${portfolio.title}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//     } catch (error) {
//       console.error('Error exporting PDF:', error);
//     }
//   };

//   if (!portfolio) return <p>Loading...</p>;

//   return (
//     <Container className="mt-4 view-portfolio-container">
//       <Row className="mb-4">
//         <Col>
//           <h1 className="text-center portfolio-title">{portfolio.title}</h1>
//         </Col>
//       </Row>
//       <Row className="mb-4">
//         <Col md={6}>
//           <Card className="portfolio-card mb-3">
//             <Card.Body>
//               <Card.Title className="portfolio-section-title">Portfolio Details</Card.Title>
//               <Card.Text className="portfolio-text">
//                 <strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}
//               </Card.Text>
//               <Card.Text className="portfolio-text">
//                 <strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}
//               </Card.Text>
//               <Card.Text className="portfolio-text">
//                 <strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}
//               </Card.Text>
//               <Card.Text className="portfolio-text">
//                 <strong>Location:</strong> {portfolio.postcode}
//               </Card.Text>
//               <Card.Text className="portfolio-text">
//                 <strong>Task Description:</strong> {portfolio.taskDescription || 'N/A'}
//               </Card.Text>
//               <Card.Text className="portfolio-text">
//                 <strong>Job Type:</strong> {portfolio.jobType || 'N/A'}
//               </Card.Text>
//               <Card.Text className="portfolio-text">
//                 <strong>Reason for Task:</strong> {portfolio.reasonForTask || 'N/A'}
//               </Card.Text>
//               <Card.Text className="portfolio-text">
//                 <strong>Objective of Job:</strong> {portfolio.objectiveOfJob || 'N/A'}
//               </Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={6}>
//           <Card className="portfolio-card mb-3">
//             <Card.Body>
//               <Card.Title className="portfolio-section-title">Comments & Feedback</Card.Title>
//               <h5 className="portfolio-subtitle">Comments</h5>
//               <Card.Text className="portfolio-text">{portfolio.comments}</Card.Text>
//               <h5 className="portfolio-subtitle">Assessor Feedback</h5>
//               <Form onSubmit={handleFeedbackSubmit}>
//                 <Form.Group controlId="feedback">
//                   <Form.Label>Assessor Feedback</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     value={feedback}
//                     onChange={(e) => {
//                       setFeedback(e.target.value);
//                       // Check if feedback is different from original feedback
//                       //setFeedbackSubmitted(e.target.value === originalFeedback);
//                     }}
//                     readOnly={portfolio.status === 'Done'}
//                   />
//                 </Form.Group>
//                 {portfolio.status === 'Done' ? (
//                   <Button variant="warning" onClick={markAsUndone}>
//                     Mark as Undone
//                   </Button>
//                 ) : (
//                   <>
//                     <Button
//                       variant="primary"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handleFeedbackSubmit('Reviewed');
//                       }}
//                       className="mt-2 me-2"
//                     >
//                       Submit Feedback
//                     </Button>
//                     <Button
//                       variant="info"
//                       className="mt-2"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handleFeedbackSubmit('To Be Reviewed');
//                       }}
//                     >
//                       Save Feedback
//                     </Button>
//                   </>
//                 )}
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col>
//           <h2 className="portfolio-section-title">Images</h2>
//           <div className="d-flex flex-wrap">
//             {portfolio.images.map((image, index) => (
//               <div key={index} className="portfolio-image-container">
//                 <img
//                   src={`${API_URL}/${image}`}
//                   alt="Portfolio"
//                   className="portfolio-image"
//                   onClick={() => handleImageClick(`${API_URL}/${image}`)}
//                 />
//                 <FaSearchPlus
//                   className="portfolio-image-icon"
//                   onClick={() => handleImageClick(`${API_URL}/${image}`)}
//                   size={20}
//                 />
//               </div>
//             ))}
//           </div>
//         </Col>
//       </Row>

//       <Row>
//         <Col className="text-center">
//           <Button variant="primary" onClick={exportPdf} className="mt-3">
//             Export as PDF
//           </Button>
//         </Col>
//       </Row>

//       <Modal show={showModal} onHide={handleModalClose} centered size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Enlarged Image</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <img src={selectedImage} alt="Enlarged" style={{ width: '100%' }} />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleModalClose}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       {/* <Button variant="success" onClick={markAsDone} style={{ marginTop: '10px' }}
//         disabled={!feedbackSubmitted} // Disable if feedback hasn't been submitted
//       >
//         Mark as Done
//       </Button> */}
//     </Container>
//   );
// };
// export default AssessorPortfolio;


// AssessorPortfolio.jsx - UPDATED UI ONLY
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { FaSearchPlus } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import './AssessorPortfolio.css'; // CHANGED: Separate CSS file

const AssessorPortfolio = () => {
  const { id } = useParams();  // Get portfolio ID from URL
  const [portfolio, setPortfolio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
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

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

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

  const exportPdf = async () => {
    try {
      const response = await fetch(`${API_URL}/api/portfolios/${id}/export-pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error exporting PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${portfolio.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  if (!portfolio) return <p>Loading...</p>;

  return (
    <Container className="mt-4 assessor-portfolio-container">
      {/* UPDATED: Title with better styling */}
      <Row className="mb-3">
        <Col>
          <h2 className="portfolio-main-title">{portfolio.title}</h2>
        </Col>
      </Row>

      {/* UPDATED: Portfolio Details section with blue header */}
      <Row className="mb-3">
        <Col>
          <div className="portfolio-section">
            <div className="section-header">
              <h5 className="section-header-title">Portfolio Details</h5>
            </div>
            <div className="section-content">
              <Row>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">Unit:</span>
                    <span className="detail-value">{portfolio.unit?.number} - {portfolio.unit?.title}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Learning Outcome:</span>
                    <span className="detail-value">{portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Criteria:</span>
                    <span className="detail-value">{portfolio.criteria?.number} - {portfolio.criteria?.description}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{portfolio.postcode}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">Task Description:</span>
                    <span className="detail-value">{portfolio.taskDescription || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Job Type:</span>
                    <span className="detail-value">{portfolio.jobType || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Reason for Task:</span>
                    <span className="detail-value">{portfolio.reasonForTask || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Objective of Job:</span>
                    <span className="detail-value">{portfolio.objectiveOfJob || 'N/A'}</span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* UPDATED: Comments & Feedback section with blue header */}
      <Row className="mb-3">
        <Col>
          <div className="portfolio-section">
            <div className="section-header">
              <h5 className="section-header-title">Comments & Assessor Feedback</h5>
            </div>
            <div className="section-content">
              <div className="comment-box">
                <h6 className="comment-label">Student Comments</h6>
                <p className="comment-text">{portfolio.comments}</p>
              </div>

              <div className="comment-box mt-3">
                <h6 className="comment-label">Assessor Feedback</h6>
                <Form onSubmit={(e) => e.preventDefault()}>
                  <Form.Group controlId="feedback">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      readOnly={portfolio.status === 'Done'}
                      placeholder="Enter your feedback here..."
                      className="feedback-textarea"
                    />
                  </Form.Group>
                  
                  <div className="feedback-buttons mt-3">
                    {portfolio.status === 'Done' ? (
                      <Button variant="warning" onClick={markAsUndone}>
                        Mark as Undone
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          onClick={() => handleFeedbackSubmit('Reviewed')}
                          className="me-2"
                        >
                          Submit Feedback
                        </Button>
                        <Button
                          variant="info"
                          onClick={() => handleFeedbackSubmit('To Be Reviewed')}
                        >
                          Save Feedback
                        </Button>
                      </>
                    )}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* UPDATED: Images section with blue header */}
      <Row className="mb-3">
        <Col>
          <div className="portfolio-section">
            <div className="section-header">
              <h5 className="section-header-title">Portfolio Images</h5>
            </div>
            <div className="section-content">
              <div className="images-grid">
                {portfolio.images.map((image, index) => (
                  <div key={index} className="portfolio-image-wrapper">
                    <img
                      src={`${API_URL}/${image}`}
                      alt="Portfolio"
                      className="portfolio-image"
                      onClick={() => handleImageClick(`${API_URL}/${image}`)}
                    />
                    <div className="image-overlay" onClick={() => handleImageClick(`${API_URL}/${image}`)}>
                      <FaSearchPlus className="zoom-icon" size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* UPDATED: Export button */}
      <Row>
        <Col className="d-flex justify-content-end">
          <Button variant="primary" onClick={exportPdf} className="export-btn">
            Export as PDF
          </Button>
        </Col>
      </Row>

      {/* Modal - unchanged */}
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
    </Container>
  );
};

export default AssessorPortfolio;