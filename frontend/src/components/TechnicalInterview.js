import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import TechAnswerInputs from './TechAnswerInputs';

const TechnicalInterview = ({ permissions }) => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    fetchQuestions();
  }, [difficulty]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`/api/tech/getRandomTechnicalQuestions?difficulty=${difficulty}`);
      setQuestions(response.data);
      setCurrentQuestionIndex(0); // Reset to first question when difficulty changes
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true });
    setRecording(true);
  };

  const stopRecording = async () => {
    SpeechRecognition.stopListening();
    setRecording(false);

    // Save the transcript to the answers state
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion._id]: transcript,
      }));

      // Save answer to the server
      try {
        await axios.post('/api/tech/get/RecordAnswer', {
          questionId: currentQuestion._id,
          transcript,
        });
        console.log('Answer saved successfully');
      } catch (error) {
        console.error('Error saving answer:', error);
      }
    }
    resetTranscript();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log('Captured image:', imageSrc);
    // Save or upload the image to the server
    try {
      await axios.post('/api/tech/capturePhoto', { imageSrc });
      console.log('Image captured successfully');
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };
  const saveAnswer = (answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: answer,
    }));
    alert('Answer saved!');
  };

  const submitAnswers = async () => {
    const intervieweeId = '12345'; // Replace with actual interviewee ID
    const formattedAnswers = Object.values(answers);

    try {
      await axios.post('http://localhost:5001/api/submit-answers', {
        intervieweeId,
        answers: formattedAnswers,
      });
      alert('Answers submitted successfully');
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Error submitting answers');
    }
  };

  return (
    <div>
      <h1>Technical Interview Platform</h1>

      {/* Difficulty selection */}
      <div>
        <label>Select Difficulty: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Display Single Question */}
      <div>
        {questions.length > 0 && (
          <div>
            <h2>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].title}</h2>
            <p>{questions[currentQuestionIndex].description}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons for Questions */}
      <div>
        <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
          Previous Question
        </button>
        <button onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
          Next Question
        </button>
      </div>

      <TechAnswerInputs 
        permissions={permissions}
        saveAnswer={saveAnswer}
        currentAnswer={answers[currentQuestionIndex]}
        onSubmitAnswers={submitAnswers}
      />
    </div>
  );
};

export default TechnicalInterview;
