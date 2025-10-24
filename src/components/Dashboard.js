import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BookOpen, 
  MessageCircle,
  ArrowRight,
  Star,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.recommendations) {
      setRecommendations(user.recommendations);
    }
    setLoading(false);
  }, [user]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const chartData = recommendations.map((rec, index) => ({
    name: rec.name || Object.keys(career_data).find(key => career_data[key] === rec) || `Career ${index + 1}`,
    match: rec.match_percentage || 0,
    salary: rec.salary_range ? (rec.salary_range[0] + rec.salary_range[1]) / 2 : 0,
    growth: rec.growth_rate || 0
  }));

  const pieData = recommendations.slice(0, 5).map((rec, index) => ({
    name: rec.name || `Career ${index + 1}`,
    value: rec.match_percentage || 0,
    color: COLORS[index % COLORS.length]
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover your perfect career path with AI-powered recommendations
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/quiz"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <Brain className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Take Career Quiz</h3>
                <p className="text-blue-100">Discover your ideal career path</p>
              </div>
            </div>
          </Link>

          <Link
            to="/chat"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">AI Career Chat</h3>
                <p className="text-green-100">Get personalized career advice</p>
              </div>
            </div>
          </Link>

          <Link
            to="/profile"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <Target className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Track Progress</h3>
                <p className="text-purple-100">Monitor your skill development</p>
              </div>
            </div>
          </Link>
        </div>

        {recommendations.length > 0 ? (
          <>
            {/* Career Recommendations */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Career Recommendations</h2>
                <Link
                  to="/quiz"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  Retake Quiz
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Match Percentage Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Match Percentage</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="match" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Career Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Recommendations Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recommendations.slice(0, 6).map((career, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Brain className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {career.name || `Career ${index + 1}`}
                        </h3>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">
                            {career.match_percentage || 0}% match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {career.description || 'A promising career path for you'}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Salary Range</span>
                      <span className="text-sm font-medium text-gray-900">
                        {career.salary_range ? 
                          `$${career.salary_range[0].toLocaleString()} - $${career.salary_range[1].toLocaleString()}` :
                          'Not available'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Growth Rate</span>
                      <span className="text-sm font-medium text-green-600">
                        {career.growth_rate || 0}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Required Skills</span>
                      <span className="text-sm text-gray-900">
                        {career.skills ? career.skills.length : 0} skills
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations[0]?.skills?.slice(0, 9).map((skill, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* No Recommendations State */
          <div className="text-center py-12">
            <Brain className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to discover your career path?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Take our comprehensive career quiz to get personalized recommendations
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Brain className="h-5 w-5 mr-2" />
              Start Career Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;