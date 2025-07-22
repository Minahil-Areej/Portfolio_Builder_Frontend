
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
  const [qualificationUnitsData, setQualificationUnitsData] = useState([]);
  const [dateTime, setDateTime] = useState(new Date().toISOString().substring(0, 16)); // State for date and time field
  const [locationError, setLocationError] = useState(null); // Error message for invalid postcode
  const [isPostcodeValid, setIsPostcodeValid] = useState(true); // State to track validity
  const [status, setStatus] = useState('Draft'); // Default to 'Draft'
  // New fields
  const [taskDescription, setTaskDescription] = useState('');
  const [jobType, setJobType] = useState('');
  const [reasonForTask, setReasonForTask] = useState('');
  const [objectiveOfJob, setObjectiveOfJob] = useState('');
  const navigate = useNavigate();

  // Fetch the JSON data from the public folder
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

  const handleImageChange = (e) => {
    setImages([...images, ...e.target.files]);
  };

  const validatePostcode = (postcode) => {
    const regex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}$/i;
    const isValid = regex.test(postcode.trim());
    setIsPostcodeValid(isValid); // Set validity state

    if (!isValid) {
      setLocationError('Invalid UK postcode. Please enter a valid postcode.');
    } else {
      setLocationError(null); // Valid postcode
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
    formData.append('dateTime', new Date(dateTime).toISOString()); // Convert to ISO format
    formData.append('status', isSubmitForReview ? 'To Be Reviewed' : 'Draft'); // Set status based on action
    // Append new fields
    formData.append('taskDescription', taskDescription);
    formData.append('jobType', jobType);
    formData.append('reasonForTask', reasonForTask);
    formData.append('objectiveOfJob', objectiveOfJob);
    images.forEach((image) => {
      formData.append('images', image);
    });

    console.log([...formData.entries()]); // Log form data before sending

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
        alert(`Portfo lio ${isSubmitForReview ? 'submitted for review' : 'saved as draft'} successfully!`);
        navigate('/dashboard');
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
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Postcode</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter postcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)} // Only update state on change
                  onBlur={(e) => validatePostcode(e.target.value)} // Validate only when the user leaves the field
                  className={isPostcodeValid ? '' : 'is-invalid'} // Apply CSS class conditionally
                  required
                />
                {locationError && (
                  <Form.Text className="text-danger">{locationError}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Select Date and Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Select Unit</Form.Label>
                <Form.Select
                  value={unit.number}
                  onChange={(e) => {
                    const selectedUnit = qualificationUnitsData.find((u) => u.unit === e.target.value);
                    setUnit({ number: selectedUnit.unit, title: selectedUnit.title });
                    setLearningOutcome({ number: '', description: '' }); // reset LO
                    setCriteria({ number: '', description: '' }); // reset criteria
                  }}
                >
                  <option value="">Select a Unit</option>
                  {qualificationUnitsData.map((unit) => (
                    <option key={unit.unit} value={unit.unit}>
                      {`Unit ${unit.unit} - ${unit.title}`}
                    </option>
                  ))}
                  required
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                
                <Form.Label>Select Learning Outcome</Form.Label>
                <Form.Select
                  value={learningOutcome.number}
                  onChange={(e) => {
                    const selectedLO = getLearningOutcomes(unit.number).find(
                      (lo) => lo.LO_number === parseFloat(e.target.value)
                    );
                    setLearningOutcome({ number: selectedLO.LO_number, description: selectedLO.description });
                  }}
                >
                  <option value="">Select a Learning Outcome</option>
                  {getLearningOutcomes(unit.number).map((lo) => (
                    <option key={lo.LO_number} value={lo.LO_number}>
                      {`LO ${lo.LO_number}: ${lo.description}`}
                    </option>
                  ))}
                  required
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Select Criteria</Form.Label>
                <Form.Select
                  value={criteria.number}
                  onChange={(e) => {
                    const selectedCriteria = getCriteria(unit.number, learningOutcome.number).find(
                      (c) => c.AC_number === e.target.value
                    );
                    if (selectedCriteria) {
                      setCriteria({ number: selectedCriteria.AC_number, description: selectedCriteria.description });
                    } else {
                      setCriteria({ number: '', description: '' });
                    }
                  }}
                >
                  <option value="">Select Criteria</option>
                  {getCriteria(unit.number, learningOutcome.number).map((criteria) => (
                    <option key={criteria.AC_number} value={criteria.AC_number}>
                      {`AC ${criteria.AC_number}: ${criteria.description}`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe the task"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Job Type</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter job type"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required
            />
          </Form.Group>


          <Form.Group>
            <Form.Label>Reason for Task</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Reason for performing the task"
              value={reasonForTask}
              onChange={(e) => setReasonForTask(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Objective of Job</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Objective of the job"
              value={objectiveOfJob}
              onChange={(e) => setObjectiveOfJob(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Add comments"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Form.Group>

          <h2>Portfolio Sections</h2>
          {sections.map((section, index) => (
            <div key={index} className="mb-3">
              <Form.Group>
                <Form.Label>Section Heading</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter section heading"
                  value={section.heading}
                  onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Section Content</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter section content"
                  rows={3}
                  value={section.content}
                  onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                />
              </Form.Group>
            </div>
          ))}
          <Button variant="outline-secondary" onClick={addSection} className="mb-3">
            Add Section
          </Button>

          <h2>Upload Images</h2>
          <Form.Group className="mb-3">
            <Form.Control type="file" multiple onChange={handleImageChange} accept="image/*" />
          </Form.Group>

          <Button variant="primary" onClick={(e) => handleSubmit(e, false)}>Save as Draft</Button>
          <Button variant="success" className="ms-2" onClick={(e) => handleSubmit(e, true)}>Submit for Review</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Portfolio;
