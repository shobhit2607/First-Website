import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { testAPI } from '../services/api';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  ChartBarIcon, 
  TrophyIcon,
  PlusIcon,
  ArrowRightIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [testHistory, setTestHistory] = useState([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeSpent: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    examType: user?.examType || ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [historyResponse, statsResponse] = await Promise.all([
        testAPI.getTestHistory(user.id),
        testAPI.getUserStats(user.id)
      ]);
      
      setTestHistory(historyResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const result = await updateProfile(profileData);
    if (result.success) {
      setShowProfileModal(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to continue your exam preparation journey?
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <UserCircleIcon className="w-6 h-6" />
                <span>Profile</span>
              </button>
              <Link
                to="/exam-selection"
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Start New Test
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bestScore}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(stats.totalTimeSpent)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tests */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Tests</h2>
                <Link
                  to="/exam-selection"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                >
                  View all
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {testHistory.length === 0 ? (
                <div className="text-center py-12">
                  <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tests taken yet</h3>
                  <p className="text-gray-600 mb-6">Start your exam preparation journey today!</p>
                  <Link
                    to="/exam-selection"
                    className="btn-primary"
                  >
                    Take Your First Test
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {testHistory.slice(0, 5).map((test, index) => (
                    <motion.div 
                      key={test.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {test.examType?.charAt(0) || 'T'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{test.examName}</h3>
                          <p className="text-sm text-gray-600">{test.subjectName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{test.score}%</p>
                        <p className="text-sm text-gray-600">{formatDate(test.completedAt)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/exam-selection"
                  className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-4">
                    <PlusIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Start New Test</h3>
                    <p className="text-sm text-gray-600">Take a practice test</p>
                  </div>
                </Link>

                <Link
                  to="/results"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                    <ChartBarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">View Results</h3>
                    <p className="text-sm text-gray-600">Check your performance</p>
                  </div>
                </Link>

                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                    <Cog6ToothIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Update Profile</h3>
                    <p className="text-sm text-gray-600">Manage your account</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Trend</h2>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-lg max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Update Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Exam Type
                </label>
                <select
                  value={profileData.examType}
                  onChange={(e) => setProfileData({...profileData, examType: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select exam type</option>
                  <option value="JEE Main & Advanced">JEE Main & Advanced</option>
                  <option value="NEET">NEET</option>
                  <option value="SSC CGL">SSC CGL</option>
                  <option value="UPSC Civil Services">UPSC Civil Services</option>
                  <option value="Banking Exams">Banking Exams</option>
                  <option value="Railway Exams">Railway Exams</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;