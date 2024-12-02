import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after timeout
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown'; // For parsing AI messages from Gemini
import remarkGfm from 'remark-gfm';

const IDE = ({ QuestionId, savedCode, handleSaveCode, savedCodeMap }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [userEmail, setUserEmail] = useState('');
  const [prName, setPrName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [position, setPosition] = useState('');
  const [diff, setDiff] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setCode(savedCode || '');
  }, [QuestionId, savedCode]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    setUserEmail(storedEmail);
  }, []);

  useEffect(() => {
    const storedPname = localStorage.getItem('pname');
    console.log(storedPname);
    setPrName(storedPname);
  }, []);

  useEffect(() => {
    const storedPosition = localStorage.getItem('selectedPosition');
    console.log(storedPosition);
    setPosition(storedPosition);
  }, []);

  useEffect(() => {
    const storedDifficulty = localStorage.getItem('selectedDifficulty');
    console.log(storedDifficulty);
    setDiff(storedDifficulty);
  }, []);

  useEffect(() => {
    const storedStartDate = localStorage.getItem('codingSessionStartDate');
    console.log(storedStartDate);
    setStartDate(storedStartDate);
  }, []);

  useEffect(() => {
    const storedStartTime = localStorage.getItem('codingSessionStartTime');
    console.log(storedStartTime);
    setStartTime(storedStartTime);
  }, []);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/Questions/${QuestionId}`
        );
        setTestCases(res.data.testCases);
      } catch (error) {
        console.error('Error fetching Question:', error);
      }
    };

    if (QuestionId) fetchQuestion();
  }, [QuestionId]);

  const handleSave = () => {
    handleSaveCode(QuestionId, code);
    setSubmitted(true);
    setSaveMessage('Your code is saved successfully!');
    setTimeout(() => {
      setSaveMessage('');
    }, 5000);
  };

  useEffect(() => {
    if (timeRemaining <= 0) {
      alert("Time's up! Redirecting to the feedback page.");
      handleEndTest();
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeRemaining, navigate]);

  const handleFontSizeChange = (e) => {
    setFontSize(Number(e.target.value));
  };

  const handleSubmit = async () => {
    try {
      const result = await axios.post(
        'http://localhost:5001/api/auth/testsubmit',
        {
          solutions: savedCodeMap,
        }
      );
      console.log('Server response:', result.data);

      if (result) {
        console.log('Question and saved for testing');
      }

      setSubmitted(true);
      setSaveMessage('Session data saved successfully!');
      setTimeout(() => {
        setSaveMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error saving question and session:', error);
      alert('Error saving question and session');
    }

    try {
      const res = await axios.post('http://localhost:5001/api/submit', {
        code: code,
        testCases: testCases,
      });

      const { stdout, stderr, status } = res.data;
      const outputResult =
        stdout || stderr || `Execution status: ${status.description}`;
      setOutput(outputResult);

      const passedTestCases = res.data.passedTestCases || testCases.length;
      const totalTestCases = res.data.totalTestCases || testCases.length;
      setTestResults({
        passed: passedTestCases,
        total: totalTestCases,
        outputs: res.data.outputs || [],
      });
    } catch (error) {
      console.error('Error during submission:', error);
      setOutput('Error during submission');
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleEndTest = async () => {
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    const formattedTime = today.toLocaleTimeString('en-GB');

    try {
      const totalInterviewTimeInSeconds = 30 * 60 - timeRemaining;
      const formattedTimeTaken = formatTime(totalInterviewTimeInSeconds);

      localStorage.removeItem('codingSessionActive');
      localStorage.removeItem('sessionQuestions');
      localStorage.removeItem('positionPath');
      localStorage.removeItem('selectedRole');
      localStorage.removeItem('selectedRound');
      localStorage.removeItem('companySelected');

      const result = await axios.post(
        'http://localhost:5001/api/auth/sessions',
        {
          userEmail: userEmail,
          preparationName: prName,
          positionName: position,
          prepDiff: diff,
          sessionStartDate: startDate,
          sessionEndDate: formattedDate,
          sessionStartTime: startTime,
          sessionEndTime: formattedTime,
          timeTaken: formattedTimeTaken,
          solutions: savedCodeMap,
        }
      );

      if (result) {
        console.log('Session saved');
      }

      navigate('/feedback', {
        state: {
          userId: userEmail,
          prName: prName,
          passedTestCases: testResults?.passed || 0,
          totalTestCases: testResults?.total || 0,
          questionId: QuestionId,
          solution: code,
        },
      });

      alert('Session data saved successfully!');
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving session');
    }
  };

  const handleGetAIFeedback = async () => {
    try {
      setFeedbackContent(
        'Generating AI feedback.... might take a minute... please wait'
      );
      setShowFeedbackModal(true);
      const response = await axios.post(
        'http://localhost:5001/api/Questions/feedback',
        {
          sourceCode: code,
          questionId: QuestionId,
        }
      );

      const feedback = response.data.feedback;
      setFeedbackContent(feedback);
      setShowFeedbackModal(true);
    } catch (error) {
      console.log('Error getting AI feedback:', error);
      alert('Failed to get AI feedback');
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            <span className="text-green-500">{`</>`}</span>Code
          </h2>
          <div className="flex items-center gap-2 p-2">
            <div htmlFor="fontSize" className="font-semibold flex items-center">
              Font Size:
            </div>
            <select
              id="fontSize"
              value={fontSize}
              onChange={handleFontSizeChange}
              className="outlino-none border border-gray-300 rounded-md p-1"
            >
              <option value={14}>14</option>
              <option value={16}>16</option>
              <option value={18}>18</option>
              <option value={20}>20</option>
              <option value={22}>22</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>
        <Editor
          height="500px"
          defaultLanguage="python"
          options={{
            fontSize: fontSize,
          }}
          value={code}
          onChange={(value) => setCode(value)}
        />
      </div>

      <div className="buttons">
        <p>Code Editor</p>
        <button onClick={handleSave}>Save Code</button>
        <button onClick={handleSubmit}>Submit</button>
        {submitted && (
          <button onClick={handleGetAIFeedback}>AI feedback</button>
        )}
        <button onClick={handleEndTest}>End Test</button>
      </div>
      {saveMessage && (
        <p className="text-green-700 text-lg font-semibold mt-2">
          {saveMessage}
        </p>
      )}
      {showFeedbackModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 h-1/2 overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">AI Feedback</h2>
              <button
                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white focus:outline-none"
                onClick={() => setShowFeedbackModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg max-w-3xl mx-auto">
              <ReactMarkdown
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
                remarkPlugins={[remarkGfm]}
              >
                {feedbackContent}
              </ReactMarkdown>
            </div>
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setShowFeedbackModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 mt-4 overflow-auto">
        <pre className="w-full p-4 rounded-md shadow-md">{output}</pre>
      </div>
    </div>
  );
};

IDE.propTypes = {
  QuestionId: PropTypes.string.isRequired,
  savedCode: PropTypes.string.isRequired,
  handleSaveCode: PropTypes.func.isRequired,
  savedCodeMap: PropTypes.object.isRequired,
};

export default IDE;
