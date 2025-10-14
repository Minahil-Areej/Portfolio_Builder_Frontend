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


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Badge } from 'react-bootstrap';
import { FaSearchPlus, FaFilePdf, FaArrowLeft, FaImage, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import './ViewPortfolio.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ViewPortfolio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

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
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleModalClose = () => setShowModal(false);

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

    if (!portfolio) return (
        <Container className="mt-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading portfolio...</p>
        </Container>
    );

    return (
        <Container className="py-4" style={{ maxWidth: '1400px' }}>
            {/* Header Section */}
            <div className="mb-4">
                <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate(-1)}
                    className="mb-3"
                >
                    <FaArrowLeft className="me-2" /> Back
                </Button>
                
                <div className="text-center mb-4">
                    <h1 className="display-5 fw-bold text-primary mb-2">{portfolio.title}</h1>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Badge bg="primary" className="px-3 py-2">
                            Unit {portfolio.unit?.number}
                        </Badge>
                        <Badge bg="info" className="px-3 py-2">
                            LO {portfolio.learningOutcome?.number}
                        </Badge>
                        <Badge bg="success" className="px-3 py-2">
                            AC {portfolio.criteria?.number}
                        </Badge>
                        {portfolio.postcode && (
                            <Badge bg="secondary" className="px-3 py-2">
                                <FaMapMarkerAlt className="me-1" /> {portfolio.postcode}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Row className="mb-4">
                {/* Portfolio Details Card */}
                <Col lg={6} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Portfolio Details</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <h6 className="text-muted mb-2">Unit Information</h6>
                                <p className="mb-1">
                                    <strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}
                                </p>
                                <p className="mb-1">
                                    <strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}
                                </p>
                                <p className="mb-1">
                                    <strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}
                                </p>
                            </div>

                            <hr />

                            <div className="mb-3">
                                <h6 className="text-muted mb-2">Task Information</h6>
                                <p className="mb-1">
                                    <strong>Method:</strong> {portfolio.method || 'N/A'}
                                </p>
                                <p className="mb-1">
                                    <strong>Location:</strong> {portfolio.postcode}
                                </p>
                            </div>

                            <hr />

                            <div>
                                <h6 className="text-muted mb-2">Task Details</h6>
                                {portfolio.taskDescription && (
                                    <div className="mb-2">
                                        <strong>Task Description:</strong>
                                        <p className="ms-3 text-secondary">{portfolio.taskDescription}</p>
                                    </div>
                                )}
                                {portfolio.jobType && (
                                    <div className="mb-2">
                                        <strong>Job Type:</strong>
                                        <p className="ms-3 text-secondary">{portfolio.jobType}</p>
                                    </div>
                                )}
                                {portfolio.reasonForTask && (
                                    <div className="mb-2">
                                        <strong>Reason for Task:</strong>
                                        <p className="ms-3 text-secondary">{portfolio.reasonForTask}</p>
                                    </div>
                                )}
                                {portfolio.objectiveOfJob && (
                                    <div className="mb-2">
                                        <strong>Objective of Job:</strong>
                                        <p className="ms-3 text-secondary">{portfolio.objectiveOfJob}</p>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Comments & Feedback Card */}
                <Col lg={6} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Comments & Feedback</h5>
                        </Card.Header>
                        <Card.Body>
                            {portfolio.comments && (
                                <div className="mb-4">
                                    <h6 className="text-muted mb-2">Student Comments</h6>
                                    <div className="p-3 bg-light rounded">
                                        <p className="mb-0">{portfolio.comments}</p>
                                    </div>
                                </div>
                            )}

                            {portfolio.assessorComments ? (
                                <div>
                                    <h6 className="text-muted mb-2">Assessor Feedback</h6>
                                    <div className="p-3 bg-info bg-opacity-10 rounded border border-info">
                                        <p className="mb-0">{portfolio.assessorComments}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted py-4">
                                    <p className="mb-0">No assessor feedback yet</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Images Section */}
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <FaImage className="me-2" />Portfolio Images
                        </h5>
                        <Badge bg="light" text="dark">
                            {portfolio.images.length} {portfolio.images.length === 1 ? 'image' : 'images'}
                        </Badge>
                    </div>
                </Card.Header>
                <Card.Body>
                    {portfolio.images.length > 0 ? (
                        <Row>
                            {portfolio.images.map((image, index) => (
                                <Col md={4} sm={6} key={index} className="mb-4">
                                    <div 
                                        className="position-relative"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleImageClick(`${API_URL}/${image}`)}
                                    >
                                        <img
                                            src={`${API_URL}/${image}`}
                                            alt={`Portfolio ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '250px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid #dee2e6',
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                color: 'white',
                                                padding: '12px',
                                                borderRadius: '50%',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                        >
                                            <FaSearchPlus size={24} />
                                        </div>
                                        <Badge 
                                            bg="dark" 
                                            style={{
                                                position: 'absolute',
                                                bottom: '10px',
                                                left: '10px'
                                            }}
                                        >
                                            Image {index + 1}
                                        </Badge>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center text-muted py-5">
                            <FaImage size={48} className="mb-3 opacity-50" />
                            <p className="mb-0">No images available</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Action Buttons */}
            <div className="text-center">
                <Button 
                    variant="primary" 
                    size="lg"
                    onClick={exportPdf}
                    className="d-inline-flex align-items-center gap-2"
                >
                    <FaFilePdf /> Export as PDF
                </Button>
            </div>

            {/* Image Modal */}
            <Modal show={showModal} onHide={handleModalClose} centered size="xl">
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <img 
                        src={selectedImage} 
                        alt="Enlarged" 
                        style={{ 
                            width: '100%',
                            height: 'auto',
                            maxHeight: '80vh',
                            objectFit: 'contain'
                        }} 
                    />
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