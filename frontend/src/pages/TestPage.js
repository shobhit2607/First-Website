import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTest } from '../contexts/TestContext';
import toast from 'react-hot-toast';
import { 
  ClockIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TestPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { 
    currentTest, 
    answers, 
    timeRemaining, 
    submitAnswer, 
    submitTest, 
    formatTime,
    setTimeRemaining 
  } = useTest();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!currentTest) {
      navigate('/exam-selection');
      return;
    }

    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTest]);

  const handleAutoSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitTest();
    if (result.success) {
      navigate(`/results/${result.results.id}`);
    } else {
      toast.error('Failed to submit test');
    }
    setIsSubmitting(false);
  };

  const handleAnswerSelect = (questionId, answer) => {
    submitAnswer(questionId, answer);
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitTest();
    if (result.success) {
      toast.success('Test submitted successfully!');
      navigate(`/results/${result.results.id}`);
    } else {
      toast.error('Failed to submit test');
    }
    setIsSubmitting(false);
    setShowConfirmModal(false);
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getUnansweredCount = () => {
    return currentTest.questions.length - getAnsweredCount();
  };

  if (!currentTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion.id] !== undefined;
  const selectedAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentTest.examName} - {currentTest.subjectName}
              </h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {currentTest.questions.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Timer */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                <ClockIcon className="w-5 h-5" />
                <span className="font-mono text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Progress */}
              <div className="text-sm text-gray-600">
                <span className="font-medium text-green-600">{getAnsweredCount()}</span> answered,{' '}
                <span className="font-medium text-orange-600">{getUnansweredCount()}</span> remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {currentTest.questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      index === currentQuestionIndex
                        ? 'bg-primary-600 text-white'
                        : answers[question.id] !== undefined
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
                  Answered
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <div className="w-3 h-3 bg-orange-100 rounded-full mr-2"></div>
                  Not Answered
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-3 h-3 bg-primary-100 rounded-full mr-2"></div>
                  Current
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="card"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Question {currentQuestionIndex + 1}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {currentQuestion.difficulty?.charAt(0).toUpperCase() + currentQuestion.difficulty?.slice(1)} Level
                      </span>
                      {isAnswered && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {currentQuestion.questionText}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        selectedAnswer === option
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                        selectedAnswer === option
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === option && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </label>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-4">
                    {currentQuestionIndex === currentTest.questions.length - 1 ? (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Test'}
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="btn-primary px-6 py-2 flex items-center"
                      >
                        Next
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-lg max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Submission</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your test? You have answered{' '}
              <span className="font-semibold text-green-600">{getAnsweredCount()}</span> out of{' '}
              <span className="font-semibold">{currentTest.questions.length}</span> questions.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TestPage;