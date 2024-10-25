import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Webcam from 'react-webcam';
import PropTypes from 'prop-types'; // Import PropTypes

const TechAnswerInputs = ({ permissions, saveAnswer, currentAnswer, onSubmitAnswers }) => {
  const [recording, setRecording] = useState(false);
  const [transcriptText, setTranscriptText] = useState(currentAnswer || '');
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    setTranscriptText(currentAnswer || ''); // Update transcript when currentAnswer changes 
  }, [currentAnswer]);

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

  const toggleVideoRecording = () => {
    if (isVideoRecording) {
      mediaRecorderRef.current.stop();
      setIsVideoRecording(false);
    } else {
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
      };
      mediaRecorderRef.current.start();
    }
  };

  const saveVideo = async () => {
    if (videoBlob) {
      const formData = new FormData();
      formData.append('file', videoBlob, 'interview_video.webm');
      // Handle the video save here...
    }
  };

  return (
    <div>
      <h3>Your Answer</h3>
      
      {permissions.microphoneGranted ? (
        <div>
          {recording ? (
            <div>
              <p>recording answer</p>
            </div>
          ) : (
            <div>
              <p>press button to record answer</p>
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
      </div>

      {permissions.cameraGranted ? (
        <div className='video-container'>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam-feed"
          />
          <div>
            <button onClick={toggleVideoRecording}>
              {isVideoRecording ? 'Stop Video Recording' : 'Start Video Recording'}
            </button>
          </div>
          {videoBlob && (
            <div>
              <video src={URL.createObjectURL(videoBlob)} controls width="320" height="240" />
              <button onClick={saveVideo}>Save Video</button>
            </div>
          )}
        </div>
      ) : (
        <p>Camera permission is not granted. Video recording is disabled.</p>
      )}

      <div>
        <button onClick={onSubmitAnswers}>End Test</button>
      </div>
    </div>
  );
};
// Define prop types
TechAnswerInputs.propTypes = {
  permissions: PropTypes.shape({
    microphoneGranted: PropTypes.bool.isRequired, // Define specific structure for permissions object
    cameraGranted: PropTypes.bool.isRequired,
  }).isRequired,
  saveAnswer: PropTypes.func.isRequired,
  currentAnswer: PropTypes.string.isRequired, // Assuming currentAnswer is a string, adjust as needed
  onSubmitAnswers: PropTypes.func.isRequired,
};
export default TechAnswerInputs;
