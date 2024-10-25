import React,{ useState }  from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const ForgetPassword = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const clickHandler = async (e) => {
    e.preventDefault();
    // Check if the user has entered email correctly
    if ('' === email) {
      alert('Please enter your email');
      return;
    }
    try {
      console.log(email);
        if(password == confirmPassword){
          const result = await axios.post('http://localhost:5001/auth/checkEmail', { email, password});
          if(result.status == 200)
            navigate('/login')
          else 
            alert('An error occurred. Please try again.');
          
        }
        else{
          alert('Password Mismatch');
        }
      } catch (err) {
        if (err.response && err.response.status == 404) {
            alert('User Not Found')
        } 
        else{
          console.error(err.response.data);
          alert('An error occurred. Please try again.');
        }
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-white-100">
      <div className=" w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center font-rubik">
          Reset Password
        </h2>
        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mt-6">
            <button
              className="w-full py-3 bg-[#7360bf] text-white text-center rounded-md font-bold cursor-pointer transition duration-300 transform hover:bg-[#433878] hover:-translate-y-1"
              type="button"
              onClick={clickHandler}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
}