// import React, { useState, useEffect } from 'react';
// import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
// import './Portfolio.css'; // Ensure this file has the styles for error highlighting
// import { useNavigate } from 'react-router-dom';
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const Portfolio = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [unit, setUnit] = useState({ number: '', title: '' });
//   const [learningOutcome, setLearningOutcome] = useState({ number: '', description: '' });
//   const [criteria, setCriteria] = useState({ number: '', description: '' });
//   const [statement, setStatement] = useState('');
//   const [postcode, setPostcode] = useState('');
//   const [comments, setComments] = useState('');
//   const [sections, setSections] = useState([]);
//   const [images, setImages] = useState([]);
//   const [qualificationUnitsData, setQualificationUnitsData] = useState([]);
//   const [dateTime, setDateTime] = useState(new Date().toISOString().substring(0, 16)); // State for date and time field
//   const [locationError, setLocationError] = useState(null); // Error message for invalid postcode
//   const [isPostcodeValid, setIsPostcodeValid] = useState(true); // State to track validity
//   const [status, setStatus] = useState('Draft'); // Default to 'Draft'
//   // New fields
//   const [taskDescription, setTaskDescription] = useState('');
//   const [jobType, setJobType] = useState('');
//   const [reasonForTask, setReasonForTask] = useState('');
//   const [objectiveOfJob, setObjectiveOfJob] = useState('');
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState('');
//   const [showAddresses, setShowAddresses] = useState(false);
//   const [isLoadingAddresses, setIsLoadingAddresses] = useState(false); // Add new state
//   const [method, setMethod] = useState(''); // State for Method
//   const navigate = useNavigate();

//   // Fetch the JSON data from the public folder
//   useEffect(() => {
//     fetch('/Nvq_2357_13.json')
//       .then((response) => response.json())
//       .then((data) => setQualificationUnitsData(data.performance_units))
//       .catch((error) => console.error('Error loading JSON data:', error));
//   }, []);

//   const getLearningOutcomes = (unitNumber) => {
//     const selectedUnitData = qualificationUnitsData.find((u) => u.unit === unitNumber);
//     return selectedUnitData ? selectedUnitData.learning_outcomes : [];
//   };

//   const getCriteria = (unitNumber, learningOutcomeNumber) => {
//     const selectedUnitData = qualificationUnitsData.find((u) => u.unit === unitNumber);
//     const selectedLO = selectedUnitData?.learning_outcomes.find(
//       (lo) => lo.LO_number === learningOutcomeNumber
//     );
//     return selectedLO ? selectedLO.assessment_criteria : [];
//   };

//   const addSection = () => {
//     setSections([...sections, { heading: '', content: '' }]);
//   };

//   const handleSectionChange = (index, field, value) => {
//     const updatedSections = [...sections];
//     updatedSections[index][field] = value;
//     setSections(updatedSections);
//   };

//   const handleImageChange = (e) => {
//     setImages([...images, ...e.target.files]);
//   };

//   const validatePostcode = (postcode) => {
//     const regex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}$/i;
//     const isValid = regex.test(postcode.trim());
//     setIsPostcodeValid(isValid); // Set validity state

//     if (!isValid) {
//       setLocationError('Invalid UK postcode. Please enter a valid postcode.');
//     } else {
//       setLocationError(null); // Valid postcode
//     }
//   };

//   // Update fetchAddresses function
//   const fetchAddresses = async (postcode) => {
//     try {
//       setIsLoadingAddresses(true);
//       const formattedPostcode = postcode.trim().toUpperCase();

//       // First try to get postcodes that match
//       const response = await fetch(`https://api.postcodes.io/postcodes/${formattedPostcode}/autocomplete`);
//       const data = await response.json();

//       if (data.result) {
//         // Get detailed info for each matching postcode
//         const detailedAddresses = await Promise.all(
//           data.result.slice(0, 5).map(async (code) => {
//             const detailResponse = await fetch(`https://api.postcodes.io/postcodes/${code}`);
//             const detailData = await detailResponse.json();
            
