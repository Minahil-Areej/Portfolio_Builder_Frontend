import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [assessors, setAssessors] = useState([]);
  const [user, setUser] = useState(null);
  const [userFilter, setUserFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        const currentUser = response.data.find(u => u.role === 'admin');
        if (currentUser) setUser(currentUser);
      } catch (error) {
        console.error('Error fetching users:', error);
        navigate('/login');
      }
    };

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
    fetchAssessors();
  }, [navigate]);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/users/deactivate/${userId}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleAssignAssessor = async (studentId, assessorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/users/assign-assessor/${studentId}`,
        { assessorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
    <Layout user={user}>
      <Container className="mt-4">
        <h2 className="mb-4">Users Management</h2>
        
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
                          value={user.assignedAssessor?._id || ''}
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
                        value=""
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
      </Container>
    </Layout>
  );
};

export default UsersPage;