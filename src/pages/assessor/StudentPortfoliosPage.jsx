import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Col, Row, Form, Button, Badge } from 'react-bootstrap';
import { AiOutlineEye, AiOutlineCheck, AiOutlineDelete, AiOutlineSend } from 'react-icons/ai'; // Import icons
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const StudentPortfoliosPage = () => {
  const [portfolios, setPortfolios] = useState({
    toBeReviewed: [],
    reviewed: [],
    done: []
  });
  const [selectedStudent, setSelectedStudent] = useState(''); // For student filter
  const [selectedUnit, setSelectedUnit] = useState(''); // For unit filter
  const [studentOptions, setStudentOptions] = useState([]); // For dropdown options
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Add logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        // const { data } = await axios.get(`${API_URL}/api/portfolios/assessor/portfolios`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //   },
        // });
        const token = localStorage.getItem('token');
        const assessorId = JSON.parse(atob(token.split('.')[1])).id; // Extract assessor ID from token

        const response = await axios.get(`${API_URL}/api/portfolios/assessor-portfolios/${assessorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        // Categorize portfolios based on status
        const categorizedPortfolios = {
          toBeReviewed: data.filter(p => p.status === 'To Be Reviewed'),
          reviewed: data.filter(p => p.status === 'Reviewed'),
          done: data.filter(p => p.status === 'Done')
        };

        const uniqueStudents = Array.from(new Set(data.map(p => p.userId?.name)));

        setStudentOptions(uniqueStudents);

        setPortfolios(categorizedPortfolios);
      } catch (error) {
        console.error('Error fetching portfolios', error);
      }
    };

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchPortfolios();
    fetchUserData();
  }, []);

  const filterPortfolios = (portfoliosList) => {
    return portfoliosList.filter((portfolio) => {
      const matchesStudent = selectedStudent === '' || portfolio.userId?.name === selectedStudent;
      const matchesUnit = selectedUnit === '' || portfolio.unit?.number === selectedUnit;
      return matchesStudent && matchesUnit;
    });
  };

  const filteredToBeReviewed = filterPortfolios(portfolios.toBeReviewed);
  const filteredReviewed = filterPortfolios(portfolios.reviewed);
  const filteredDone = filterPortfolios(portfolios.done);

  const markAsDone = async (id) => {
    try {
      await axios.post(
        `${API_URL}/api/portfolios/${id}/feedback`,
        { status: 'Done' },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Portfolio marked as done');
      setPortfolios((prev) => {
        const updated = { ...prev };
        updated.reviewed = updated.reviewed.filter((p) => p._id !== id);
        updated.done.push({ ...prev.reviewed.find((p) => p._id === id), status: 'Done' });
        return updated;
      });
    } catch (error) {
      console.error('Error marking portfolio as done', error);
    }
  };

  return (
    <Layout user={user}>
    <Container className="mt-5 dashboard-container">
      <Row className="align-items-center mb-3">
        <Col>
          <h2>Student Portfolios</h2>
        </Col>
        <Col className="text-end">
          {/* <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button> */}
        </Col>
      </Row>
      {/* Filter section */}
      <Row className="mb-3">
        <Col md="auto">
          <Form.Group controlId="studentFilter">
            <Form.Label>Filter by Student Name</Form.Label>
            <Form.Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">All Students</option>
              {studentOptions.map((student, index) => (
                <option key={index} value={student}>{student}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md="auto">
          <Form.Group controlId="unitFilter">
            <Form.Label>Filter by Unit</Form.Label>
            <Form.Select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
            >
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
      </Row>

      <Row className="justify-content-center">

        <Col md={4}>
          <h2>To Be Reviewed</h2>
          {filteredToBeReviewed.length > 0 ? filteredToBeReviewed.map(portfolio => (
            <Card key={portfolio._id} style={{ margin: '10px' }}>
              <Card.Header className="text-center">
                <h5>{portfolio.title}</h5>
                <h5> {portfolio.submissionCount > 0 && (
                  <Badge bg="danger" text="light" className="ms-2">
                    Assessed: {portfolio.submissionCount}
                  </Badge>
                )}</h5>
              </Card.Header>
              <Card.Body>
                {/* <Card.Title>
                  {portfolio.title}
                  {portfolio.submissionCount > 0 && (
                    <Badge bg="danger" text="light" className="ms-2">
                      Assessed: {portfolio.submissionCount}
                    </Badge>
                  )}
                </Card.Title>                 */}
                <Card.Text><strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}</Card.Text>
                <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}</Card.Text>
                <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}</Card.Text>
                <Card.Text><strong>Student:</strong> {portfolio.userId?.name}</Card.Text> {/* Display student name */}
              </Card.Body>
              <Card.Footer className="d-flex flex-column align-items-center">
                {/* Change button label based on feedback presence */}
                <Link to={`/portfolio/assessor/${portfolio._id}`}>
                  <Button variant={portfolio.assessorComments ? 'info' : 'primary'}>
                    {portfolio.assessorComments ? 'View Saved Feedback' : 'Review Portfolio'}
                  </Button>
                </Link>
              </Card.Footer>

            </Card>
          )) : <p>No portfolios to review.</p>}
        </Col>

        <Col md={4}>
          <h2>Reviewed</h2>
          {filteredReviewed.length > 0 ? filteredReviewed.map(portfolio => (
            <Card key={portfolio._id} style={{ margin: '10px' }}>
              <Card.Header className="text-center">
                <h5>{portfolio.title}</h5>
                <h5> <Badge bg="danger" text="light" className="ms-2">
                  Assessed: {portfolio.submissionCount + 1}
                </Badge></h5>
              </Card.Header>
              <Card.Body>
                {/* <Card.Title>
                  {portfolio.title}
                  <Badge bg="danger" text="light" className="ms-2">
                    Assessed: {portfolio.submissionCount + 1}
                  </Badge>

                </Card.Title> */}
                <Card.Text><strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}</Card.Text>
                <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}</Card.Text>
                <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}</Card.Text>
                <Card.Text><strong>Student:</strong> {portfolio.userId?.name}</Card.Text> {/* Display student name */}

                {/* <Link to={`/portfolio/assessor/${portfolio._id}`}>
                  <Button variant="secondary">View/Edit Feedback</Button>
                  <Button
                    variant="success"
                    style={{ marginLeft: '10px' }}
                    onClick={() => markAsDone(portfolio._id)}
                  >
                    Mark as Done
                  </Button>
                </Link> */}
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                <Link to={`/portfolio/assessor/${portfolio._id}`}>
                  <AiOutlineEye
                    className="icon-view"
                    style={{ color: '#007bff', cursor: 'pointer' }} // Blue for "View"
                    title="View Feedback"
                  />
                </Link>
                <AiOutlineCheck
                  className="icon-done"
                  style={{ color: '#28a745', cursor: 'pointer', fontSize: '1.5em' }} // Green for "Mark as Done"
                  title="Mark as Done"
                  onClick={() => markAsDone(portfolio._id)} />
              </Card.Footer>
            </Card>
          )) : <p>No reviewed portfolios.</p>}

        </Col>

        <Col md={4}>
          <h2>Done</h2>
          {filteredDone.length > 0 ? filteredDone.map(portfolio => (
            <Card key={portfolio._id} style={{ margin: '10px' }}>
              <Card.Header className="text-center">
                <h5>{portfolio.title}</h5>
              </Card.Header>
              <Card.Body>
                {/* <Card.Title>{portfolio.title}</Card.Title> */}
                <Card.Text><strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}</Card.Text>
                <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}</Card.Text>
                <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}</Card.Text>
                <Card.Text><strong>Student:</strong> {portfolio.userId?.name}</Card.Text> {/* Display student name */}

                {/* <Link to={`/portfolio/assessor/${portfolio._id}`}>
                  <Button variant="success">View Portfolio</Button>
                </Link> */}
              </Card.Body>
              <Card.Footer className="d-flex flex-column align-items-center">
                <Link to={`/portfolio/assessor/${portfolio._id}`}>
                  <AiOutlineEye
                    className="icon-view"
                    style={{ color: '#007bff', cursor: 'pointer' }} // Blue for "View"
                    title="View Portfolio"
                  />
                </Link>

              </Card.Footer>
            </Card>
          )) : <p>No completed portfolios.</p>}
        </Col>



      </Row>
    </Container>
    </Layout>
  );
};

export default StudentPortfoliosPage;