//             if (detailData.result) {
//               const {
//                 postcode,
//                 admin_district,
//                 thoroughfare,
//                 district,
//                 ward
//               } = detailData.result;

//               // Build address with street name first
//               const addressParts = [];
              
//               // Add thoroughfare (street name) if available
//               if (thoroughfare) {
//                 addressParts.push(thoroughfare);
//               }
              
//               // Add area details
//               if (ward && ward !== thoroughfare) {
//                 addressParts.push(ward);
//               }
//               if (district && district !== ward) {
//                 addressParts.push(district);
//               }
//               if (admin_district && !addressParts.includes(admin_district)) {
//                 addressParts.push(admin_district);
//               }
              
//               // Always add postcode at the end
//               addressParts.push(postcode);

//               return {
//                 text: addressParts.join(', '),
//                 postcode: postcode,
//                 fullAddress: addressParts.join(', ')
//               };
//             }
//             return null;
//           })
//         );

//         const validAddresses = detailedAddresses.filter(addr => addr !== null);
//         setAddresses(validAddresses);
//         setShowAddresses(true);
//         setLocationError(null);
//       }
//     } catch (error) {
//       console.error('Error fetching addresses:', error);
//     } finally {
//       setIsLoadingAddresses(false);
//     }
//   };

//   const handleSubmit = async (e, isSubmitForReview = false) => {
//     e.preventDefault();

//     if (locationError) {
//       alert('Please fix the postcode before submitting.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('unit', JSON.stringify(unit));
//     formData.append('learningOutcome', JSON.stringify(learningOutcome));
//     formData.append('criteria', JSON.stringify(criteria));
//     formData.append('statement', statement);
//     formData.append('postcode', postcode);
//     formData.append('comments', comments);
//     formData.append('dateTime', new Date(dateTime).toISOString()); // Convert to ISO format
//     formData.append('status', isSubmitForReview ? 'To Be Reviewed' : 'Draft'); // Set status based on action
//     // Append new fields
//     formData.append('taskDescription', taskDescription);
//     formData.append('jobType', jobType);
//     formData.append('reasonForTask', reasonForTask);
//     formData.append('objectiveOfJob', objectiveOfJob);
//     formData.append('method', method); // Add method to form data
//     images.forEach((image) => {
//       formData.append('images', image);
//     });

//     console.log([...formData.entries()]); // Log form data before sending

//     try {
//       const response = await fetch(`${API_URL}/api/portfolios/save`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert(`Portfo lio ${isSubmitForReview ? 'submitted for review' : 'saved as draft'} successfully!`);
//         navigate('/dashboard');
//         console.log(result); // Debug response

//       } else {
//         alert('Error creating portfolio: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error creating portfolio:', error);
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <h1 className="text-center mb-4">Create a New Portfolio</h1>
//       <Card className="shadow-sm p-4">
//         <Form onSubmit={handleSubmit} encType="multipart/form-data">
//           <Row className="mb-3">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Title</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="position-relative">
//                 <Form.Label>Postcode</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter postcode"
//                   value={postcode}
//                   onChange={(e) => {
//                     setPostcode(e.target.value);
//                     console.log('Postcode changed:', e.target.value);
//                     if (e.target.value.length >= 3) {
//                       console.log('Fetching addresses...');
//                       fetchAddresses(e.target.value);
//                     } else {
//                       setShowAddresses(false);
//                     }
//                   }}
//                   onBlur={() => {
//                     // Don't hide addresses immediately to allow for clicking
//                     setTimeout(() => setShowAddresses(false), 200);
//                   }}
//                   className={isPostcodeValid ? '' : 'is-invalid'}
//                   required
//                 />
//                 {locationError && (
//                   <Form.Text className="text-danger">{locationError}</Form.Text>
//                 )}
                
