import React from 'react';
import { useParams } from 'react-router-dom';

const CompanyPage = () => {
  const { companyName } = useParams();

  // Static data for roles and company details (replace with API data if needed)
  const companyDetails = {
    Amazon: {
      location: 'Seattle, Washington, United States',
      roles: [
        { title: 'Frontend Engineer', description: 'UI Development', id: 1 },
        { title: 'Backend Engineer', description: 'API Development', id: 2 },
        { title: 'Data Analyst', description: 'Data Processing', id: 3 },
        { title: 'DevOps Engineer', description: 'Infrastructure Automation', id: 4 },
      ],
    },
    Google: {
      location: 'Mountain View, California, United States',
      roles: [
        { title: 'Software Engineer', description: 'Full-Stack Development', id: 1 },
        { title: 'Data Scientist', description: 'Machine Learning', id: 2 },
        { title: 'Product Manager', description: 'Team Coordination', id: 3 },
        { title: 'UX Designer', description: 'User Experience Design', id: 4 },
      ],
    },
  };

  const company = companyDetails[companyName] || { location: 'Unknown', roles: [] };

  return (
    <div className="p-8">
      {/* Company Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center sm:w-1/3">
          <div className="mb-4">
            {/* Placeholder logo */}
            <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto"></div>
          </div>
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <p className="text-gray-600">{company.location}</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            Check Interview Stories
          </button>
        </div>
        <div className="sm:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {company.roles.map((role) => (
            <div key={role.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="mb-4">
                {/* Placeholder role image */}
                <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto"></div>
              </div>
              <h2 className="text-xl font-semibold mb-2">{role.title}</h2>
              <p className="text-gray-500 mb-4">{role.description}</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Start Practice
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;