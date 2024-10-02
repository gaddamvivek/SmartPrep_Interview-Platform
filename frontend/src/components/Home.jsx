import React, { useState } from 'react';
import { NavBar } from './NavBar';
import interview from '../assets/images/interview.jpg';
import interview1 from '../assets/images/interview1.jpg';
import interview2 from '../assets/images/interview2.jpg';

export const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [interview, interview1, interview2];

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="bg-[#e6dceb]">
      <NavBar showNewInterview={true} showSignIn={true} />
      <main className="p-3">
        <section className="w-full flex justify-center p-6" id="carousel">
          <div className="relative w-full max-w-2xl mx-auto">
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-64 object-cover rounded-3xl shadow-2xl shadow-[#945da0]"
            />
            <button
              onClick={prevImage}
              className="absolute font-bold left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full hover:bg-gray-600 transition"
            >
              &lt;
            </button>
            <button
              onClick={nextImage}
              className="absolute font-bold right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full hover:bg-gray-600 transition"
            >
              &gt;
            </button>
            <div className="flex justify-center mt-4">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-3 h-3 mx-1 rounded-full ${
                    index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></span>
              ))}
            </div>
          </div>
        </section>
        <hr className="text-slate-600" />

        <div className="">
          {/* <h2 className="text-5xl font-bold text-slate-700"></h2> */}
          <p className="mt-4 text-slate-700">
            <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#e6d3eb] rounded-3xl shadow-lg shadow-black font-rubik">
              <h2 className="text-2xl font-bold text-slate-700 justify-between ">
                What is PrepSmart
              </h2>
              PrepSmart is designed to help users practice for coding and
              technical interviews by simulating real-world coding challenges
              and technical Q&A sessions tailored to your preference. With
              AI-generated coding problems and automated feedback, you
              experience authentic interview scenarios and can improve your
              skills in a personalized environment.
            </div>
            <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#e6d3eb] rounded-3xl shadow-lg shadow-black font-rubik">
              <h2 className="text-2xl font-bold text-slate-700 mt-4">
                How PrepSmart works
                </h2>
              The platform presents AI-generated questions tailored to your
              preference, allowing you to solve coding problems in a live coding
              editor and receive immediate feedback. For technical QA, the
              system analyzes your responses, compares them to AI-generated
              solutions, and provides thorough feedback on accuracy and areas
              for improvement.
            </div>
            <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#e6d3eb] rounded-3xl shadow-lg shadow-black font-rubik">
              <h2 className="text-2xl font-bold text-slate-700 mt-4">
                What makes PrepSmart unique
              </h2>
              We offer personalized learning that adapts to your skill levels
              and preferences. Our platform goes beyond just coding — it
              evaluates both coding and spoken technical responses, providing
              real-time feedback on efficiency, correctness, and technical
              depth. Plus, it is a cost-effective alternative to expensive
              human-led mock interviews.
            </div>
            <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#e6d3eb] rounded-3xl shadow-lg shadow-black font-rubik">
              <h2 className="text-2xl font-bold text-slate-700 mt-4">
                Who benefits from PrepSmart
              </h2>
              Anyone preparing for software engineering interviews, whether you
              are a beginner or an experienced professional, you can get benefit
              from our platform. You can tailor your interview practice based on
              topics and difficulty levels to suit your needs.
            </div>
            <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#e6d3eb] rounded-3xl shadow-lg shadow-black font-rubik">
              <h2 className="text-2xl font-bold text-slate-700 mt-4">
                Why choose PrepSmart
              </h2>
              We offer a scalable, AI-driven solution that provides you with
              everything you need to prepare for coding and technical
              interviews. With personalized sessions, real-time AI feedback, and
              comprehensive reports, we help you build confidence and improve
              your interview skills, all in a flexible and affordable way.
            </div>
          </p>
        </div>
      </main>
    </div>
  );
};
