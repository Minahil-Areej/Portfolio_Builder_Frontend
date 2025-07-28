import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [postcode, setPostcode] = useState('');
    const [qualification, setQualification] = useState('');
    const [phone, setPhone] = useState('');
    const [referenceNo, setReferenceNo] = useState('');
    const [role, setRole] = useState('student');
    const [image, setImage] = useState(null);
    const [registerMessage, setRegisterMessage] = useState('');

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Store the selected image file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the form data to send with the request, including the image
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('dob', dob);
        formData.append('postcode', postcode);
        formData.append('qualification', qualification);
        formData.append('phone', phone);
        formData.append('referenceNo', referenceNo);
        formData.append('role', role);
        if (image) {
            formData.append('image', image); // Add image file to form data
        }

        console.log('FormData: ', formData);
        for (let [key, value] of formData.entries()) {
            console.log(key, value); // This will print all key-value pairs in FormData
        }
        // try {
        //     await userService.register(formData);
        //     navigate('/login'); // Redirect to login after successful registration
        // } catch (error) {
        //     console.error('Registration failed:', error);
        // }
        try {
            const response = await userService.register(formData);
            setRegisterMessage(response.message); // Show backend message
            // Optionally, navigate to login after a delay
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setRegisterMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        // <div>
        //   <h2>Register</h2>
        //   <form onSubmit={handleSubmit} encType="multipart/form-data">
        //     <div>
        //       <label>Name</label>
        //       <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        //     </div>
        //     <div>
        //       <label>Email</label>
        //       <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        //     </div>
        //     <div>
        //       <label>Password</label>
        //       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        //     </div>
        //     <div>
        //       <label>Date of Birth</label>
        //       <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
        //     </div>
        //     <div>
        //       <label>Postcode</label>
        //       <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} required />
        //     </div>
        //     <div>
        //       <label>Qualification</label>
        //       <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
        //     </div>
        //     <div>
        //       <label>Phone</label>
        //       <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        //     </div>
        //     <div>
        //       <label>Reference Number</label>
        //       <input type="text" value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} required />
        //     </div>
        //     <div>
        //       <label>Role</label>
        //       <select value={role} onChange={(e) => setRole(e.target.value)}>
        //         <option value="student">Student</option>
        //         <option value="admin">Admin</option>
        //         <option value="assessor">Assessor</option>
        //       </select>
        //     </div>
        //     <div>
        //       <label>Upload Image</label>
        //       <input type="file" onChange={handleImageChange} accept="image/*" />
        //     </div>
        //     <button type="submit">Register</button>
        //   </form>
        // </div>
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '2rem', backgroundImage: 'url(/background.jpg)', backgroundSize: 'cover' }}>
            <Card style={{ width: '40rem', padding: '2rem' }}>
                <h2 className="text-center mb-4">Register</h2>
                <Form onSubmit={handleSubmit} encType="multipart/form-data" >
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} required />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Postcode</Form.Label>
                                <Form.Control type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Qualification</Form.Label>
                                <Form.Control type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Reference Number</Form.Label>
                                <Form.Control type="text" value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3" controlId="formRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                            <option value="assessor">Assessor</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formProfileImage">
                        <Form.Label>Profile Image</Form.Label>
                        <Form.Control
                            type="file" onChange={handleImageChange} accept="image/*"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                </Form>
                {registerMessage && (
                    <div className="alert alert-info text-center">{registerMessage}</div>
                )}
            </Card>
        </Container>
    );
};

export default Register;
