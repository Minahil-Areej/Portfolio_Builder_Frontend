// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
// import './Dashboard.css';

// const Dashboard = () => {
//   const [portfolios, setPortfolios] = useState({
//     toBeReviewed: [],
//     reviewed: [],
//     done: [],
//     draft: []
//   });
//   const [error, setError] = useState('');
//   const [selectedUnit, setSelectedUnit] = useState(''); // For unit filter
//   const [selectedDate, setSelectedDate] = useState(''); // For date filter

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPortfolios = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/portfolios/user-portfolios', {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch portfolios');
//         }

//         const data = await response.json();

//         // Categorize portfolios based on status
//         const categorizedPortfolios = {
//           toBeReviewed: data.filter(p => p.status === 'To Be Reviewed'),
//           reviewed: data.filter(p => p.status === 'Reviewed'),
//           done: data.filter(p => p.status === 'Done'),
//           draft: data.filter(p => p.status === 'Draft')
//         };

//         setPortfolios(categorizedPortfolios);
//       } catch (err) {
//         setError('Error fetching portfolios');
//       }
//     };

//     fetchPortfolios();
//   }, []);

//   // Filtering logic
//   const filterPortfolios = (portfoliosList) => {
//     return portfoliosList.filter((portfolio) => {
//       const matchesUnit = selectedUnit === '' || portfolio.unit?.number === selectedUnit;
//       const matchesDate = selectedDate === '' || portfolio.date === selectedDate;
//       return matchesUnit && matchesDate;
//     });
//   };

//   const filteredToBeReviewed = filterPortfolios(portfolios.toBeReviewed);
//   const filteredReviewed = filterPortfolios(portfolios.reviewed);
//   const filteredDone = filterPortfolios(portfolios.done);
//   const filteredDrafts = filterPortfolios(portfolios.draft);

//   const handleMoveToToBeReviewed = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/portfolios/${id}/feedback`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: 'To Be Reviewed' }),
//       });

//       // Update the state to move the portfolio back to "To Be Reviewed"
//       setPortfolios((prev) => {
//         const updated = { ...prev };
//         const movedPortfolio = updated.draft.find((p) => p._id === id);

//         if (movedPortfolio) {
//           // Remove the portfolio from the Drafts section
//           updated.draft = updated.draft.filter((p) => p._id !== id);

//           // Ensure the portfolio is not already in the "To Be Reviewed" section
//           const isAlreadyInToBeReviewed = updated.toBeReviewed.some((p) => p._id === id);
//           if (!isAlreadyInToBeReviewed) {
//             updated.toBeReviewed = [...updated.toBeReviewed, { ...movedPortfolio, status: 'To Be Reviewed' }];
//           }
//         }
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error moving portfolio to "To Be Reviewed":', error);
//     }
//   };

//   const handleMoveToDraft = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/portfolios/${id}/feedback`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: 'Draft' }),
//       });

