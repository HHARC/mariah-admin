import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import '../AdminLogin/AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import img from '../../assets/images/logo.png'
import { useAuth } from '../../contexts/authContext';
import { authService } from '../../services';

function AdminLogin() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { updateUser } = useAuth()

    
    const login = async (creds) => {
        setLoading(true);
        try {
            const result = await authService.login(creds);
            
            if (result.success && result.status === 200) {
                return { success: true, status: result.status, message: result.message }
            } else {
                return { success: false, error: result.error || 'Login failed' }
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: 'Login failed' }
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (loading) return; // Prevent multiple submissions

        const result = await login(credentials)

        if (result.success) {
            toast.success(result.message || 'Login Successful!');

            updateUser(credentials)

            setTimeout(() => {
                navigate('/Services');
            }, 2000);
        } else {
            toast.error(result.error || 'Invalid username or password');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <Container className="d-flex vh-100" style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <img src={img} alt="anas was here" className='position-fixed top-50 left-50 z-1' style={{ transform: 'translateY(-45%) translateX(-12%) scale(.9)' }} />
            <Row className="m-auto align-self-center w-100 position-relative z-2">
                <Col xs={12} md={6} lg={4} className="m-auto">
                    <Form onSubmit={handleSubmit} className="p-4 border rounded bg-dark text-light">
                        <h2 className="mb-3 text-center" style={{ color: '#7F89F0' }}>Admin Login</h2>
                        <Form.Group controlId="formBasicusername">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={credentials.username}
                                onChange={handleChange}
                                name="username"
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={handleChange}
                                name="password"
                            />
                        </Form.Group>
                        <Button 
                            style={{ backgroundColor: '#7F89F0', borderColor: '#0d8341', color: 'var(--bs-white)' }} 
                            type="submit" 
                            className="mt-3 w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </Form>
                </Col>
            </Row>
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </Container>
    );
}

export default AdminLogin;
