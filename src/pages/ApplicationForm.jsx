import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ApplicationForm.css';

const ApplicationForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Details
        familyName: '',
        firstName: '',
        permanentAddress: '',
        postcode: '',
        homePhone: '',
        mobile: '',
        email: '',
        passportNumber: '',
        gender: '',
        nationality: '',
        countryOfResidence: '',
        dateOfBirth: '',
        hasDisability: false,
        hasCriminalConviction: false,
        courseToStudy: '',

        // English Qualifications
        englishTestType: '',
        englishTestDate: '',
        englishTestResult: '',

        // Previous Studies
        previousStudies: [
            {
                fromMonthYear: '',
                toMonthYear: '',
                qualification: '',
                majorSubject: '',
                institution: '',
                country: '',
                fullOrPartTime: '',
            },
        ],

        // Declaration
        personalStatement: '',
        agreedToDeclaration: false,
        declarationSignature: '',
        declarationDate: '',

        // Diversity
        genderIdentity: '',
        ageGroup: '',
        religion: '',
        sexualOrientation: '',
        ethnicOrigin: '',
        hasDisabilityDiversitySection: '',

        // Emergency Contacts
        emergencyContacts: [
            { name: '', address: '', sameAsAbove: false, contactNumber: '', relationship: '' },
            { name: '', address: '', sameAsAbove: false, contactNumber: '', relationship: '' },
        ],
        medicalInfo: '',

        // Consent
        consentGiven: false,
        photoConsentName: '',
        photoConsentAddress: '',
        photoConsentCity: '',
        photoConsentPostalCode: '',
        photoConsentPhone: '',
        photoConsentFax: '',
        photoConsentEmail: '',
        photoConsentSignature: '',
        photoConsentDate: '',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (step < 8) {
            setStep(step + 1);
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/application-form`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Final submission step:", step);

                navigate('/application-success');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error('Error submitting application form:', err);
            alert('Submission failed.');
        }
    };

    const renderStep = () => {
        //console.log("Rendering Step:", step);

        switch (step) {
            case 1:
                return (
                    <>
                        <h3>Personal Details</h3>

                        <Form.Group className="mb-3"><Form.Label>Family Name</Form.Label>
                            <Form.Control value={formData.familyName} onChange={(e) => handleChange('familyName', e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3"><Form.Label>First Name</Form.Label>
                            <Form.Control value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3"><Form.Label>Permanent Address</Form.Label>
                            <Form.Control value={formData.permanentAddress} onChange={(e) => handleChange('permanentAddress', e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3"><Form.Label>Postcode</Form.Label>
                            <Form.Control value={formData.postcode} onChange={(e) => handleChange('postcode', e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3"><Form.Label>Mobile</Form.Label>
                            <Form.Control value={formData.mobile} onChange={(e) => handleChange('mobile', e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3"><Form.Label>Email</Form.Label>
                            <Form.Control value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3"><Form.Label>Passport Number</Form.Label>
                            <Form.Control value={formData.passportNumber} onChange={(e) => handleChange('passportNumber', e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3"><Form.Label>Gender</Form.Label>
                            <Form.Select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                                <option value="">Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Prefer not to say</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3"><Form.Label>Nationality</Form.Label>
                            <Form.Select value={formData.nationality} onChange={(e) => handleChange('nationality', e.target.value)}>
                                <option value="">Select Country</option>
                                {[
                                    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
                                    "Bangladesh", "Belgium", "Brazil", "Canada", "China", "Colombia", "Croatia", "Czech Republic", "Denmark", "Egypt",
                                    "Finland", "France", "Germany", "Ghana", "Greece", "Hong Kong", "Hungary", "India", "Indonesia", "Iran", "Iraq",
                                    "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Lebanon", "Malaysia", "Mexico",
                                    "Morocco", "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway", "Oman", "Pakistan", "Peru", "Philippines",
                                    "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore", "Slovakia", "South Africa", "South Korea",
                                    "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Thailand", "Tunisia", "Turkey", "UAE", "Uganda",
                                    "Ukraine", "United Kingdom", "United States", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zimbabwe"
                                ].map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
  <Form.Label>Course to Study</Form.Label>
  <Form.Select
    value={formData.courseToStudy}
    onChange={(e) => handleChange('courseToStudy', e.target.value)}
  >
    <option value="">Select Course</option>
    <option>Functional Skills – English</option>
    <option>Functional Skills – Mathematics</option>
    <option>GCSE English</option>
    <option>GCSE Mathematics</option>
    <option>English Language Course – ESOL</option>
    <option>Level 2 Diploma in Electrical Installations (2365-02)</option>
    <option>Level 3 Diploma in Electrical Installations (2365-03)</option>
    <option>NVQ Level 3 Electrical Installation (2357-44)</option>
    <option>AM2 Assessment Preparation</option>
  </Form.Select>
</Form.Group>

                        <Form.Group className="mb-3"><Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="date" value={formData.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
                        </Form.Group>

                        <Form.Check
                            type="checkbox"
                            label="Disability"
                            checked={formData.hasDisability}
                            onChange={(e) => handleChange('hasDisability', e.target.checked)}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Criminal Conviction"
                            checked={formData.hasCriminalConviction}
                            onChange={(e) => handleChange('hasCriminalConviction', e.target.checked)}
                        />
                    </>
                );


            case 2:
                return (
                    <>
                        <h3>English Language Qualifications</h3>
                        {['englishTestType', 'englishTestResult'].map(field => (
                            <Form.Group className="mb-3" key={field}>
                                <Form.Label>{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                                <Form.Control value={formData[field]} onChange={e => handleChange(field, e.target.value)} />
                            </Form.Group>
                        ))}
                        <Form.Group className="mb-3">
                            <Form.Label>Test Date</Form.Label>
                            <Form.Control type="date" value={formData.englishTestDate} onChange={(e) => handleChange('englishTestDate', e.target.value)} />
                        </Form.Group>
                    </>
                );

            case 3:
                return (
                    <>
                        <h3>Previous Studies</h3>
                        {formData.previousStudies.map((study, i) => (
                            <div key={i}>
                                {Object.keys(study).map(field => (
                                    <Form.Group className="mb-2" key={field}>
                                        <Form.Label>{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                                        <Form.Control value={study[field]} onChange={e => {
                                            const updated = [...formData.previousStudies];
                                            updated[i][field] = e.target.value;
                                            handleChange('previousStudies', updated);
                                        }} />
                                    </Form.Group>
                                ))}
                            </div>
                        ))}
                    </>
                );

            case 4:
                return (
                    <>
                        <h3>Personal Statement & Declaration</h3>
                        <Form.Group className="mb-3">
                            <Form.Label>Statement</Form.Label>
                            <Form.Control as="textarea" rows={4} value={formData.personalStatement} onChange={(e) => handleChange('personalStatement', e.target.value)} />
                        </Form.Group>
                        <Form.Check label="Agree to Declaration" checked={formData.agreedToDeclaration} onChange={(e) => handleChange('agreedToDeclaration', e.target.checked)} />
                        <Form.Group className="mb-3"><Form.Label>Signature</Form.Label>
                            <Form.Control value={formData.declarationSignature} onChange={(e) => handleChange('declarationSignature', e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Declaration Date</Form.Label>
                            <Form.Control type="date" value={formData.declarationDate} onChange={(e) => handleChange('declarationDate', e.target.value)} />
                        </Form.Group>
                    </>
                );

            case 5:
                return (
                    <>
                        <h3>Equality & Diversity Monitoring</h3>
                        {['genderIdentity', 'ageGroup', 'religion', 'sexualOrientation', 'ethnicOrigin', 'hasDisabilityDiversitySection'].map(field => (
                            <Form.Group className="mb-3" key={field}>
                                <Form.Label>{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                                <Form.Control value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} />
                            </Form.Group>
                        ))}
                    </>
                );

            case 6:
                return (
                    <>
                        <h3>Emergency Contacts</h3>
                        {formData.emergencyContacts.map((contact, i) => (
                            <div key={i}>
                                {Object.keys(contact).map(field => (
                                    <Form.Group className="mb-2" key={field}>
                                        <Form.Label>Contact {i + 1} - {field}</Form.Label>
                                        <Form.Control value={contact[field]} onChange={e => {
                                            const updated = [...formData.emergencyContacts];
                                            updated[i][field] = e.target.value;
                                            handleChange('emergencyContacts', updated);
                                        }} />
                                    </Form.Group>
                                ))}
                            </div>
                        ))}
                        <Form.Group className="mb-3"><Form.Label>Medical Info</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.medicalInfo} onChange={(e) => handleChange('medicalInfo', e.target.value)} />
                        </Form.Group>
                    </>
                );

            case 7:
                return (
                    <>
                        <h3>Photo/Video Consent</h3>
                        <Form.Check label="I give photo/video consent" checked={formData.consentGiven} onChange={(e) => handleChange('consentGiven', e.target.checked)} />
                        {['photoConsentName', 'photoConsentAddress', 'photoConsentCity', 'photoConsentPostalCode', 'photoConsentPhone', 'photoConsentFax', 'photoConsentEmail', 'photoConsentSignature'].map(field => (
                            <Form.Group className="mb-3" key={field}>
                                <Form.Label>{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                                <Form.Control value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} />
                            </Form.Group>
                        ))}
                        <Form.Group className="mb-3">
                            <Form.Label>Consent Date</Form.Label>
                            <Form.Control type="date" value={formData.photoConsentDate} onChange={(e) => handleChange('photoConsentDate', e.target.value)} />
                        </Form.Group>
                    </>
                );

            case 8:
                return (
                    <>
                        <h3>Review & Submit</h3>
                        <p>Please confirm all details are correct before submitting the application.</p>
                        {/* You can later add a summary here if needed */}
                    </>
                );

            default:
                return <p>Unknown step. Please restart the form.</p>;
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow-sm">
                <Form onSubmit={handleSubmit}>
                    <h2 className="mb-4 text-center">Application Form</h2>
                    {renderStep()}
                    <div className="d-flex justify-content-between mt-4">
                        {step > 1 && <Button variant="secondary" onClick={prevStep}>Back</Button>}
                        {step < 8 && (
                            <Button onClick={nextStep}>Next</Button>
                        )}
                        {step === 8 && (
                            <Button type="submit" variant="success">Submit</Button>
                        )}

                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default ApplicationForm;
