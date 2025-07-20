// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import userService from '../services/userService';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate(); // Hook for navigation

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await userService.login({ email, password });

//       // Store the JWT token in localStorage
//       localStorage.setItem('token', response.token);

//       // Redirect to the dashboard after successful login
//       navigate('/dashboard'); // Navigate to dashboard
//     } catch (err) {
//       setError('Login failed. Please check your credentials.');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input 
//           type="email" 
//           value={email} 
//           onChange={(e) => setEmail(e.target.value)} 
//           placeholder="Email" 
//           required 
//         />
//         <input 
//           type="password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//           placeholder="Password" 
//           required 
//         />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';  // Your existing service for login API call
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Call userService.login with the user credentials
            const response = await userService.login({ email, password });

            // Store the JWT token in localStorage
            localStorage.setItem('token', response.token);

            // Redirect based on role received from backend
            if (response.user.role === 'admin') {
                navigate('/admin-dashboard');  // ✅ Redirect to Admin Dashboard
            } else if (response.user.role === 'assessor') {
                navigate('/assessor');  // Redirect to Assessor Dashboard
            } else if (response.user.role === 'student') {
                navigate('/dashboard');  // Redirect to Student Dashboard
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        }
    };

    return (
        //     // <div>
        //     //     <h2>Login</h2>
        //         {/* <form onSubmit={handleSubmit}>
        //     <input 
        //       type="email" 
        //       value={email} 
        //       onChange={(e) => setEmail(e.target.value)} 
        //       placeholder="Email" 
        //       required 
        //     />
        //     <input 
        //       type="password" 
        //       value={password} 
        //       onChange={(e) => setPassword(e.target.value)} 
        //       placeholder="Password" 
        //       required 
        //     />
        //     <button type="submit">Login</button>
        //   </form> */}
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundImage: 'url(/background.jpg)', backgroundSize: 'cover' }}>
            <Card style={{ width: '30rem', padding: '2rem' }}>
                <h2 className="text-center mb-4">Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email}
                            onChange={(e) => setEmail(e.target.value)} required />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                    <p className="text-sm text-right mt-2">
                        <Link to="/forgot-password" className="text-blue-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </p>

                </Form>
                {error && <p>{error}</p>}
                {/* </div> */}
            </Card>
        </Container>
    );
};

export default Login;
