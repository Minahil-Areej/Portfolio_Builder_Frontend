// BEFORE CALUDE

//import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
// import { FaSearchPlus } from 'react-icons/fa';
// import axios from 'axios';
// import './ViewPortfolio.css'; // Custom CSS for styling
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const ViewPortfolio = () => {
//     const { id } = useParams(); // Get portfolio ID from URL params
//     const [portfolio, setPortfolio] = useState(null);
//     const [showModal, setShowModal] = useState(false); // Modal state
//     const [selectedImage, setSelectedImage] = useState(''); // Selected image for the modal

//     useEffect(() => {
//         const fetchPortfolio = async () => {
//             const response = await axios.get(`${API_URL}/api/portfolios/${id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             setPortfolio(response.data);
//         };
//         fetchPortfolio();
//     }, [id]);

//     const handleImageClick = (image) => {
//         console.log(portfolio.images);
//         setSelectedImage(image); // Set the image to display in modal
//         setShowModal(true); // Show the modal
//     };

//     const handleModalClose = () => setShowModal(false); // Close modal handler

//     const exportPdf = async () => {
//         try {
//             const response = await fetch(`${API_URL}/api/portfolios/${id}/export-pdf`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Error exporting PDF');
//             }

//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `${portfolio.title}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.parentNode.removeChild(link);
//         } catch (error) {
//             console.error('Error exporting PDF:', error);
//         }
//     };

//     const moveToToBeReviewed = async () => {
//         try {
//             await axios.post(
//                 `${API_URL}/api/portfolios/${id}/feedback`,
//                 { status: 'To Be Reviewed' },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 }
//             );
//             setPortfolio((prev) => ({
//                 ...prev,
//                 status: 'To Be Reviewed',
//             }));
//             alert('Portfolio moved to "To Be Reviewed"');
//         } catch (error) {
//             console.error('Error moving portfolio to "To Be Reviewed":', error);
//         }
//     };

//     if (!portfolio) return <p>Loading...</p>;


//     return (
//         <Container className="mt-4 view-portfolio-container">
//             <Row className="mb-4">
//                 <Col>
//                     <h1 className="text-center portfolio-title">{portfolio.title}</h1>
//                 </Col>
//             </Row>

//             <Row className="mb-4">
//                 <Col md={6}>
//                     <Card className="portfolio-card mb-3">
//                         <Card.Body>
//                             <Card.Title className="portfolio-section-title">Portfolio Details</Card.Title>
//                             <Card.Text className="portfolio-text">
//                                 <strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}
//                             </Card.Text>
//                             <Card.Text className="portfolio-text">
//                                 <strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}
//                             </Card.Text>
//                             <Card.Text className="portfolio-text">
//                                 <strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}
//                             </Card.Text>
//                             <Card.Text className="portfolio-text">
//                                 <strong>Method:</strong> {portfolio.method || 'N/A'}
//                             </Card.Text>
//                             <Card.Text className="portfolio-text">
//                                 <strong>Location:</strong> {portfolio.postcode}
//                             </Card.Text>
//                             <Card.Text className="portfolio-text">
//                                 <strong>Task Description:</strong> {portfolio.taskDescription || 'N/A'}
//                             </Card.Text>
//                             <Card.Text className="portfolio-text">
//                                 <strong>Job Type:</strong> {portfolio.jobType || 'N/A'}
//                             </Card.Text>
//                             <Card.Text className="portfolio-text">
//                                 <strong>Reason for Task:</strong> {portfolio.reasonForTask || 'N/A'}
//                             </Card.Text>
//                             <Card.Text className="portfolio-text">
//                                 <strong>Objective of Job:</strong> {portfolio.objectiveOfJob || 'N/A'}
//                             </Card.Text>

//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card className="portfolio-card mb-3">
//                         <Card.Body>
//                             <Card.Title className="portfolio-section-title">Comments & Feedback</Card.Title>
//                             <h5 className="portfolio-subtitle">Comments</h5>
//                             <Card.Text className="portfolio-text">{portfolio.comments}</Card.Text>
//                             {portfolio.assessorComments && (
//                                 <>
//                                     <h5 className="portfolio-subtitle">Assessor Feedback</h5>
//                                     <Card.Text className="portfolio-text">{portfolio.assessorComments}</Card.Text>
//                                 </>
//                             )}
//                             {/* {portfolio.status === 'Reviewed' && (
//                                 <div className="mt-3">
//                                     <p>If you want to make changes, please move the portfolio to "To Be Reviewed" section first:</p>
//                                     <Button variant="info" onClick={moveToToBeReviewed}>
//                                         Move to "To Be Reviewed"
//                                     </Button>
//                                 </div>
//                             )} */}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             <Row className="mb-4">
//                 <Col>
//                     <h2 className="portfolio-section-title">Images</h2>
//                     {/* <div className="d-flex flex-wrap">
//                         {portfolio.images.map((image, index) => (
//                             <div key={index} className="portfolio-image-container">
//                                 <img
//                                     src={`http://localhost:5000/uploads/${image}`}
//                                     alt="Portfolio"
//                                     className="portfolio-image"
//                                     onClick={() => handleImageClick(`http://localhost:5000/uploads/${image}`)}
//                                 />
//                                 <FaSearchPlus
//                                     className="portfolio-image-icon"
//                                     onClick={() => handleImageClick(`http://localhost:5000/uploads/${image}`)}
//                                     size={20}
//                                 />
//                             </div>
//                         ))}
//                     </div> */}
//                     <div className="d-flex flex-wrap">
//                         {portfolio.images.map((image, index) => {


//                             return (
//                                 <div key={index} className="portfolio-image-container">
//                                     <img
//                                         key={index}
//                                         src={`${API_URL}/${image}`} // Use relative path saved in the database
//                                         alt="Portfolio"
//                                         className="portfolio-image"
//                                         onClick={() => handleImageClick(`${API_URL}/${image}`)}
//                                     />
//                                     <FaSearchPlus
//                                         className="portfolio-image-icon"
//                                         onClick={() => handleImageClick(`${API_URL}/${image}`)}
//                                         size={20}
//                                     />
//                                 </div>
//                             );
//                         })}
//                     </div>


//                 </Col>
//             </Row>

//             <Row>
//                 <Col className="text-center">
//                     <Button variant="primary" onClick={exportPdf} className="mt-3">
//                         Export as PDF
//                     </Button>
//                 </Col>
//             </Row>

//             {/* Modal to display the enlarged image */}
//             <Modal show={showModal} onHide={handleModalClose} centered size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Enlarged Image</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <img src={selectedImage} alt="Enlarged" style={{ width: '100%' }} />
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleModalClose}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// };

