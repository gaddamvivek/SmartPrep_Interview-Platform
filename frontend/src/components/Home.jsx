import React from 'react';
import { NavBar } from './NavBar';

export const Home = () => {
  return (
    <div className="bg-[#e6dceb]">
      <NavBar showNewInterview={true} showSignIn={true} />
      <main className="p-3">
        <div className="">
          <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#e6d3eb] rounded-3xl shadow-lg shadow-black font-rubik">
            <h2 className="text-2xl font-bold text-slate-700 justify-between">
              What is PrepSmart
            </h2>
            <p className="mt-4 text-slate-700">
              PrepSmart is designed to help users practice for coding and
              technical interviews by simulating real-world coding challenges
              and technical Q&A sessions tailored to your preference. With
              AI-generated coding problems and automated feedback, you
              experience authentic interview scenarios and can improve your
              skills in a personalized environment.
            </p>
          </div>
          <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#e6d3eb] rounded-3xl shadow-lg shadow-black font-rubik">
            <h2 className="text-2xl font-bold text-slate-700 mt-4">
              How PrepSmart works
            </h2>
            <p className="mt-4 text-slate-700">
              The platform presents AI-generated questions tailored to your
              preference, allowing you to solve coding problems in a live coding
              editor and receive immediate feedback. For technical QA, the
              system analyzes your responses, compares them to AI-generated
              solutions, and provides thorough feedback on accuracy and areas
              for improvement.
            </p>
          </div>
          <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#e6d3eb] rounded-3xl shadow-lg shadow-black font-rubik">
            <h2 className="text-2xl font-bold text-slate-700 mt-4">
              What makes PrepSmart unique
            </h2>
            <p className="mt-4 text-slate-700">
              We offer personalized learning that adapts to your skill levels
              and preferences. Our platform goes beyond just coding — it
              evaluates both coding and spoken technical responses, providing
              real-time feedback on efficiency, correctness, and technical
              depth. Plus, it is a cost-effective alternative to expensive
              human-led mock interviews.
            </p>
          </div>
          <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#e6d3eb] rounded-3xl shadow-lg shadow-black font-rubik">
            <h2 className="text-2xl font-bold text-slate-700 mt-4">
              Who benefits from PrepSmart
            </h2>
            <p className="mt-4 text-slate-700">
              Anyone preparing for software engineering interviews, whether you
              are a beginner or an experienced professional, you can get benefit
              from our platform. You can tailor your interview practice based on
              topics and difficulty levels to suit your needs.
            </p>
          </div>
          <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#e6d3eb] rounded-3xl shadow-lg shadow-black font-rubik">
            <h2 className="text-2xl font-bold text-slate-700 mt-4">
              Why choose PrepSmart
            </h2>
            <p className="mt-4 text-slate-700">
              We offer a scalable, AI-driven solution that provides you with
              everything you need to prepare for coding and technical
              interviews. With personalized sessions, real-time AI feedback, and
              comprehensive reports, we help you build confidence and improve
              your interview skills, all in a flexible and affordable way.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
