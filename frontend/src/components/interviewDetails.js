import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './interviewDetails.css';
import axios from 'axios';

export const InterviewDetails = () => {
    const [prepname, setPrepName] = useState('');
    const [diffLvl, setDifficultyLvl] = useState('');
    const [slctround, setRound] = useState('');
    const [slctposition, setPosition] = useState('');
    const [voiceType, setVoiceType] = useState('');
    const [buttonClick, setButtonClick] = useState(false);
    const navigate = useNavigate();
    const positionPath = localStorage.getItem('positionPath');
    const role = localStorage.getItem('selectedRole');
    const onClickHandler = () => {
        navigate('/dashboard');
    }


    useEffect(() => {
        // Set the round value automatically when positionPath is true
        if (positionPath && role) {
            
            setRound("Technical questions"); // Automatically set the round based on selectedRole
            setPosition(role);
          }
      }, [positionPath, role]); 

      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            const uname = JSON.parse(localStorage.getItem("logindata"));
          
            const headers = {
                Authorization: `Bearer ${uname}`,  // Send the token in the Authorization header
            };

        
            const result = await axios.post('http://localhost:5001/api/auth/interviewdetails', { prepname, diffLvl, slctround, slctposition},{headers});
            console.log(result);
            localStorage.setItem('codingSessionActive', 'true');
            localStorage.setItem("pname",prepname);
            localStorage.setItem("selectedDifficulty", diffLvl);
            localStorage.setItem("selectedPosition", slctposition);
            localStorage.setItem("selectedRound", slctround);

            localStorage.setItem("voiceType", voiceType);

            if(slctround === 'Coding' && buttonClick){
            const sessionStartTime = new Date();
            const startDate = sessionStartTime.toLocaleDateString('en-US');
            const startTime = sessionStartTime.toLocaleTimeString('en-US', { hour12: false });
            localStorage.setItem("codingSessionStartDate", startDate);
            localStorage.setItem("codingSessionStartTime", startTime);
                localStorage.removeItem('remainingTime');
                navigate('/codeeditor');
            }                
            // Updated for Technical questions
            else if (slctround === 'Technical questions' && buttonClick) {
            const sessionStartTime = new Date();
            const tstartDate = sessionStartTime.toLocaleDateString('en-US');
            const tstartTime = sessionStartTime.toLocaleTimeString('en-US', { hour12: false });
            localStorage.setItem("technicalSessionStartDate", tstartDate);
            localStorage.setItem("technicalSessionStartTime", tstartTime);
            console.log(tstartDate);
            console.log(tstartTime);
                localStorage.removeItem('remainingTime');
                navigate('/technicalinterview'); // Redirect to the technical interview route
            }
            setPrepName('');
            setDifficultyLvl('');
            setRound('');
            setButtonClick(false);
          } catch (err) 
          {
                if (err.response && err.response.data) {
                    console.error(err.response.data);
                } else {
                    console.error(err);
                }
          }
      };

    return (
        <div className='interviewDetails'>
            <form className="formcss" onSubmit={handleSubmit}>
                <div className="preprName">
                    <input
                        type="text"
                        placeholder="Enter Preparation Name"
                        value={prepname}
                        onChange={(e) => setPrepName(e.target.value)}
                        required
                    />
                </div>

                <div className="dropDown">
                    <select value={diffLvl} onChange={(e) => setDifficultyLvl(e.target.value)} required>
                        <option value="" disabled>Select Difficulty Level</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                    <div>
                    {positionPath ? (
                        
                        <div className="formcss">
                         {/* Styled box for "Technical Round" */}
                         <div className="bg-white border border-gray-300 p-2 rounded-md text-gray-700">
                           {slctround}
                         </div>
                         {/* Box for the role */}
                         <div className="bg-white border border-gray-300 p-2 mt-2 rounded-md text-gray-700">
                           {role}
                         </div>
                         <div>
                                <input
                                type="radio"
                                name="voiceType"
                                value="Male"
                                checked={voiceType === 'Male'}
                                onChange={(e) => setVoiceType(e.target.value)}
                                />
                                Male US-English<br />
                                <input
                                type="radio"
                                name="voiceType"
                                value="Female"
                                checked={voiceType === 'Female'}
                                onChange={(e) => setVoiceType(e.target.value)}
                                />
                                Female UK-English
                            </div>
                       </div>
                     ) : (
                        <div className="formcss">
                        {/* First dropdown */}
                        <select value={slctround} onChange={(e) => setRound(e.target.value)} required>
                            <option value="" disabled>Select Round</option>
                            <option value="Technical questions">Technical Questions</option>
                            <option value="Coding">Coding</option>
                        </select>

                        {slctround === "Technical questions" && (
                            <div>
                            {/* Second dropdown */}
                            <div className="dropDown">
                                <select value={slctposition} onChange={(e) => setPosition(e.target.value)} required>
                                <option value="" disabled>Select Position</option>
                                <option value="Frontend Technical">Frontend Technical</option>
                                <option value="Backend Technical">Backend Technical</option>
                                <option value="DevOps Technical">DevOps Technical</option>
                                <option value="Software Testing Technical">Software Testing Technical</option>
                                <option value="All">Full Stack Developer</option>
                                </select>
                            </div>
                            <div>
                                <input
                                type="radio"
                                name="voiceType"
                                value="Male"
                                checked={voiceType === 'Male'}
                                onChange={(e) => setVoiceType(e.target.value)}
                                />
                                Male US-English<br />
                                <input
                                type="radio"
                                name="voiceType"
                                value="Female"
                                checked={voiceType === 'Female'}
                                onChange={(e) => setVoiceType(e.target.value)}
                                />
                                Female UK-English
                            </div>
                            </div>
                        )}
                        </div>
                    )}
                    </div>


                {slctround === "Coding" && (
                <div>
                    <div className = "dropDown">
                        <select value={slctposition} onChange={(e) => setPosition(e.target.value)} required>
                            <option value="" disabled>Select Position</option>
                            <option value="Python Developer I">Python Developer I</option>
                            <option value="Python Developer II">Python Developer II</option>
                        </select>
                    </div>       
                        <div>
                                <input type="radio"
                                    name="voiceType" value="Male"
                                    checked={voiceType === 'Male'} onChange={(e) => setVoiceType(e.target.value)} />
                                Male US-English<br />
                                <input type="radio"
                                    name="voiceType" value="Female"
                                    checked={voiceType === 'Female'} onChange={(e) => setVoiceType(e.target.value)} />
                                Female UK-English
                    </div>
                    </div>
                )}


                <div className='btns'>
                    <button type="button" onClick={onClickHandler}>Previous</button>
                    <button type="submit" onClick={() => setButtonClick(true)}>Next</button>
                </div>
            </form>
        </div>
    )
}