// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Form, Button, Col, Row } from 'react-bootstrap';
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const EditPortfolio = () => {
//   const { id } = useParams();
//   const [portfolioData, setPortfolioData] = useState({
//     title: '',
//     unit: { number: '', title: '' }, // Updated to an object
//     learningOutcome: { number: '', description: '' }, // Updated to an object
//     criteria: { number: '', description: '' }, // Updated to an object
//     postcode: '',
//     // statement: '',
//     comments: '',
//     images: [], // Existing images
//     taskDescription: '', // New field
//     jobType: '',         // New field
//     reasonForTask: '',   // New field
//     objectiveOfJob: '',  // New field
//     method: '', // Add Method field to the state
//   });
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [qualificationUnitsData, setQualificationUnitsData] = useState([]);

//   useEffect(() => {
//     // Fetch portfolio data
//     // const fetchPortfolio = async () => {
//     //   try {
//     //     const { data } = await axios.get(`${API_URL}/api/portfolios/${id}`, {
//     //       headers: {
//     //         Authorization: `Bearer ${localStorage.getItem('token')}`,
//     //       },
//     //     });
//     //     setPortfolioData(data);
//     //   } catch (err) {
//     //     console.error('Error fetching portfolio', err);
//     //   }
//     // };
//     // Fetch portfolio data
//     const fetchPortfolio = async () => {
//       try {
//         const { data } = await axios.get(`${API_URL}/api/portfolios/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });

//         // 🔧 Normalize unit, LO, criteria to ensure they are always objects
//         setPortfolioData({
//           ...data,
//           unit: typeof data.unit === 'string'
//             ? JSON.parse(data.unit)
//             : (data.unit || { number: '', title: '' }),
//           learningOutcome: typeof data.learningOutcome === 'string'
//             ? JSON.parse(data.learningOutcome)
//             : (data.learningOutcome || { number: '', description: '' }),
//           criteria: typeof data.criteria === 'string'
//             ? JSON.parse(data.criteria)
//             : (data.criteria || { number: '', description: '' }),
//         });
//       } catch (err) {
//         console.error('Error fetching portfolio', err);
//       }
//     };

//     // Fetch qualification units data
//     const fetchQualificationUnits = async () => {
//       try {
//         const response = await fetch('/Nvq_2357_13.json');
//         const data = await response.json();
//         setQualificationUnitsData(data.performance_units);
//       } catch (error) {
//         console.error('Error loading JSON data:', error);
//       }
//     };

//     fetchPortfolio();
//     fetchQualificationUnits();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith('unit.') || name.startsWith('learningOutcome.') || name.startsWith('criteria.')) {
//       const [objectName, key] = name.split('.');
//       setPortfolioData({
//         ...portfolioData,
//         [objectName]: {
//           ...portfolioData[objectName],
//           [key]: value,
//         },
//       });
//     } else {
//       setPortfolioData({ ...portfolioData, [name]: value });
//     }
//   };

//   const handleFileChange = (e) => {
//     setSelectedFiles(e.target.files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('title', portfolioData.title);
//     formData.append('unit', JSON.stringify(portfolioData.unit)); // Send unit as an object
//     formData.append('learningOutcome', JSON.stringify(portfolioData.learningOutcome)); // Send learningOutcome as an object
//     formData.append('criteria', JSON.stringify(portfolioData.criteria)); // Send criteria as an object
//     formData.append('postcode', portfolioData.postcode);
//     // formData.append('statement', portfolioData.statement);
//     formData.append('comments', portfolioData.comments);
//     formData.append('taskDescription', portfolioData.taskDescription); // Added to submission
//     formData.append('jobType', portfolioData.jobType);                 // Added to submission
//     formData.append('reasonForTask', portfolioData.reasonForTask);     // Added to submission
//     formData.append('objectiveOfJob', portfolioData.objectiveOfJob);   // Added to submission
//     formData.append('method', portfolioData.method);                   // Added to submission

//     // Pass existing images as a stringified array
//     formData.append('existingImages', JSON.stringify(portfolioData.images));

//     // Append new images
//     for (let i = 0; i < selectedFiles.length; i++) {
//       formData.append('images', selectedFiles[i]);
//     }

//     try {
//       await axios.put(`${API_URL}/api/portfolios/${id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       alert('Portfolio updated successfully');
//     } catch (err) {
//       console.error('Error updating portfolio', err);
//     }
//   };

//   // Get learning outcomes for the selected unit
//   const getLearningOutcomes = (unitNumber) => {
//     const selectedUnitData = qualificationUnitsData.find((u) => u.unit === unitNumber);
//     return selectedUnitData ? selectedUnitData.learning_outcomes : [];
//   };

//   // Get criteria for the selected learning outcome
//   const getCriteria = (unitNumber, learningOutcomeNumber) => {
//     const selectedUnitData = qualificationUnitsData.find((u) => u.unit === unitNumber);
//     const selectedLO = selectedUnitData?.learning_outcomes.find(
//       (lo) => lo.LO_number === parseInt(learningOutcomeNumber)
//     );
//     return selectedLO ? selectedLO.assessment_criteria : [];
//   };

//   return (
//     <Container fluid>
//       <h2>Edit Portfolio</h2>
//       <Form onSubmit={handleSubmit}>
//         <Form.Group className="mb-3" controlId="formTitle">
//           <Form.Label>Title</Form.Label>
//           <Form.Control
//             type="text"
//             name="title"
//             value={portfolioData.title}
//             onChange={handleChange}
//           />
//         </Form.Group>

//         <Row>
//           <Col>
//             <Form.Group className="mb-3" controlId="formUnit">
//               <Form.Label>Select Unit</Form.Label>
//               <Form.Select
//                 name="unit.number"
//                 value={portfolioData.unit.number}
//                 onChange={(e) => {
//                   const selectedUnit = qualificationUnitsData.find((u) => u.unit === e.target.value);
//                   setPortfolioData({
//                     ...portfolioData,
//                     unit: { number: selectedUnit.unit, title: selectedUnit.title },
//                     learningOutcome: { number: '', description: '' }, // Reset LO
//                     criteria: { number: '', description: '' }, // Reset Criteria
//                   });
//                 }}
//               >
//                 <option value="">Select a Unit</option>
//                 {qualificationUnitsData.map((unit) => (
//                   <option key={unit.unit} value={unit.unit}>
//                     {`Unit ${unit.unit} - ${unit.title}`}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group className="mb-3" controlId="formPostcode">
//               <Form.Label>Postcode</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="postcode"
//                 value={portfolioData.postcode}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row>
//           <Col>
//             <Form.Group className="mb-3" controlId="formLearningOutcome">
//               <Form.Label>Select Learning Outcome</Form.Label>
//               <Form.Select
//                 name="learningOutcome"
//                 value={portfolioData.learningOutcome?.LO_number || ''}
//                 onChange={(e) => {
//                   const selectedLO = portfolioData.unit.learning_outcomes.find(
//                     (lo) => lo.LO_number === Number(e.target.value)
//                   );
//                   setPortfolioData({
//                     ...portfolioData,
//                     learningOutcome: selectedLO,
//                     criteria: { AC_number: '', description: '' }, // reset criteria
//                   });
//                 }}
//               >
//                 <option value="">Select Learning Outcome</option>
//                 {portfolioData.unit?.learning_outcomes?.map((lo, idx) => (
//                   <option key={idx} value={lo.LO_number}>
//                     {lo.LO_number} - {lo.description}
//                   </option>
//                 ))}
//               </Form.Select>

//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group className="mb-3" controlId="formCriteria">
//               <Form.Label>Select Criteria</Form.Label>
//               <Form.Select
//                 name="criteria"
//                 value={portfolioData.criteria?.AC_number || ''}
//                 onChange={(e) => {
//                   const selectedAC = portfolioData.learningOutcome?.assessment_criteria?.find(
//                     (ac) => ac.AC_number === e.target.value
//                   );
//                   setPortfolioData({
//                     ...portfolioData,
//                     criteria: selectedAC || { AC_number: '', description: '' },
//                   });
//                 }}
//               >
//                 <option value="">Select Criteria</option>
//                 {portfolioData.learningOutcome?.assessment_criteria?.map((ac, idx) => (
//                   <option key={idx} value={ac.AC_number}>
//                     {ac.AC_number} - {ac.description}
//                   </option>
//                 ))}
//               </Form.Select>

//             </Form.Group>
//           </Col>
//         </Row>

//         {/* <Form.Group className="mb-3" controlId="formStatement">
//           <Form.Label>Statement</Form.Label>
//           <Form.Control
//             as="textarea"
//             name="statement"
//             rows={3}
//             value={portfolioData.statement}
//             onChange={handleChange}
//           />
//         </Form.Group> */}
//         <Form.Group className="mb-3" controlId="formMethod">
//           <Form.Label>Method</Form.Label>
//           <Form.Select
//             name="method"
//             value={portfolioData.method}
//             onChange={handleChange}
//           >
//             <option value="">Select Method</option>
//             <option value="Professional discussion">Professional discussion</option>
//             <option value="Witness testimony">Witness testimony</option>
//             <option value="Written questions">Written questions</option>
//             <option value="Work Product">Work Product</option>
//             <option value="Direct observation">Direct observation</option>
//             <option value="Oral questions">Oral questions</option>
//             <option value="APL / RPL">APL / RPL</option>
//           </Form.Select>
//         </Form.Group>
//         <Row>
//           <Col>
//             <Form.Group className="mb-3" controlId="formTaskDescription">
//               <Form.Label>Task Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="taskDescription"
//                 rows={2}
//                 value={portfolioData.taskDescription}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group className="mb-3" controlId="formJobType">
//               <Form.Label>Job Type</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="jobType"
//                 rows={2}
//                 value={portfolioData.jobType}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row>
//           <Col>
//             <Form.Group className="mb-3" controlId="formReasonForTask">
//               <Form.Label>Reason for Task</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="reasonForTask"
//                 rows={2}
//                 value={portfolioData.reasonForTask}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group className="mb-3" controlId="formObjectiveOfJob">
//               <Form.Label>Objective of Job</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="objectiveOfJob"
//                 rows={2}
//                 value={portfolioData.objectiveOfJob}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         <Form.Group className="mb-3" controlId="formComments">
//           <Form.Label>Comments</Form.Label>
//           <Form.Control
//             as="textarea"
//             name="comments"
//             rows={3}
//             value={portfolioData.comments}
//             onChange={handleChange}
//           />
//         </Form.Group>

//         {/* Display existing images */}
//         <Form.Group className="mb-3">
//           <Form.Label>Existing Images</Form.Label>
//           <div>
//             {portfolioData.images.map((image, index) => (
//               <img
//                 key={index}
//                 src={`${API_URL}/${image}`}
//                 alt="Portfolio"
//                 style={{ width: '100px', margin: '10px' }}
//               />
//             ))}
//           </div>
//         </Form.Group>

//         <Form.Group className="mb-3" controlId="formFile">
//           <Form.Label>Upload New Images</Form.Label>
//           <Form.Control type="file" multiple onChange={handleFileChange} />
//         </Form.Group>

//         <Button variant="primary" type="submit">
//           Update Portfolio
//         </Button>
//       </Form>
//     </Container>
//   );
// };

// export default EditPortfolio;

// //the RECENT PNE BEFORE CLAUDE
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Form, Button, Col, Row } from 'react-bootstrap';
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const EditPortfolio = () => {
//   const { id } = useParams();
//   const [portfolioData, setPortfolioData] = useState({
//     title: '',
//     unit: { number: '', title: '' }, // Updated to an object
//     learningOutcome: { number: '', description: '' }, // Updated to an object
//     criteria: { number: '', description: '' }, // Updated to an object
//     postcode: '',
//     // statement: '',
//     comments: '',
//     images: [], // Existing images
//     taskDescription: '', // New field
//     jobType: '',         // New field
//     reasonForTask: '',   // New field
//     objectiveOfJob: '',  // New field
//     method: '', // Add Method field to the state
//   });
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [qualificationUnitsData, setQualificationUnitsData] = useState([]);

//   useEffect(() => {
//     // Fetch portfolio data
//     const fetchPortfolio = async () => {
//       try {
//         const { data } = await axios.get(`${API_URL}/api/portfolios/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         setPortfolioData(data);
//       } catch (err) {
//         console.error('Error fetching portfolio', err);
//       }
//     };

//     // Fetch qualification units data
//     const fetchQualificationUnits = async () => {
//       try {
//         const response = await fetch('/Nvq_2357_13.json');
//         const data = await response.json();
//         setQualificationUnitsData(data.performance_units);
//       } catch (error) {
//         console.error('Error loading JSON data:', error);
//       }
//     };

//     fetchPortfolio();
//     fetchQualificationUnits();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith('unit.') || name.startsWith('learningOutcome.') || name.startsWith('criteria.')) {
//       const [objectName, key] = name.split('.');
//       setPortfolioData({
//         ...portfolioData,
//         [objectName]: {
//           ...portfolioData[objectName],
//           [key]: value,
//         },
//       });
//     } else {
//       setPortfolioData({ ...portfolioData, [name]: value });
//     }
//   };

//   const handleFileChange = (e) => {
//     setSelectedFiles(e.target.files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('title', portfolioData.title);
//     formData.append('unit', JSON.stringify(portfolioData.unit)); // Send unit as an object
//     formData.append('learningOutcome', JSON.stringify(portfolioData.learningOutcome)); // Send learningOutcome as an object
//     formData.append('criteria', JSON.stringify(portfolioData.criteria)); // Send criteria as an object
//     formData.append('postcode', portfolioData.postcode);
//     // formData.append('statement', portfolioData.statement);
//     formData.append('comments', portfolioData.comments);
//     formData.append('taskDescription', portfolioData.taskDescription); // Added to submission
//     formData.append('jobType', portfolioData.jobType);                 // Added to submission
//     formData.append('reasonForTask', portfolioData.reasonForTask);     // Added to submission
//     formData.append('objectiveOfJob', portfolioData.objectiveOfJob);   // Added to submission
//     formData.append('method', portfolioData.method);                   // Added to submission

//     // Pass existing images as a stringified array
//     formData.append('existingImages', JSON.stringify(portfolioData.images));

//     // Append new images
//     for (let i = 0; i < selectedFiles.length; i++) {
//       formData.append('images', selectedFiles[i]);
//     }

//     try {
//       await axios.put(`${API_URL}/api/portfolios/${id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       alert('Portfolio updated successfully');
//     } catch (err) {
//       console.error('Error updating portfolio', err);
//     }
//   };

//   // Get learning outcomes for the selected unit
//   const getLearningOutcomes = (unitNumber) => {
//     const selectedUnitData = qualificationUnitsData.find((u) => u.unit === unitNumber);
//     return selectedUnitData ? selectedUnitData.learning_outcomes : [];
//   };

//   // Get criteria for the selected learning outcome
//   const getCriteria = (unitNumber, learningOutcomeNumber) => {
//     const selectedUnitData = qualificationUnitsData.find((u) => u.unit === unitNumber);
//     const selectedLO = selectedUnitData?.learning_outcomes.find(
//       (lo) => lo.LO_number === parseInt(learningOutcomeNumber)
//     );
//     return selectedLO ? selectedLO.assessment_criteria : [];
//   };

//   return (
//     <Container fluid>
//       <h2>Edit Portfolio</h2>
//       <Form onSubmit={handleSubmit}>
//         <Form.Group className="mb-3" controlId="formTitle">
//           <Form.Label>Title</Form.Label>
//           <Form.Control
//             type="text"
//             name="title"
//             value={portfolioData.title}
//             onChange={handleChange}
//           />
//         </Form.Group>

//         <Row>
//           <Col>
//             <Form.Group className="mb-3" controlId="formUnit">
//               <Form.Label>Select Unit</Form.Label>
//               <Form.Select
//                 name="unit.number"
//                 value={portfolioData.unit.number}
//                 onChange={(e) => {
//                   const selectedUnit = qualificationUnitsData.find((u) => u.unit === e.target.value);
//                   setPortfolioData({
//                     ...portfolioData,
//                     unit: { number: selectedUnit.unit, title: selectedUnit.title },
//                     learningOutcome: { number: '', description: '' }, // Reset LO
//                     criteria: { number: '', description: '' }, // Reset Criteria
//                   });
//                 }}
//               >
//                 <option value="">Select a Unit</option>
//                 {qualificationUnitsData.map((unit) => (
//                   <option key={unit.unit} value={unit.unit}>
//                     {`Unit ${unit.unit} - ${unit.title}`}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group className="mb-3" controlId="formPostcode">
//               <Form.Label>Postcode</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="postcode"
//                 value={portfolioData.postcode}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row>
//           <Col>
//             <Form.Group className="mb-3" controlId="formLearningOutcome">
//               <Form.Label>Select Learning Outcome</Form.Label>
//               <Form.Select
//                 name="learningOutcome.number"
//                 value={portfolioData.learningOutcome.number}
//                 onChange={(e) => {
//                   const selectedLO = getLearningOutcomes(portfolioData.unit.number).find(
//                     (lo) => lo.LO_number === parseInt(e.target.value)
//                   );
//                   setPortfolioData({
//                     ...portfolioData,
//                     learningOutcome: { number: selectedLO.LO_number, description: selectedLO.description },
//                     criteria: { number: '', description: '' }, // Reset Criteria
//                   });
//                 }}
//               >
//                 <option value="">Select a Learning Outcome</option>
//                 {getLearningOutcomes(portfolioData.unit.number).map((lo) => (
//                   <option key={lo.LO_number} value={lo.LO_number}>
//                     {`LO ${lo.LO_number}: ${lo.description}`}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col>
//             {/* <Form.Group className="mb-3" controlId="formCriteria">
//               <Form.Label>Select Criteria</Form.Label>
//               <Form.Select
//                 name="criteria"
//                 value={portfolioData.criteria.number || ""}
//                 onChange={(e) => {
//                   const selectedCriteria = getCriteria(
//                     portfolioData.unit.number,
//                     portfolioData.learningOutcome.number
//                   ).find((c) => c.AC_number === parseInt(e.target.value));

//                   setPortfolioData({
//                     ...portfolioData,
//                     criteria: { number: selectedCriteria.AC_number, description: selectedCriteria.description },
//                   });
//                 }}
//               >
//                 <option value="">Select Criteria</option>
//                 {getCriteria(
//                   portfolioData.unit.number,
//                   portfolioData.learningOutcome.number
//                 ).map((criteria) => (
//                   <option key={criteria.AC_number} value={criteria.AC_number}>
//                     {criteria.AC_number} - {criteria.description}
//                   </option>
//                 ))}
//               </Form.Select>

//             </Form.Group> */}
//             <Form.Group className="mb-3" controlId="formCriteria">
//               <Form.Label>Assessment Criteria</Form.Label>
//               <Form.Select
//                 name="criteria"
//                 value={portfolioData.criteria?.number || ""}
//                 onChange={(e) => {
//                   const selectedCriteria = getCriteria(
//                     portfolioData.unit.number,
//                     portfolioData.learningOutcome.number
//                   ).find(
//                     (c) =>
//                       (c.number?.toString?.() || c.AC_number?.toString?.()) ===
//                       e.target.value
//                   );

//                   setPortfolioData({
//                     ...portfolioData,
//                     criteria: selectedCriteria
//                       ? {
//                         number: selectedCriteria.number || selectedCriteria.AC_number,
//                         description: selectedCriteria.description,
//                       }
//                       : { number: "", description: "" },
//                   });
//                 }}
//               >
//                 <option value="">Select Criteria</option>
//                 {getCriteria(
//                   portfolioData.unit.number,
//                   portfolioData.learningOutcome.number
//                 ).map((criteria, idx) => (
//                   <option
//                     key={idx}
//                     value={criteria.number || criteria.AC_number}
//                   >
//                     {(criteria.number || criteria.AC_number) +
//                       " - " +
//                       criteria.description}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//           </Col>
//         </Row>

//         {/* <Form.Group className="mb-3" controlId="formStatement">
//           <Form.Label>Statement</Form.Label>
//           <Form.Control
//             as="textarea"
//             name="statement"
//             rows={3}
//             value={portfolioData.statement}
//             onChange={handleChange}
//           />
//         </Form.Group> */}
//         <Form.Group className="mb-3" controlId="formMethod">
//           <Form.Label>Method</Form.Label>
//           <Form.Select
//             name="method"
//             value={portfolioData.method}
//             onChange={handleChange}
//           >
//             <option value="">Select Method</option>
//             <option value="Professional discussion">Professional discussion</option>
//             <option value="Witness testimony">Witness testimony</option>
//             <option value="Written questions">Written questions</option>
//             <option value="Work Product">Work Product</option>
//             <option value="Direct observation">Direct observation</option>
//             <option value="Oral questions">Oral questions</option>
//             <option value="APL / RPL">APL / RPL</option>
//           </Form.Select>
//         </Form.Group>
//         <Row>
//           <Col>
//             <Form.Group className="mb-3" controlId="formTaskDescription">
//               <Form.Label>Task Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="taskDescription"
//                 rows={2}
//                 value={portfolioData.taskDescription}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group className="mb-3" controlId="formJobType">
//               <Form.Label>Job Type</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="jobType"
//                 rows={2}
//                 value={portfolioData.jobType}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row>
//           <Col>
//             <Form.Group className="mb-3" controlId="formReasonForTask">
//               <Form.Label>Reason for Task</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="reasonForTask"
//                 rows={2}
//                 value={portfolioData.reasonForTask}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group className="mb-3" controlId="formObjectiveOfJob">
//               <Form.Label>Objective of Job</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="objectiveOfJob"
//                 rows={2}
//                 value={portfolioData.objectiveOfJob}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         <Form.Group className="mb-3" controlId="formComments">
//           <Form.Label>Comments</Form.Label>
//           <Form.Control
//             as="textarea"
//             name="comments"
//             rows={3}
//             value={portfolioData.comments}
//             onChange={handleChange}
//           />
//         </Form.Group>

//         {/* Display existing images */}
//         <Form.Group className="mb-3">
//           <Form.Label>Existing Images</Form.Label>
//           <div>
//             {portfolioData.images.map((image, index) => (
//               <img
//                 key={index}
//                 src={`${API_URL}/${image}`}
//                 alt="Portfolio"
//                 style={{ width: '100px', margin: '10px' }}
//               />
//             ))}
//           </div>
//         </Form.Group>

//         <Form.Group className="mb-3" controlId="formFile">
//           <Form.Label>Upload New Images</Form.Label>
//           <Form.Control type="file" multiple onChange={handleFileChange} />
//         </Form.Group>

//         <Button variant="primary" type="submit">
//           Update Portfolio
//         </Button>
//       </Form>
//     </Container>
//   );
// };

// export default EditPortfolio;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Col, Row, Card, Alert } from 'react-bootstrap'; // ✅ ADDED: Card, Alert
import { FaTimes } from 'react-icons/fa'; // ✅ ADDED: FaTimes icon for delete buttons

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EditPortfolio = () => {
  const { id } = useParams();
  const [portfolioData, setPortfolioData] = useState({
    title: '',
    unit: { number: '', title: '' },
    learningOutcome: { number: '', description: '' },
    criteria: { number: '', description: '' },
    postcode: '',
    comments: '',
    images: [],
    taskDescription: '',
    jobType: '',
    reasonForTask: '',
    objectiveOfJob: '',
    method: '',
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]); // ✅ NEW: Preview URLs for new images
  const [imagesToDelete, setImagesToDelete] = useState([]); // ✅ NEW: Track images to delete
  const [qualificationUnitsData, setQualificationUnitsData] = useState([]);
  const [updateMessage, setUpdateMessage] = useState(''); // ✅ NEW: Success/error messages

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/portfolios/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPortfolioData(data);
      } catch (err) {
        console.error('Error fetching portfolio', err);
      }
    };

    const fetchQualificationUnits = async () => {
      try {
        const response = await fetch('/Nvq_2357_13.json');
        const data = await response.json();
        setQualificationUnitsData(data.performance_units);
      } catch (error) {
        console.error('Error loading JSON data:', error);
      }
    };

    fetchPortfolio();
    fetchQualificationUnits();
  }, [id]);

  // NEW: Handle file selection with preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview URLs for new images
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // NEW: Remove a newly selected image (before upload)
  const removeNewImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  // NEW: Mark existing image for deletion
  const markImageForDeletion = (imagePath) => {
    if (!imagesToDelete.includes(imagePath)) {
      setImagesToDelete([...imagesToDelete, imagePath]);
    }
  };

  // NEW: Unmark existing image from deletion
  const unmarkImageForDeletion = (imagePath) => {
    setImagesToDelete(imagesToDelete.filter(img => img !== imagePath));
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('unit.') || name.startsWith('learningOutcome.') || name.startsWith('criteria.')) {
      const [objectName, key] = name.split('.');
      setPortfolioData({
        ...portfolioData,
        [objectName]: {
          ...portfolioData[objectName],
          [key]: value,
        },
      });
    } else {
      setPortfolioData({ ...portfolioData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage('');

    const formData = new FormData();
    formData.append('title', portfolioData.title);
    formData.append('unit', JSON.stringify(portfolioData.unit));
    formData.append('learningOutcome', JSON.stringify(portfolioData.learningOutcome));
    formData.append('criteria', JSON.stringify(portfolioData.criteria));
    formData.append('postcode', portfolioData.postcode);
    formData.append('comments', portfolioData.comments);
    formData.append('taskDescription', portfolioData.taskDescription);
    formData.append('jobType', portfolioData.jobType);
    formData.append('reasonForTask', portfolioData.reasonForTask);
    formData.append('objectiveOfJob', portfolioData.objectiveOfJob);
    formData.append('method', portfolioData.method);

    // Filter out images marked for deletion
    const remainingImages = portfolioData.images.filter(
      img => !imagesToDelete.includes(img)
    );
    formData.append('existingImages', JSON.stringify(remainingImages));

    // Append new images
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    try {
      await axios.put(`${API_URL}/api/portfolios/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUpdateMessage('Portfolio updated successfully!');
      
      // Clear new image selections and previews
      setSelectedFiles([]);
      setPreviewUrls([]);
      setImagesToDelete([]);
      
      // Refresh portfolio data
      const { data } = await axios.get(`${API_URL}/api/portfolios/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPortfolioData(data);
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error updating portfolio', err);
      setUpdateMessage('Error updating portfolio. Please try again.');
    }
  };

  const getLearningOutcomes = (unitNumber) => {
    const selectedUnitData = qualificationUnitsData.find((u) => u.unit === unitNumber);
    return selectedUnitData ? selectedUnitData.learning_outcomes : [];
  };

  const getCriteria = (unitNumber, learningOutcomeNumber) => {
    const selectedUnitData = qualificationUnitsData.find((u) => u.unit === unitNumber);
    const selectedLO = selectedUnitData?.learning_outcomes.find(
      (lo) => lo.LO_number === parseInt(learningOutcomeNumber)
    );
    return selectedLO ? selectedLO.assessment_criteria : [];
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Edit Portfolio</h2>
      
      {updateMessage && (
        <Alert variant={updateMessage.includes('success') ? 'success' : 'danger'}>
          {updateMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={portfolioData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formUnit">
              <Form.Label>Select Unit</Form.Label>
              <Form.Select
                name="unit.number"
                value={portfolioData.unit.number}
                onChange={(e) => {
                  const selectedUnit = qualificationUnitsData.find((u) => u.unit === e.target.value);
                  setPortfolioData({
                    ...portfolioData,
                    unit: { number: selectedUnit.unit, title: selectedUnit.title },
                    learningOutcome: { number: '', description: '' },
                    criteria: { number: '', description: '' },
                  });
                }}
              >
                <option value="">Select a Unit</option>
                {qualificationUnitsData.map((unit) => (
                  <option key={unit.unit} value={unit.unit}>
                    {`Unit ${unit.unit} - ${unit.title}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formPostcode">
              <Form.Label>Postcode</Form.Label>
              <Form.Control
                type="text"
                name="postcode"
                value={portfolioData.postcode}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formLearningOutcome">
              <Form.Label>Select Learning Outcome</Form.Label>
              <Form.Select
                name="learningOutcome.number"
                value={portfolioData.learningOutcome.number}
                onChange={(e) => {
                  const selectedLO = getLearningOutcomes(portfolioData.unit.number).find(
                    (lo) => lo.LO_number === parseInt(e.target.value)
                  );
                  setPortfolioData({
                    ...portfolioData,
                    learningOutcome: { number: selectedLO.LO_number, description: selectedLO.description },
                    criteria: { number: '', description: '' },
                  });
                }}
              >
                <option value="">Select a Learning Outcome</option>
                {getLearningOutcomes(portfolioData.unit.number).map((lo) => (
                  <option key={lo.LO_number} value={lo.LO_number}>
                    {`LO ${lo.LO_number}: ${lo.description}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formCriteria">
              <Form.Label>Assessment Criteria</Form.Label>
              <Form.Select
                name="criteria"
                value={portfolioData.criteria?.number || ""}
                onChange={(e) => {
                  const selectedCriteria = getCriteria(
                    portfolioData.unit.number,
                    portfolioData.learningOutcome.number
                  ).find(
                    (c) =>
                      (c.number?.toString?.() || c.AC_number?.toString?.()) ===
                      e.target.value
                  );

                  setPortfolioData({
                    ...portfolioData,
                    criteria: selectedCriteria
                      ? {
                        number: selectedCriteria.number || selectedCriteria.AC_number,
                        description: selectedCriteria.description,
                      }
                      : { number: "", description: "" },
                  });
                }}
              >
                <option value="">Select Criteria</option>
                {getCriteria(
                  portfolioData.unit.number,
                  portfolioData.learningOutcome.number
                ).map((criteria, idx) => (
                  <option
                    key={idx}
                    value={criteria.number || criteria.AC_number}
                  >
                    {(criteria.number || criteria.AC_number) +
                      " - " +
                      criteria.description}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formMethod">
          <Form.Label>Method</Form.Label>
          <Form.Select
            name="method"
            value={portfolioData.method}
            onChange={handleChange}
            required
          >
            <option value="">Select Method</option>
            <option value="Professional discussion">Professional discussion</option>
            <option value="Witness testimony">Witness testimony</option>
            <option value="Written questions">Written questions</option>
            <option value="Work Product">Work Product</option>
            <option value="Direct observation">Direct observation</option>
            <option value="Oral questions">Oral questions</option>
            <option value="APL / RPL">APL / RPL</option>
          </Form.Select>
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formTaskDescription">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                name="taskDescription"
                rows={2}
                value={portfolioData.taskDescription}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formJobType">
              <Form.Label>Job Type</Form.Label>
              <Form.Control
                as="textarea"
                name="jobType"
                rows={2}
                value={portfolioData.jobType}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formReasonForTask">
              <Form.Label>Reason for Task</Form.Label>
              <Form.Control
                as="textarea"
                name="reasonForTask"
                rows={2}
                value={portfolioData.reasonForTask}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formObjectiveOfJob">
              <Form.Label>Objective of Job</Form.Label>
              <Form.Control
                as="textarea"
                name="objectiveOfJob"
                rows={2}
                value={portfolioData.objectiveOfJob}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formComments">
          <Form.Label>Comments</Form.Label>
          <Form.Control
            as="textarea"
            name="comments"
            rows={3}
            value={portfolioData.comments}
            onChange={handleChange}
          />
        </Form.Group>

        {/* ENHANCED: Existing Images Section */}
        <Card className="mb-4">
          <Card.Header>
            <strong>Existing Images</strong>
          </Card.Header>
          <Card.Body>
            {portfolioData.images.length > 0 ? (
              <Row>
                {portfolioData.images.map((image, index) => {
                  const isMarkedForDeletion = imagesToDelete.includes(image);
                  return (
                    <Col md={3} key={index} className="mb-3">
                      <div 
                        style={{ 
                          position: 'relative',
                          opacity: isMarkedForDeletion ? 0.5 : 1,
                          border: isMarkedForDeletion ? '2px solid red' : '1px solid #dee2e6',
                          borderRadius: '8px',
                          padding: '5px'
                        }}
                      >
                        <img
                          src={`${API_URL}/${image}`}
                          alt={`Portfolio ${index + 1}`}
                          style={{ 
                            width: '100%', 
                            height: '150px', 
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <Button
                          variant={isMarkedForDeletion ? 'success' : 'danger'}
                          size="sm"
                          onClick={() => 
                            isMarkedForDeletion 
                              ? unmarkImageForDeletion(image)
                              : markImageForDeletion(image)
                          }
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            padding: '5px 10px'
                          }}
                        >
                          {isMarkedForDeletion ? 'Undo' : <FaTimes />}
                        </Button>
                        {isMarkedForDeletion && (
                          <div 
                            style={{
                              position: 'absolute',
                              bottom: '10px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: 'rgba(220, 53, 69, 0.9)',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}
                          >
                            Will be deleted
                          </div>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <p className="text-muted">No existing images</p>
            )}
          </Card.Body>
        </Card>

        {/* ENHANCED: New Images Section */}
        <Card className="mb-4">
          <Card.Header>
            <strong>Add New Images</strong>
          </Card.Header>
          <Card.Body>
            <Form.Group controlId="formFile">
              <Form.Label>Upload New Images</Form.Label>
              <Form.Control 
                type="file" 
                multiple 
                onChange={handleFileChange}
                accept="image/*"
              />
              <Form.Text className="text-muted">
                You can select multiple images at once
              </Form.Text>
            </Form.Group>

            {/* Preview new images */}
            {previewUrls.length > 0 && (
              <div className="mt-3">
                <h6>New Images Preview:</h6>
                <Row>
                  {previewUrls.map((url, index) => (
                    <Col md={3} key={index} className="mb-3">
                      <div style={{ position: 'relative' }}>
                        <img
                          src={url}
                          alt={`New upload ${index + 1}`}
                          style={{ 
                            width: '100%', 
                            height: '150px', 
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #28a745'
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeNewImage(index)}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            padding: '5px 10px'
                          }}
                        >
                          <FaTimes />
                        </Button>
                        <div 
                          style={{
                            position: 'absolute',
                            bottom: '5px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'rgba(40, 167, 69, 0.9)',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        >
                          New
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit">
            Update Portfolio
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditPortfolio;