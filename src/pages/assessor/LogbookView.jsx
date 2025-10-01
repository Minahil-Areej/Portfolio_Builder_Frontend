// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout"; // ✅ adjust path if needed
// import "./LogbookView.css"; // optional for styling

// const LogbookView = () => {
//     const [logbookData, setLogbookData] = useState([]);

//     useEffect(() => {
//         fetch("/Nvq_2357_13.json")
//             .then((res) => res.json())
//             .then((data) => {
//                 if (data && Array.isArray(data.performance_units)) {
//                     setLogbookData(data.performance_units); // ✅ correct key
//                 } else {
//                     setLogbookData([]);
//                 }
//             })
//             .catch((err) => console.error("Failed to load logbook JSON", err));
//     }, []);

//     return (
//         <Layout>
//             <div className="logbook-container">
//                 <h1>NVQ Logbook</h1>

//                 {logbookData.map((unit) => (
//                     <div key={unit.unit} className="unit-block">
//                         <h2>
//                             Unit {unit.unit}: {unit.title}
//                         </h2>

//                         {unit.learning_outcomes.map((lo) => (
//                             <div key={lo.LO_number} className="lo-block">
//                                 <h3>
//                                     Learning Outcome {lo.LO_number}: {lo.description}
//                                 </h3>

//                                 <table className="logbook-table">
//                                     <thead>
//                                         <tr>
//                                             <th>Evidence</th>
//                                             <th>Summary</th>
//                                             <th>Method</th>
//                                             <th>Assessment Criteria</th>
//                                             <th>Range Statement</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {lo.assessment_criteria.map((criteria, idx) => (
//                                             <tr key={idx}>
//                                                 {/* 6 empty Evidence slots */}
//                                                 <td className="evidence-slots">
//                                                     {[...Array(6)].map((_, i) => (
//                                                         <div key={i} className="evidence-slot"></div>
//                                                     ))}
//                                                 </td>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td>
//                                                     <strong>{criteria.AC_number}</strong>: {criteria.description}
//                                                 </td>
//                                                 <td>*</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>

//                             </div>
//                         ))}
//                     </div>
//                 ))}
//             </div>
//         </Layout>
//     );
// };

// export default LogbookView;




