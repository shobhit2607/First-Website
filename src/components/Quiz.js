import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Star,
  Target,
  Heart,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Quiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState({
    skills: {},
    interests: {},
    personality: {},
    personality_type: ''
  });

  const skills = [
    'Programming', 'Problem Solving', 'Communication', 'Leadership', 'Creativity',
    'Data Analysis', 'Design', 'Project Management', 'Research', 'Writing',
    'Mathematics', 'Statistics', 'User Research', 'Marketing', 'Sales',
    'Teaching', 'Mentoring', 'Public Speaking', 'Teamwork', 'Time Management'
  ];

  const interests = [
    'Technology', 'Business', 'Arts', 'Science', 'Healthcare', 'Education',
    'Finance', 'Sports', 'Travel', 'Music', 'Writing', 'Design',
    'Research', 'Social Work', 'Environment', 'Politics', 'Psychology',
    'History', 'Languages', 'Photography'
  ];

  const personalityTraits = [
    'Analytical', 'Creative', 'Leadership', 'Detail-oriented', 'Social',
    'Independent', 'Strategic', 'Empathetic', 'Logical', 'Innovative',
    'Organized', 'Flexible', 'Confident', 'Patient', 'Ambitious'
  ];

  const personalityTypes = [
    { type: 'Analytical', description: 'Logical, data-driven, and systematic approach to problem-solving' },
    { type: 'Creative', description: 'Innovative, artistic, and imaginative thinking' },
    { type: 'Leadership', description: 'Natural leader, strategic thinker, and team motivator' },
    { type: 'Social', description: 'People-oriented, empathetic, and relationship-focused' },
    { type: 'Practical', description: 'Hands-on, results-oriented, and action-focused' }
  ];

  const steps = [
    { title: 'Skills Assessment', description: 'Rate your proficiency in various skills' },
    { title: 'Interests Survey', description: 'Tell us what you enjoy doing' },
    { title: 'Personality Traits', description: 'Describe your personality characteristics' },
    { title: 'Personality Type', description: 'Choose your primary personality type' },
    { title: 'Results', description: 'Get your personalized career recommendations' }
  ];

  const handleSkillChange = (skill, value) => {
    setQuizData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skill]: value
      }
    }));
  };

  const handleInterestChange = (interest, value) => {
    setQuizData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        [interest]: value
      }
    }));
  };

  const handlePersonalityChange = (trait, value) => {
    setQuizData(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        [trait]: value
      }
    }));
  };

  const handlePersonalityTypeChange = (type) => {
    setQuizData(prev => ({
      ...prev,
      personality_type: type
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/quiz', quizData);
      toast.success('Quiz submitted successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to submit quiz. Please try again.');
      console.error('Quiz submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSkillsStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Rate your proficiency in these skills (1-5 scale)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill} className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {skill}
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleSkillChange(skill, value)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    quizData.skills[skill] === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInterestsStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        How interested are you in these areas? (1-5 scale)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interests.map((interest) => (
          <div key={interest} className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {interest}
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleInterestChange(interest, value)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    quizData.interests[interest] === value
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPersonalityStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        How well do these traits describe you? (1-5 scale)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalityTraits.map((trait) => (
          <div key={trait} className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {trait}
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handlePersonalityChange(trait, value)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    quizData.personality[trait] === value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPersonalityTypeStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Which personality type best describes you?
      </h3>
      <div className="space-y-4">
        {personalityTypes.map((type) => (
          <button
            key={type.type}
            onClick={() => handlePersonalityTypeChange(type.type)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
              quizData.personality_type === type.type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                quizData.personality_type === type.type
                  ? 'bg-blue-500'
                  : 'border-2 border-gray-300'
              }`}>
                {quizData.personality_type === type.type && (
                  <Check className="w-3 h-3 text-white m-0.5" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{type.type}</h4>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">
        Quiz Complete!
      </h3>
      <p className="text-lg text-gray-600">
        Your responses have been analyzed. Click below to get your personalized career recommendations.
      </p>
      <button
        onClick={submitQuiz}
        disabled={loading}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <Brain className="h-5 w-5 mr-2" />
        )}
        Get My Recommendations
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderSkillsStep();
      case 1: return renderInterestsStep();
      case 2: return renderPersonalityStep();
      case 3: return renderPersonalityTypeStep();
      case 4: return renderResultsStep();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Career Assessment Quiz</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="mt-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {currentStep < steps.length - 1 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            <button
              onClick={nextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;