// export default ViewPortfolio;


//Claude best UI
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
// import { FaSearchPlus } from 'react-icons/fa';
// import axios from 'axios';
// import './ViewPortfolio.css'; // Custom CSS for styling
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const ViewPortfolio = () => {
//     const { id } = useParams(); // Get portfolio ID from URL params
//     const [portfolio, setPortfolio] = useState(null);
//     const [showModal, setShowModal] = useState(false); // Modal state
//     const [selectedImage, setSelectedImage] = useState(''); // Selected image for the modal

//     useEffect(() => {
//         const fetchPortfolio = async () => {
//             const response = await axios.get(`${API_URL}/api/portfolios/${id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             setPortfolio(response.data);
//         };
//         fetchPortfolio();
//     }, [id]);

//     const handleImageClick = (image) => {
//         console.log(portfolio.images);
//         setSelectedImage(image); // Set the image to display in modal
//         setShowModal(true); // Show the modal
//     };

//     const handleModalClose = () => setShowModal(false); // Close modal handler

//     const exportPdf = async () => {
//         try {
//             const response = await fetch(`${API_URL}/api/portfolios/${id}/export-pdf`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Error exporting PDF');
//             }

//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `${portfolio.title}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.parentNode.removeChild(link);
//         } catch (error) {
//             console.error('Error exporting PDF:', error);
//         }
//     };

//     const moveToToBeReviewed = async () => {
//         try {
//             await axios.post(
//                 `${API_URL}/api/portfolios/${id}/feedback`,
//                 { status: 'To Be Reviewed' },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 }
//             );
//             setPortfolio((prev) => ({
//                 ...prev,
//                 status: 'To Be Reviewed',
//             }));
//             alert('Portfolio moved to "To Be Reviewed"');
//         } catch (error) {
//             console.error('Error moving portfolio to "To Be Reviewed":', error);
//         }
//     };

//     if (!portfolio) return <p>Loading...</p>;


//     return (
//         <Container className="mt-4 view-portfolio-container">
//             {/* UPDATED: More compact title with better styling */}
//             <Row className="mb-3">
//                 <Col>
//                     <h2 className="portfolio-title">{portfolio.title}</h2>
//                 </Col>
//             </Row>

//             <Row className="mb-3">
//                 {/* UPDATED: Portfolio Details Card with cleaner layout */}
//                 <Col md={6}>
//                     <Card className="portfolio-card shadow-sm">
//                         <Card.Body>
//                             <h5 className="portfolio-section-title mb-3">Portfolio Details</h5>

//                             <div className="portfolio-detail-item">
//                                 <span className="detail-label">Unit:</span>
//                                 <span className="detail-value">{portfolio.unit?.number} - {portfolio.unit?.title}</span>
//                             </div>

//                             <div className="portfolio-detail-item">
//                                 <span className="detail-label">Learning Outcome:</span>
//                                 <span className="detail-value">{portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}</span>
//                             </div>

//                             <div className="portfolio-detail-item">
//                                 <span className="detail-label">Criteria:</span>
//                                 <span className="detail-value">{portfolio.criteria?.number} - {portfolio.criteria?.description}</span>
//                             </div>

//                             <div className="portfolio-detail-item">
//                                 <span className="detail-label">Method:</span>
//                                 <span className="detail-value">{portfolio.method || 'N/A'}</span>
//                             </div>

//                             <div className="portfolio-detail-item">
//                                 <span className="detail-label">Location:</span>
//                                 <span className="detail-value">{portfolio.postcode}</span>
//                             </div>

//                             <div className="portfolio-detail-item">
//                                 <span className="detail-label">Task Description:</span>
//                                 <span className="detail-value">{portfolio.taskDescription || 'N/A'}</span>
//                             </div>

//                             <div className="portfolio-detail-item">
//                                 <span className="detail-label">Job Type:</span>
//                                 <span className="detail-value">{portfolio.jobType || 'N/A'}</span>
//                             </div>

//                             <div className="portfolio-detail-item">
//                                 <span className="detail-label">Reason for Task:</span>
//                                 <span className="detail-value">{portfolio.reasonForTask || 'N/A'}</span>
//                             </div>

//                             <div className="portfolio-detail-item">
//                                 <span className="detail-label">Objective of Job:</span>
//                                 <span className="detail-value">{portfolio.objectiveOfJob || 'N/A'}</span>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 {/* UPDATED: Comments & Feedback Card with cleaner layout */}
//                 <Col md={6}>
//                     <Card className="portfolio-card shadow-sm">
//                         <Card.Body>
//                             <h5 className="portfolio-section-title mb-3">Comments & Feedback</h5>

//                             <div className="feedback-section">
//                                 <h6 className="feedback-subtitle">Comments</h6>
//                                 <p className="feedback-text">{portfolio.comments}</p>
//                             </div>

//                             {portfolio.assessorComments && (
//                                 <div className="feedback-section mt-3">
//                                     <h6 className="feedback-subtitle">Assessor Feedback</h6>
//                                     <p className="feedback-text">{portfolio.assessorComments}</p>
//                                 </div>
//                             )}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* UPDATED: Images section with better layout */}
//             <Row className="mb-3">
//                 <Col>
//                     <Card className="portfolio-card shadow-sm">
//                         <Card.Body>
//                             <h5 className="portfolio-section-title mb-3">Images</h5>
//                             <div className="images-grid">
//                                 {portfolio.images.map((image, index) => {
//                                     return (
//                                         <div key={index} className="portfolio-image-wrapper">
//                                             <img
//                                                 key={index}
//                                                 src={`${API_URL}/${image}`}
//                                                 alt="Portfolio"
//                                                 className="portfolio-image"
//                                                 onClick={() => handleImageClick(`${API_URL}/${image}`)}
//                                             />
//                                             <div className="image-overlay" onClick={() => handleImageClick(`${API_URL}/${image}`)}>
//                                                 <FaSearchPlus className="zoom-icon" size={24} />
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* UPDATED: Export button with better styling */}
//             <Row>
//                 <Col className="d-flex justify-content-end">
//                     <Button variant="primary" onClick={exportPdf} className="export-btn">
//                         Export as PDF
//                     </Button>
//                 </Col>
//             </Row>