//       setPortfolios((prev) => {
//         const updated = { ...prev };
//         const movedPortfolio = updated.toBeReviewed.find((p) => p._id === id);
//         if (movedPortfolio) {
//           updated.toBeReviewed = updated.toBeReviewed.filter((p) => p._id !== id);
//           updated.draft = [...updated.draft, { ...movedPortfolio, status: 'Draft' }]; // Force state change
//         }
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error moving portfolio to "Draft":', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this portfolio?')) {
//       try {
//         const response = await fetch(`http://localhost:5000/api/portfolios/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });

//         if (response.ok) {
//           setPortfolios((prev) => ({
//             ...prev,
//             toBeReviewed: prev.toBeReviewed.filter((p) => p._id !== id),
//             reviewed: prev.reviewed.filter((p) => p._id !== id),
//             done: prev.done.filter((p) => p._id !== id),
//             draft: prev.draft.filter((p) => p._id !== id), // Ensure it's removed from drafts too

//           }));
//         } else {
//           alert('Error deleting portfolio');
//         }
//       } catch (err) {
//         alert('Error deleting portfolio');
//       }
//     }
//   };

//   const handleEdit = (id) => {
//     navigate(`/portfolio/edit/${id}`);
//   };

//   const handleView = (id) => {
//     navigate(`/portfolio/view/${id}`);
//   };

//   const handleCreatePortfolio = () => {
//     navigate('/portfolio');
//   };

//   return (
//     <Container className="mt-5 dashboard-container">
//       <Row className="justify-content-between align-items-center mb-3">
//         <Col md="auto">
//           <h2>Portfolio</h2>
//         </Col>

//         <Col md="auto">
//           <Form.Group className="mb-3" controlId="formUnit">
//             <Form.Label>Filter by Unit</Form.Label>
//             <Form.Select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
//               <option value=''>All Units</option>
//               <option value='311'>311</option>
//               <option value='312'>312</option>
//               <option value='313'>313</option>
//               <option value='315'>315</option>
//               <option value='316'>316</option>
//               <option value='317'>317</option>
//               <option value='318'>318</option>
//               <option value='399'>399</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         <Col md="auto">
//           <Form.Group className="mb-3" controlId="formDate">
//             <Form.Label>Filter by Date</Form.Label>
//             <Form.Control type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
//           </Form.Group>
//         </Col>
//         <Col md="auto">
//           <Button variant="primary" onClick={handleCreatePortfolio}>
//             Create Portfolio
//           </Button>
//         </Col>
//       </Row>

//       {error && <div className="alert alert-danger">{error}</div>}

//       <Row className="justify-content-center">

//       <Col md={3}>
//           <h2>Drafts</h2>
//           {filteredDrafts.length > 0 ? filteredDrafts.map((portfolio) => (
//             <Card key={portfolio._id} className="portfolio-card mb-3">
//               <Card.Body>
//                 <Card.Title>{portfolio.title}</Card.Title>
//                 <Card.Text><strong>Unit:</strong> {portfolio.unit?.number || '-'}</Card.Text>
//                 <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number || '-'}</Card.Text>
//                 <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number || '-'}</Card.Text>
//                 <Button variant="primary" className="me-2" onClick={() => handleView(portfolio._id)}>View Portfolio</Button>
//                 <Button variant="secondary" className="me-2" onClick={() => handleEdit(portfolio._id)}>Edit Portfolio</Button>
//                 <Button variant="info" className="me-2" onClick={() => handleMoveToToBeReviewed(portfolio._id)}>
//                   Submit for Review
//                 </Button>
//                 <Button variant="danger" onClick={() => handleDelete(portfolio._id)}>Delete Portfolio</Button>
//               </Card.Body>
//             </Card>
//           )) : <p>No draft portfolios.</p>}
//         </Col>

//         {/* To Be Reviewed Section */}
//         <Col md={3}>
//           <h2>To Be Reviewed</h2>
//           {filteredToBeReviewed.length > 0 ? filteredToBeReviewed.map((portfolio) => (
//             <Card key={portfolio._id} className="portfolio-card mb-3">
//               <Card.Body>
//                 <Card.Title>{portfolio.title}</Card.Title>
//                 <Card.Text><strong>Unit:</strong> {portfolio.unit?.number || '-'}</Card.Text>
//                 <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number || '-'}</Card.Text>
//                 <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number || '-'}</Card.Text>
//                 <Button variant="primary" className="me-2" onClick={() => handleView(portfolio._id)}>View Portfolio</Button>
//                 <Button variant="info" className="me-2" onClick={() => handleMoveToDraft(portfolio._id)}>
//           Move to Draft
//         </Button>                
//               </Card.Body>
//             </Card>
//           )) : <p>No portfolios to review.</p>}
//         </Col>

//         {/* Reviewed Section */}
//         <Col md={3}>
//           <h2>Reviewed</h2>
//           {filteredReviewed.length > 0 ? filteredReviewed.map((portfolio) => (
//             <Card key={portfolio._id} className="portfolio-card mb-3">
//               <Card.Body>
//                 <Card.Title>{portfolio.title}</Card.Title>
//                 <Card.Text><strong>Unit:</strong> {portfolio.unit?.number || '-'}</Card.Text>
//                 <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number || '-'}</Card.Text>
//                 <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number || '-'}</Card.Text>
//                 <Button variant="primary" className="me-2" onClick={() => handleView(portfolio._id)}>View Portfolio</Button>
//                 <Button variant="info" className="me-2" onClick={() => handleMoveToDraft(portfolio._id)}>
//           Move to Draft
//         </Button>  
//               </Card.Body>
//             </Card>
//           )) : <p>No reviewed portfolios.</p>}
//         </Col>

//         {/* Done Section */}
//         <Col md={3}>
//           <h2>Done</h2>
//           {filteredDone.length > 0 ? filteredDone.map((portfolio) => (
//             <Card key={portfolio._id} className="portfolio-card mb-3">
//               <Card.Body>
//                 <Card.Title>{portfolio.title}</Card.Title>
//                 <Card.Text><strong>Unit:</strong> {portfolio.unit?.number || '-'}</Card.Text>
//                 <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number || '-'}</Card.Text>
//                 <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number || '-'}</Card.Text>
//                 <Button variant="success" onClick={() => handleView(portfolio._id)}>View Portfolio</Button>
//               </Card.Body>
//             </Card>
//           )) : <p>No completed portfolios.</p>}
//         </Col>

//       </Row>
//     </Container>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form, Container, Row, Col, Badge } from 'react-bootstrap';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineSend } from 'react-icons/ai'; // Import icons
import './Dashboard.css';

const Dashboard = () => {
  const [portfolios, setPortfolios] = useState({
    toBeReviewed: [],
    reviewed: [],
    done: [],
    draft: []
  });
  const [error, setError] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(''); // For unit filter
  const [selectedDate, setSelectedDate] = useState(''); // For date filter

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/portfolios/user-portfolios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch portfolios');
        }

        const data = await response.json();

        // Categorize portfolios based on status
        const categorizedPortfolios = {
          toBeReviewed: data.filter(p => p.status === 'To Be Reviewed'),
          reviewed: data.filter(p => p.status === 'Reviewed'),
          done: data.filter(p => p.status === 'Done'),
          draft: data.filter(p => p.status === 'Draft')
        };

        setPortfolios(categorizedPortfolios);
      } catch (err) {
        setError('Error fetching portfolios');
      }
    };

    fetchPortfolios();
  }, []);

  // Filtering logic
  const filterPortfolios = (portfoliosList) => {
    return portfoliosList.filter((portfolio) => {
      const matchesUnit = selectedUnit === '' || portfolio.unit?.number === selectedUnit;
      const matchesDate = selectedDate === '' || portfolio.date === selectedDate;
      return matchesUnit && matchesDate;
    });
  };

  const filteredToBeReviewed = filterPortfolios(portfolios.toBeReviewed);
  const filteredReviewed = filterPortfolios(portfolios.reviewed);
  const filteredDone = filterPortfolios(portfolios.done);
  const filteredDrafts = filterPortfolios(portfolios.draft);

  const handleMoveToToBeReviewed = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/portfolios/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'To Be Reviewed' }),
      });


      // Update the state to move the portfolio back to "To Be Reviewed"
      setPortfolios((prev) => {
        const updated = { ...prev };
        const movedPortfolio = updated.draft.find((p) => p._id === id);

        if (movedPortfolio) {
          // Remove the portfolio from the Drafts section
          updated.draft = updated.draft.filter((p) => p._id !== id);

          // Ensure the portfolio is not already in the "To Be Reviewed" section
          const isAlreadyInToBeReviewed = updated.toBeReviewed.some((p) => p._id === id);
          if (!isAlreadyInToBeReviewed) {
            updated.toBeReviewed = [...updated.toBeReviewed, { ...movedPortfolio, status: 'To Be Reviewed' }];
          }
        }
        return updated;
      });
    } catch (error) {
      console.error('Error moving portfolio to "To Be Reviewed":', error);
    }
  };

  // const handleMoveToDraft = async (id) => {
  //   try {
  //     await fetch(`http://localhost:5000/api/portfolios/${id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ status: 'Draft' }),
  //     });

  //     setPortfolios((prev) => {
  //       const updated = { ...prev };
  //       const movedPortfolio = updated.toBeReviewed.find((p) => p._id === id);
  //       if (movedPortfolio) {
  //         updated.toBeReviewed = updated.toBeReviewed.filter((p) => p._id !== id);
  //         updated.draft = [...updated.draft, { ...movedPortfolio, status: 'Draft' }]; // Force state change
  //       }
  //       return updated;
  //     });
  //   } catch (error) {
  //     console.error('Error moving portfolio to "Draft":', error);
  //   }
  // };

  // const handleMoveToDraft = async (id) => {
  //   try {
  //     // API call to update the status
  //     const response = await fetch(`http://localhost:5000/api/portfolios/${id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ status: 'Draft' }), // Only update the status
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to move portfolio to Draft');
  //     }

  //     const updatedPortfolio = await response.json();

  //     // Update local state
  //     setPortfolios((prev) => {
  //       const updated = { ...prev };

  //       // Check if the portfolio exists in "To Be Reviewed"
  //       let movedPortfolio = updated.toBeReviewed.find((p) => p._id === id);
  //       if (movedPortfolio) {
  //         // Remove from "To Be Reviewed"
  //         updated.toBeReviewed = updated.toBeReviewed.filter((p) => p._id !== id);
  //       } else {
  //         // Check if the portfolio exists in "Reviewed"
  //         movedPortfolio = updated.reviewed.find((p) => p._id === id);
  //         if (movedPortfolio) {
  //           // Remove from "Reviewed"
  //           updated.reviewed = updated.reviewed.filter((p) => p._id !== id);
  //         }
  //       }

  //       // Add to "Draft"
  //       if (movedPortfolio) {
  //         updated.draft = [...updated.draft, { ...movedPortfolio, status: 'Draft'}];
  //       }

  //       return updated;
  //     });

  //     alert('Portfolio moved to Draft successfully');
  //   } catch (error) {
  //     console.error('Error moving portfolio to Draft:', error);
  //     alert('Error moving portfolio to Draft');
  //   }
  // };

  const handleMoveToDraft = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/portfolios/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Draft' }),
      });

      if (response.ok) {
        //const updatedPortfolio = await response.json();

        // Fetch updated data from the server
        const portfoliosResponse = await fetch('http://localhost:5000/api/portfolios/user-portfolios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (portfoliosResponse.ok) {
          const updatedPortfolios = await portfoliosResponse.json();
          setPortfolios({
            toBeReviewed: updatedPortfolios.filter((p) => p.status === 'To Be Reviewed'),
            reviewed: updatedPortfolios.filter((p) => p.status === 'Reviewed'),
            done: updatedPortfolios.filter((p) => p.status === 'Done'),
            draft: updatedPortfolios.filter((p) => p.status === 'Draft'),
          });
        } else {
          console.error('Failed to fetch updated portfolios.');
        }
      } else {
        console.error('Failed to move portfolio to drafts.');
      }
    } catch (error) {
      console.error('Error moving portfolio to drafts:', error);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/portfolios/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          setPortfolios((prev) => ({
            ...prev,
            toBeReviewed: prev.toBeReviewed.filter((p) => p._id !== id),
            reviewed: prev.reviewed.filter((p) => p._id !== id),
            done: prev.done.filter((p) => p._id !== id),
            draft: prev.draft.filter((p) => p._id !== id), // Ensure it's removed from drafts too

          }));
        } else {
          alert('Error deleting portfolio');
        }
      } catch (err) {
        alert('Error deleting portfolio');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/portfolio/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/portfolio/view/${id}`);
  };

  const handleCreatePortfolio = () => {
    navigate('/portfolio');
  };

  return (
    <Container className="mt-5 dashboard-container">
      <Row className="justify-content-between align-items-center mb-3">
        <Col md="auto">
          <h2>Portfolio</h2>
        </Col>

        <Col md="auto">
          <Form.Group className="mb-3" controlId="formUnit">
            <Form.Label>Filter by Unit</Form.Label>
            <Form.Select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
              <option value=''>All Units</option>
              <option value='311'>311</option>
              <option value='312'>312</option>
              <option value='313'>313</option>
              <option value='315'>315</option>
              <option value='316'>316</option>
              <option value='317'>317</option>
              <option value='318'>318</option>
              <option value='399'>399</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md="auto">
          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label>Filter by Date</Form.Label>
            <Form.Control type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleCreatePortfolio}>
            Create Portfolio
          </Button>
        </Col>
      </Row>

      {error && <div className="alert alert-danger">{error}</div>}

      <Row className="justify-content-center">

        <Col md={3}>
          <h2>Drafts</h2>
          {filteredDrafts.length > 0 ? filteredDrafts.map((portfolio) => (
            <Card key={portfolio._id} className="portfolio-card mb-3">
              <Card.Header className="text-center">
                <h5>{portfolio.title}</h5>
                <h5> {portfolio.submissionCount > 0 && (
                  <Badge bg="info" text="dark" className="ms-2">
                    Assessed : {portfolio.submissionCount}
                  </Badge>
                )}</h5>
              </Card.Header>
              <Card.Body>
                {/* <Card.Title>
                  {portfolio.title}{' '}
                  {portfolio.submissionCount > 0 && (
                    <Badge bg="warning" text="dark" className="ms-2">
                      Assessed : {portfolio.submissionCount}
                    </Badge>
                  )}
                </Card.Title> */}
                <Card.Text><strong>Unit:</strong> {portfolio.unit?.number || '-'}</Card.Text>
                <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number || '-'}</Card.Text>
                <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number || '-'}</Card.Text>
                {/* <Button variant="primary" className="me-2" onClick={() => handleView(portfolio._id)}>View Portfolio</Button>
                <Button variant="secondary" className="me-2" onClick={() => handleEdit(portfolio._id)}>Edit Portfolio</Button>
                <Button variant="info" className="me-2" onClick={() => handleMoveToToBeReviewed(portfolio._id)}>
                  Submit for Review
                </Button>
                <Button variant="danger" onClick={() => handleDelete(portfolio._id)}>Delete Portfolio</Button> */}
              </Card.Body>
              <Card.Footer className="d-flex flex-column align-items-center">
                <div className="d-flex justify-content-around w-100 mb-2">
                  <AiOutlineEye
                    className="icon-view"
                    style={{ color: '#007bff', cursor: 'pointer' }} // Blue for "View"
                    title="View Portfolio"
                    onClick={() => handleView(portfolio._id)}
                  />
                  <AiOutlineEdit
                    className="icon-edit"
                    style={{ color: '#ffc107', cursor: 'pointer' }} // Yellow for "Edit"
                    title="Edit Portfolio"
                    onClick={() => handleEdit(portfolio._id)}
                  />
                  <AiOutlineDelete
                    className="icon-delete"
                    style={{ color: '#dc3545', cursor: 'pointer' }} // Red for "Delete"
                    title="Delete Portfolio"
                    onClick={() => handleDelete(portfolio._id)}
                  />
                </div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleMoveToToBeReviewed(portfolio._id)}
                  title="Submit Portfolio for Review"
                >
                  Submit
                </Button>
              </Card.Footer>

            </Card>
          )) : <p>No draft portfolios.</p>}
        </Col>

        {/* To Be Reviewed Section */}
        <Col md={3}>
          <h2>To Be Reviewed</h2>
          {filteredToBeReviewed.length > 0 ? filteredToBeReviewed.map((portfolio) => (
            <Card key={portfolio._id} className="portfolio-card mb-3">
              <Card.Header className="text-center">
                <h5>{portfolio.title}</h5>
                <h5> {portfolio.submissionCount > 0 && (
                    <Badge bg="info" text="dark" className="ms-2">
                      Submitted: {portfolio.submissionCount + 1}
                    </Badge>
                  )}</h5>
              </Card.Header>
              <Card.Body>
                {/* <Card.Title>
                  {portfolio.title}
                  {portfolio.submissionCount > 0 && (
                    <Badge bg="info" text="dark" className="ms-2">
                      Submitted: {portfolio.submissionCount + 1}
                    </Badge>
                  )}
                </Card.Title> */}
                <Card.Text><strong>Unit:</strong> {portfolio.unit?.number || '-'}</Card.Text>
                <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number || '-'}</Card.Text>
                <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number || '-'}</Card.Text>
                {/* <Button variant="primary" className="me-2" onClick={() => handleView(portfolio._id)}>View Portfolio</Button>
                <Button variant="info" className="me-2" onClick={() => handleMoveToDraft(portfolio._id)}>
                  Move to Draft
                </Button> */}
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                <AiOutlineEye
                  className="icon-view"
                  style={{ color: '#007bff', cursor: 'pointer' }} // Blue for "View"
                  title="View Portfolio"
                  onClick={() => handleView(portfolio._id)}
                />

                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleMoveToDraft(portfolio._id)}
                  title="Move portfolio to draft"
                >
                  Move to Draft

                </Button>
              </Card.Footer>

            </Card>
          )) : <p>No portfolios to review.</p>}
        </Col>

        {/* Reviewed Section */}
        <Col md={3}>
          <h2>Reviewed</h2>
          {filteredReviewed.length > 0 ? filteredReviewed.map((portfolio) => (
            <Card key={portfolio._id} className="portfolio-card mb-3">
              <Card.Header className="text-center">
                <h5>{portfolio.title}</h5>
                <h5> <Badge bg="info" text="dark" className="ms-2">
                    Assessed: {portfolio.submissionCount + 1}
                  </Badge></h5>
              </Card.Header>
              <Card.Body>
                {/* <Card.Title>
                  {portfolio.title}{' '}
                  <Badge bg="info" text="dark" className="ms-2">
                    Assessed: {portfolio.submissionCount + 1}
                  </Badge>
                </Card.Title> */}
                <Card.Text><strong>Unit:</strong> {portfolio.unit?.number || '-'}</Card.Text>
                <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number || '-'}</Card.Text>
                <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number || '-'}</Card.Text>
                {/* <Button variant="primary" className="me-2" onClick={() => handleView(portfolio._id)}>View Portfolio</Button>
                <Button variant="info" className="me-2" onClick={() => handleMoveToDraft(portfolio._id)}>
                  Move to Draft
                </Button> */}
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                <AiOutlineEye
                  className="icon-view"
                  style={{ color: '#007bff', cursor: 'pointer' }} // Blue for "View"
                  title="View Portfolio"
                  onClick={() => handleView(portfolio._id)}
                />

                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleMoveToDraft(portfolio._id)}
                  title="Move portfolio to draft"
                >
                  Move to Draft

                </Button>
              </Card.Footer>
            </Card>
          )) : <p>No reviewed portfolios.</p>}
        </Col>

        {/* Done Section */}
        <Col md={3}>
          <h2>Done</h2>
          {filteredDone.length > 0 ? filteredDone.map((portfolio) => (
            <Card key={portfolio._id} className="portfolio-card mb-3">
              <Card.Header className="text-center">
                <h5>{portfolio.title}</h5>
              </Card.Header>
              <Card.Body>
                {/* <Card.Title>{portfolio.title}</Card.Title> */}
                <Card.Text><strong>Unit:</strong> {portfolio.unit?.number || '-'}</Card.Text>
                <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number || '-'}</Card.Text>
                <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number || '-'}</Card.Text>
                {/* <Button variant="success" onClick={() => handleView(portfolio._id)}>View Portfolio</Button> */}
              </Card.Body>
              <Card.Footer className="d-flex flex-column align-items-center">
                <AiOutlineEye
                  className="icon-view"
                  style={{ color: '#007bff', cursor: 'pointer' }} // Blue for "View"
                  title="View Portfolio"
                  onClick={() => handleView(portfolio._id)}
                />
              </Card.Footer>
            </Card>
          )) : <p>No completed portfolios.</p>}
        </Col>

      </Row>
    </Container>
  );
};

export default Dashboard;
