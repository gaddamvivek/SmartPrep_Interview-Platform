import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './feedback.css';

const FeedbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, prName, passedTestCases, totalTestCases, userName } =
    location.state || {
      userId: '',
      prName: '',
      passedTestCases: 0,
      totalTestCases: 0,
      userName: '',
    };

  const [sessionDetails, setSessionDetails] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [review, setReview] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showSolutions, setShowSolutions] = useState(false);
  const [message, setMessage] = useState('');
  const [viewUserSolution, setViewUserSolution] = useState(false);
  const [viewCorrectSolution, setViewCorrectSolution] = useState(false);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!userId || !prName) {
        setMessage('User ID or Preparation name is missing');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5001/api/feedback/sessions/details/${userId}/${prName}`
        );
        setSessionDetails(response.data || []);
      } catch (error) {
        console.error('Error fetching session details:', error);
        setMessage('Error fetching session details');
      }
    };

    fetchSessionDetails();
  }, [userId, prName]);

  const handleQuestionSelect = (index) => {
    setSelectedQuestionIndex(index);
    setViewUserSolution(false);
    setViewCorrectSolution(false);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const feedbackData = sessionDetails.map((session) => ({
        passedTestCases: session.passedTestCases,
        totalTestCases: session.totalTestCases,
        review: mapReviewToNumber(review),
        feedback,
        userId,
        userName,
        questionId: session.questionID,
        solution: session.userSolution,
      }));

      await Promise.all(
        feedbackData.map(async (data) => {
          await axios.post('http://localhost:5001/api/feedback/submit', data);
        })
      );

      setMessage('Thank you for your feedback! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('Failed to submit feedback');
    }
  };

  const mapReviewToNumber = (rating) =>
    ({
      Excellent: 5,
      Good: 4,
      Medium: 3,
      Poor: 2,
      'Very Bad': 1,
    })[rating] || 0;

  return (
    <div className="feedback-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">PrepSmart</div>
        <div className="navbar-right">{userId ? userId.split('@')[0] : ''}</div>
      </div>

      <h2>Feedback Page</h2>

      <button
        className="view-solutions-button"
        onClick={() => setShowSolutions(!showSolutions)}
      >
        {showSolutions ? 'Hide Solutions' : 'View Solutions'}
      </button>

      {showSolutions && (
        <div>
          <div className="question-buttons">
            {sessionDetails.map((_, index) => (
              <button
                key={index}
                className={`question-button ${selectedQuestionIndex === index ? 'active' : ''}`}
                onClick={() => handleQuestionSelect(index)}
              >
                Question {index + 1}
              </button>
            ))}
          </div>

          {sessionDetails.length > 0 && (
            <div className="session-item">
              <h3>{sessionDetails[selectedQuestionIndex].title}</h3>
              <p>
                <strong>Description:</strong>{' '}
                {sessionDetails[selectedQuestionIndex].description}
              </p>

              {/* <p className="test-cases-passed"> Test Cases Passed: {passedTestCases}/{totalTestCases} </p> */}

              <button
                className={`solution-toggle-button ${viewUserSolution ? 'active' : ''}`}
                onClick={() => setViewUserSolution(!viewUserSolution)}
              >
                {viewUserSolution ? 'Hide User Solution' : 'View User Solution'}
              </button>

              <button
                className={`solution-toggle-button ${viewCorrectSolution ? 'active' : ''}`}
                onClick={() => setViewCorrectSolution(!viewCorrectSolution)}
              >
                {viewCorrectSolution
                  ? 'Hide Correct Solution'
                  : 'View Correct Solution'}
              </button>

              {viewUserSolution && (
                <div>
                  <p>
                    <strong>Your Solution:</strong>
                  </p>
                  <pre>
                    {sessionDetails[selectedQuestionIndex].userSolution}
                  </pre>
                </div>
              )}

              {viewCorrectSolution && (
                <div>
                  <p>
                    <strong>Correct Solution:</strong>
                  </p>
                  <pre>
                    {sessionDetails[selectedQuestionIndex].correctSolution}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmitFeedback}>
        <h3>How was your experience?</h3>
        <div className="feedback-options">
          {['Excellent', 'Good', 'Medium', 'Poor', 'Very Bad'].map((rating) => (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={review === rating}
                onChange={() => setReview(rating)}
              />
              {rating}
            </label>
          ))}
        </div>

        <h3>Leave Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts here"
          className="feedback-textarea"
          required
        />

        <button type="submit" className="submit-feedback-button">
          Submit Feedback
        </button>
      </form>

      {message && <p className="feedback-message">{message}</p>}
    </div>
  );
};

export default FeedbackPage;
