// import React, { useEffect, useState } from 'react';
// import { Table, Button, Container } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const AdminDashboard = () => {
//     const [users, setUsers] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get(`${API_URL}/api/users`, {
//                     headers: { 'Authorization': `Bearer ${token}` },
//                 });
//                 setUsers(response.data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         };
//         fetchUsers();
//     }, []);

//     return (
//         <Container className="mt-4">
//             <h1>Admin Dashboard</h1>
//             <Button variant="success" onClick={() => navigate('/register')}>Register New User</Button>
            
//             <Table striped bordered hover className="mt-4">
//                 <thead>
//                     <tr>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Role</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map((user) => (
//                         <tr key={user._id}>
//                             <td>{user.name}</td>
//                             <td>{user.email}</td>
//                             <td>{user.role}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </Container>
//     );
// };

// export default AdminDashboard;



import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chart from 'chart.js/auto';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [portfolioCounts, setPortfolioCounts] = useState({});
    const [recentImages, setRecentImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch Users
                const userResponse = await axios.get(`${API_URL}/api/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(userResponse.data);

                // Fetch Portfolios
                const portfolioResponse = await axios.get(`${API_URL}/api/portfolios`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPortfolios(portfolioResponse.data);

                // Count Portfolios by User
                const counts = {};
                portfolioResponse.data.forEach(portfolio => {
                    counts[portfolio.userId] = (counts[portfolio.userId] || 0) + 1;
                });
                setPortfolioCounts(counts);

                // Fetch recent portfolio images
                const images = portfolioResponse.data
                    .flatMap(portfolio => portfolio.images)
                    .slice(0, 5); // Show only the latest 5 images
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

    return (
        <Container className="mt-4">
            <h1>Admin Dashboard</h1>

            {/* Top Statistics */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Users</Card.Title>
                            <h3>{users.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Portfolios</Card.Title>
                            <h3>{portfolios.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Assessors</Card.Title>
                            <h3>{users.filter(user => user.role === 'assessor').length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow-sm">
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
                                    {Object.entries(portfolioCounts).map(([userId, count]) => (
                                        <tr key={userId}>
                                            <td>{userId}</td>
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

            {/* Users Table */}
            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>All Users</Card.Title>
                            <Button variant="success" onClick={() => navigate('/register')}>
                                Register New User
                            </Button>

                            <Table striped bordered hover className="mt-4">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
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
