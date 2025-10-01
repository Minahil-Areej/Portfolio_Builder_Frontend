import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import "../assessor/LogbookView.css"; // reuse same styles

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StudentLogbook = () => {
    const [logbookData, setLogbookData] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [user, setUser] = useState(null);   // ✅ added

    // ✅ Fetch NVQ logbook JSON
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

    // ✅ Fetch logged-in student portfolios
    useEffect(() => {
        fetch(`${API_URL}/api/portfolios/user-portfolios`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // send JWT
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setPortfolios(data);
                } else {
                    setPortfolios([]);
                }
            })
            .catch((err) => console.error("Failed to load student portfolios", err));
    }, []);

    // ✅ Fetch logged-in user (for header/sidebar)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((u) => setUser(u)) // { name, email, role }
            .catch((err) => console.error("Failed to fetch user:", err));
    }, []);

    // ✅ Helper: match AC with student portfolios
    const getEvidenceForCriteria = (unit, lo, acNumber) => {
        return portfolios.filter(
            (p) =>
                String(p.unit?.number) === String(unit.unit) &&
                String(p.learningOutcome?.number) === String(lo.LO_number) &&
                String(p.criteria?.number) === String(acNumber)
        );
    };


    return (
        <Layout user={user}>   
            <div className="logbook-container">
                <h1>My NVQ Logbook</h1>

                {logbookData.map((unit) => (
                    <div key={unit.unit} className="unit-block">
                        <h2>
                            Unit {unit.unit}: {unit.title}
                        </h2>

                        {unit.learning_outcomes.map((lo) => (
                            <div key={lo.LO_number} className="lo-block">
                                <h3>
                                    Learning Outcome {lo.LO_number}: {lo.description}
                                </h3>

                                <table className="logbook-table">
                                    <thead>
                                        <tr>
                                            <th>Evidence</th>
                                            <th>Summary</th>
                                            <th>Method</th>
                                            <th>Assessment Criteria</th>
                                            <th>Range Statement</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lo.assessment_criteria.map((criteria, idx) => {
                                            const evidenceList = getEvidenceForCriteria(
                                                unit,
                                                lo,
                                                criteria.AC_number
                                            );

                                            return (
                                                <tr key={idx}>
                                                    <td className="evidence-slots">
                                                        {evidenceList.length > 0 ? (
                                                            evidenceList.map((p) => (
                                                                <a
                                                                    key={p._id}
                                                                    href={`/portfolio/view/${p._id}`}   // ✅ correct route
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    {p.title || `Portfolio ${p.criteria?.number}`}
                                                                </a>

                                                            ))
                                                        ) : (
                                                            <span>No evidence yet</span>
                                                        )}
                                                    </td>
                                                    <td>{evidenceList[0]?.statement || ""}</td>
                                                    <td>{evidenceList[0]?.method || ""}</td>
                                                    <td>
                                                        {criteria.AC_number}: {criteria.description}
                                                    </td>
                                                    <td>*</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default StudentLogbook;

