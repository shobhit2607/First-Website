import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTest } from '../contexts/TestContext';
import { 
  TrophyIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  HomeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const ResultsPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { testResults, getTestResults, resetTest } = useTest();
  const [isLoading, setIsLoading] = useState(true);
  const [showExplanations, setShowExplanations] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [testId]);

  const fetchResults = async () => {
    try {
      await getTestResults(testId);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetakeTest = () => {
    resetTest();
    navigate('/exam-selection');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPerformanceMessage = (score) => {
    if (score >= 90) return 'Outstanding! You have mastered this subject.';
    if (score >= 80) return 'Excellent work! You have a strong understanding.';
    if (score >= 70) return 'Good job! You have a solid grasp of the concepts.';
    if (score >= 60) return 'Not bad! Keep practicing to improve further.';
    if (score >= 50) return 'Keep working! Focus on the areas you missed.';
    return 'Don\'t give up! Review the concepts and try again.';
  };

  const getWeakAreas = () => {
    if (!testResults?.questions) return [];
    
    const incorrectQuestions = testResults.questions.filter(q => !q.isCorrect);
    const weakTopics = {};
    
    incorrectQuestions.forEach(q => {
      if (q.topic) {
        weakTopics[q.topic] = (weakTopics[q.topic] || 0) + 1;
      }
    });
    
    return Object.entries(weakTopics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic, count]) => ({ topic, count }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!testResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results not found</h2>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, correctAnswers, wrongAnswers, timeSpent, questions } = testResults;
  const weakAreas = getWeakAreas();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <TrophyIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Test Completed!</h1>
            <p className="text-xl text-gray-600">
              {testResults.examName} - {testResults.subjectName}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Overview */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Main Score Card */}
            <div className="card text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${getScoreBgColor(score)}`}>
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Score</h2>
              <p className="text-gray-600 mb-6">{getPerformanceMessage(score)}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{totalQuestions}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex items-center mb-4">
                  <ClockIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Time Spent</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{timeSpent} minutes</p>
                <p className="text-sm text-gray-600 mt-1">Average: {(timeSpent / totalQuestions).toFixed(1)} min/question</p>
              </div>

              <div className="card">
                <div className="flex items-center mb-4">
                  <ChartBarIcon className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Accuracy</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{score}%</p>
                <p className="text-sm text-gray-600 mt-1">
                  {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good!' : 'Keep practicing!'}
                </p>
              </div>
            </div>

            {/* Weak Areas */}
            {weakAreas.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas to Improve</h3>
                <div className="space-y-3">
                  {weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-800">{area.topic}</span>
                      <span className="text-sm text-red-600 font-medium">{area.count} incorrect</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowExplanations(!showExplanations)}
                className="btn-outline flex-1 flex items-center justify-center"
              >
                <AcademicCapIcon className="w-5 h-5 mr-2" />
                {showExplanations ? 'Hide' : 'View'} Detailed Explanations
              </button>
              <button
                onClick={handleRetakeTest}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Retake Test
              </button>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/exam-selection"
                  className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
                >
                  <AcademicCapIcon className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-primary-800 font-medium">Take Another Test</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <HomeIcon className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-800 font-medium">Go to Dashboard</span>
                </Link>
              </div>
            </div>

            {/* Performance Tips */}
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Performance Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Review incorrect answers to understand mistakes</li>
                <li>• Practice weak areas identified in this test</li>
                <li>• Take regular practice tests to track progress</li>
                <li>• Focus on time management during tests</li>
                <li>• Read questions carefully before answering</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Detailed Explanations */}
        {showExplanations && questions && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="card">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Question Review & Explanations</h3>
              <div className="space-y-8">
                {questions.map((question, index) => (
                  <div key={question.id} className="border-l-4 border-gray-200 pl-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Question {index + 1}
                      </h4>
                      <div className="flex items-center">
                        {question.isCorrect ? (
                          <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircleIcon className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-800 mb-4">{question.questionText}</p>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg ${
                              option === question.correctAnswer
                                ? 'bg-green-100 border border-green-300'
                                : option === question.userAnswer && !question.isCorrect
                                ? 'bg-red-100 border border-red-300'
                                : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="font-medium mr-2">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span>{option}</span>
                              {option === question.correctAnswer && (
                                <CheckCircleIcon className="w-5 h-5 text-green-500 ml-auto" />
                              )}
                              {option === question.userAnswer && !question.isCorrect && (
                                <XCircleIcon className="w-5 h-5 text-red-500 ml-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {question.explanation && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">Explanation:</h5>
                        <p className="text-blue-800">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;