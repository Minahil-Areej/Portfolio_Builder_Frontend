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

                        {/* <Form.Group className="mb-3"><Form.Label>Gender</Form.Label>
                            <Form.Select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                                <option value="">Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Prefer not to say</option>
                            </Form.Select>
                        </Form.Group> */}

                        <Form.Group className="mb-3"><Form.Label>Nationality</Form.Label>
                            <Form.Select value={formData.nationality} onChange={(e) => handleChange('nationality', e.target.value)}>
                                <option value="">Select Nationality</option>
                                {[
                                    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria',
                                    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
                                    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
                                    'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia',
                                    'Comoros', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
                                    'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini',
                                    'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
                                    'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia',
                                    'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
                                    'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
                                    'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands',
                                    'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
                                    'Mozambique', 'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
                                    'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
                                    'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Republic of the Congo',
                                    'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
                                    'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
                                    'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
                                    'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
                                    'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
                                    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
                                    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
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
                        <h3>Equality & Diversity</h3>

                        <Form.Group className="mb-3">
                            <Form.Label>Gender Identity</Form.Label>
                            <Form.Select
                                value={formData.genderIdentity}
                                onChange={(e) => handleChange('genderIdentity', e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Age Group</Form.Label>
                            <Form.Select
                                value={formData.ageGroup}
                                onChange={(e) => handleChange('ageGroup', e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="16–24">16–24</option>
                                <option value="25–34">25–34</option>
                                <option value="35–44">35–44</option>
                                <option value="45–54">45–54</option>
                                <option value="55–64">55–64</option>
                                <option value="65+">65+</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Religion</Form.Label>
                            <Form.Select
                                value={formData.religion}
                                onChange={(e) => handleChange('religion', e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="No religion">No religion</option>
                                <option value="Christian">Christian</option>
                                <option value="Muslim">Muslim</option>
                                <option value="Jewish">Jewish</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Buddhist">Buddhist</option>
                                <option value="Sikh">Sikh</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Sexual Orientation</Form.Label>
                            <Form.Select
                                value={formData.sexualOrientation}
                                onChange={(e) => handleChange('sexualOrientation', e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Heterosexual/Straight">Heterosexual/Straight</option>
                                <option value="Gay/Lesbian">Gay/Lesbian</option>
                                <option value="Bisexual">Bisexual</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ethnic Origin</Form.Label>
                            <Form.Select
                                value={formData.ethnicOrigin}
                                onChange={(e) => handleChange('ethnicOrigin', e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="White – English/Welsh/Scottish/Northern Irish/British">White – English/Welsh/Scottish/Northern Irish/British</option>
                                <option value="White – European">White – European</option>
                                <option value="White – Irish">White – Irish</option>
                                <option value="White – Other">White – Other</option>
                                <option value="Mixed – White and Black Caribbean">Mixed – White and Black Caribbean</option>
                                <option value="Mixed – White and Black African">Mixed – White and Black African</option>
                                <option value="Mixed – White and Asian">Mixed – White and Asian</option>
                                <option value="Mixed – Other">Mixed – Other</option>
                                <option value="Asian/Asian British– Indian">Asian/Asian British – Indian</option>
                                <option value="Asian/Asian British – Pakistani">Asian/Asian British – Pakistani</option>
                                <option value="Asian/Asian British – Bangladeshi">Asian/Asian British – Bangladeshi</option>
                                <option value="Asian – Other">Asian – Other</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Black/Black British – African">Black/Black British – African</option>
                                <option value="Black/Black British – Caribbean">Black/Black British – Caribbean</option>
                                <option value="Black – Other">Black – Other</option>
                                <option value="Other ethnic group">Other ethnic group</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Disability</Form.Label>
                            <Form.Text className="text-muted d-block mb-2">
                                The Disability Discrimination / Equalities Act defines a “disabled person” as a person with: “A
                                physical or mental impairment which has a substantial or long-term adverse effect on their
                                ability to carry out normal day to day activities.” Some examples may include (but are not
                                limited to); visual impairment, hearing difficulties, mental health issues, mobility problems,
                                dyslexia, depression, epilepsy, diabetes, HIV. The following questions on disability are designed
                                to enable us to assess what action we might take to offer positive employment opportunities for
                                people with disabilities.</Form.Text>
                            <Form.Select
                                value={formData.hasDisabilityDiversitySection}
                                onChange={(e) => handleChange('hasDisabilityDiversitySection', e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </Form.Select>
                        </Form.Group>
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
