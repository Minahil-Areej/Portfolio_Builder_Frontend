import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Row, Col, Accordion, Button } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const styles = {
    groupHeader: {
        backgroundColor: '#f8f9fa',
        cursor: 'pointer'
    },
    portfolioCount: {
        fontSize: '0.9rem',
        color: '#6c757d',
        marginLeft: '8px'
    },
    nestedTable: {
        marginBottom: 0
    }
};

const PortfoliosPage = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [user, setUser] = useState(null);
    const [filter, setFilter] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [activeKeys, setActiveKeys] = useState([]);
    const [assessors, setAssessors] = useState([]); // Add assessors to state

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [portfoliosRes, usersRes] = await Promise.all([
                    axios.get(`${API_URL}/api/portfolios/admin/all`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${API_URL}/api/users`, {  // Add this to get full user data
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);
                
                // Map portfolios with full user data
                const portfoliosWithUserData = portfoliosRes.data.map(portfolio => {
                    const fullUserData = usersRes.data.find(u => u._id === portfolio.userId._id);
                    return {
                        ...portfolio,
                        userId: fullUserData // Replace limited user data with full user data
                    };
                });

                setPortfolios(portfoliosWithUserData);
                const currentUser = usersRes.data.find(u => u.role === 'admin');
                if (currentUser) setUser(currentUser);
            } catch (error) {
                console.error('Error fetching data:', error);
                navigate('/login');
            }
        };

        fetchData();
    }, [navigate]);

    // First, create a function to group portfolios
    const groupPortfolios = (portfolios) => {
        return Object.entries(
            portfolios.reduce((groups, portfolio) => {
                const studentId = portfolio.userId?._id;
                const studentName = portfolio.userId?.name;
                
                if (!groups[studentId]) {
                    groups[studentId] = {
                        student: {
                            name: studentName,
                            assignedAssessor: portfolio.userId?.assignedAssessor?.name || 'Not Assigned'
                        },
                        portfolios: []
                    };
                }
                groups[studentId].portfolios.push(portfolio);
                return groups;
            }, {})
        );
    };

    // Then update the filterAndSortPortfolios function
    const filterAndSortPortfolios = (portfolios) => {
        // First group the portfolios
        const groupedPortfolios = groupPortfolios(portfolios);

        // Then filter the groups
        const filteredGroups = groupedPortfolios.filter(([_, group]) => {
            const searchTerm = filter.toLowerCase();
            return (
                group.student.name.toLowerCase().includes(searchTerm) ||
                group.portfolios.some(p => 
                    p.unit?.number?.toLowerCase().includes(searchTerm) ||
                    p.status?.toLowerCase().includes(searchTerm)
                )
            );
        });

        // Finally sort the groups
        return filteredGroups.sort(([_, a], [__, b]) => {
            let aValue, bValue;

            switch(sortField) {
                case 'studentName':
                    aValue = a.student.name;
                    bValue = b.student.name;
                    break;
                case 'createdAt':
                    // Sort by most recent portfolio
                    aValue = Math.max(...a.portfolios.map(p => new Date(p.createdAt)));
                    bValue = Math.max(...b.portfolios.map(p => new Date(p.createdAt)));
                    break;
                case 'status':
                    // Sort by most recent portfolio status
                    aValue = a.portfolios[0]?.status;
                    bValue = b.portfolios[0]?.status;
                    break;
                case 'unit':
                    // Sort by first unit number
                    aValue = a.portfolios[0]?.unit?.number;
                    bValue = b.portfolios[0]?.unit?.number;
                    break;
                default:
                    aValue = a.student.name;
                    bValue = b.student.name;
            }

            if (sortDirection === 'asc') {
                return String(aValue).localeCompare(String(bValue));
            }
            return String(bValue).localeCompare(String(aValue));
        });
    };

    // Update getBadgeVariant function
    const getBadgeVariant = (status) => {
        switch (status) {
            case 'To Be Reviewed':
                return 'warning';
            case 'In Review':  // Changed from 'In review' to 'In Review'
                return 'info';
            case 'Done':
                return 'success';
            default:
                return 'secondary';
        }
    };

    const handleExpandCollapseAll = (expand) => {
        if (expand) {
            const allKeys = Object.keys(portfolios.reduce((groups, portfolio) => {
                const studentId = portfolio.userId?._id;
                if (!groups[studentId]) groups[studentId] = true;
                return groups;
            }, {}));
            setActiveKeys(allKeys.map((_, index) => index.toString()));
        } else {
            setActiveKeys([]);
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

                {/* Expand/Collapse All buttons */}
                <div className="mb-3">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleExpandCollapseAll(true)}
                    >
                        Expand All
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleExpandCollapseAll(false)}
                    >
                        Collapse All
                    </Button>
                </div>

                {/* Grouped Portfolios Table */}
                <Accordion activeKey={activeKeys} onSelect={(keys) => setActiveKeys(keys || [])}>
                    {filterAndSortPortfolios(portfolios).map(([studentId, group], index) => (
                        <Accordion.Item key={studentId} eventKey={index.toString()}>
                            <Accordion.Header>
                                <div className="d-flex justify-content-between align-items-center w-100">
                                    <div>
                                        <strong>{group.student.name}</strong>
                                        <span style={styles.portfolioCount}>
                                            ({group.portfolios.length} portfolios)
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Assessor:</strong> {group.student.assignedAssessor}
                                    </div>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Table striped bordered hover responsive style={styles.nestedTable}>
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Unit</th>
                                            <th>Status</th>
                                            <th>Created Date</th>
                                            <th>Last Updated</th>
                                            {/* <th>Actions</th>  Add this column */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.portfolios
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .map(portfolio => (
                                                <tr key={portfolio._id}>
                                                    <td>{portfolio.unit?.number}</td>
                                                    <td>
                                                        <Badge bg={getBadgeVariant(portfolio.status)}>
                                                            {portfolio.status}
                                                        </Badge>
                                                    </td>
                                                    <td>{new Date(portfolio.createdAt).toLocaleDateString()}</td>
                                                    <td>{new Date(portfolio.updatedAt).toLocaleDateString()}</td>
                                                    {/* <td>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            onClick={() => navigate(`/portfolio/view/${portfolio._id}`)}
                                                        >
                                                            View
                                                        </Button>
                                                    </td> */}
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>

                {/* Show message if no portfolios */}
                {portfolios.length === 0 && (
                    <div className="text-center p-4 bg-light rounded">
                        <p className="mb-0">No portfolios found</p>
                    </div>
                )}
            </Container>
        </Layout>
    );
};

export default PortfoliosPage;