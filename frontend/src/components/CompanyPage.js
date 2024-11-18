import React from 'react';
import { NavBar } from './NavBar';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const CompanyPage = () => {
  const { companyName } = useParams();
  
  // Static data for roles and company details (replace with API data if needed)
  const navigate = useNavigate();
  const companyDetails = {
    Amazon: {
      location: 'Seattle, Washington, United States',
      logo: '/amazon.png',
      careersLink: 'https://www.amazon.jobs/',
      roles: [
        { title: 'Python Developer I', description: 'Python Development (Level I)', id: 1, roundType: 'Coding' },
        { title: 'Python Developer II', description: 'Python Development (Level II)', id: 2, roundType: 'Coding' },
        { title: 'Frontend Technical', description: 'UI Development', id: 3, roundType: 'Technical' },
        { title: 'Backend Technical', description: 'API Development', id: 4, roundType: 'Technical' },
        { title: 'DevOps Technical', description: 'Infrastructure Automation', id: 5, roundType: 'Technical' },
        { title: 'Software Testing Technical', description: 'Software Quality Assurance', id: 6, roundType: 'Technical' },
      ],
    },
    Google: {
      location: 'Mountain View, California, United States',
      logo: '/google.png',
      careersLink: 'https://careers.google.com/',
      roles: [
        { title: 'Python Developer I', description: 'Python Development (Level I)', id: 1, roundType: 'Coding' },
        { title: 'Python Developer II', description: 'Python Development (Level II)', id: 2, roundType: 'Coding' },
        { title: 'Frontend Technical', description: 'UI Development', id: 3, roundType: 'Technical' },
        { title: 'Backend Technical', description: 'API Development', id: 4, roundType: 'Technical' },
        { title: 'DevOps Technical', description: 'Infrastructure Automation', id: 5, roundType: 'Technical' },
        { title: 'Software Testing Technical', description: 'Software Quality Assurance', id: 6, roundType: 'Technical' },
      ],
    },
  };

  const company = companyDetails[companyName] || { location: 'Unknown', roles: [] };
  const handleRoleSelect = (role) => {
    // Store the selected role in local storage
    localStorage.setItem('selectedRole', role.title);
    localStorage.setItem('selectedRound', role.roundType);
    localStorage.setItem('positionPath' , true);
    // console.log(`Role "${role.title}" stored in local storage.`);
  };
  return (
    <div className="h-full bg-[#e6dceb] flex flex-col justify-start font-rubik">
      {/* Navigation Bar */}
      <NavBar showProfile={true} showNewInterview={true} />

      {/* Main Content */}
      <div className="p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-8 mb-12">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center sm:w-1/3">
            <div className="mb-6">
              <img
                src={company.logo}
                alt={`${companyName} logo`}
                className="w-24 h-24 rounded-full mx-auto object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold">{companyName}</h1>
            <p className="text-gray-600 mt-2">{company.location}</p>
            <a
              href={company.careersLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg text-base hover:bg-purple-700"
            >
              Visit Careers Page
            </a>
          </div>

          <div className="sm:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.roles.map((role) => (
               <div 
               key={role.id} 
               className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:bg-gray-100"
               onClick={() => handleRoleSelect(role)}
             >
                <div className="mb-4">
                  <img
                    src={`/${companyName === 'Google' ? 'GRole.png' : 'ARole.png'}`}
                    alt={`${role.title}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-medium text-gray-800 text-center">{role.title}</h2>
                <p className="text-sm text-gray-500 text-center mt-2 mb-4">{role.description}</p>
                <p className="text-sm text-gray-500 text-center mt-1">{role.roundType}</p> 
                <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                onClick={() => navigate('/interviewdetails')}>
                Start Practice
              </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;