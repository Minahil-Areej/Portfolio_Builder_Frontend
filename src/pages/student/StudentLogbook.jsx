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


// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout";
// import "./StudentLogbook.css";
// import { Modal, Button, Form, Accordion, Card } from "react-bootstrap";

// const StudentLogbook = () => {
//   const [logbookData, setLogbookData] = useState([]);
//   const [portfolios, setPortfolios] = useState([]);
//   const [selectedPortfolio, setSelectedPortfolio] = useState(null);
//   const [filters, setFilters] = useState({ unit: "", status: "" });
//   const [activeKeys, setActiveKeys] = useState([]);

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

//   // ✅ Expand / Collapse
//   const handleExpandAll = () => {
//     setActiveKeys(logbookData.map((_, idx) => String(idx)));
//   };
//   const handleCollapseAll = () => setActiveKeys([]);

//   return (
//     <Layout>
//       <div className="logbook-container">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h1 className="fw-bold">My NVQ Logbook</h1>
//           <div>
//             <Button size="sm" variant="outline-primary" className="me-2" onClick={handleExpandAll}>
//               Expand All
//             </Button>
//             <Button size="sm" variant="outline-secondary" onClick={handleCollapseAll}>
//               Collapse All
//             </Button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="filters d-flex gap-3 mb-4">
//           <Form.Select
//             value={filters.unit}
//             onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
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
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//           >
//             <option value="">All Status</option>
//             <option value="Draft">Draft</option>
//             <option value="To Be Reviewed">To Be Reviewed</option>
//             <option value="Reviewed">Reviewed</option>
//             <option value="Done">Done</option>
//           </Form.Select>
//         </div>

//         {/* Accordion for Units */}
//         <Accordion activeKey={activeKeys}>
//           {logbookData
//             .filter((unit) => (filters.unit ? unit.unit === filters.unit : true))
//             .map((unit, uIdx) => (
//               <Accordion.Item eventKey={String(uIdx)} key={uIdx} className="mb-3">
//                 <Accordion.Header>
//                   <span className="fw-semibold">
//                     Unit {unit.unit}: {unit.title}
//                   </span>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   {unit.learning_outcomes.map((lo, lIdx) => (
//                     <Card key={lIdx} className="mb-4 shadow-sm border-0">
//                       <Card.Body>
//                         <h5 className="text-primary mb-3">
//                           Learning Outcome {lo.LO_number}: {lo.description}
//                         </h5>
//                         <table className="table table-sm align-middle">
//                           <thead className="table-light">
//                             <tr>
//                               <th>Evidence</th>
//                               <th>Summary</th>
//                               <th>Method</th>
//                               <th>Assessment Criteria</th>
//                               <th>Range</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {lo.assessment_criteria.map((criteria, idx) => {
//                               const evidenceList = getEvidenceForCriteria(unit, lo, criteria.AC_number);
//                               return (
//                                 <tr key={idx}>
//                                   <td>
//                                     {evidenceList.length > 0 ? (
//                                       evidenceList.map((p) => (
//                                         <Button
//                                           key={p._id}
//                                           variant="link"
//                                           size="sm"
//                                           className="p-0 text-decoration-underline"
//                                           onClick={() => setSelectedPortfolio(p)}
//                                         >
//                                           {p.title || `Portfolio ${p.criteria?.number}`}
//                                         </Button>
//                                       ))
//                                     ) : (
//                                       <em className="text-muted">No evidence yet</em>
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
//                       </Card.Body>
//                     </Card>
//                   ))}
//                 </Accordion.Body>
//               </Accordion.Item>
//             ))}
//         </Accordion>

