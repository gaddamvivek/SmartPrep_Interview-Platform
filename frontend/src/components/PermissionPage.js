import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PermissionPage = ({ onPermissionGranted }) => {
  const [cameraGranted, setCameraGranted] = useState(false);
  const [microphoneGranted, setMicrophoneGranted] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [micStream, setMicStream] = useState(null);

  const handleCameraPermission = async () => {
    if (cameraGranted) {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      setCameraGranted(false);
      setMediaStream(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraGranted(true);
        setMediaStream(stream);
      } catch (error) {
        console.error('Camera permission denied:', error);
        setCameraGranted(false);
      }
    }
  };

  const handleMicrophonePermission = async () => {
    if (microphoneGranted) {
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
      setMicrophoneGranted(false);
      setMicStream(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicrophoneGranted(true);
        setMicStream(stream);
      } catch (error) {
        console.error('Microphone permission denied:', error);
        setMicrophoneGranted(false);
      }
    }
  };

  const proceedToInterview = () => {
    localStorage.setItem('interviewSessionActive', 'true');
    onPermissionGranted({ cameraGranted, microphoneGranted });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl text-black font-semibold text-center mb-6">Welcome</h1>
        <h2 className="text-xl font-semibold text-center mb-4">Technical Interview</h2>
        <p className="text-center mb-8">30 minutes</p>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-200 rounded-full">⏱</div>
            <p className="ml-4 text-gray-700">Test will run for 30 minutes. This is a timed test. At the end, responses will be auto-saved.</p>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-200 rounded-full">⏸</div>
            <p className="ml-4 text-gray-700">You cannot pause the test. Make sure you have time for it.</p>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-200 rounded-full">🔍</div>
            <p className="ml-4 text-gray-700">This is a mock test , so Honesty is the best policy.</p>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-200 rounded-full">📶</div>
            <p className="ml-4 text-gray-700">Ensure you have a stable internet connection.</p>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-200 rounded-full">💾</div>
            <p className="ml-4 text-gray-700">ensure you haved saved an answer before you move to next one</p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Permissions</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={cameraGranted}
              onChange={handleCameraPermission}
              className="mr-2"
            />
            <label className="text-gray-700">Enable Camera</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={microphoneGranted}
              onChange={handleMicrophonePermission}
              className="mr-2"
            />
            <label className="text-gray-700">Enable Microphone</label>
          </div>
        </div>

        <button
          onClick={proceedToInterview}
          className="mt-6 w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Proceed to Interview
        </button>
      </div>
    </div>
  );
};

PermissionPage.propTypes = {
  onPermissionGranted: PropTypes.func.isRequired,
};

export default PermissionPage;
