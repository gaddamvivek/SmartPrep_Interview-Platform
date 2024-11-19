import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Webcam from 'react-webcam';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactMarkdown from "react-markdown";  // for parsing ai message from gemini
import remarkGfm from "remark-gfm";

const TechAnswerInputs = ({ permissions, saveAnswer, currentAnswer, onSubmitAnswers, currentQuestionIndex, questionId }) => {
  const [recording, setRecording] = useState(false);
  const [transcriptText, setTranscriptText] = useState(currentAnswer || '');
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [aiFeedback, setAiFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    setTranscriptText(currentAnswer || '');
  }, [currentAnswer, currentQuestionIndex]);

  useEffect(() => {
    // Reset recording state and transcript each time the question changes
    setRecording(false);
    resetTranscript();
  }, [currentQuestionIndex]);

  const handleTranscriptChange = (e) => {
    setTranscriptText(e.target.value);
  };

  const toggleRecording = () => {
    if (recording) {
      SpeechRecognition.stopListening();
      setRecording(false);
      setTranscriptText(transcript);
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setRecording(true);
    }
  };

  const startVideoRecording = () => {
    if (webcamRef.current && webcamRef.current.stream) {
      setIsVideoRecording(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm',
      });
      const videoChunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunks.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
        setVideoBlob(videoBlob);

        // Save the video blob URL to local storage
        const videoUrl = URL.createObjectURL(videoBlob);
        localStorage.setItem('savedVideoUrl', videoUrl);
      };
      mediaRecorderRef.current.start();
    } else {
      console.error("Webcam stream is not available for recording.");
    }
  };

  const stopVideoRecording = () => {
    if (isVideoRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsVideoRecording(false);
    }
  };

  const handleGenerateAIAnswerFeedback = async () => {
    if (!questionId || !currentAnswer) {
      alert("Unable to generate feedback. Ensure your answer is available.");
      return;
    }

    try {
      setAiFeedback("Generating Ai feedback.... might take a minute... please wait");
      setShowFeedbackModal(true); 
      const response = await axios.post(`http://localhost:5001/api/tech/aiFeedback`, {
        questionId,
        answer: currentAnswer,
      });

      const feedback = response.data.feedback;
      setAiFeedback(feedback);
      setShowFeedbackModal(true);
    } catch (error) {
      setShowFeedbackModal(false);
      console.error("Error generating AI feedback:", error);
      alert("Failed to get AI feedback. Please try again.");
    }
  };

  const handleEndSession = () => {
    stopVideoRecording();
    localStorage.removeItem('positionPath');
    onSubmitAnswers();
  };

  // Start recording when webcam stream is ready
  const handleUserMedia = () => {
    if (permissions.cameraGranted) {
      startVideoRecording();
    }
  };

  const closeModal = () => {
    setShowFeedbackModal(false);
  };

  return (
    <div>
      <h3>Your Answer</h3>
      
      {permissions.microphoneGranted ? (
        <div>
          {recording ? (
            <div>
              <p>Recording answer</p>
            </div>
          ) : (
            <div>
              <p>Press button to record answer</p>
            </div>
          )}
          <button onClick={toggleRecording}>
            {recording ? 'Stop Recording' : 'Start Recording'}
          </button>
          
          <p>Transcript: {transcript}</p>
        </div>
      ) : (
        <p>Microphone permission is not granted. You can type your answer below.</p>
      )}

      <textarea 
        value={transcriptText} 
        onChange={handleTranscriptChange} 
        rows="5" 
        cols="60"
      />
      <div>
        <button onClick={() => saveAnswer(transcriptText)}>Save Answer</button>
        <button onClick={handleGenerateAIAnswerFeedback}>Get AI Feedback</button>
      </div>

      {permissions.cameraGranted ? (
        <div className='video-container'>
          <Webcam
            audio={permissions.microphoneGranted}
            muted={true}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam-feed"
            onUserMedia={handleUserMedia}  // Trigger recording when webcam stream is ready
          />
          {videoBlob && (
            <div>
              <p>Video saved in local storage.</p>
            </div>
          )}
        </div>
      ) : (
        <p>Camera permission is not granted. Video recording is disabled.</p>
      )}

      <div>
        <button onClick={handleEndSession}>End Test</button>
      </div>

      {showFeedbackModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
        <button
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white focus:outline-none"
          onClick={closeModal}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">AI Feedback</h3>
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg max-w-3xl mx-auto">
        <ReactMarkdown
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
          remarkPlugins={[remarkGfm]}
        >
          {aiFeedback}
        </ReactMarkdown>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

// Define prop types
TechAnswerInputs.propTypes = {
  permissions: PropTypes.shape({
    microphoneGranted: PropTypes.bool.isRequired,
    cameraGranted: PropTypes.bool.isRequired,
  }).isRequired,
  saveAnswer: PropTypes.func.isRequired,
  currentAnswer: PropTypes.string.isRequired,
  onSubmitAnswers: PropTypes.func.isRequired,
  currentQuestionIndex: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired,
};

export default TechAnswerInputs;
