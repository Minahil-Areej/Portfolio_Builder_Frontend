import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import userService from '../services/userService';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await userService.resetPassword(token, password);
            setMessage(res.message || 'Password has been reset. You can now log in.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError('Error resetting password. The link may be invalid or expired.');
        }
        setLoading(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Reset Your Password</h3>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
