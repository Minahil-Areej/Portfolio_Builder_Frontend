// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout";
// import "../assessor/LogbookView.css"; // reuse same styles

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const StudentLogbook = () => {
//     const [logbookData, setLogbookData] = useState([]);
//     const [portfolios, setPortfolios] = useState([]);
//     const [user, setUser] = useState(null);   // ✅ added

//     // ✅ Fetch NVQ logbook JSON
//     useEffect(() => {
//         fetch("/Nvq_2357_13.json")
//             .then((res) => res.json())
//             .then((data) => {
//                 if (data && Array.isArray(data.performance_units)) {
//                     setLogbookData(data.performance_units);
//                 } else {
//                     setLogbookData([]);
//                 }
//             })
//             .catch((err) => console.error("Failed to load logbook JSON", err));
//     }, []);

//     // ✅ Fetch logged-in student portfolios
//     useEffect(() => {
//         fetch(`${API_URL}/api/portfolios/user-portfolios`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`, // send JWT
//             },
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 if (Array.isArray(data)) {
//                     setPortfolios(data);
//                 } else {
//                     setPortfolios([]);
//                 }
//             })
//             .catch((err) => console.error("Failed to load student portfolios", err));
//     }, []);

//     // ✅ Fetch logged-in user (for header/sidebar)
//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         fetch(`${API_URL}/api/users/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//         })
//             .then((res) => (res.ok ? res.json() : Promise.reject(res)))
//             .then((u) => setUser(u)) // { name, email, role }
//             .catch((err) => console.error("Failed to fetch user:", err));
//     }, []);

//     // ✅ Helper: match AC with student portfolios
//     const getEvidenceForCriteria = (unit, lo, acNumber) => {
//         return portfolios.filter(
//             (p) =>
//                 String(p.unit?.number) === String(unit.unit) &&
//                 String(p.learningOutcome?.number) === String(lo.LO_number) &&
//                 String(p.criteria?.number) === String(acNumber)
//         );
//     };


//     return (
//         <Layout user={user}>   
//             <div className="logbook-container">
//                 <h1>My NVQ Logbook</h1>

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
//                                         {lo.assessment_criteria.map((criteria, idx) => {
//                                             const evidenceList = getEvidenceForCriteria(
//                                                 unit,
//                                                 lo,
//                                                 criteria.AC_number
//                                             );

//                                             return (
//                                                 <tr key={idx}>
//                                                     <td className="evidence-slots">
//                                                         {evidenceList.length > 0 ? (
//                                                             evidenceList.map((p) => (
//                                                                 <a
//                                                                     key={p._id}
//                                                                     href={`/portfolio/view/${p._id}`}   // ✅ correct route
//                                                                     target="_blank"
//                                                                     rel="noopener noreferrer"
//                                                                 >
//                                                                     {p.title || `Portfolio ${p.criteria?.number}`}
//                                                                 </a>

//                                                             ))
//                                                         ) : (
//                                                             <span>No evidence yet</span>
//                                                         )}
//                                                     </td>
//                                                     <td>{evidenceList[0]?.statement || ""}</td>
//                                                     <td>{evidenceList[0]?.method || ""}</td>
//                                                     <td>
//                                                         {criteria.AC_number}: {criteria.description}
//                                                     </td>
//                                                     <td>*</td>
//                                                 </tr>
//                                             );
//                                         })}
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

// export default StudentLogbook;

// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout";
// import "./StudentLogbook.css";
// import { Modal, Button, Form } from "react-bootstrap"; // ✅ using bootstrap

// const StudentLogbook = () => {
//   const [logbookData, setLogbookData] = useState([]);
//   const [portfolios, setPortfolios] = useState([]);
//   const [selectedPortfolio, setSelectedPortfolio] = useState(null); // for modal
//   const [filters, setFilters] = useState({ unit: "", status: "" });

//   // ✅ Fetch NVQ logbook JSON
//   useEffect(() => {
//     fetch("/Nvq_2357_13.json")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && Array.isArray(data.performance_units)) {
//           setLogbookData(data.performance_units);
//         }
//       })
//       .catch((err) => console.error("Failed to load logbook JSON", err));
//   }, []);

//   // ✅ Fetch logged-in student portfolios
//   useEffect(() => {
//     const API_URL = import.meta.env.VITE_API_URL || "";
//     fetch(`${API_URL}/api/portfolios/user-portfolios`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) setPortfolios(data);
//       })
//       .catch((err) => console.error("Failed to load student portfolios", err));
//   }, []);

//   // ✅ Filter portfolios per AC
//   const getEvidenceForCriteria = (unit, lo, acNumber) => {
//     return portfolios.filter(
//       (p) =>
//         p.unit?.number === unit.unit &&
//         p.learningOutcome?.number === lo.LO_number &&
//         p.criteria?.number === acNumber &&
//         (!filters.status || p.status === filters.status)
//     );
//   };

//   return (
//     <Layout>
//       <div className="logbook-container">
//         <h1 className="mb-4">My NVQ Logbook</h1>

//         {/* Filters */}
//         <div className="filters d-flex gap-3 mb-4">
//           <Form.Select
//             value={filters.unit}
//             onChange={(e) =>
//               setFilters({ ...filters, unit: e.target.value })
//             }
//           >
//             <option value="">All Units</option>
//             {logbookData.map((u) => (
//               <option key={u.unit} value={u.unit}>
//                 {u.unit}: {u.title}
//               </option>
//             ))}
//           </Form.Select>

//           <Form.Select
//             value={filters.status}
//             onChange={(e) =>
//               setFilters({ ...filters, status: e.target.value })
//             }
//           >
//             <option value="">All Status</option>
//             <option value="Draft">Draft</option>
//             <option value="To Be Reviewed">To Be Reviewed</option>
//             <option value="Reviewed">Reviewed</option>
//             <option value="Done">Done</option>
//           </Form.Select>
//         </div>

//         {/* Accordion for Units */}
//         <div className="accordion" id="logbookAccordion">
//           {logbookData
//             .filter((unit) =>
//               filters.unit ? unit.unit === filters.unit : true
//             )
//             .map((unit, uIdx) => (
//               <div className="accordion-item mb-3" key={uIdx}>
//                 <h2 className="accordion-header" id={`heading-${uIdx}`}>
//                   <button
//                     className="accordion-button collapsed"
//                     type="button"
//                     data-bs-toggle="collapse"
//                     data-bs-target={`#collapse-${uIdx}`}
//                   >
//                     Unit {unit.unit}: {unit.title}
//                   </button>
//                 </h2>
//                 <div
//                   id={`collapse-${uIdx}`}
//                   className="accordion-collapse collapse"
//                   data-bs-parent="#logbookAccordion"
//                 >
//                   <div className="accordion-body">
//                     {unit.learning_outcomes.map((lo, lIdx) => (
//                       <div key={lIdx} className="mb-4">
//                         <h5 className="text-primary">
//                           Learning Outcome {lo.LO_number}: {lo.description}
//                         </h5>
//                         <table className="table table-bordered table-striped">
//                           <thead>
//                             <tr>
//                               <th>Evidence</th>
//                               <th>Summary</th>
//                               <th>Method</th>
//                               <th>Assessment Criteria</th>
//                               <th>Range Statement</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {lo.assessment_criteria.map((criteria, idx) => {
//                               const evidenceList = getEvidenceForCriteria(
//                                 unit,
//                                 lo,
//                                 criteria.AC_number
//                               );
//                               return (
//                                 <tr key={idx}>
//                                   <td>
//                                     {evidenceList.length > 0 ? (
//                                       evidenceList.map((p) => (
//                                         <Button
//                                           key={p._id}
//                                           variant="link"
//                                           onClick={() => setSelectedPortfolio(p)}
//                                         >
//                                           {p.title || `Portfolio ${p.criteria?.number}`}
//                                         </Button>
//                                       ))
//                                     ) : (
//                                       <em>No evidence yet</em>
//                                     )}
//                                   </td>
//                                   <td>{evidenceList[0]?.statement || ""}</td>
//                                   <td>{evidenceList[0]?.method || ""}</td>
//                                   <td>
//                                     {criteria.AC_number}: {criteria.description}
//                                   </td>
//                                   <td>*</td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>

//         {/* Modal for Portfolio Preview */}
//         {selectedPortfolio && (
//           <Modal
//             show={true}
//             onHide={() => setSelectedPortfolio(null)}
//             size="lg"
//           >
//             <Modal.Header closeButton>
//               <Modal.Title>{selectedPortfolio.title}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <p>
//                 <strong>Unit:</strong> {selectedPortfolio.unit?.number} -{" "}
//                 {selectedPortfolio.unit?.title}
//               </p>
//               <p>
//                 <strong>Learning Outcome:</strong>{" "}
//                 {selectedPortfolio.learningOutcome?.number} -{" "}
//                 {selectedPortfolio.learningOutcome?.description}
//               </p>
//               <p>
//                 <strong>Criteria:</strong>{" "}
//                 {selectedPortfolio.criteria?.number} -{" "}
//                 {selectedPortfolio.criteria?.description}
//               </p>
//               <p>
//                 <strong>Statement:</strong> {selectedPortfolio.statement}
//               </p>
//               <p>
//                 <strong>Method:</strong> {selectedPortfolio.method}
//               </p>

//               {/* Images */}
//               {selectedPortfolio.images?.length > 0 && (
//                 <div className="image-gallery d-flex gap-2 flex-wrap">
//                   {selectedPortfolio.images.map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt="Evidence"
//                       style={{ width: "120px", borderRadius: "8px" }}
//                     />
//                   ))}
//                 </div>
//               )}
//             </Modal.Body>
//             <Modal.Footer>
//               <Button
//                 variant="secondary"
//                 onClick={() => setSelectedPortfolio(null)}
//               >
//                 Close
//               </Button>
//               <Button
//                 variant="primary"
//                 href={`/portfolio/view/${selectedPortfolio._id}`}
//               >
//                 Open Full Portfolio
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default StudentLogbook;


// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout";
// import "./StudentLogbook.css";
// import { Modal, Button, Form, Accordion } from "react-bootstrap";

// const StudentLogbook = () => {
//   const [logbookData, setLogbookData] = useState([]);
//   const [portfolios, setPortfolios] = useState([]);
//   const [selectedPortfolio, setSelectedPortfolio] = useState(null); // for modal
//   const [filters, setFilters] = useState({ unit: "", status: "" });
//   const [activeKeys, setActiveKeys] = useState([]); // for expand/collapse all

//   // ✅ Fetch NVQ logbook JSON
//   useEffect(() => {
//     fetch("/Nvq_2357_13.json")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && Array.isArray(data.performance_units)) {
//           setLogbookData(data.performance_units);
//         }
//       })
//       .catch((err) => console.error("Failed to load logbook JSON", err));
//   }, []);

//   // ✅ Fetch logged-in student portfolios
//   useEffect(() => {
//     const API_URL = import.meta.env.VITE_API_URL || "";
//     fetch(`${API_URL}/api/portfolios/user-portfolios`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) setPortfolios(data);
//       })
//       .catch((err) => console.error("Failed to load student portfolios", err));
//   }, []);

//   // ✅ Filter portfolios per AC
//   const getEvidenceForCriteria = (unit, lo, acNumber) => {
//     return portfolios.filter(
//       (p) =>
//         String(p.unit?.number) === String(unit.unit) &&
//         String(p.learningOutcome?.number) === String(lo.LO_number) &&
//         String(p.criteria?.number) === String(acNumber) &&
//         (!filters.status || p.status === filters.status)
//     );
//   };

//   // ✅ Expand All / Collapse All
//   const handleExpandAll = () => {
//     setActiveKeys(logbookData.map((_, idx) => String(idx)));
//   };
//   const handleCollapseAll = () => {
//     setActiveKeys([]);
//   };

//   return (
//     <Layout>
//       <div className="logbook-container">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h1>My NVQ Logbook</h1>
//           <div>
//             <Button
//               variant="primary"
//               size="sm"
//               className="me-2"
//               onClick={handleExpandAll}
//             >
//               Expand All
//             </Button>
//             <Button
//               variant="secondary"
//               size="sm"
//               onClick={handleCollapseAll}
//             >
//               Collapse All
//             </Button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="filters d-flex gap-3 mb-4">
//           <Form.Select
//             value={filters.unit}
//             onChange={(e) =>
//               setFilters({ ...filters, unit: e.target.value })
//             }
//           >
//             <option value="">All Units</option>
//             {logbookData.map((u) => (
//               <option key={u.unit} value={u.unit}>
//                 {u.unit}: {u.title}
//               </option>
//             ))}
//           </Form.Select>

//           <Form.Select
//             value={filters.status}
//             onChange={(e) =>
//               setFilters({ ...filters, status: e.target.value })
//             }
//           >
//             <option value="">All Status</option>
//             <option value="Draft">Draft</option>
//             <option value="To Be Reviewed">To Be Reviewed</option>
//             <option value="Reviewed">Reviewed</option>
//             <option value="Done">Done</option>
//           </Form.Select>
//         </div>

//         {/* Accordion for Units */}
//         <Accordion activeKey={activeKeys} onSelect={(k) => {
//           if (!k) return;
//           if (activeKeys.includes(k)) {
//             setActiveKeys(activeKeys.filter((key) => key !== k));
//           } else {
//             setActiveKeys([...activeKeys, k]);
//           }
//         }}>
//           {logbookData
//             .filter((unit) =>
//               filters.unit ? unit.unit === filters.unit : true
//             )
//             .map((unit, uIdx) => (
//               <Accordion.Item eventKey={String(uIdx)} key={uIdx}>
//                 <Accordion.Header>
//                   Unit {unit.unit}: {unit.title}
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   {unit.learning_outcomes.map((lo, lIdx) => (
//                     <div key={lIdx} className="mb-4">
//                       <h5 className="text-primary">
//                         Learning Outcome {lo.LO_number}: {lo.description}
//                       </h5>
//                       <table className="table table-bordered table-striped">
//                         <thead>
//                           <tr>
//                             <th>Evidence</th>
//                             <th>Summary</th>
//                             <th>Method</th>
//                             <th>Assessment Criteria</th>
//                             <th>Range Statement</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {lo.assessment_criteria.map((criteria, idx) => {
//                             const evidenceList = getEvidenceForCriteria(
//                               unit,
//                               lo,
//                               criteria.AC_number
//                             );
//                             return (
//                               <tr key={idx}>
//                                 <td>
//                                   {evidenceList.length > 0 ? (
//                                     evidenceList.map((p) => (
//                                       <Button
//                                         key={p._id}
//                                         variant="link"
//                                         onClick={() => setSelectedPortfolio(p)}
//                                       >
//                                         {p.title ||
//                                           `Portfolio ${p.criteria?.number}`}
//                                       </Button>
//                                     ))
//                                   ) : (
//                                     <em>No evidence yet</em>
//                                   )}
//                                 </td>
//                                 <td>{evidenceList[0]?.statement || ""}</td>
//                                 <td>{evidenceList[0]?.method || ""}</td>
//                                 <td>
//                                   {criteria.AC_number}: {criteria.description}
//                                 </td>
//                                 <td>*</td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   ))}
//                 </Accordion.Body>
//               </Accordion.Item>
//             ))}
//         </Accordion>

//         {/* Modal for Portfolio Preview */}
//         {selectedPortfolio && (
//           <Modal
//             show={true}
//             onHide={() => setSelectedPortfolio(null)}
//             size="lg"
//           >
//             <Modal.Header closeButton>
//               <Modal.Title>{selectedPortfolio.title}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <p>
//                 <strong>Unit:</strong> {selectedPortfolio.unit?.number} -{" "}
//                 {selectedPortfolio.unit?.title}
//               </p>
//               <p>
//                 <strong>Learning Outcome:</strong>{" "}
//                 {selectedPortfolio.learningOutcome?.number} -{" "}
//                 {selectedPortfolio.learningOutcome?.description}
//               </p>
//               <p>
//                 <strong>Criteria:</strong>{" "}
//                 {selectedPortfolio.criteria?.number} -{" "}
//                 {selectedPortfolio.criteria?.description}
//               </p>
//               <p>
//                 <strong>Statement:</strong> {selectedPortfolio.statement}
//               </p>
//               <p>
//                 <strong>Method:</strong> {selectedPortfolio.method}
//               </p>

//               {/* Images */}
//               {selectedPortfolio.images?.length > 0 && (
//                 <div className="image-gallery d-flex gap-2 flex-wrap">
//                   {selectedPortfolio.images.map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt="Evidence"
//                       style={{ width: "120px", borderRadius: "8px" }}
//                     />
//                   ))}
//                 </div>
//               )}
//             </Modal.Body>
//             <Modal.Footer>
//               <Button
//                 variant="secondary"
//                 onClick={() => setSelectedPortfolio(null)}
//               >
//                 Close
//               </Button>
//               <Button
//                 variant="primary"
//                 href={`/portfolio/view/${selectedPortfolio._id}`}
//               >
//                 Open Full Portfolio
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default StudentLogbook;


import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import "./StudentLogbook.css";
import { Modal, Button, Form, Accordion, Card } from "react-bootstrap";

const StudentLogbook = () => {
  const [logbookData, setLogbookData] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [filters, setFilters] = useState({ unit: "", status: "" });
  const [activeKeys, setActiveKeys] = useState([]);

  // ✅ Fetch NVQ logbook JSON
  useEffect(() => {
    fetch("/Nvq_2357_13.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.performance_units)) {
          setLogbookData(data.performance_units);
        }
      })
      .catch((err) => console.error("Failed to load logbook JSON", err));
  }, []);

  // ✅ Fetch logged-in student portfolios
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "";
    fetch(`${API_URL}/api/portfolios/user-portfolios`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPortfolios(data);
      })
      .catch((err) => console.error("Failed to load student portfolios", err));
  }, []);

  // ✅ Filter portfolios per AC
  const getEvidenceForCriteria = (unit, lo, acNumber) => {
    return portfolios.filter(
      (p) =>
        String(p.unit?.number) === String(unit.unit) &&
        String(p.learningOutcome?.number) === String(lo.LO_number) &&
        String(p.criteria?.number) === String(acNumber) &&
        (!filters.status || p.status === filters.status)
    );
  };

  // ✅ Expand / Collapse
  const handleExpandAll = () => {
    setActiveKeys(logbookData.map((_, idx) => String(idx)));
  };
  const handleCollapseAll = () => setActiveKeys([]);

  return (
    <Layout>
      <div className="logbook-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="fw-bold">My NVQ Logbook</h1>
          <div>
            <Button size="sm" variant="outline-primary" className="me-2" onClick={handleExpandAll}>
              Expand All
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={handleCollapseAll}>
              Collapse All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters d-flex gap-3 mb-4">
          <Form.Select
            value={filters.unit}
            onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
          >
            <option value="">All Units</option>
            {logbookData.map((u) => (
              <option key={u.unit} value={u.unit}>
                {u.unit}: {u.title}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="To Be Reviewed">To Be Reviewed</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Done">Done</option>
          </Form.Select>
        </div>

        {/* Accordion for Units */}
        <Accordion activeKey={activeKeys}>
          {logbookData
            .filter((unit) => (filters.unit ? unit.unit === filters.unit : true))
            .map((unit, uIdx) => (
              <Accordion.Item eventKey={String(uIdx)} key={uIdx} className="mb-3">
                <Accordion.Header>
                  <span className="fw-semibold">
                    Unit {unit.unit}: {unit.title}
                  </span>
                </Accordion.Header>
                <Accordion.Body>
                  {unit.learning_outcomes.map((lo, lIdx) => (
                    <Card key={lIdx} className="mb-4 shadow-sm border-0">
                      <Card.Body>
                        <h5 className="text-primary mb-3">
                          Learning Outcome {lo.LO_number}: {lo.description}
                        </h5>
                        <table className="table table-sm align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Evidence</th>
                              <th>Summary</th>
                              <th>Method</th>
                              <th>Assessment Criteria</th>
                              <th>Range</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lo.assessment_criteria.map((criteria, idx) => {
                              const evidenceList = getEvidenceForCriteria(unit, lo, criteria.AC_number);
                              return (
                                <tr key={idx}>
                                  <td>
                                    {evidenceList.length > 0 ? (
                                      evidenceList.map((p) => (
                                        <Button
                                          key={p._id}
                                          variant="link"
                                          size="sm"
                                          className="p-0 text-decoration-underline"
                                          onClick={() => setSelectedPortfolio(p)}
                                        >
                                          {p.title || `Portfolio ${p.criteria?.number}`}
                                        </Button>
                                      ))
                                    ) : (
                                      <em className="text-muted">No evidence yet</em>
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
                      </Card.Body>
                    </Card>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
        </Accordion>

        {/* Modal Preview */}
        {selectedPortfolio && (
          <Modal show={true} onHide={() => setSelectedPortfolio(null)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedPortfolio.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <strong>Unit:</strong> {selectedPortfolio.unit?.number} - {selectedPortfolio.unit?.title}
              </p>
              <p>
                <strong>Learning Outcome:</strong> {selectedPortfolio.learningOutcome?.number} -{" "}
                {selectedPortfolio.learningOutcome?.description}
              </p>
              <p>
                <strong>Criteria:</strong> {selectedPortfolio.criteria?.number} -{" "}
                {selectedPortfolio.criteria?.description}
              </p>
              <p>
                <strong>Statement:</strong> {selectedPortfolio.statement}
              </p>
              <p>
                <strong>Method:</strong> {selectedPortfolio.method}
              </p>

              {selectedPortfolio.images?.length > 0 && (
                <div className="image-gallery d-flex gap-2 flex-wrap">
                  {selectedPortfolio.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Evidence"
                      style={{ width: "120px", borderRadius: "8px" }}
                    />
                  ))}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedPortfolio(null)}>
                Close
              </Button>
              <Button variant="primary" href={`/portfolio/view/${selectedPortfolio._id}`}>
                Open Full Portfolio
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default StudentLogbook;
