// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Card, Col, Row, Form, Button, Badge } from 'react-bootstrap';
// import { AiOutlineEye, AiOutlineCheck, AiOutlineDelete, AiOutlineSend } from 'react-icons/ai'; // Import icons
// import { Link, useNavigate } from 'react-router-dom';
// import Layout from '../components/layout/Layout';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const AssessorDashboard = () => {
//   const [portfolios, setPortfolios] = useState({
//     toBeReviewed: [],
//     reviewed: [],
//     done: []
//   });
//   const [selectedStudent, setSelectedStudent] = useState(''); // For student filter
//   const [selectedUnit, setSelectedUnit] = useState(''); // For unit filter
//   const [studentOptions, setStudentOptions] = useState([]); // For dropdown options
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   // Add logout handler
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   useEffect(() => {
//     const fetchPortfolios = async () => {
//       try {
//         // const { data } = await axios.get(`${API_URL}/api/portfolios/assessor/portfolios`, {
//         //   headers: {
//         //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         //   },
//         // });
//         const token = localStorage.getItem('token');
//         const assessorId = JSON.parse(atob(token.split('.')[1])).id; // Extract assessor ID from token

//         const response = await axios.get(`${API_URL}/api/portfolios/assessor-portfolios/${assessorId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = response.data;
//         // Categorize portfolios based on status
//         const categorizedPortfolios = {
//           toBeReviewed: data.filter(p => p.status === 'To Be Reviewed'),
//           reviewed: data.filter(p => p.status === 'Reviewed'),
//           done: data.filter(p => p.status === 'Done')
//         };

//         const uniqueStudents = Array.from(new Set(data.map(p => p.userId?.name)));

//         setStudentOptions(uniqueStudents);

//         setPortfolios(categorizedPortfolios);
//       } catch (error) {
//         console.error('Error fetching portfolios', error);
//       }
//     };

//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch(`${API_URL}/api/users/me`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const userData = await response.json();
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error('Error fetching user data:', err);
//       }
//     };

//     fetchPortfolios();
//     fetchUserData();
//   }, []);

//   const filterPortfolios = (portfoliosList) => {
//     return portfoliosList.filter((portfolio) => {
//       const matchesStudent = selectedStudent === '' || portfolio.userId?.name === selectedStudent;
//       const matchesUnit = selectedUnit === '' || portfolio.unit?.number === selectedUnit;
//       return matchesStudent && matchesUnit;
//     });
//   };

//   const filteredToBeReviewed = filterPortfolios(portfolios.toBeReviewed);
//   const filteredReviewed = filterPortfolios(portfolios.reviewed);
//   const filteredDone = filterPortfolios(portfolios.done);

//   const markAsDone = async (id) => {
//     try {
//       await axios.post(
//         `${API_URL}/api/portfolios/${id}/feedback`,
//         { status: 'Done' },
//         {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       alert('Portfolio marked as done');
//       setPortfolios((prev) => {
//         const updated = { ...prev };
//         updated.reviewed = updated.reviewed.filter((p) => p._id !== id);
//         updated.done.push({ ...prev.reviewed.find((p) => p._id === id), status: 'Done' });
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error marking portfolio as done', error);
//     }
//   };

//   return (
//     <Layout user={user}>
//     <Container className="mt-5 dashboard-container">
//       <Row className="align-items-center mb-3">
//         <Col>
//           <h2>Assessor Dashboard</h2>
//         </Col>
//         <Col className="text-end">
//           <Button variant="outline-danger" onClick={handleLogout}>
//             Logout
//           </Button>
//         </Col>
//       </Row>
//       {/* Filter section */}
//       <Row className="mb-3">
//         <Col md="auto">
//           <Form.Group controlId="studentFilter">
//             <Form.Label>Filter by Student Name</Form.Label>
//             <Form.Select
//               value={selectedStudent}
//               onChange={(e) => setSelectedStudent(e.target.value)}
//             >
//               <option value="">All Students</option>
//               {studentOptions.map((student, index) => (
//                 <option key={index} value={student}>{student}</option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         <Col md="auto">
//           <Form.Group controlId="unitFilter">
//             <Form.Label>Filter by Unit</Form.Label>
//             <Form.Select
//               value={selectedUnit}
//               onChange={(e) => setSelectedUnit(e.target.value)}
//             >
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
//       </Row>

//       <Row className="justify-content-center">

//         <Col md={4}>
//           <h2>To Be Reviewed</h2>
//           {filteredToBeReviewed.length > 0 ? filteredToBeReviewed.map(portfolio => (
//             <Card key={portfolio._id} style={{ margin: '10px' }}>
//               <Card.Header className="text-center">
//                 <h5>{portfolio.title}</h5>
//                 <h5> {portfolio.submissionCount > 0 && (
//                   <Badge bg="danger" text="light" className="ms-2">
//                     Assessed: {portfolio.submissionCount}
//                   </Badge>
//                 )}</h5>
//               </Card.Header>
//               <Card.Body>
//                 {/* <Card.Title>
//                   {portfolio.title}
//                   {portfolio.submissionCount > 0 && (
//                     <Badge bg="danger" text="light" className="ms-2">
//                       Assessed: {portfolio.submissionCount}
//                     </Badge>
//                   )}
//                 </Card.Title>                 */}
//                 <Card.Text><strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}</Card.Text>
//                 <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}</Card.Text>
//                 <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}</Card.Text>
//                 <Card.Text><strong>Student:</strong> {portfolio.userId?.name}</Card.Text> {/* Display student name */}
//               </Card.Body>
//               <Card.Footer className="d-flex flex-column align-items-center">
//                 {/* Change button label based on feedback presence */}
//                 <Link to={`/portfolio/assessor/${portfolio._id}`}>
//                   <Button variant={portfolio.assessorComments ? 'info' : 'primary'}>
//                     {portfolio.assessorComments ? 'View Saved Feedback' : 'Review Portfolio'}
//                   </Button>
//                 </Link>
//               </Card.Footer>

//             </Card>
//           )) : <p>No portfolios to review.</p>}
//         </Col>

//         <Col md={4}>
//           <h2>Reviewed</h2>
//           {filteredReviewed.length > 0 ? filteredReviewed.map(portfolio => (
//             <Card key={portfolio._id} style={{ margin: '10px' }}>
//               <Card.Header className="text-center">
//                 <h5>{portfolio.title}</h5>
//                 <h5> <Badge bg="danger" text="light" className="ms-2">
//                   Assessed: {portfolio.submissionCount + 1}
//                 </Badge></h5>
//               </Card.Header>
//               <Card.Body>
//                 {/* <Card.Title>
//                   {portfolio.title}
//                   <Badge bg="danger" text="light" className="ms-2">
//                     Assessed: {portfolio.submissionCount + 1}
//                   </Badge>

//                 </Card.Title> */}
//                 <Card.Text><strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}</Card.Text>
//                 <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}</Card.Text>
//                 <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}</Card.Text>
//                 <Card.Text><strong>Student:</strong> {portfolio.userId?.name}</Card.Text> {/* Display student name */}

//                 {/* <Link to={`/portfolio/assessor/${portfolio._id}`}>
//                   <Button variant="secondary">View/Edit Feedback</Button>
//                   <Button
//                     variant="success"
//                     style={{ marginLeft: '10px' }}
//                     onClick={() => markAsDone(portfolio._id)}
//                   >
//                     Mark as Done
//                   </Button>
//                 </Link> */}
//               </Card.Body>
//               <Card.Footer className="d-flex justify-content-between align-items-center">
//                 <Link to={`/portfolio/assessor/${portfolio._id}`}>
//                   <AiOutlineEye
//                     className="icon-view"
//                     style={{ color: '#007bff', cursor: 'pointer' }} // Blue for "View"
//                     title="View Feedback"
//                   />
//                 </Link>
//                 <AiOutlineCheck
//                   className="icon-done"
//                   style={{ color: '#28a745', cursor: 'pointer', fontSize: '1.5em' }} // Green for "Mark as Done"
//                   title="Mark as Done"
//                   onClick={() => markAsDone(portfolio._id)} />
//               </Card.Footer>
//             </Card>
//           )) : <p>No reviewed portfolios.</p>}

//         </Col>

//         <Col md={4}>
//           <h2>Done</h2>
//           {filteredDone.length > 0 ? filteredDone.map(portfolio => (
//             <Card key={portfolio._id} style={{ margin: '10px' }}>
//               <Card.Header className="text-center">
//                 <h5>{portfolio.title}</h5>
//               </Card.Header>
//               <Card.Body>
//                 {/* <Card.Title>{portfolio.title}</Card.Title> */}
//                 <Card.Text><strong>Unit:</strong> {portfolio.unit?.number} - {portfolio.unit?.title}</Card.Text>
//                 <Card.Text><strong>Learning Outcome:</strong> {portfolio.learningOutcome?.number} - {portfolio.learningOutcome?.description}</Card.Text>
//                 <Card.Text><strong>Criteria:</strong> {portfolio.criteria?.number} - {portfolio.criteria?.description}</Card.Text>
//                 <Card.Text><strong>Student:</strong> {portfolio.userId?.name}</Card.Text> {/* Display student name */}

//                 {/* <Link to={`/portfolio/assessor/${portfolio._id}`}>
//                   <Button variant="success">View Portfolio</Button>
//                 </Link> */}
//               </Card.Body>
//               <Card.Footer className="d-flex flex-column align-items-center">
//                 <Link to={`/portfolio/assessor/${portfolio._id}`}>
//                   <AiOutlineEye
//                     className="icon-view"
//                     style={{ color: '#007bff', cursor: 'pointer' }} // Blue for "View"
//                     title="View Portfolio"
//                   />
//                 </Link>

//               </Card.Footer>
//             </Card>
//           )) : <p>No completed portfolios.</p>}
//         </Col>



//       </Row>
//     </Container>
//     </Layout>
//   );
// };

// export default AssessorDashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Col, Row } from 'react-bootstrap';
import Layout from '../components/layout/Layout';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AssessorDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPortfolios: 0,
    toBeReviewed: 0,
    inReview: 0,
    completed: 0,
    portfoliosByUnit: {},
    recentActivity: [],
    reviewTimeByUnit: {},
    weeklyProgress: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userData, portfoliosData] = await Promise.all([
          fetch(`${API_URL}/api/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(r => r.json()),
          axios.get(`${API_URL}/api/portfolios/assessor-stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(r => r.data)
        ]);

        setUser(userData);
        setStats(portfoliosData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  // Chart Data
  const statusChartData = {
    labels: ['To Be Reviewed', 'In Review', 'Completed'],
    datasets: [{
      data: [stats.toBeReviewed, stats.inReview, stats.completed],
      backgroundColor: ['#ffc107', '#17a2b8', '#28a745']
    }]
  };

  const unitChartData = {
    labels: Object.keys(stats.portfoliosByUnit),
    datasets: [{
      label: 'Portfolios by Unit',
      data: Object.values(stats.portfoliosByUnit),
      backgroundColor: '#007bff'
    }]
  };

  return (
    <Layout user={user}>
      <Container className="mt-4">
        <h2 className="mb-4">Assessment Dashboard</h2>

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Portfolios</Card.Title>
                <h2>{stats.totalPortfolios}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center bg-warning text-white">
              <Card.Body>
                <Card.Title>To Be Reviewed</Card.Title>
                <h2>{stats.toBeReviewed}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center bg-info text-white">
              <Card.Body>
                <Card.Title>In Review</Card.Title>
                <h2>{stats.inReview}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center bg-success text-white">
              <Card.Body>
                <Card.Title>Completed</Card.Title>
                <h2>{stats.completed}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Portfolio Status Distribution</Card.Title>
                <div style={{ height: '300px' }}>
                  <Pie data={statusChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Portfolios by Unit</Card.Title>
                <div style={{ height: '300px' }}>
                  <Bar 
                    data={unitChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }} 
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Row>
          <Col md={12}>
            <Card>
              <Card.Body>
                <Card.Title>Recent Activity</Card.Title>
                <div className="activity-timeline">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item d-flex align-items-start mb-3">
                      <div className="activity-content">
                        <h6 className="mb-1">{activity.action}</h6>
                        <small className="text-muted">
                          {new Date(activity.date).toLocaleDateString()} - {activity.portfolio}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default AssessorDashboard;