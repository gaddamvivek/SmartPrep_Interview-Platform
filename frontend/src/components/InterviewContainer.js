import React, { useState, useEffect } from 'react';
import PermissionPage from './PermissionPage';
import TechnicalInterview from './TechnicalInterview';

const InterviewContainer = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissions, setPermissions] = useState({ cameraGranted: false, microphoneGranted: false });

  const handlePermissionGranted = (grantedPermissions) => {
    setPermissions(grantedPermissions);
    setPermissionGranted(true); // Move to interview
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "if you leave the page or reload the page progress will not be saved";  // Required for showing the confirmation dialog
    };

    const handlePopState = (event) => {
      event.preventDefault();
      alert("Are you sure you want to go back? Progress will not be saved.");
      // Push the current state again to prevent the back navigation
      window.history.pushState(null, null, window.location.pathname);
    };

    // Add an initial history state to prevent back navigation
    window.history.pushState(null, null, window.location.pathname);

    // Add the event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Cleanup: Remove the event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div>
      {!permissionGranted ? (
        <PermissionPage onPermissionGranted={handlePermissionGranted} />
      ) : (
        <TechnicalInterview permissions={permissions} />
      )}
    </div>
  );
};

export default InterviewContainer;
