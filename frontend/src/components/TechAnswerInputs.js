import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Webcam from 'react-webcam';

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

  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true });
    setRecording(true);
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    setRecording(false);
    setTranscriptText(transcript);
    resetTranscript();
  };

  const startVideoRecording = () => {
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
  };

  const stopVideoRecording = () => {
    setIsVideoRecording(false);
    mediaRecorderRef.current.stop();
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
          <button onClick={startRecording} disabled={recording}>Record Answer</button>
          <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
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
        <div className='Video'>
          <div>
          <Webcam audio={true} ref={webcamRef} screenshotFormat="image/jpeg" width="320" height="240"/>
          <div>
            <button onClick={startVideoRecording} disabled={isVideoRecording}>Start Video Recording</button>
            <button onClick={stopVideoRecording} disabled={!isVideoRecording}>Stop Video Recording</button>
          </div>
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
        <button onClick={onSubmitAnswers}>Submit All Answers</button>
      </div>
    </div>
  );
};

export default TechAnswerInputs;
