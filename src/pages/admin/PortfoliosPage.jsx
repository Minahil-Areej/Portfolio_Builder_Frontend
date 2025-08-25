import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Row, Col } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PortfoliosPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [portfoliosRes, usersRes] = await Promise.all([
          // Changed to match AdminDashboard endpoint
          axios.get(`${API_URL}/api/portfolios/admin/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        setPortfolios(portfoliosRes.data);
        const currentUser = usersRes.data.find(u => u.role === 'admin');
        if (currentUser) setUser(currentUser);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  // Update the filter function to match your data structure
  const filterAndSortPortfolios = (portfolios) => {
    return portfolios
      .filter(portfolio => 
        portfolio.userId?.name?.toLowerCase().includes(filter.toLowerCase()) ||
        portfolio.unit?.number?.toLowerCase().includes(filter.toLowerCase()) ||
        portfolio.status?.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (sortField === 'studentName') {
          aValue = a.userId?.name || '';
          bValue = b.userId?.name || '';
        }
        
        return sortDirection === 'asc'
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'To Be Reviewed':
        return 'warning';
      case 'In review':
        return 'info';
      case 'Done':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <Layout user={user}>
      <Container className="mt-4">
        <h2 className="mb-4">Portfolios Management</h2>
        
        {/* Filters */}
        <div className="mb-4 p-3 bg-light rounded">
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group>
                <Form.Label><small>Search Portfolios</small></Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  placeholder="Search by student, unit or status..."
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
                  <option value="createdAt">Date Created</option>
                  <option value="status">Status</option>
                  <option value="unit">Unit</option>
                  <option value="studentName">Student Name</option>
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

        {/* Portfolios Table */}
        <Table striped bordered hover responsive>
          <thead className="bg-light">
            <tr>
              <th>Student Name</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Last Updated</th>
              <th>Assigned Assessor</th>
            </tr>
          </thead>
          <tbody>
            {filterAndSortPortfolios(portfolios).map(portfolio => (
              <tr key={portfolio._id}>
                <td>{portfolio.userId?.name}</td>
                <td>{portfolio.unit?.number}</td>
                <td>
                  <Badge bg={
                    portfolio.status === 'To Be Reviewed' ? 'warning' :
                    portfolio.status === 'In Review' ? 'info' :
                    portfolio.status === 'Done' ? 'success' : 'secondary'
                  }>
                    {portfolio.status}
                  </Badge>
                </td>
                <td>{new Date(portfolio.createdAt).toLocaleDateString()}</td>
                <td>{new Date(portfolio.updatedAt).toLocaleDateString()}</td>
                <td>{portfolio.userId?.assignedAssessor?.name || 'Not Assigned'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </Layout>
  );
};

export default PortfoliosPage;