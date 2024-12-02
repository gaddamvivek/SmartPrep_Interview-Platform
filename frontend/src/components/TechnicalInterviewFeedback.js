import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './TechnicalInterviewFeedback.css';

const TechnicalInterviewFeedback = () => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user details from either localStorage or route state
  const userEmail = localStorage.getItem('userEmail') || location.state?.userId;
  const preparationName = localStorage.getItem('pname') || location.state?.prName;
  const savedVideoUrl = localStorage.getItem('savedVideoUrl');

  const [showVideo, setShowVideo] = useState(false);
  const [review, setReview] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Validate user email and preparation name
    if (!userEmail || !preparationName) {
      setError('Missing user information. Please log in again.');
      return;
    }

    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get(`https://icsi518-team1-prepsmart.onrender.com/api/technicalSession/technicalFeedback`, {
          params: {
            userEmail: userEmail,
            preparationName: preparationName
          }
        });
         // `http://localhost:5001/api/technicalSession/technicalFeedback`

        // Additional validation of response
        if (!response.data) {
          setError('No feedback data found for this session.');
          return;
        }

        setFeedbackData(response.data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
        setError('Failed to fetch feedback. Please try again later.');
      }
    };

    fetchFeedbackData();
    setUserId(localStorage.getItem('userId'));
  }, [userEmail, preparationName]);

  const handleSubmitFeedback = async () => {
    // Validate before submission
    if (!review || !feedback) {
      setMessage('Please provide a rating and feedback');
      return;
    }

    try {
      const submissionData = {
        review: mapReviewToNumber(review),
        passedTestCases: feedbackData?.session?.passedTestCases || 0,
        totalTestCases: feedbackData?.session?.totalTestCases || 0,
        feedback,
        userId: userId || null,
        userEmail: userEmail,
        preparationName: preparationName
      };

      const response = await axios.post('https://icsi518-team1-prepsmart.onrender.com/api/feedback/submit', submissionData);
      // 'http://localhost:5001/api/feedback/submit'
      if (response.status === 201) {
        setMessage('Thank you for your feedback! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('Failed to submit feedback');
    }
  };

  const mapReviewToNumber = (rating) => {
    const ratingMap = {
      'Excellent': 5,
      'Good': 4,
      'Medium': 3,
      'Poor': 2,
      'Very Bad': 1
    };
    return ratingMap[rating] || 0;
  };

  // Error handling
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
      </div>
    );
  }

  // Loading state
  if (!feedbackData) return <div>Loading...</div>;

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">PrepSmart</div>
        <div className="navbar-right">{userEmail ? userEmail.split('@')[0] : ''}</div>
      </nav>

      <div className="feedback-page">
        {/* Q&A Section */}
        <div className="feedback-container">
          <h2 className="feedback-header">Technical Interview Feedback</h2>
          {feedbackData.questions && feedbackData.questions.length > 0 ? (
            feedbackData.questions.map((question, index) => (
              <div key={index} className="feedback-question">
                <h3 className="question-title">Question {index + 1}: {question.title}</h3>
                <div className="answer-section">
                  <p className="user-answer"><strong>Your Answer:</strong> {question.userSolution}</p>
                  <ExpandableText text={question.correctSolution} />
                </div>
              </div>
            ))
          ) : (
            <p>No feedback available for this session.</p>
          )}
        </div>

        {/* Video and Rating Section */}
        <div className="video-container">
          <h3 className="video-title">Interview Recording</h3>
          <div className="video-wrapper">
            <video src={savedVideoUrl} controls className={`video-player ${showVideo ? 'video-visible' : ''}`} />
            {!showVideo && (
              <div className="blur-overlay">
                <button className="show-video-button" onClick={() => setShowVideo(true)}>Show Video</button>
              </div>
            )}
          </div>

          {/* Rating and Feedback Section */}
          <div className="rating-feedback-section">
            <h3>Rate Your Experience</h3>
            <div className="feedback-review">
              <ul>
                <li className={`feedback-option excellent ${review === 'Excellent' ? 'selected' : ''}`} onClick={() => setReview('Excellent')}>
                  <i className="fas fa-smile-beam"></i><span>Excellent</span>
                </li>
                <li className={`feedback-option good ${review === 'Good' ? 'selected' : ''}`} onClick={() => setReview('Good')}>
                  <i className="fas fa-smile"></i><span>Good</span>
                </li>
                <li className={`feedback-option medium ${review === 'Medium' ? 'selected' : ''}`} onClick={() => setReview('Medium')}>
                  <i className="fas fa-meh"></i><span>Medium</span>
                </li>
                <li className={`feedback-option poor ${review === 'Poor' ? 'selected' : ''}`} onClick={() => setReview('Poor')}>
                  <i className="fas fa-frown"></i><span>Poor</span>
                </li>
                <li className={`feedback-option very-bad ${review === 'Very Bad' ? 'selected' : ''}`} onClick={() => setReview('Very Bad')}>
                  <i className="fas fa-angry"></i><span>Very Bad</span>
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
        </div>
      </div>
    </div>
  );
};

// Expandable text component for displaying long solutions
const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="correct-solution">
      <p><strong>Correct Answer:</strong> {isExpanded ? text : `${text.slice(0, 100)}...`}</p>
      {text.length > 100 && (
        <span className="show-more-link" onClick={toggleExpand}>{isExpanded ? "Show less" : "Show more"}</span>
      )}
    </div>
  );
};

// PropTypes for ExpandableText
ExpandableText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default TechnicalInterviewFeedback;