//                 {/* Address Dropdown */}
//                 {showAddresses && (
//                   <div className="address-dropdown">
//                     {isLoadingAddresses ? (
//                       <div className="address-loading">
//                         Looking up addresses...
//                       </div>
//                     ) : addresses.length > 0 ? (
//                       addresses.map((address, index) => (
//                         <div
//                           key={index}
//                           className="address-option"
//                           onClick={() => {
//                             setPostcode(address.fullAddress); // Use full address instead of just postcode
//                             setSelectedAddress(address.text);
//                             setShowAddresses(false);
//                             setLocationError(null);
//                             setIsPostcodeValid(true);
//                           }}
//                         >
//                           {address.text}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="address-empty">
//                         No addresses found
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Select Date and Time</Form.Label>
//                 <Form.Control
//                   type="datetime-local"
//                   value={dateTime}
//                   onChange={(e) => setDateTime(e.target.value)}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Select Unit</Form.Label>
//                 <Form.Select
//                   value={unit.number}
//                   onChange={(e) => {
//                     const selectedUnit = qualificationUnitsData.find((u) => u.unit === e.target.value);
//                     setUnit({ number: selectedUnit.unit, title: selectedUnit.title });
//                     setLearningOutcome({ number: '', description: '' }); // reset LO
//                     setCriteria({ number: '', description: '' }); // reset criteria
//                   }}
//                 >
//                   <option value="">Select a Unit</option>
//                   {qualificationUnitsData.map((unit) => (
//                     <option key={unit.unit} value={unit.unit}>
//                       {`Unit ${unit.unit} - ${unit.title}`}
//                     </option>
//                   ))}
//                   required
//                 </Form.Select>
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Select Learning Outcome</Form.Label>
//                 <Form.Select
//                   value={learningOutcome.number}
//                   onChange={(e) => {
//                     const selectedLO = getLearningOutcomes(unit.number).find(
//                       (lo) => lo.LO_number === parseFloat(e.target.value)
//                     );
//                     setLearningOutcome({ number: selectedLO.LO_number, description: selectedLO.description });
//                   }}
//                 >
//                   <option value="">Select a Learning Outcome</option>
//                   {getLearningOutcomes(unit.number).map((lo) => (
//                     <option key={lo.LO_number} value={lo.LO_number}>
//                       {`LO ${lo.LO_number}: ${lo.description}`}
//                     </option>
//                   ))}
//                   required
//                 </Form.Select>
//               </Form.Group>
//             </Col>

//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Select Criteria</Form.Label>
//                 <Form.Select
//                   value={criteria.number}
//                   onChange={(e) => {
//                     const selectedCriteria = getCriteria(unit.number, learningOutcome.number).find(
//                       (c) => c.AC_number === e.target.value
//                     );
//                     if (selectedCriteria) {
//                       setCriteria({ number: selectedCriteria.AC_number, description: selectedCriteria.description });
//                     } else {
//                       setCriteria({ number: '', description: '' });
//                     }
//                   }}
//                 >
//                   <option value="">Select Criteria</option>
//                   {getCriteria(unit.number, learningOutcome.number).map((criteria) => (
//                     <option key={criteria.AC_number} value={criteria.AC_number}>
//                       {`AC ${criteria.AC_number}: ${criteria.description}`}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>
//           <Form.Group className="mb-3">
//             <Form.Label>Method</Form.Label>
//             <Form.Select
//               value={method}
//               onChange={(e) => setMethod(e.target.value)} // Update state on change
//               required
//             >
//               <option value="">Select Method</option>
//               <option value="Professional discussion">Professional discussion</option>
//               <option value="Witness testimony">Witness testimony</option>
//               <option value="Written questions">Written questions</option>
//               <option value="Work Product">Work Product</option>
//               <option value="Direct observation">Direct observation</option>
//               <option value="Oral questions">Oral questions</option>
//               <option value="APL / RPL">APL / RPL</option>
//             </Form.Select>
//           </Form.Group>
//           <Form.Group>
//             <Form.Label>Task Description</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               placeholder="Describe the task"
//               value={taskDescription}
//               onChange={(e) => setTaskDescription(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Form.Group>
//             <Form.Label>Job Type</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               placeholder="Enter job type"
//               value={jobType}
//               onChange={(e) => setJobType(e.target.value)}
//               required
//             />
//           </Form.Group>