//             {/* Modal to display the enlarged image */}
//             <Modal show={showModal} onHide={handleModalClose} centered size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Enlarged Image</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <img src={selectedImage} alt="Enlarged" style={{ width: '100%' }} />
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleModalClose}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// };

// export default ViewPortfolio;

//CLAYUDE SECOND VERSION and one before image thingy
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
// import { FaSearchPlus } from 'react-icons/fa';
// import axios from 'axios';
// import './ViewPortfolio.css'; // Custom CSS for styling
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const ViewPortfolio = () => {
//     const { id } = useParams(); // Get portfolio ID from URL params
//     const [portfolio, setPortfolio] = useState(null);
//     const [showModal, setShowModal] = useState(false); // Modal state
//     const [selectedImage, setSelectedImage] = useState(''); // Selected image for the modal

//     useEffect(() => {
//         const fetchPortfolio = async () => {
//             const response = await axios.get(`${API_URL}/api/portfolios/${id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             setPortfolio(response.data);
//         };
//         fetchPortfolio();
//     }, [id]);

//     const handleImageClick = (image) => {
//         console.log(portfolio.images);
//         setSelectedImage(image); // Set the image to display in modal
//         setShowModal(true); // Show the modal
//     };

//     const handleModalClose = () => setShowModal(false); // Close modal handler

//     const exportPdf = async () => {
//         try {
//             const response = await fetch(`${API_URL}/api/portfolios/${id}/export-pdf`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Error exporting PDF');
//             }

//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `${portfolio.title}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.parentNode.removeChild(link);
//         } catch (error) {
//             console.error('Error exporting PDF:', error);
//         }
//     };

//     const moveToToBeReviewed = async () => {
//         try {
//             await axios.post(
//                 `${API_URL}/api/portfolios/${id}/feedback`,
//                 { status: 'To Be Reviewed' },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 }
//             );
//             setPortfolio((prev) => ({
//                 ...prev,
//                 status: 'To Be Reviewed',
//             }));
//             alert('Portfolio moved to "To Be Reviewed"');
//         } catch (error) {
//             console.error('Error moving portfolio to "To Be Reviewed":', error);
//         }
//     };

//     if (!portfolio) return <p>Loading...</p>;


//     return (
//         <Container className="mt-4 view-portfolio-container">
//             {/* UPDATED: Title matching Edit Portfolio style */}
//             <Row className="mb-3">
//                 <Col>
//                     <h3 className="portfolio-main-title">{portfolio.title}</h3>
//                 </Col>
//             </Row>

//             {/* UPDATED: Portfolio Details section with blue header like Edit page */}
//             <Row className="mb-3">
//                 <Col>
//                     <div className="portfolio-section">
//                         <div className="section-header">
//                             <h5 className="section-header-title">Portfolio Details</h5>
//                         </div>
//                         <div className="section-content">
//                             <Row>
//                                 <Col md={6}>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Unit:</span>
//                                         <span className="detail-value">{portfolio.unit?.number} - {portfolio.unit?.title}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Learning Outcome:</span>
//                                         <span className="detail-value">{portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Criteria:</span>
//                                         <span className="detail-value">{portfolio.criteria?.number} - {portfolio.criteria?.description}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Method:</span>
//                                         <span className="detail-value">{portfolio.method || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Location:</span>
//                                         <span className="detail-value">{portfolio.postcode}</span>
//                                     </div>
//                                 </Col>
//                                 <Col md={6}>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Task Description:</span>
//                                         <span className="detail-value">{portfolio.taskDescription || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Job Type:</span>
//                                         <span className="detail-value">{portfolio.jobType || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Reason for Task:</span>
//                                         <span className="detail-value">{portfolio.reasonForTask || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Objective of Job:</span>
//                                         <span className="detail-value">{portfolio.objectiveOfJob || 'N/A'}</span>
//                                     </div>
//                                 </Col>
//                             </Row>
//                         </div>
//                     </div>
//                 </Col>
//             </Row>

//             {/* UPDATED: Combined Comments & Feedback section */}
//             <Row className="mb-3">
//                 <Col>
//                     <div className="portfolio-section">
//                         <div className="section-header">
//                             <h5 className="section-header-title">Comments & Feedback</h5>
//                         </div>
//                         <div className="section-content">
//                             <div className="comment-box">
//                                 <h6 className="comment-label">Comments</h6>
//                                 <p className="comment-text">{portfolio.comments}</p>
//                             </div>
//                             {portfolio.assessorComments && (
//                                 <div className="comment-box mt-3">
//                                     <h6 className="comment-label">Assessor Feedback</h6>
//                                     <p className="comment-text assessor-feedback">{portfolio.assessorComments}</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </Col>
//             </Row>

//             {/* UPDATED: Images section with blue header */}
//             <Row className="mb-3">
//                 <Col>
//                     <div className="portfolio-section">
//                         <div className="section-header">
//                             <h5 className="section-header-title">Images</h5>
//                         </div>
//                         <div className="section-content">
//                             <div className="images-grid">
//                                 {portfolio.images.map((image, index) => {
//                                     return (
//                                         <div key={index} className="portfolio-image-wrapper">
//                                             <img
//                                                 src={`${API_URL}/${image}`}
//                                                 alt="Portfolio"
//                                                 className="portfolio-image"
//                                                 onClick={() => handleImageClick(`${API_URL}/${image}`)}
//                                             />
//                                             <div className="image-overlay" onClick={() => handleImageClick(`${API_URL}/${image}`)}>
//                                                 <FaSearchPlus className="zoom-icon" size={24} />
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </div>
//                 </Col>
//             </Row>

//             {/* UPDATED: Export button */}
//             <Row>
//                 <Col className="d-flex justify-content-end">
//                     <Button variant="primary" onClick={exportPdf} className="export-btn">
//                         Export as PDF
//                     </Button>
//                 </Col>
//             </Row>

//             {/* Modal to display the enlarged image */}
//             <Modal show={showModal} onHide={handleModalClose} centered size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Enlarged Image</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <img src={selectedImage} alt="Enlarged" style={{ width: '100%' }} />
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleModalClose}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// };

