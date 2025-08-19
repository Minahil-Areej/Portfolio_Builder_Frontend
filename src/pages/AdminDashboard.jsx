import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Card, Row, Col, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chart from 'chart.js/auto';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Add this CSS at the top after your imports
const dropdownStyles = {
  assignmentBox: {
    padding: '8px',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
    marginBottom: '8px'
  },
  label: {
    fontSize: '0.8rem',
    color: '#6c757d',
    marginBottom: '4px'
  },
  currentAssessor: {
    color: '#0d6efd',
    fontWeight: 'bold',
    padding: '4px 0'
  },
  select: {
    fontSize: '0.9rem'
  }
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [portfolioCounts, setPortfolioCounts] = useState({});
  const [recentImages, setRecentImages] = useState([]);
  const [applications, setApplications] = useState([]);
  const [assessors, setAssessors] = useState([]); // NEW STATE
  const [userFilter, setUserFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch Users
        // const userResponse = await axios.get(`${API_URL}/api/users`, {
        //     headers: { Authorization: `Bearer ${token}` },
        // });
        // setUsers(userResponse.data);

        // Fetch Portfolios
        const portfolioResponse = await axios.get(`${API_URL}/api/portfolios/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPortfolios(portfolioResponse.data);

        // Count Portfolios by User
        const counts = {};
        portfolioResponse.data.forEach(portfolio => {
          const userName = portfolio.userId?.name || 'Unknown User'; // Fetch name or default
          counts[userName] = (counts[userName] || 0) + 1;
        });
        setPortfolioCounts(counts);

        // Fetch Applications
        const applicationResponse = await axios.get(`${API_URL}/api/application-form`);
        setApplications(applicationResponse.data);

        // Fetch recent portfolio images
        const images = portfolioResponse.data
          .flatMap(portfolio => portfolio.images)
          .slice(0, 10); // Show only the latest 5 images
        setRecentImages(images);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (Object.keys(portfolioCounts).length > 0) {
      renderChart();
    }
  }, [portfolioCounts]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        //console.log('Fetched users:', response.data); // Log fetched users
        setUsers(response.data); // Ensure we store the latest data, including `isActive`
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // NEW: Fetch assessors
    const fetchAssessors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/users/assessors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssessors(response.data);
      } catch (error) {
        console.error('Error fetching assessors:', error);
      }
    };

    fetchUsers();
    fetchAssessors(); // NEW CALL
  }, []);

  const renderChart = () => {
    const ctx = document.getElementById('portfolioChart').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(portfolioCounts),
        datasets: [{
          label: 'Portfolios Submitted',
          data: Object.values(portfolioCounts),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  };

  // ✅ Using the Already Existing API
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      //console.log(`Sending request to toggle user ${userId} to ${!currentStatus}`); // Log request data

      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/api/users/deactivate/${userId}`,
        { isActive: !currentStatus }, // Send toggled status
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log('API response:', response.data); // Log API response

      // Ensure correct message is shown in alert
      alert(response.data.message);

      // Update user state correctly
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );

      // If the toggled user is an assessor, refresh the assessors list
      const toggledUser = users.find(user => user._id === userId);
      if (toggledUser?.role === 'assessor') {
        // Fetch updated list of active assessors
        const assessorsResponse = await axios.get(`${API_URL}/api/users/assessors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssessors(assessorsResponse.data);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  // NEW FUNCTION: Handle assessor assignment
  const handleAssignAssessor = async (studentId, assessorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/users/assign-assessor/${studentId}`, 
        { assessorId },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      // Refresh users to get updated data with populated assessor
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);

      alert('Assessor assigned successfully!');
    } catch (error) {
      console.error('Error assigning assessor:', error);
      alert('Error assigning assessor');
    }
  };

  // Add this helper function inside your component
  const filterAndSortUsers = (users, role) => {
    return users
      .filter(user => user.role === role)
      .filter(user => 
        user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
        user.email.toLowerCase().includes(userFilter.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortDirection === 'asc' 
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Admin Dashboard</h1>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Top Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm bg-primary text-white">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h3>{users.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm bg-success text-white">
            <Card.Body>
              <Card.Title>Total Portfolios</Card.Title>
              <h3>{portfolios.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm bg-warning text-dark">
            <Card.Body>
              <Card.Title>Assessors</Card.Title>
              <h3>{users.filter(user => user.role === 'assessor').length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm bg-danger text-white">
            <Card.Body>
              <Card.Title>Students</Card.Title>
              <h3>{users.filter(user => user.role === 'student').length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      {/* Leaderboard */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Portfolio Submissions by Users</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Portfolios Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(portfolioCounts).map(([userName, count]) => (
                    <tr key={userName}>
                      <td>{userName}</td>  {/* Display name instead of Object */}
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Chart for portfolio submission */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Portfolio Submission Chart</Card.Title>
              <canvas id="portfolioChart"></canvas>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Portfolio Images */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Recent Portfolio Images</Card.Title>
              <div className="d-flex flex-wrap">
                {recentImages.map((image, index) => (
                  <img
                    key={index}
                    src={`${API_URL}/${image}`}
                    alt="Portfolio"
                    className="m-2"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Applications Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Submitted Applications</Card.Title>
              <Table striped bordered hover className="mt-4">
                <thead>
                  <tr>
                    <th>Family Name</th>
                    <th>First Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app._id}>
                      <td>{app.familyName}</td>
                      <td>{app.firstName}</td>
                      <td>{app.email}</td>
                      <td>{app.courseToStudy}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button variant="info" onClick={() => navigate(`/admin/application/${app._id}`)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* UPDATED Users Table with Assessor Assignment */}
      {/* Users Section */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>User Management</span>
                <Button variant="success" size="sm" onClick={() => navigate('/register')}>
                  Register New User
                </Button>
              </Card.Title>

              {/* Filters */}
              <div className="mb-4 p-3 bg-light rounded">
                <Row className="align-items-center">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label><small>Search Users</small></Form.Label>
                      <Form.Control
                        type="text"
                        size="sm"
                        placeholder="Search by name or email..."
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
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
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="isActive">Status</option>
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
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Students Table */}
              <h5 className="mb-3">Students</h5>
              <Table striped bordered hover responsive className="mb-4">
                <thead className="bg-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Assigned Assessor</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterAndSortUsers(users, 'student').map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={user.isActive ? 'success' : 'warning'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div style={dropdownStyles.assignmentBox}>
                          {user.assignedAssessor ? (
                            <>
                              <div>
                                <small style={dropdownStyles.label}>Currently Assigned to:</small>
                                <div style={dropdownStyles.currentAssessor}>
                                  {user.assignedAssessor.name}
                                </div>
                              </div>
                              <Form.Select
                                size="sm"
                                style={dropdownStyles.select}
                                className="border-primary mt-2"
                                value={user.assignedAssessor?._id || user.assignedAssessor || ''}
                                onChange={(e) => handleAssignAssessor(user._id, e.target.value)}
                              >
                                <option value="">Select Assessor</option>
                                {assessors.map((assessor) => (
                                  <option key={assessor._id} value={assessor._id}>
                                    {assessor.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </>
                          ) : (
                            <Form.Select
                              size="sm"
                              value={user.assignedAssessor?._id || user.assignedAssessor || ''}
                              onChange={(e) => handleAssignAssessor(user._id, e.target.value)}
                            >
                              <option value="">Select Assessor</option>
                              {assessors.map((assessor) => (
                                <option key={assessor._id} value={assessor._id}>
                                  {assessor.name}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        </div>
                      </td>
                      <td>
                        <Button
                          variant={user.isActive ? 'danger' : 'success'}
                          size="sm"
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Assessors Table */}
              <h5 className="mb-3">Assessors</h5>
              <Table striped bordered hover responsive className="mb-4">
                <thead className="bg-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterAndSortUsers(users, 'assessor').map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={user.isActive ? 'success' : 'warning'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant={user.isActive ? 'danger' : 'success'}
                          size="sm"
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Admins Table */}
              <h5 className="mb-3">Administrators</h5>
              <Table striped bordered hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterAndSortUsers(users, 'admin').map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={user.isActive ? 'success' : 'warning'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant={user.isActive ? 'danger' : 'success'}
                          size="sm"
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;




