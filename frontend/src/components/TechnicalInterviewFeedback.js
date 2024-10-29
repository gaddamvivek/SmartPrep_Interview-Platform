import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TechnicalInterviewFeedback.css';

const TechnicalInterviewFeedback = () => {
  const [feedbackData, setFeedbackData] = useState(null);
  const userEmail = localStorage.getItem('userEmail');
  const preparationName = localStorage.getItem('pname');
  const savedVideoUrl = localStorage.getItem('savedVideoUrl');
  const [showVideo, setShowVideo] = useState(false);
  const [review, setReview] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/technicalSession/technicalFeedback?userEmail=${userEmail}&preparationName=${preparationName}`);
        setFeedbackData(response.data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };
    fetchFeedbackData();
    setUserId(localStorage.getItem('userId'));
  }, [userEmail, preparationName]);

  const handleSubmitFeedback = async () => {
    try {
      const feedbackData = {
        passedTestCases: 0,
        totalTestCases: 0,
        review: mapReviewToNumber(review),
        feedback,
        userId: userId || null
      };
      const response = await axios.post('http://localhost:5001/api/feedback/submit', feedbackData);

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
    switch (rating) {
      case 'Excellent': return 5;
      case 'Good': return 4;
      case 'Medium': return 3;
      case 'Poor': return 2;
      case 'Very Bad': return 1;
      default: return 0;
    }
  };

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