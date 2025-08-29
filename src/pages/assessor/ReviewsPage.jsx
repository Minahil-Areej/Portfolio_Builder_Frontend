import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Row, Col, Button } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye } from 'react-icons/ai';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ReviewsPage = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchUserData();
  }, []);

  // Add effect to fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/portfolios/assessor-reviews`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  const handleViewPortfolio = (portfolioId) => {
    navigate(`/portfolio/view/${portfolioId}`);
  };

  const filterAndSortReviews = () => {
    return reviews
      .filter(review => 
        review.studentName?.toLowerCase().includes(filter.toLowerCase()) ||
        review.unit?.toLowerCase().includes(filter.toLowerCase()) ||
        review.status?.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (sortField === 'date') {
          aValue = new Date(a.reviewedAt);
          bValue = new Date(b.reviewedAt);
        }
        
        return sortDirection === 'asc' ? 
          aValue > bValue ? 1 : -1 : 
          aValue < bValue ? 1 : -1;
      });
  };

  return (
    <Layout user={user}>
      <Container className="mt-4">
        <h2 className="mb-4">Reviews History</h2>

        <div className="mb-4 p-3 bg-light rounded">
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group>
                <Form.Label><small>Search Reviews</small></Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  placeholder="Search by student or unit..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label><small>Sort By</small></Form.Label>
                <Form.Select
                  size="sm"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="date">Review Date</option>
                  <option value="studentName">Student Name</option>
                  <option value="unit">Unit</option>
                  <option value="status">Status</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label><small>Order</small></Form.Label>
                <Form.Select
                  size="sm"
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </div>

        <Table striped bordered hover responsive>
          <thead className="bg-light">
            <tr>
              <th>Student Name</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Review Date</th>
              <th>Comments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterAndSortReviews().map(review => (
              <tr key={review._id}>
                <td>{review.studentName}</td>
                <td>{review.unit}</td>
                <td>
                  <Badge bg={
                    review.status === 'Done' ? 'success' :
                    review.status === 'In Review' ? 'info' : 'warning'
                  }>
                    {review.status}
                  </Badge>
                </td>
                <td>{new Date(review.reviewedAt).toLocaleDateString()}</td>
                <td>{review.comments?.substring(0, 50)}...</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleViewPortfolio(review.portfolioId)}
                  >
                    <AiOutlineEye /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {reviews.length === 0 && (
          <div className="text-center p-4 bg-light rounded">
            <p className="mb-0">No reviews found</p>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default ReviewsPage;