import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Row, Col } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ReviewsPage = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Layout user={user}>
      <Container className="mt-4">
        <h2 className="mb-4">Reviews</h2>
        {/* Add reviews table here */}
      </Container>
    </Layout>
  );
};

export default ReviewsPage;