//           <Form.Group>
//             <Form.Label>Reason for Task</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               placeholder="Reason for performing the task"
//               value={reasonForTask}
//               onChange={(e) => setReasonForTask(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Form.Group>
//             <Form.Label>Objective of Job</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               placeholder="Objective of the job"
//               value={objectiveOfJob}
//               onChange={(e) => setObjectiveOfJob(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Comments</Form.Label>
//             <Form.Control
//               as="textarea"
//               placeholder="Add comments"
//               rows={3}
//               value={comments}
//               onChange={(e) => setComments(e.target.value)}
//             />
//           </Form.Group>

//           <h2>Portfolio Sections</h2>
//           {sections.map((section, index) => (
//             <div key={index} className="mb-3">
//               <Form.Group>
//                 <Form.Label>Section Heading</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter section heading"
//                   value={section.heading}
//                   onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
//                 />
//               </Form.Group>
//               <Form.Group className="mt-2">
//                 <Form.Label>Section Content</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   placeholder="Enter section content"
//                   rows={3}
//                   value={section.content}
//                   onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
//                 />
//               </Form.Group>
//             </div>
//           ))}
//           <Button variant="outline-secondary" onClick={addSection} className="mb-3">
//             Add Section
//           </Button>

//           <h2>Upload Images</h2>
//           <Form.Group className="mb-3">
//             <Form.Control type="file" multiple onChange={handleImageChange} accept="image/*" />
//           </Form.Group>

//           <Button variant="primary" onClick={(e) => handleSubmit(e, false)}>Save as Draft</Button>
//           <Button variant="success" className="ms-2" onClick={(e) => handleSubmit(e, true)}>Submit for Review</Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default Portfolio;