//         {/* Modal Preview */}
//         {selectedPortfolio && (
//           <Modal show={true} onHide={() => setSelectedPortfolio(null)} size="lg">
//             <Modal.Header closeButton>
//               <Modal.Title>{selectedPortfolio.title}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <p>
//                 <strong>Unit:</strong> {selectedPortfolio.unit?.number} - {selectedPortfolio.unit?.title}
//               </p>
//               <p>
//                 <strong>Learning Outcome:</strong> {selectedPortfolio.learningOutcome?.number} -{" "}
//                 {selectedPortfolio.learningOutcome?.description}
//               </p>
//               <p>
//                 <strong>Criteria:</strong> {selectedPortfolio.criteria?.number} -{" "}
//                 {selectedPortfolio.criteria?.description}
//               </p>
//               <p>
//                 <strong>Statement:</strong> {selectedPortfolio.statement}
//               </p>
//               <p>
//                 <strong>Method:</strong> {selectedPortfolio.method}
//               </p>

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
//               <Button variant="secondary" onClick={() => setSelectedPortfolio(null)}>
//                 Close
//               </Button>
//               <Button variant="primary" href={`/portfolio/view/${selectedPortfolio._id}`}>
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







// // with claude try 1
// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout";
// import { 
//     Container, Row, Col, Card, Badge, Button, 
//     Form, ProgressBar, Spinner, InputGroup 
// } from "react-bootstrap";
// import { 
//     BsSearch, BsBook, BsCheckCircle, BsClock, 
//     BsFileText, BsBoxArrowUpRight, BsChevronDown, BsChevronUp 
// } from "react-icons/bs";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const StudentLogbook = () => {
//     const [logbookData, setLogbookData] = useState([]);
//     const [portfolios, setPortfolios] = useState([]);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [expandedUnits, setExpandedUnits] = useState({});
//     const [filterStatus, setFilterStatus] = useState("all");

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

//     useEffect(() => {
//         fetch(`${API_URL}/api/portfolios/user-portfolios`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
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
//             .catch((err) => console.error("Failed to load student portfolios", err))
//             .finally(() => setLoading(false));
//     }, []);

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         fetch(`${API_URL}/api/users/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//         })
//             .then((res) => (res.ok ? res.json() : Promise.reject(res)))
//             .then((u) => setUser(u))
//             .catch((err) => console.error("Failed to fetch user:", err));
//     }, []);

//     const getEvidenceForCriteria = (unit, lo, acNumber) => {
//         return portfolios.filter(
//             (p) =>
//                 String(p.unit?.number) === String(unit.unit) &&
//                 String(p.learningOutcome?.number) === String(lo.LO_number) &&
//                 String(p.criteria?.number) === String(acNumber)
//         );
//     };

//     const getUnitProgress = (unit) => {
//         const totalCriteria = unit.learning_outcomes.reduce(
//             (sum, lo) => sum + lo.assessment_criteria.length, 0
//         );
//         const completedCriteria = unit.learning_outcomes.reduce((sum, lo) => {
//             return sum + lo.assessment_criteria.filter(ac => 
//                 getEvidenceForCriteria(unit, lo, ac.AC_number).length > 0
//             ).length;
//         }, 0);
//         return { total: totalCriteria, completed: completedCriteria };
//     };

//     const toggleUnit = (unitNumber) => {
//         setExpandedUnits(prev => ({
//             ...prev,
//             [unitNumber]: !prev[unitNumber]
//         }));
//     };

//     const filteredData = logbookData.filter(unit => {
//         const matchesSearch = unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                             unit.unit.toString().includes(searchTerm);
        
//         if (filterStatus === "all") return matchesSearch;
        
//         const progress = getUnitProgress(unit);
//         if (filterStatus === "completed") return matchesSearch && progress.completed === progress.total;
//         if (filterStatus === "incomplete") return matchesSearch && progress.completed < progress.total;
        
//         return matchesSearch;
//     });

//     if (loading) {
//         return (
//             <Layout user={user}>
//                 <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
//                     <div className="text-center">
//                         <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
//                         <p className="mt-3 text-muted">Loading your logbook...</p>
//                     </div>
//                 </Container>
//             </Layout>
//         );
//     }

//     return (
//         <Layout user={user}>
//             <div style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)', minHeight: '100vh', paddingBottom: '2rem' }}>
//                 <div className="bg-white border-bottom shadow-sm">
//                     <Container className="py-4">
//                         <div className="d-flex align-items-center mb-2" style={{ gap: '1rem' }}>
//                             <BsBook size={32} className="text-primary" />
//                             <h1 className="mb-0 fw-bold">My NVQ Logbook</h1>
//                         </div>
//                         <p className="text-muted mb-0">Track your progress and manage evidence portfolios</p>
//                     </Container>
//                 </div>

//                 <Container className="py-4">
//                     <Row className="mb-4">
//                         <Col md={4} className="mb-3">
//                             <Card className="shadow-sm h-100">
//                                 <Card.Body>
//                                     <div className="d-flex justify-content-between align-items-center">
//                                         <div>
//                                             <p className="text-muted small mb-1">Total Units</p>
//                                             <h2 className="mb-0 fw-bold">{logbookData.length}</h2>
//                                         </div>
//                                         <div className="rounded p-3" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
//                                             <BsFileText size={28} className="text-primary" />
//                                         </div>
//                                     </div>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
                        
//                         <Col md={4} className="mb-3">
//                             <Card className="shadow-sm h-100">
//                                 <Card.Body>
//                                     <div className="d-flex justify-content-between align-items-center">
//                                         <div>
//                                             <p className="text-muted small mb-1">Evidence Submitted</p>
//                                             <h2 className="mb-0 fw-bold">{portfolios.length}</h2>
//                                         </div>
//                                         <div className="rounded p-3" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
//                                             <BsCheckCircle size={28} className="text-success" />
//                                         </div>
//                                     </div>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
                        
//                         <Col md={4} className="mb-3">
//                             <Card className="shadow-sm h-100">
//                                 <Card.Body>
//                                     <div className="d-flex justify-content-between align-items-center">
//                                         <div>
//                                             <p className="text-muted small mb-1">Overall Progress</p>
//                                             <h2 className="mb-0 fw-bold">
//                                                 {logbookData.length > 0 ? Math.round(
//                                                     (logbookData.reduce((sum, unit) => {
//                                                         const prog = getUnitProgress(unit);
//                                                         return sum + (prog.completed / prog.total);
//                                                     }, 0) / logbookData.length) * 100
//                                                 ) : 0}%
//                                             </h2>
//                                         </div>
//                                         <div className="rounded p-3" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
//                                             <BsClock size={28} className="text-warning" />
//                                         </div>
//                                     </div>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>

//                     <Card className="shadow-sm mb-4">
//                         <Card.Body>
//                             <Row>
//                                 <Col md={8} className="mb-3 mb-md-0">
//                                     <InputGroup>
//                                         <InputGroup.Text>
//                                             <BsSearch size={18} />
//                                         </InputGroup.Text>
//                                         <Form.Control
//                                             type="text"
//                                             placeholder="Search units..."
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                         />
//                                     </InputGroup>
//                                 </Col>
//                                 <Col md={4}>
//                                     <div className="d-flex" style={{ gap: '0.5rem' }}>
//                                         <Button 
//                                             variant={filterStatus === "all" ? "primary" : "outline-secondary"}
//                                             onClick={() => setFilterStatus("all")}
//                                             style={{ flex: 1 }}
//                                             size="sm"
//                                         >
//                                             All
//                                         </Button>
//                                         <Button 
//                                             variant={filterStatus === "completed" ? "success" : "outline-secondary"}
//                                             onClick={() => setFilterStatus("completed")}
//                                             style={{ flex: 1 }}
//                                             size="sm"
//                                         >
//                                             Complete
//                                         </Button>
//                                         <Button 
//                                             variant={filterStatus === "incomplete" ? "warning" : "outline-secondary"}
//                                             onClick={() => setFilterStatus("incomplete")}
//                                             style={{ flex: 1 }}
//                                             size="sm"
//                                         >
//                                             Progress
//                                         </Button>
//                                     </div>
//                                 </Col>
//                             </Row>
//                         </Card.Body>
//                     </Card>

//                     {filteredData.map((unit) => {
//                         const progress = getUnitProgress(unit);
//                         const isExpanded = expandedUnits[unit.unit];
//                         const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
                        
//                         return (
//                             <Card key={unit.unit} className="shadow-sm mb-4">
//                                 <Card.Body>
//                                     <div 
//                                         onClick={() => toggleUnit(unit.unit)}
//                                         style={{ cursor: 'pointer' }}
//                                     >
//                                         <div className="d-flex justify-content-between align-items-start">
//                                             <div style={{ flex: 1 }}>
//                                                 <div className="d-flex align-items-center mb-2" style={{ gap: '0.5rem' }}>
//                                                     <Badge bg="primary" className="px-3 py-2">
//                                                         Unit {unit.unit}
//                                                     </Badge>
//                                                     {progress.completed === progress.total && progress.total > 0 && (
//                                                         <Badge bg="success" className="px-3 py-2">
//                                                             <BsCheckCircle size={14} className="me-1" />
//                                                             Complete
//                                                         </Badge>
//                                                     )}
//                                                 </div>
//                                                 <h4 className="fw-bold mb-3">{unit.title}</h4>
                                                
//                                                 <div className="mb-2">
//                                                     <div className="d-flex justify-content-between small text-muted mb-1">
//                                                         <span>Progress</span>
//                                                         <span className="fw-semibold">
//                                                             {progress.completed} / {progress.total} criteria
//                                                         </span>
//                                                     </div>
//                                                     <ProgressBar 
//                                                         now={progressPercent} 
//                                                         variant="primary"
//                                                         style={{ height: '8px' }}
//                                                     />
//                                                 </div>
//                                             </div>
                                            
//                                             <Button 
//                                                 variant="light" 
//                                                 size="sm" 
//                                                 className="ms-3"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     toggleUnit(unit.unit);
//                                                 }}
//                                             >
//                                                 {isExpanded ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
//                                             </Button>
//                                         </div>
//                                     </div>

//                                     {isExpanded && (
//                                         <div className="mt-4 pt-4 border-top">
//                                             {unit.learning_outcomes.map((lo) => (
//                                                 <div key={lo.LO_number} className="mb-4">
//                                                     <h5 className="fw-semibold mb-3">
//                                                         Learning Outcome {lo.LO_number}: {lo.description}
//                                                     </h5>
                                                    
//                                                     {lo.assessment_criteria.map((criteria) => {
//                                                         const evidenceList = getEvidenceForCriteria(unit, lo, criteria.AC_number);
//                                                         const hasEvidence = evidenceList.length > 0;
                                                        
//                                                         return (
//                                                             <Card 
//                                                                 key={criteria.AC_number}
//                                                                 className="mb-3"
//                                                                 style={{
//                                                                     borderWidth: '2px',
//                                                                     borderColor: hasEvidence ? '#198754' : '#6c757d',
//                                                                     backgroundColor: hasEvidence ? 'rgba(25, 135, 84, 0.1)' : '#f8f9fa'
//                                                                 }}
//                                                             >
//                                                                 <Card.Body>
//                                                                     <div className="d-flex" style={{ gap: '1rem' }}>
//                                                                         <div 
//                                                                             className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
//                                                                             style={{ 
//                                                                                 width: '24px', 
//                                                                                 height: '24px',
//                                                                                 backgroundColor: hasEvidence ? '#198754' : '#6c757d'
//                                                                             }}
//                                                                         >
//                                                                             {hasEvidence && (
//                                                                                 <BsCheckCircle size={16} style={{ color: 'white' }} />
//                                                                             )}
//                                                                         </div>
                                                                        
//                                                                         <div style={{ flex: 1 }}>
//                                                                             <p className="fw-semibold small mb-2">
//                                                                                 AC {criteria.AC_number}: {criteria.description}
//                                                                             </p>
                                                                            
//                                                                             {hasEvidence ? (
//                                                                                 <div>
//                                                                                     {evidenceList.map((p) => (
//                                                                                         <div key={p._id} className="mb-2">
//                                                                                            <a 
//                                                                                                 href={`/portfolio/view/${p._id}`}
//                                                                                                 target="_blank"
//                                                                                                 rel="noopener noreferrer"
//                                                                                                 className="text-primary text-decoration-none fw-medium small d-flex align-items-center"
//                                                                                                 style={{ gap: '0.5rem' }}
//                                                                                             >
//                                                                                                 <BsFileText size={14} />
//                                                                                                 {p.title || `Portfolio ${p.criteria?.number}`}
//                                                                                                 <BsBoxArrowUpRight size={12} />
//                                                                                             </a>
//                                                                                         </div>
//                                                                                     ))}
//                                                                                     {evidenceList[0]?.statement && (
//                                                                                         <p className="small text-muted mb-0 mt-2">
//                                                                                             <span className="fw-semibold">Summary: </span>
//                                                                                             {evidenceList[0].statement}
//                                                                                         </p>
//                                                                                     )}
//                                                                                 </div>
//                                                                             ) : (
//                                                                                 <p className="small text-muted fst-italic mb-0">
//                                                                                     No evidence submitted yet
//                                                                                 </p>
//                                                                             )}
//                                                                         </div>
//                                                                     </div>
//                                                                 </Card.Body>
//                                                             </Card>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </Card.Body>
//                             </Card>
//                         );
//                     })}

//                     {filteredData.length === 0 && (
//                         <Card className="shadow-sm text-center py-5">
//                             <Card.Body>
//                                 <BsSearch size={64} className="text-muted mb-3" />
//                                 <h4 className="fw-semibold">No units found</h4>
//                                 <p className="text-muted">Try adjusting your search or filter criteria</p>
//                             </Card.Body>
//                         </Card>
//                     )}
//                 </Container>
//             </div>
//         </Layout>
//     );
// };

// export default StudentLogbook;




//claude try 2 perfect

// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout";
// import { 
//     Container, Row, Col, Card, Badge, Button, 
//     Form, ProgressBar, Spinner, InputGroup 
// } from "react-bootstrap";
// import { 
//     BsSearch, BsBook, BsCheckCircle, BsClock, 
//     BsFileText, BsBoxArrowUpRight, BsChevronDown, BsChevronUp 
// } from "react-icons/bs";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const StudentLogbook = () => {
//     const [logbookData, setLogbookData] = useState([]);
//     const [portfolios, setPortfolios] = useState([]);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [expandedUnits, setExpandedUnits] = useState({});
//     const [filterStatus, setFilterStatus] = useState("all");

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

//     useEffect(() => {
//         fetch(`${API_URL}/api/portfolios/user-portfolios`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
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
//             .catch((err) => console.error("Failed to load student portfolios", err))
//             .finally(() => setLoading(false));
//     }, []);

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         fetch(`${API_URL}/api/users/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//         })
//             .then((res) => (res.ok ? res.json() : Promise.reject(res)))
//             .then((u) => setUser(u))
//             .catch((err) => console.error("Failed to fetch user:", err));
//     }, []);

//     const getEvidenceForCriteria = (unit, lo, acNumber) => {
//         return portfolios.filter(
//             (p) =>
//                 String(p.unit?.number) === String(unit.unit) &&
//                 String(p.learningOutcome?.number) === String(lo.LO_number) &&
//                 String(p.criteria?.number) === String(acNumber)
//         );
//     };

//     const getUnitProgress = (unit) => {
//         const totalCriteria = unit.learning_outcomes.reduce(
//             (sum, lo) => sum + lo.assessment_criteria.length, 0
//         );
//         const completedCriteria = unit.learning_outcomes.reduce((sum, lo) => {
//             return sum + lo.assessment_criteria.filter(ac => 
//                 getEvidenceForCriteria(unit, lo, ac.AC_number).length > 0
//             ).length;
//         }, 0);
//         return { total: totalCriteria, completed: completedCriteria };
//     };

//     const toggleUnit = (unitNumber) => {
//         setExpandedUnits(prev => ({
//             ...prev,
//             [unitNumber]: !prev[unitNumber]
//         }));
//     };

//     const filteredData = logbookData.filter(unit => {
//         const matchesSearch = unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                             unit.unit.toString().includes(searchTerm);
        
//         if (filterStatus === "all") return matchesSearch;
        
//         const progress = getUnitProgress(unit);
//         if (filterStatus === "completed") return matchesSearch && progress.completed === progress.total;
//         if (filterStatus === "incomplete") return matchesSearch && progress.completed < progress.total;
        
//         return matchesSearch;
//     });

//     if (loading) {
//         return (
//             <Layout user={user}>
//                 <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
//                     <div className="text-center">
//                         <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
//                         <p className="mt-3 text-muted">Loading your logbook...</p>
//                     </div>
//                 </Container>
//             </Layout>
//         );
//     }

//     return (
//         <Layout user={user}>
//             <div style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)', minHeight: '100vh', paddingBottom: '2rem' }}>
//                 <div className="bg-white border-bottom shadow-sm">
//                     <Container className="py-4">
//                         <div className="d-flex align-items-center mb-2" style={{ gap: '1rem' }}>
//                             <BsBook size={32} className="text-primary" />
//                             <h1 className="mb-0 fw-bold">My NVQ Logbook</h1>
//                         </div>
//                         <p className="text-muted mb-0">Track your progress and manage evidence portfolios</p>
//                     </Container>
//                 </div>

//                 <Container className="py-4">
//                     <Row className="mb-4">
//                         <Col md={4} className="mb-3">
//                             <Card className="shadow-sm h-100">
//                                 <Card.Body>
//                                     <div className="d-flex justify-content-between align-items-center">
//                                         <div>
//                                             <p className="text-muted small mb-1">Total Units</p>
//                                             <h2 className="mb-0 fw-bold">{logbookData.length}</h2>
//                                         </div>
//                                         <div className="rounded p-3" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
//                                             <BsFileText size={28} className="text-primary" />
//                                         </div>
//                                     </div>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
                        
//                         <Col md={4} className="mb-3">
//                             <Card className="shadow-sm h-100">
//                                 <Card.Body>
//                                     <div className="d-flex justify-content-between align-items-center">
//                                         <div>
//                                             <p className="text-muted small mb-1">Evidence Submitted</p>
//                                             <h2 className="mb-0 fw-bold">{portfolios.length}</h2>
//                                         </div>
//                                         <div className="rounded p-3" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
//                                             <BsCheckCircle size={28} className="text-success" />
//                                         </div>
//                                     </div>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
                        
//                         <Col md={4} className="mb-3">
//                             <Card className="shadow-sm h-100">
//                                 <Card.Body>
//                                     <div className="d-flex justify-content-between align-items-center">
//                                         <div>
//                                             <p className="text-muted small mb-1">Overall Progress</p>
//                                             <h2 className="mb-0 fw-bold">
//                                                 {logbookData.length > 0 ? Math.round(
//                                                     (logbookData.reduce((sum, unit) => {
//                                                         const prog = getUnitProgress(unit);
//                                                         return sum + (prog.completed / prog.total);
//                                                     }, 0) / logbookData.length) * 100
//                                                 ) : 0}%
//                                             </h2>
//                                         </div>
//                                         <div className="rounded p-3" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
//                                             <BsClock size={28} className="text-warning" />
//                                         </div>
//                                     </div>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>

//                     <Card className="shadow-sm mb-4">
//                         <Card.Body>
//                             <Row>
//                                 <Col md={8} className="mb-3 mb-md-0">
//                                     <InputGroup>
//                                         <InputGroup.Text>
//                                             <BsSearch size={18} />
//                                         </InputGroup.Text>
//                                         <Form.Control
//                                             type="text"
//                                             placeholder="Search units..."
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                         />
//                                     </InputGroup>
//                                 </Col>
//                                 <Col md={4}>
//                                     <div className="d-flex" style={{ gap: '0.5rem' }}>
//                                         <Button 
//                                             variant={filterStatus === "all" ? "primary" : "outline-secondary"}
//                                             onClick={() => setFilterStatus("all")}
//                                             style={{ flex: 1 }}
//                                             size="sm"
//                                         >
//                                             All
//                                         </Button>
//                                         <Button 
//                                             variant={filterStatus === "completed" ? "success" : "outline-secondary"}
//                                             onClick={() => setFilterStatus("completed")}
//                                             style={{ flex: 1 }}
//                                             size="sm"
//                                         >
//                                             Complete
//                                         </Button>
//                                         <Button 
//                                             variant={filterStatus === "incomplete" ? "warning" : "outline-secondary"}
//                                             onClick={() => setFilterStatus("incomplete")}
//                                             style={{ flex: 1 }}
//                                             size="sm"
//                                         >
//                                             Progress
//                                         </Button>
//                                     </div>
//                                 </Col>
//                             </Row>
//                         </Card.Body>
//                     </Card>

//                     {filteredData.map((unit) => {
//                         const progress = getUnitProgress(unit);
//                         const isExpanded = expandedUnits[unit.unit];
//                         const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
                        
//                         return (
//                             <Card key={unit.unit} className="shadow-sm mb-4">
//                                 <Card.Body>
//                                     <div 
//                                         onClick={() => toggleUnit(unit.unit)}
//                                         style={{ cursor: 'pointer' }}
//                                     >
//                                         <div className="d-flex justify-content-between align-items-start">
//                                             <div style={{ flex: 1 }}>
//                                                 <div className="d-flex align-items-center mb-2" style={{ gap: '0.5rem' }}>
//                                                     <Badge bg="primary" className="px-3 py-2">
//                                                         Unit {unit.unit}
//                                                     </Badge>
//                                                     {progress.completed === progress.total && progress.total > 0 && (
//                                                         <Badge bg="success" className="px-3 py-2">
//                                                             <BsCheckCircle size={14} className="me-1" />
//                                                             Complete
//                                                         </Badge>
//                                                     )}
//                                                 </div>
//                                                 <h4 className="fw-bold mb-3">{unit.title}</h4>
                                                
//                                                 <div className="mb-2">
//                                                     <div className="d-flex justify-content-between small text-muted mb-1">
//                                                         <span>Progress</span>
//                                                         <span className="fw-semibold">
//                                                             {progress.completed} / {progress.total} criteria
//                                                         </span>
//                                                     </div>
//                                                     <ProgressBar 
//                                                         now={progressPercent} 
//                                                         variant="primary"
//                                                         style={{ height: '8px' }}
//                                                     />
//                                                 </div>
//                                             </div>
                                            
//                                             <Button 
//                                                 variant="light" 
//                                                 size="sm" 
//                                                 className="ms-3"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     toggleUnit(unit.unit);
//                                                 }}
//                                             >
//                                                 {isExpanded ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
//                                             </Button>
//                                         </div>
//                                     </div>

//                                     {isExpanded && (
//                                         <div className="mt-4 pt-4 border-top">
//                                             {unit.learning_outcomes.map((lo) => (
//                                                 <div key={lo.LO_number} className="mb-4">
//                                                     <h5 className="fw-semibold mb-3">
//                                                         Learning Outcome {lo.LO_number}: {lo.description}
//                                                     </h5>
                                                    
//                                                     {lo.assessment_criteria.map((criteria) => {
//                                                         const evidenceList = getEvidenceForCriteria(unit, lo, criteria.AC_number);
//                                                         const hasEvidence = evidenceList.length > 0;
                                                        
//                                                         return (
//                                                             <Card 
//                                                                 key={criteria.AC_number}
//                                                                 className="mb-3"
//                                                                 style={{
//                                                                     borderWidth: '2px',
//                                                                     borderColor: hasEvidence ? '#198754' : '#6c757d',
//                                                                     backgroundColor: hasEvidence ? 'rgba(25, 135, 84, 0.1)' : '#f8f9fa'
//                                                                 }}
//                                                             >
//                                                                 <Card.Body>
//                                                                     <div className="d-flex" style={{ gap: '1rem' }}>
//                                                                         <div 
//                                                                             className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
//                                                                             style={{ 
//                                                                                 width: '24px', 
//                                                                                 height: '24px',
//                                                                                 backgroundColor: hasEvidence ? '#198754' : '#6c757d'
//                                                                             }}
//                                                                         >
//                                                                             {hasEvidence && (
//                                                                                 <BsCheckCircle size={16} style={{ color: 'white' }} />
//                                                                             )}
//                                                                         </div>
                                                                        
//                                                                         <div style={{ flex: 1 }}>
//                                                                             <p className="fw-semibold small mb-2">
//                                                                                 AC {criteria.AC_number}: {criteria.description}
//                                                                             </p>
                                                                            
//                                                                             {hasEvidence ? (
//                                                                                 <div className="d-flex flex-column" style={{ gap: '1rem' }}>
//                                                                                     {evidenceList.map((p) => (
//                                                                                         <div key={p._id} className="border rounded p-3" style={{ backgroundColor: 'white' }}>
//                                                                                             <a 
//                                                                                                 href={`/portfolio/view/${p._id}`}
//                                                                                                 target="_blank"
//                                                                                                 rel="noopener noreferrer"
//                                                                                                 className="text-primary text-decoration-none fw-medium small d-flex align-items-center mb-2"
//                                                                                                 style={{ gap: '0.5rem' }}
//                                                                                             >
//                                                                                                 <BsFileText size={14} />
//                                                                                                 {p.title || `Portfolio ${p.criteria?.number}`}
//                                                                                                 <BsBoxArrowUpRight size={12} />
//                                                                                             </a>
                                                                                            
//                                                                                             {p.method && (
//                                                                                                 <div className="mb-2">
//                                                                                                     <span className="fw-semibold text-muted small">Method: </span>
//                                                                                                     <Badge bg="info" className="ms-1">{p.method}</Badge>
//                                                                                                 </div>
//                                                                                             )}
                                                                                            
//                                                                                             {p.taskDescription && (
//                                                                                                 <p className="small text-muted mb-0">
//                                                                                                     <span className="fw-semibold">Summary: </span>
//                                                                                                     {p.taskDescription}
//                                                                                                 </p>
//                                                                                             )}
//                                                                                         </div>
//                                                                                     ))}
//                                                                                 </div>
//                                                                             ) : (
//                                                                                 <p className="small text-muted fst-italic mb-0">
//                                                                                     No evidence submitted yet
//                                                                                 </p>
//                                                                             )}
//                                                                         </div>
//                                                                     </div>
//                                                                 </Card.Body>
//                                                             </Card>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </Card.Body>
//                             </Card>
//                         );
//                     })}

//                     {filteredData.length === 0 && (
//                         <Card className="shadow-sm text-center py-5">
//                             <Card.Body>
//                                 <BsSearch size={64} className="text-muted mb-3" />
//                                 <h4 className="fw-semibold">No units found</h4>
//                                 <p className="text-muted">Try adjusting your search or filter criteria</p>
//                             </Card.Body>
//                         </Card>
//                     )}
//                 </Container>
//             </div>
//         </Layout>
//     );
// };

// export default StudentLogbook;





import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { 
    Container, Row, Col, Card, Badge, Button, 
    Form, ProgressBar, Spinner, InputGroup 
} from "react-bootstrap";
import { 
    BsSearch, BsBook, BsCheckCircle, BsClock, 
    BsFileText, BsBoxArrowUpRight, BsChevronDown, BsChevronUp, BsChevronRight 
} from "react-icons/bs";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StudentLogbook = () => {
    const [logbookData, setLogbookData] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedUnits, setExpandedUnits] = useState({});
    const [expandedOutcomes, setExpandedOutcomes] = useState({}); // NEW: track expanded learning outcomes
    const [filterStatus, setFilterStatus] = useState("all");

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

    useEffect(() => {
        fetch(`${API_URL}/api/portfolios/user-portfolios`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            .catch((err) => console.error("Failed to load student portfolios", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((u) => setUser(u))
            .catch((err) => console.error("Failed to fetch user:", err));
    }, []);

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

    if (loading) {
        return (
            <Layout user={user}>
                <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                        <p className="mt-3 text-muted">Loading your logbook...</p>
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
                            <h1 className="mb-0 fw-bold">My NVQ Logbook</h1>
                        </div>
                        <p className="text-muted mb-0">Track your progress and manage evidence portfolios</p>
                    </Container>
                </div>

                <Container className="py-4">
                    <Row className="mb-4">
                        <Col md={4} className="mb-3">
                            <Card className="shadow-sm h-100">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-muted small mb-1">Total Units</p>
                                            <h2 className="mb-0 fw-bold">{logbookData.length}</h2>
                                        </div>
                                        <div className="rounded p-3" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
                                            <BsFileText size={28} className="text-primary" />
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
                                            <p className="text-muted small mb-1">Evidence Submitted</p>
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
                                                                                                                href={`/portfolio/view/${p._id}`}
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
                </Container>
            </div>
        </Layout>
    );
};

export default StudentLogbook;