// export default ViewPortfolio;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { FaSearchPlus } from 'react-icons/fa';
import axios from 'axios';
import './ViewPortfolio.css'; // Custom CSS for styling
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ViewPortfolio = () => {
    const { id } = useParams(); // Get portfolio ID from URL params
    const [portfolio, setPortfolio] = useState(null);
    const [showModal, setShowModal] = useState(false); // Modal state
    const [selectedImage, setSelectedImage] = useState(''); // Selected image for the modal

    useEffect(() => {
        const fetchPortfolio = async () => {
            const response = await axios.get(`${API_URL}/api/portfolios/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setPortfolio(response.data);
        };
        fetchPortfolio();
    }, [id]);

    const handleImageClick = (image) => {
        console.log(portfolio.images);
        setSelectedImage(image); // Set the image to display in modal
        setShowModal(true); // Show the modal
    };

    const handleModalClose = () => setShowModal(false); // Close modal handler

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

    const moveToToBeReviewed = async () => {
        try {
            await axios.post(
                `${API_URL}/api/portfolios/${id}/feedback`,
                { status: 'To Be Reviewed' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setPortfolio((prev) => ({
                ...prev,
                status: 'To Be Reviewed',
            }));
            alert('Portfolio moved to "To Be Reviewed"');
        } catch (error) {
            console.error('Error moving portfolio to "To Be Reviewed":', error);
        }
    };

    if (!portfolio) return <p>Loading...</p>;


    return (
        <Container className="mt-4 view-portfolio-container">
            {/* UPDATED: Title matching Edit Portfolio style */}
            <Row className="mb-3">
                <Col>
                    <h3 className="portfolio-main-title">{portfolio.title}</h3>
                </Col>
            </Row>

            {/* UPDATED: Portfolio Details section with blue header like Edit page */}
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
                                        <span className="detail-label">Method:</span>
                                        <span className="detail-value">{portfolio.method || 'N/A'}</span>
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

            {/* UPDATED: Combined Comments & Feedback section */}
            <Row className="mb-3">
                <Col>
                    <div className="portfolio-section">
                        <div className="section-header">
                            <h5 className="section-header-title">Comments & Feedback</h5>
                        </div>
                        <div className="section-content">
                            <div className="comment-box">
                                <h6 className="comment-label">Comments</h6>
                                <p className="comment-text">{portfolio.comments}</p>
                            </div>
                            {portfolio.assessorComments && (
                                <div className="comment-box mt-3">
                                    <h6 className="comment-label">Assessor Feedback</h6>
                                    <p className="comment-text assessor-feedback">{portfolio.assessorComments}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* UPDATED: Images section with blue header */}
            <Row className="mb-3">
                <Col>
                    <div className="portfolio-section">
                        <div className="section-header">
                            <h5 className="section-header-title">Images</h5>
                        </div>
                        <div className="section-content">
                            <div className="images-grid">
                                {portfolio.images.map((image, index) => {
                                    const imgUrl = image.url || image; // ✅ supports old + new format
                                    const caption = image.caption || ''; // ✅ optional caption text

                                    return (
                                        <div key={index} className="portfolio-image-wrapper">
                                            <img
                                                src={`${API_URL}/${imgUrl}`}
                                                alt="Portfolio"
                                                className="portfolio-image"
                                                onClick={() => handleImageClick(`${API_URL}/${imgUrl}`)}
                                            />
                                            <div
                                                className="image-overlay"
                                                onClick={() => handleImageClick(`${API_URL}/${imgUrl}`)}
                                            >
                                                <FaSearchPlus className="zoom-icon" size={24} />
                                            </div>

                                            {/* 🟨 NEW: Optional caption display */}
                                            {caption && (
                                                <p className="text-muted text-center mt-2 small">
                                                    {caption}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}

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

            {/* Modal to display the enlarged image */}
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

export default ViewPortfolio;