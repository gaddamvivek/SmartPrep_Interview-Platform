import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import "./profile.css";

const ProfilePage = () => {
  const [email, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    headline: "",
    location: "",
    about: "",
    experiences: [],
    education: [],
    skills: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true); // Loading state

  // Combine the email and userName retrieval into a single useEffect
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');
    setUserEmail(storedEmail);
    setUserName(storedName);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (email) {
          const result = await axios.get(`http://localhost:5001/api/profile/getuserdata?email=${email}`);
          setProfileData(result.data); // Set the profile data from the server
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false); // Set loading state to false once data is fetched
      }
    };

    fetchProfileData();
  }, [email]); // Run the effect whenever email changes

  // Handle input changes
  const handleChange = (e, section, index, field) => {
    const value = e.target.value;

    if (section === "profile") {
      setProfileData((prevData) => ({ ...prevData, [field]: value }));
    } else if (profileData[section]) {
      const updatedSection = [...profileData[section]];
      updatedSection[index][field] = value;
      setProfileData((prevData) => ({ ...prevData, [section]: updatedSection }));
    }
  };

  const addEntry = (section, defaultEntry) => {
    setProfileData({
      ...profileData,
      [section]: [
        ...profileData[section],
        { ...defaultEntry, id: Date.now() }, // Adding an ID to each entry
      ],
    });
  };

  const saveProfile = async () => {
    try {
        const updatedProfileData = {
          ...profileData,
          name: userName,  // Add userName explicitly
          email: email,    // Add email explicitly
        };
        console.log(updatedProfileData); 
      const response = await axios.post("http://localhost:5001/api/profile/postuserdata", updatedProfileData);
      alert("Profile saved successfully");
      console.log(response.data); // Log the response data if needed
    } catch (error) {
      console.error("Error saving profile", error);
      alert("An error occurred while saving the profile. Please try again.");
    }
  };

  // If loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <form className="profile-form">
        <div className="profile-header">
          <h2>Profile Information</h2>
          <label>
            Name:
            <input type="text" value={userName} disabled />
          </label>
          <label>
            Email:
            <input type="email" value={email} disabled />
          </label>
          <label>
            Headline:
            <input
              type="text"
              value={profileData.headline}
              onChange={(e) => handleChange(e, "profile", null, "headline")}
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleChange(e, "profile", null, "location")}
            />
          </label>
        </div>

        <div className="about-section">
          <h2>About</h2>
          <textarea
            value={profileData.about}
            onChange={(e) => handleChange(e, "profile", null, "about")}
          />
        </div>

        {/* Experience Section */}
        <div className="profile-experiences-section">
          <h2>Experiences</h2>
          {profileData.experiences?.map((exp, index) => (
            <div key={exp.id}>
              <label>
                Role:
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleChange(e, "experiences", index, "role")}
                />
              </label>
              <label>
                Company:
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleChange(e, "experiences", index, "company")}
                />
              </label>
              <label>
                Duration:
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) => handleChange(e, "experiences", index, "duration")}
                />
              </label>
              <label>
                Description:
                <textarea
                  value={exp.description}
                  onChange={(e) => handleChange(e, "experiences", index, "description")}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry("experiences", { role: "", company: "", duration: "", description: "" })}
          >
            Add Experience
          </button>
        </div>

        {/* Education Section */}
        <div className="profile-education-section">
          <h2>Education</h2>
          {profileData.education?.map((edu, index) => (
            <div key={edu.id}>
              <label>
                School:
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => handleChange(e, "education", index, "school")}
                />
              </label>
              <label>
                Degree:
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleChange(e, "education", index, "degree")}
                />
              </label>
              <label>
                Year:
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => handleChange(e, "education", index, "year")}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry("education", { school: "", degree: "", year: "" })}
          >
            Add Education
          </button>
        </div>

        {/* Skills Section */}
        <div className="profile-skills-section">
          <h2>Skills</h2>
          {profileData.skills?.map((skill, index) => (
            <div key={skill.id}>
              <label>
                Skill:
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => handleChange(e, "skills", index, "name")}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry("skills", { name: "" })}
          >
            Add Skill
          </button>
        </div>

        {/* Projects Section */}
        <div className="profile-projects-section">
          <h2>Projects</h2>
          {profileData.projects?.map((project, index) => (
            <div key={project.id}>
              <label>
                Project Name:
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleChange(e, "projects", index, "name")}
                />
              </label>
              <label>
                Description:
                <textarea
                  value={project.description}
                  onChange={(e) => handleChange(e, "projects", index, "description")}
                />
              </label>
              <label>
                Technologies:
                <input
                  type="text"
                  value={project.technologies}
                  onChange={(e) => handleChange(e, "projects", index, "technologies")}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry("projects", { name: "", description: "", technologies: "" })}
          >
            Add Project
          </button>
        </div>

        <button type="button" onClick={saveProfile}>
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