//*******************8trying TO FIX IMAGE ISSUE HERE
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import './Portfolio.css'; // Ensure this file has the styles for error highlighting
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Portfolio = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState({ number: '', title: '' });
  const [learningOutcome, setLearningOutcome] = useState({ number: '', description: '' });
  const [criteria, setCriteria] = useState({ number: '', description: '' });
  const [statement, setStatement] = useState('');
  const [postcode, setPostcode] = useState('');
  const [comments, setComments] = useState('');
  const [sections, setSections] = useState([]);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]); // ✅ Added for image previews
  const [qualificationUnitsData, setQualificationUnitsData] = useState([]);
  const [dateTime, setDateTime] = useState(new Date().toISOString().substring(0, 16));
  const [locationError, setLocationError] = useState(null);
  const [isPostcodeValid, setIsPostcodeValid] = useState(true);
  const [status, setStatus] = useState('Draft');
  const [taskDescription, setTaskDescription] = useState('');
  const [jobType, setJobType] = useState('');
  const [reasonForTask, setReasonForTask] = useState('');
  const [objectiveOfJob, setObjectiveOfJob] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showAddresses, setShowAddresses] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [method, setMethod] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/Nvq_2357_13.json')
      .then((response) => response.json())
      .then((data) => setQualificationUnitsData(data.performance_units))
      .catch((error) => console.error('Error loading JSON data:', error));
  }, []);

  const getLearningOutcomes = (unitNumber) => {
    const selectedUnitData = qualificationUnitsData.find((u) => u.unit === unitNumber);
    return selectedUnitData ? selectedUnitData.learning_outcomes : [];
  };

  const getCriteria = (unitNumber, learningOutcomeNumber) => {
    const selectedUnitData = qualificationUnitsData.find((u) => u.unit === unitNumber);
    const selectedLO = selectedUnitData?.learning_outcomes.find(
      (lo) => lo.LO_number === learningOutcomeNumber
    );
    return selectedLO ? selectedLO.assessment_criteria : [];
  };

  const addSection = () => {
    setSections([...sections, { heading: '', content: '' }]);
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  // ✅ Updated image handler with preview support
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  // ✅ Remove selected image before submission
  const removeNewImage = (index) => {
    const newFiles = images.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    URL.revokeObjectURL(previewUrls[index]);
    setImages(newFiles);
    setPreviewUrls(newUrls);
  };

  const validatePostcode = (postcode) => {
    const regex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}$/i;
    const isValid = regex.test(postcode.trim());
    setIsPostcodeValid(isValid);

    if (!isValid) {
      setLocationError('Invalid UK postcode. Please enter a valid postcode.');
    } else {
      setLocationError(null);
    }
  };

  const fetchAddresses = async (postcode) => {
    try {
      setIsLoadingAddresses(true);
      const formattedPostcode = postcode.trim().toUpperCase();
      const response = await fetch(`https://api.postcodes.io/postcodes/${formattedPostcode}/autocomplete`);
      const data = await response.json();

      if (data.result) {
        const detailedAddresses = await Promise.all(
          data.result.slice(0, 5).map(async (code) => {
            const detailResponse = await fetch(`https://api.postcodes.io/postcodes/${code}`);
            const detailData = await detailResponse.json();
            if (detailData.result) {
              const {
                postcode,
                admin_district,
                thoroughfare,
                district,
                ward
              } = detailData.result;
              const addressParts = [];
              if (thoroughfare) addressParts.push(thoroughfare);
              if (ward && ward !== thoroughfare) addressParts.push(ward);
              if (district && district !== ward) addressParts.push(district);
              if (admin_district && !addressParts.includes(admin_district)) addressParts.push(admin_district);
              addressParts.push(postcode);
              return {
                text: addressParts.join(', '),
                postcode,
                fullAddress: addressParts.join(', ')
              };
            }
            return null;
          })
        );
        const validAddresses = detailedAddresses.filter(addr => addr !== null);
        setAddresses(validAddresses);
        setShowAddresses(true);
        setLocationError(null);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleSubmit = async (e, isSubmitForReview = false) => {
    e.preventDefault();

    if (locationError) {
      alert('Please fix the postcode before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('unit', JSON.stringify(unit));
    formData.append('learningOutcome', JSON.stringify(learningOutcome));
    formData.append('criteria', JSON.stringify(criteria));
    formData.append('statement', statement);
    formData.append('postcode', postcode);
    formData.append('comments', comments);
    formData.append('dateTime', new Date(dateTime).toISOString());
    formData.append('status', isSubmitForReview ? 'To Be Reviewed' : 'Draft');
    formData.append('taskDescription', taskDescription);
    formData.append('jobType', jobType);
    formData.append('reasonForTask', reasonForTask);
    formData.append('objectiveOfJob', objectiveOfJob);
    formData.append('method', method);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await fetch(`${API_URL}/api/portfolios/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Portfolio ${isSubmitForReview ? 'submitted for review' : 'saved as draft'} successfully!`);
        navigate('/dashboard');
        console.log(result);
      } else {
        alert('Error creating portfolio: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Create a New Portfolio</h1>
      <Card className="shadow-sm p-4">
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Existing fields stay the same */}
          {/* ... full form content ... */}

          <h2>Upload Images</h2>
          <Form.Group className="mb-3">
            <Form.Control type="file" multiple onChange={handleImageChange} accept="image/*" />
          </Form.Group>

          {/* ✅ Preview New Images */}
          {previewUrls.length > 0 && (
            <div className="mt-3">
              <h6>Image Preview:</h6>
              <Row>
                {previewUrls.map((url, index) => (
                  <Col md={3} key={index} className="mb-3">
                    <div style={{ position: 'relative' }}>
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
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
                        ✕
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

          <Button variant="primary" onClick={(e) => handleSubmit(e, false)}>Save as Draft</Button>
          <Button variant="success" className="ms-2" onClick={(e) => handleSubmit(e, true)}>Submit for Review</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Portfolio;
