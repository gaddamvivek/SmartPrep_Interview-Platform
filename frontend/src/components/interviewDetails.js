import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './interviewDetails.css';
import axios from 'axios';
import { Dashboard } from './dashboard';
export const InterviewDetails = () => {
    const [prepname,setPrepName] = useState('');
    const [diffLvl,setDifficultyLvl] = useState('');
    const [slctround,setRound] = useState('Technical Questions');
    const [buttonClick,setButtonClick] = useState(false);
    const navigate = useNavigate();
    const onClickHandler = () => {
        navigate('/dashboard');
    }
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        const interviewData = {
          preparationName: prepname,
          difficultyLevel: diffLvl,
          round: slctround,
        };
        try {
            const uname = JSON.parse(localStorage.getItem("logindata"));
            //console.log(uname);
            const headers = {
                Authorization: `Bearer ${uname}`,  // Send the token in the Authorization header
            };
        
            const result = await axios.post('http://localhost:5001/auth/interviewdetails', { prepname, diffLvl, slctround},{headers});
            console.log(result);
            if(slctround === 'Coding' && buttonClick)
                navigate('/codeeditor');
            else
                console.log(slctround)
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
        <form className = "formcss" onSubmit = {handleSubmit}>
            <div className="preprName">
                    <input 
                        type="text" 
                        placeholder="Enter Preparation Name" 
                        value = {prepname}
                        onChange = {(e) => setPrepName(e.target.value)}
                        required 
                   />
            </div>
            <div className = "dropDown">
                <select value={diffLvl} onChange={(e) => setDifficultyLvl(e.target.value)} required>
                <option value="" disabled>Select Difficulty Level</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
            <div className = "dropDown">
                <select value={slctround} onChange={(e) => setRound(e.target.value)} required>
                    <option value="" disabled>Select Round</option>
                    <option value="Technical questions">Technical Questions</option>
                    <option value="Coding">Coding</option>
                </select>
            </div>
            <div className='btns'>
                <button type = "button" onClick={onClickHandler}>Previous</button>
                <button type="submit" onClick={() => setButtonClick(true)}>{slctround}</button>
            </div>
        </form>
    </div>
  )
}