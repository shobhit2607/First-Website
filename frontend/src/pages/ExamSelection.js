import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTest } from '../contexts/TestContext';
import { examAPI } from '../services/api';
import toast from 'react-hot-toast';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  ChartBarIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ExamSelection = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingTest, setIsStartingTest] = useState(false);
  
  const { startTest } = useTest();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchSubjects(selectedExam);
    } else {
      setSubjects([]);
      setSelectedSubject('');
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    try {
      const response = await examAPI.getExams();
      setExams(response.data);
    } catch (error) {
      toast.error('Failed to load exams');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjects = async (examId) => {
    try {
      const response = await examAPI.getSubjects(examId);
      setSubjects(response.data);
    } catch (error) {
      toast.error('Failed to load subjects');
    }
  };

  const handleStartTest = async () => {
    if (!selectedExam || !selectedSubject) {
      toast.error('Please select both exam and subject');
      return;
    }

    setIsStartingTest(true);
    const result = await startTest(selectedExam, selectedSubject, difficulty, numQuestions);
    
    if (result.success) {
      toast.success('Test started successfully!');
      navigate(`/test/${result.test.id}`);
    } else {
      toast.error(result.error);
    }
    
    setIsStartingTest(false);
  };

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'bg-green-500', description: 'Basic concepts and straightforward questions' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Moderate difficulty with some challenging questions' },
    { value: 'hard', label: 'Hard', color: 'bg-red-500', description: 'Advanced concepts and complex problem-solving' }
  ];

  const questionCounts = [10, 20, 30, 50, 100];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select Your Test
          </h1>
          <p className="text-xl text-gray-600">
            Choose your exam type, subject, and difficulty level to start practicing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Selection Form */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Test Configuration</h2>
            
            <div className="space-y-6">
              {/* Exam Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Exam Type
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose an exam type</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="input-field"
                  disabled={!selectedExam}
                >
                  <option value="">Choose a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {difficultyLevels.map((level) => (
                    <label
                      key={level.value}
                      className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        difficulty === level.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={level.value}
                        checked={difficulty === level.value}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 ${level.color} rounded-full mr-3`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{level.label}</div>
                        <div className="text-sm text-gray-600">{level.description}</div>
                      </div>
                      {difficulty === level.value && (
                        <CheckCircleIcon className="w-5 h-5 text-primary-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {questionCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => setNumQuestions(count)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        numQuestions === count
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Test Button */}
              <button
                onClick={handleStartTest}
                disabled={!selectedExam || !selectedSubject || isStartingTest}
                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isStartingTest ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Start Test
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Test Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Selected Test Info */}
            {selectedExam && selectedSubject && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <AcademicCapIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Exam:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {exams.find(e => e.id === selectedExam)?.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ChartBarIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Subject:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {subjects.find(s => s.id === selectedSubject)?.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 ${difficultyLevels.find(d => d.value === difficulty)?.color} rounded-full mr-3`}></div>
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="ml-2 font-medium text-gray-900 capitalize">{difficulty}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Questions:</span>
                    <span className="ml-2 font-medium text-gray-900">{numQuestions}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Test Instructions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Instructions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  You can navigate between questions using Next/Previous buttons
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  You can change your answers before submitting
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Timer will be shown at the top of the test page
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Detailed explanations will be provided after submission
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Your progress will be saved automatically
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Tips for Success</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Read each question carefully before answering</li>
                <li>• Don't spend too much time on difficult questions</li>
                <li>• Use the process of elimination for multiple choice</li>
                <li>• Review your answers before submitting</li>
                <li>• Practice regularly to improve your performance</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExamSelection;