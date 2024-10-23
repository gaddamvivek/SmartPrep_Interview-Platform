import React, { useState } from 'react';
import PermissionPage from './PermissionPage';
import TechnicalInterview from './TechnicalInterview';

const InterviewContainer = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissions, setPermissions] = useState({ cameraGranted: false, microphoneGranted: false });

  const handlePermissionGranted = (grantedPermissions) => {
    setPermissions(grantedPermissions);
    setPermissionGranted(true); // Move to interview
  };

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
