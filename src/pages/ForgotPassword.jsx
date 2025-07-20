import React, { useState } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await userService.sendPasswordResetEmail(email);
            setMessage(res.message || 'If an account exists, a reset email has been sent.');
        } catch (err) {
            setError('Error sending reset email.');
        }
        setLoading(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Forgot Your Password?</h3>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                        <Button
                            variant="link"
                            className="w-100 mt-2"
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ForgotPassword;