//claude try -1 
import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import {
    Container, Row, Col, Card, Badge, Button,
    Form, ProgressBar, Spinner, InputGroup
} from "react-bootstrap";
import {
    BsSearch, BsBook, BsCheckCircle, BsClock,
    BsFileText, BsBoxArrowUpRight, BsChevronDown, BsChevronUp, BsPerson
} from "react-icons/bs";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LogbookView = () => {
    const [logbookData, setLogbookData] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [allPortfolios, setAllPortfolios] = useState([]); // Store all portfolios
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedUnits, setExpandedUnits] = useState({});
    const [expandedOutcomes, setExpandedOutcomes] = useState({});
    const [filterStatus, setFilterStatus] = useState("all");

    // Fetch NVQ logbook JSON
    useEffect(() => {
        fetch("/Nvq_2357_13.json")
            .then((res) => res.json())
            .then((data) => {
                if (data && Array.isArray(data.performance_units)) {
                    setLogbookData(data.performance_units);
                } else {
                    setLogbookData([]);
                }
            })
            .catch((err) => console.error("Failed to load logbook JSON", err));
    }, []);

    // Fetch assessor's assigned students and their portfolios
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                // Fetch user data
                const userResponse = await fetch(`${API_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                }

                // Get assessor ID from token
                const assessorId = JSON.parse(atob(token.split('.')[1])).id;

                // Fetch all portfolios for this assessor
                const portfoliosResponse = await fetch(
                    `${API_URL}/api/portfolios/assessor-portfolios/${assessorId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (portfoliosResponse.ok) {
                    const portfoliosData = await portfoliosResponse.json();
                    setAllPortfolios(portfoliosData);

                    // Extract unique students
                    const uniqueStudents = Array.from(
                        new Set(
                            portfoliosData
                                .filter(p => p.userId?.name)
                                .map(p => JSON.stringify({
                                    id: p.userId._id,
                                    name: p.userId.name
                                }))
                        )
                    ).map(s => JSON.parse(s));

                    setStudents(uniqueStudents);

                    // Auto-select first student if available
                    if (uniqueStudents.length > 0 && !selectedStudent) {
                        setSelectedStudent(uniqueStudents[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to load data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Update portfolios when student selection changes
    useEffect(() => {
        if (selectedStudent) {
            const studentPortfolios = allPortfolios.filter(
                p => p.userId?._id === selectedStudent
            );
            setPortfolios(studentPortfolios);
        } else {
            setPortfolios([]);
        }
    }, [selectedStudent, allPortfolios]);

    const getEvidenceForCriteria = (unit, lo, acNumber) => {
        return portfolios.filter(
            (p) =>
                String(p.unit?.number) === String(unit.unit) &&
                String(p.learningOutcome?.number) === String(lo.LO_number) &&
                String(p.criteria?.number) === String(acNumber)
        );
    };

    const getUnitProgress = (unit) => {
        const totalCriteria = unit.learning_outcomes.reduce(
            (sum, lo) => sum + lo.assessment_criteria.length, 0
        );
        const completedCriteria = unit.learning_outcomes.reduce((sum, lo) => {
            return sum + lo.assessment_criteria.filter(ac =>
                getEvidenceForCriteria(unit, lo, ac.AC_number).length > 0
            ).length;
        }, 0);
        return { total: totalCriteria, completed: completedCriteria };
    };

    const getOutcomeProgress = (unit, lo) => {
        const total = lo.assessment_criteria.length;
        const completed = lo.assessment_criteria.filter(ac =>
            getEvidenceForCriteria(unit, lo, ac.AC_number).length > 0
        ).length;
        return { total, completed };
    };

    const toggleUnit = (unitNumber) => {
        setExpandedUnits(prev => ({
            ...prev,
            [unitNumber]: !prev[unitNumber]
        }));
    };

    const toggleOutcome = (unitNumber, loNumber) => {
        const key = `${unitNumber}-${loNumber}`;
        setExpandedOutcomes(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const filteredData = logbookData.filter(unit => {
        const matchesSearch = unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            unit.unit.toString().includes(searchTerm);

        if (filterStatus === "all") return matchesSearch;

        const progress = getUnitProgress(unit);
        if (filterStatus === "completed") return matchesSearch && progress.completed === progress.total;
        if (filterStatus === "incomplete") return matchesSearch && progress.completed < progress.total;

        return matchesSearch;
    });

    const selectedStudentData = students.find(s => s.id === selectedStudent);

    if (loading) {
        return (
            <Layout user={user}>
                <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                        <p className="mt-3 text-muted">Loading logbooks...</p>
                    </div>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout user={user}>
            <div style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)', minHeight: '100vh', paddingBottom: '2rem' }}>
                <div className="bg-white border-bottom shadow-sm">
                    <Container className="py-4">
                        <div className="d-flex align-items-center mb-2" style={{ gap: '1rem' }}>
                            <BsBook size={32} className="text-primary" />
                            <h1 className="mb-0 fw-bold">Student Logbooks</h1>
                        </div>
                        <p className="text-muted mb-0">View and track student progress across all portfolios</p>
                    </Container>
                </div>

                <Container className="py-4">
                    {/* Student Selection */}
                    {/* Student Selection - Beautiful Version */}
                    <Card className="shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <Card.Body className="p-4">
                            <Row className="align-items-center">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="text-white fw-semibold mb-3 d-flex align-items-center" style={{ gap: '0.5rem', fontSize: '1.1rem' }}>
                                            <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                                <BsPerson size={20} className="text-primary" />
                                            </div>
                                            Select Student
                                        </Form.Label>
                                        <Form.Select
                                            value={selectedStudent}
                                            onChange={(e) => setSelectedStudent(e.target.value)}
                                            className="form-select-lg shadow-sm"
                                            style={{
                                                borderRadius: '12px',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                padding: '12px 16px',
                                                fontSize: '1rem',
                                                fontWeight: '500',
                                                backgroundColor: 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <option value="">Choose a student...</option>
                                            {students.map((student) => (
                                                <option key={student.id} value={student.id}>
                                                    {student.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {selectedStudent && selectedStudentData && (
                                    <Col md={6}>
                                        <div className="text-white">
                                            <div className="d-flex align-items-center mb-2" style={{ gap: '0.75rem' }}>
                                                <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                                    <BsPerson size={28} className="text-primary" />
                                                </div>
                                                <div>
                                                    <p className="mb-0 small opacity-75">Currently Viewing</p>
                                                    <h4 className="mb-0 fw-bold">{selectedStudentData.name}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>

                    {!selectedStudent ? (
                        <Card className="shadow-sm text-center py-5">
                            <Card.Body>
                                <BsPerson size={64} className="text-muted mb-3" />
                                <h4 className="fw-semibold">No Student Selected</h4>
                                <p className="text-muted">Please select a student from the dropdown above to view their logbook</p>
                            </Card.Body>
                        </Card>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <Row className="mb-4">
                                <Col md={4} className="mb-3">
                                    <Card className="shadow-sm h-100">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <p className="text-muted small mb-1">Total Evidence</p>
                                                    <h2 className="mb-0 fw-bold">{portfolios.length}</h2>
                                                </div>
                                                <div className="rounded p-3" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
                                                    <BsCheckCircle size={28} className="text-success" />
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={4} className="mb-3">
                                    <Card className="shadow-sm h-100">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <p className="text-muted small mb-1">Overall Progress</p>
                                                    <h2 className="mb-0 fw-bold">
                                                        {logbookData.length > 0 ? Math.round(
                                                            (logbookData.reduce((sum, unit) => {
                                                                const prog = getUnitProgress(unit);
                                                                return sum + (prog.completed / prog.total);
                                                            }, 0) / logbookData.length) * 100
                                                        ) : 0}%
                                                    </h2>
                                                </div>
                                                <div className="rounded p-3" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
                                                    <BsClock size={28} className="text-warning" />
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Search and Filter */}
                            <Card className="shadow-sm mb-4">
                                <Card.Body>
                                    <Row>
                                        <Col md={8} className="mb-3 mb-md-0">
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <BsSearch size={18} />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Search units..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Col>
                                        <Col md={4}>
                                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                                <Button
                                                    variant={filterStatus === "all" ? "primary" : "outline-secondary"}
                                                    onClick={() => setFilterStatus("all")}
                                                    style={{ flex: 1 }}
                                                    size="sm"
                                                >
                                                    All
                                                </Button>
                                                <Button
                                                    variant={filterStatus === "completed" ? "success" : "outline-secondary"}
                                                    onClick={() => setFilterStatus("completed")}
                                                    style={{ flex: 1 }}
                                                    size="sm"
                                                >
                                                    Complete
                                                </Button>
                                                <Button
                                                    variant={filterStatus === "incomplete" ? "warning" : "outline-secondary"}
                                                    onClick={() => setFilterStatus("incomplete")}
                                                    style={{ flex: 1 }}
                                                    size="sm"
                                                >
                                                    Progress
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Units */}
                            {filteredData.map((unit) => {
                                const progress = getUnitProgress(unit);
                                const isExpanded = expandedUnits[unit.unit];
                                const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

                                return (
                                    <Card key={unit.unit} className="shadow-sm mb-4">
                                        <Card.Body>
                                            <div
                                                onClick={() => toggleUnit(unit.unit)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div style={{ flex: 1 }}>
                                                        <div className="d-flex align-items-center mb-2" style={{ gap: '0.5rem' }}>
                                                            <Badge bg="primary" className="px-3 py-2">
                                                                Unit {unit.unit}
                                                            </Badge>
                                                            {progress.completed === progress.total && progress.total > 0 && (
                                                                <Badge bg="success" className="px-3 py-2">
                                                                    <BsCheckCircle size={14} className="me-1" />
                                                                    Complete
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h4 className="fw-bold mb-3">{unit.title}</h4>

                                                        <div className="mb-2">
                                                            <div className="d-flex justify-content-between small text-muted mb-1">
                                                                <span>Progress</span>
                                                                <span className="fw-semibold">
                                                                    {progress.completed} / {progress.total} criteria
                                                                </span>
                                                            </div>
                                                            <ProgressBar
                                                                now={progressPercent}
                                                                variant="primary"
                                                                style={{ height: '8px' }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="ms-3"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleUnit(unit.unit);
                                                        }}
                                                    >
                                                        {isExpanded ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
                                                    </Button>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="mt-4 pt-4 border-top">
                                                    {unit.learning_outcomes.map((lo) => {
                                                        const outcomeKey = `${unit.unit}-${lo.LO_number}`;
                                                        const isOutcomeExpanded = expandedOutcomes[outcomeKey];
                                                        const outcomeProgress = getOutcomeProgress(unit, lo);
                                                        const outcomePercent = outcomeProgress.total > 0
                                                            ? (outcomeProgress.completed / outcomeProgress.total) * 100
                                                            : 0;

                                                        return (
                                                            <Card
                                                                key={lo.LO_number}
                                                                className="mb-3"
                                                                style={{
                                                                    backgroundColor: '#f0f7ff',
                                                                    borderLeft: '4px solid #0d6efd'
                                                                }}
                                                            >
                                                                <Card.Body>
                                                                    <div
                                                                        onClick={() => toggleOutcome(unit.unit, lo.LO_number)}
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        <div className="d-flex justify-content-between align-items-start">
                                                                            <div style={{ flex: 1 }}>
                                                                                <div className="d-flex align-items-center mb-2" style={{ gap: '0.5rem' }}>
                                                                                    <Badge bg="secondary" className="px-2 py-1">
                                                                                        LO {lo.LO_number}
                                                                                    </Badge>
                                                                                    {outcomeProgress.completed === outcomeProgress.total && outcomeProgress.total > 0 && (
                                                                                        <Badge bg="success" className="px-2 py-1">
                                                                                            <BsCheckCircle size={12} className="me-1" />
                                                                                            Complete
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                <h5 className="fw-semibold mb-2" style={{ color: '#0d6efd' }}>
                                                                                    {lo.description}
                                                                                </h5>

                                                                                <div className="mb-0">
                                                                                    <div className="d-flex justify-content-between small text-muted mb-1">
                                                                                        <span>Progress</span>
                                                                                        <span className="fw-semibold">
                                                                                            {outcomeProgress.completed} / {outcomeProgress.total} criteria
                                                                                        </span>
                                                                                    </div>
                                                                                    <ProgressBar
                                                                                        now={outcomePercent}
                                                                                        variant="info"
                                                                                        style={{ height: '6px' }}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <Button
                                                                                variant="light"
                                                                                size="sm"
                                                                                className="ms-2"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    toggleOutcome(unit.unit, lo.LO_number);
                                                                                }}
                                                                            >
                                                                                {isOutcomeExpanded ? <BsChevronUp size={18} /> : <BsChevronDown size={18} />}
                                                                            </Button>
                                                                        </div>
                                                                    </div>

                                                                    {isOutcomeExpanded && (
                                                                        <div className="mt-3 pt-3 border-top">
                                                                            {lo.assessment_criteria.map((criteria) => {
                                                                                const evidenceList = getEvidenceForCriteria(unit, lo, criteria.AC_number);
                                                                                const hasEvidence = evidenceList.length > 0;

                                                                                return (
                                                                                    <Card
                                                                                        key={criteria.AC_number}
                                                                                        className="mb-3"
                                                                                        style={{
                                                                                            borderWidth: '2px',
                                                                                            borderColor: hasEvidence ? '#198754' : '#6c757d',
                                                                                            backgroundColor: hasEvidence ? 'rgba(25, 135, 84, 0.1)' : '#ffffff'
                                                                                        }}
                                                                                    >
                                                                                        <Card.Body>
                                                                                            <div className="d-flex" style={{ gap: '1rem' }}>
                                                                                                <div
                                                                                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                                                                    style={{
                                                                                                        width: '24px',
                                                                                                        height: '24px',
                                                                                                        backgroundColor: hasEvidence ? '#198754' : '#6c757d'
                                                                                                    }}
                                                                                                >
                                                                                                    {hasEvidence && (
                                                                                                        <BsCheckCircle size={16} style={{ color: 'white' }} />
                                                                                                    )}
                                                                                                </div>

                                                                                                <div style={{ flex: 1 }}>
                                                                                                    <p className="fw-semibold small mb-2">
                                                                                                        AC {criteria.AC_number}: {criteria.description}
                                                                                                    </p>

                                                                                                    {hasEvidence ? (
                                                                                                        <div className="d-flex flex-column" style={{ gap: '1rem' }}>
                                                                                                            {evidenceList.map((p) => (
                                                                                                                <div key={p._id} className="border rounded p-3" style={{ backgroundColor: 'white' }}>
                                                                                                                    <a
                                                                                                                        href={`/portfolio/assessor/${p._id}`}
                                                                                                                        target="_blank"
                                                                                                                        rel="noopener noreferrer"
                                                                                                                        className="text-primary text-decoration-none fw-medium small d-flex align-items-center mb-2"
                                                                                                                        style={{ gap: '0.5rem' }}
                                                                                                                    >
                                                                                                                        <BsFileText size={14} />
                                                                                                                        {p.title || `Portfolio ${p.criteria?.number}`}
                                                                                                                        <BsBoxArrowUpRight size={12} />
                                                                                                                    </a>

                                                                                                                    {p.method && (
                                                                                                                        <div className="mb-2">
                                                                                                                            <span className="fw-semibold text-muted small">Method: </span>
                                                                                                                            <Badge bg="info" className="ms-1">{p.method}</Badge>
                                                                                                                        </div>
                                                                                                                    )}

                                                                                                                    {p.taskDescription && (
                                                                                                                        <p className="small text-muted mb-0">
                                                                                                                            <span className="fw-semibold">Summary: </span>
                                                                                                                            {p.taskDescription}
                                                                                                                        </p>
                                                                                                                    )}

                                                                                                                    {p.status && (
                                                                                                                        <div className="mt-2">
                                                                                                                            <Badge
                                                                                                                                bg={
                                                                                                                                    p.status === 'Done' ? 'success' :
                                                                                                                                        p.status === 'Reviewed' ? 'info' :
                                                                                                                                            'warning'
                                                                                                                                }
                                                                                                                            >
                                                                                                                                {p.status}
                                                                                                                            </Badge>
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <p className="small text-muted fst-italic mb-0">
                                                                                                            No evidence submitted yet
                                                                                                        </p>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </Card.Body>
                                                                                    </Card>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </Card.Body>
                                                            </Card>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                );
                            })}

                            {filteredData.length === 0 && (
                                <Card className="shadow-sm text-center py-5">
                                    <Card.Body>
                                        <BsSearch size={64} className="text-muted mb-3" />
                                        <h4 className="fw-semibold">No units found</h4>
                                        <p className="text-muted">Try adjusting your search or filter criteria</p>
                                    </Card.Body>
                                </Card>
                            )}
                        </>
                    )}
                </Container>
            </div>
        </Layout>
    );
};

export default LogbookView;