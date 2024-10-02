import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './feedback.css';  // Ensure you have the CSS file linked for styling

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { passedTestCases, totalTestCases } = location.state || { passedTestCases: 0, totalTestCases: 0 };

  const [review, setReview] = useState('');  // Initially store the selected string rating
  const [feedback, setFeedback] = useState('');  // User feedback
  const [message, setMessage] = useState('');  // Success or error message
  const [userId, setUserId] = useState(null);  // Store userId, default is null

  // Function to map the selected review to a numeric value
  const mapReviewToNumber = (rating) => {
    switch (rating) {
      case 'Excellent':
        return 5;
      case 'Good':
        return 4;
      case 'Medium':
        return 3;
      case 'Poor':
        return 2;
      case 'Very Bad':
        return 1;
      default:
        return 0;
    }
  };

  // Fetch userId if necessary (e.g., from a token, API call, or localStorage)
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setUserId(null);
    }
  }, []);

  const handleSubmitFeedback = async () => {
    try {
      const feedbackData = {
        passedTestCases,
        totalTestCases,
        review: mapReviewToNumber(review),  // Convert string rating to a numeric value
        feedback,
        userId: userId || null  // Set to null if userId is not available
      };

      const response = await axios.post('http://localhost:5001/api/feedback/submit', feedbackData);

      if (response.status === 201) {
        setMessage('Thank you for your feedback! Redirecting to dashboard...');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000); // 3-second delay
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('Failed to submit feedback');
    }
  };

  return (
    <div className="feedback-container font-inconsolata">
      <h2>Your Performance</h2>
      <p>You passed {passedTestCases} out of {totalTestCases} test cases.</p>

      <h3>How was your interview experience?</h3>
      <div className="feedback-review font-inconsolata">
        <ul>
          <li
            className={`feedback-option excellent ${review === 'Excellent' ? 'selected' : ''}`}
            onClick={() => setReview('Excellent')}
          >
            <i className="fas fa-smile-beam"></i>
            <span>Excellent</span>
          </li>
          <li
            className={`feedback-option good ${review === 'Good' ? 'selected' : ''}`}
            onClick={() => setReview('Good')}
          >
            <i className="fas fa-smile"></i>
            <span>Good</span>
          </li>
          <li
            className={`feedback-option medium ${review === 'Medium' ? 'selected' : ''}`}
            onClick={() => setReview('Medium')}
          >
            <i className="fas fa-meh"></i>
            <span>Medium</span>
          </li>
          <li
            className={`feedback-option poor ${review === 'Poor' ? 'selected' : ''}`}
            onClick={() => setReview('Poor')}
          >
            <i className="fas fa-frown"></i>
            <span>Poor</span>
          </li>
          <li
            className={`feedback-option very-bad ${review === 'Very Bad' ? 'selected' : ''}`}
            onClick={() => setReview('Very Bad')}
          >
            <i className="fas fa-angry"></i>
            <span>Very Bad</span>
          </li>
        </ul>
      </div>

      <h3>Leave a Feedback</h3>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Leave your feedback here"
        className="feedback-textarea"
      />

      <button onClick={handleSubmitFeedback} className="submit-feedback-button">Submit Feedback</button>

      {message && <p className="feedback-message">{message}</p>}
    </div>
  );
};

export default Feedback;