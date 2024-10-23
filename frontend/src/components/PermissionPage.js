import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PermissionPage = ({ onPermissionGranted }) => {
  const [cameraGranted, setCameraGranted] = useState(false);
  const [microphoneGranted, setMicrophoneGranted] = useState(false);
  const [mediaStream, setMediaStream] = useState(null); // Store media stream
  const [micStream, setMicStream] = useState(null);  // Store the microphone media stream

  const handleCameraPermission = async () => {
    if (cameraGranted) {
      // If the camera is currently on, stop the media stream
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());  // Stop all tracks
      }
      setCameraGranted(false);  // Update state to reflect camera is off
      setMediaStream(null);  // Clear the media stream reference
    } else {
      // If the camera is off, request permission and turn it on
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraGranted(true);  // Update state to reflect camera is on
        setMediaStream(stream);  // Store the media stream reference
      } catch (error) {
        console.error('Camera permission denied:', error);
        setCameraGranted(false);
      }
    }
  };
  

  const handleMicrophonePermission = async () => {
    if (microphoneGranted) {
      // If microphone is already granted, stop the media stream
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());  // Stop all audio tracks
      }
      setMicrophoneGranted(false);  // Update state to reflect microphone is off
      setMicStream(null);  // Clear the microphone stream reference
    } else {
      // Request permission and turn on the microphone
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicrophoneGranted(true);  // Update state to reflect microphone is on
        setMicStream(stream);  // Store the media stream reference
      } catch (error) {
        console.error('Microphone permission denied:', error);
        setMicrophoneGranted(false);
      }
    }
  };

  const proceedToInterview = () => {
    onPermissionGranted({ cameraGranted, microphoneGranted });
  };

  return (
    <div>
      <h1>Welcome to the Technical Interview</h1>

      <div>
        <h2>How the Interview Works</h2>
        <p>
          You will be asked coding questions and recorded during your responses. Ensure your camera and microphone are set up correctly.
        </p>
      </div>

      {/* Permissions Request */}
      <div>
        <h3>Permissions</h3>
        <div>
          <label>
            <input
              type="checkbox"
              checked={cameraGranted}
              onChange={handleCameraPermission}
            />
            Enable Camera
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={microphoneGranted}
              onChange={handleMicrophonePermission}
            />
            Enable Microphone
          </label>
        </div>
        <button onClick={proceedToInterview}>
          Proceed to Interview
        </button>
      </div>
    </div>
  );
};

PermissionPage.propTypes = {
  onPermissionGranted: PropTypes.func.isRequired,
};

// Add PropTypes validation
PermissionPage.propTypes = {
  onPermissionGranted: PropTypes.func.isRequired, // Validate that onPermissionGranted is a function and is required
};

export default PermissionPage;
