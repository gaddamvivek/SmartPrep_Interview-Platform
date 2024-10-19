// import React, { useState, useEffect } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import Webcam from 'react-webcam';
// import axios from 'axios';

// const TechnicalInterview = () => {
//   const [questions, setQuestions] = useState([]);
//   const [difficulty, setDifficulty] = useState('easy');
//   const [recording, setRecording] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const webcamRef = React.useRef(null);

//   const { transcript, resetTranscript } = useSpeechRecognition();

//   useEffect(() => {
//     fetchQuestions();
//   }, [difficulty]);

//   const fetchQuestions = async () => {
//     try {
//       const response = await axios.get(`/api/tech/questions?difficulty=${difficulty}`);
//       setQuestions(response.data);
//       setCurrentQuestionIndex(0); // Reset to first question when difficulty changes
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     }
//   };

//   const startRecording = () => {
//     SpeechRecognition.startListening({ continuous: true });
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     SpeechRecognition.stopListening();
//     setRecording(false);

//     // Save the transcript to the answers state
//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questions[currentQuestionIndex].id]: transcript,
//     }));
//     resetTranscript();
//   };

//   const nextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const previousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const capturePhoto = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     console.log('Captured image:', imageSrc);
//     // You can save or upload the image to a server here
//   };

//   return (
//     <div>
//       <h1>Technical Interview Platform</h1>

//       {/* Difficulty selection */}
//       <div>
//         <label>Select Difficulty: </label>
//         <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
//           <option value="easy">Easy</option>
//           <option value="medium">Medium</option>
//           <option value="hard">Hard</option>
//         </select>
//       </div>

//       {/* Display Single Question */}
//       <div>
//         {questions.length > 0 && (
//           <div>
//             <h2>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].title}</h2>
//             <p>{questions[currentQuestionIndex].description}</p>
//           </div>
//         )}
//       </div>

//       {/* Navigation Buttons for Questions */}
//       <div>
//         <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
//           Previous Question
//         </button>
//         <button onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
//           Next Question
//         </button>
//       </div>

//       {/* Recording Section */}
//       <div>
//         <button onClick={startRecording} disabled={recording}>Record Answer</button>
//         <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
//         <p>Transcript: {transcript}</p>
//         <p>Saved Answer: {answers[questions[currentQuestionIndex]?.id]}</p>
//       </div>

//       {/* Webcam Section */}
//       <div>
//         <Webcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//         />
//         <button onClick={capturePhoto}>Capture Photo</button>
//       </div>
//     </div>
//   );
// };

// export default TechnicalInterview;


import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Webcam from 'react-webcam';
import axios from 'axios';

const TechnicalInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [recording, setRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const webcamRef = React.useRef(null);

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    fetchQuestions();
  }, [difficulty]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`/api/tech/getRandomTechnicalQuestions?difficulty=${difficulty}`);
      setQuestions(response.data);
      setCurrentQuestionIndex(0); // Reset to first question when difficulty changes
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true });
    setRecording(true);
  };

  const stopRecording = async () => {
    SpeechRecognition.stopListening();
    setRecording(false);

    // Save the transcript to the answers state
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion._id]: transcript,
      }));

      // Save answer to the server
      try {
        await axios.post('/api/tech/get/RecordAnswer', {
          questionId: currentQuestion._id,
          transcript,
        });
        console.log('Answer saved successfully');
      } catch (error) {
        console.error('Error saving answer:', error);
      }
    }
    resetTranscript();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log('Captured image:', imageSrc);
    // Save or upload the image to the server
    try {
      await axios.post('/api/tech/capturePhoto', { imageSrc });
      console.log('Image captured successfully');
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  return (
    <div>
      <h1>Technical Interview Platform</h1>

      {/* Difficulty selection */}
      <div>
        <label>Select Difficulty: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Display Single Question */}
      <div>
        {questions.length > 0 && (
          <div>
            <h2>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].title}</h2>
            <p>{questions[currentQuestionIndex].description}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons for Questions */}
      <div>
        <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
          Previous Question
        </button>
        <button onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
          Next Question
        </button>
      </div>

      {/* Recording Section */}
      <div>
        <button onClick={startRecording} disabled={recording}>Record Answer</button>
        <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
        <p>Transcript: {transcript}</p>
        <p>Saved Answer: {answers[questions[currentQuestionIndex]?._id]}</p>
      </div>

      {/* Webcam Section */}
      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
        <button onClick={capturePhoto}>Capture Photo</button>
      </div>
    </div>
  );
};

export default TechnicalInterview;
