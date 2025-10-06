import React, { createContext, useContext, useState } from 'react';
import { testAPI } from '../services/api';

const TestContext = createContext();

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

export const TestProvider = ({ children }) => {
  const [currentTest, setCurrentTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const [isTestActive, setIsTestActive] = useState(false);

  const startTest = async (examId, subjectId, difficulty, numQuestions) => {
    try {
      const response = await testAPI.startTest(examId, subjectId, difficulty, numQuestions);
      const testData = response.data;
      
      setCurrentTest(testData);
      setAnswers({});
      setTimeRemaining(testData.duration * 60); // Convert minutes to seconds
      setIsTestActive(true);
      
      return { success: true, test: testData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to start test' 
      };
    }
  };

  const submitAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitTest = async () => {
    try {
      const response = await testAPI.submitTest(currentTest.id, answers);
      const results = response.data;
      
      setTestResults(results);
      setIsTestActive(false);
      
      return { success: true, results };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to submit test' 
      };
    }
  };

  const getTestResults = async (testId) => {
    try {
      const response = await testAPI.getResults(testId);
      const results = response.data;
      
      setTestResults(results);
      return { success: true, results };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch results' 
      };
    }
  };

  const resetTest = () => {
    setCurrentTest(null);
    setAnswers({});
    setTimeRemaining(0);
    setTestResults(null);
    setIsTestActive(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const value = {
    currentTest,
    answers,
    timeRemaining,
    testResults,
    isTestActive,
    startTest,
    submitAnswer,
    submitTest,
    getTestResults,
    resetTest,
    formatTime,
    setTimeRemaining
  };

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
};