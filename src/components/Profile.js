import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Target, 
  TrendingUp, 
  BookOpen,
  Edit3,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [newProgress, setNewProgress] = useState({ skill: '', value: 0 });

  useEffect(() => {
    if (user) {
      setProfile(user);
      setEditData({
        name: user.name || '',
        email: user.email || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({
      name: profile.name || '',
      email: profile.email || ''
    });
  };

  const handleSave = async () => {
    try {
      // In a real app, you'd update the profile via API
      setProfile(prev => ({ ...prev, ...editData }));
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfile(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [newSkill]: 0
        }
      }));
      setNewSkill('');
      toast.success('Skill added successfully!');
    }
  };

  const handleUpdateProgress = async () => {
    if (newProgress.skill && newProgress.value >= 0) {
      try {
        await axios.post('/api/progress', {
          skill: newProgress.skill,
          progress: newProgress.value
        });
        
        setProfile(prev => ({
          ...prev,
          progress: {
            ...prev.progress,
            [newProgress.skill]: {
              value: newProgress.value,
              updated_at: new Date()
            }
          }
        }));
        
        setNewProgress({ skill: '', value: 0 });
        toast.success('Progress updated successfully!');
      } catch (error) {
        toast.error('Failed to update progress');
      }
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfile(prev => {
      const newSkills = { ...prev.skills };
      delete newSkills[skill];
      return { ...prev, skills: newSkills };
    });
    toast.success('Skill removed successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const progressData = profile?.progress ? Object.entries(profile.progress).map(([skill, data]) => ({
    skill,
    progress: data.value,
    date: new Date(data.updated_at).toLocaleDateString()
  })) : [];

  const skillsData = profile?.skills ? Object.entries(profile.skills).map(([skill, level]) => ({
    skill,
    level
  })) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-6">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile?.name || 'User Profile'}
                </h1>
                <p className="text-gray-600">{profile?.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
            <button
              onClick={editing ? handleSave : handleEdit}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profile?.name || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profile?.email}</p>
                  )}
                </div>
                {editing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Management */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Management</h2>
              
              {/* Add New Skill */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add new skill"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-2">
                {skillsData.map(({ skill, level }) => (
                  <div key={skill} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-900">{skill}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Level: {level}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Progress</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skill</label>
                  <select
                    value={newProgress.skill}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, skill: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a skill</option>
                    {skillsData.map(({ skill }) => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Progress (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProgress.value}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleUpdateProgress}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Update Progress
                </button>
              </div>
            </div>
          </div>

          {/* Analytics and Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Overview</h2>
              {skillsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="level" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No skills data available</p>
              )}
            </div>

            {/* Progress Tracking */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Tracking</h2>
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="progress" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No progress data available</p>
              )}
            </div>

            {/* Recent Recommendations */}
            {profile?.recommendations && profile.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Recommendations</h2>
                <div className="space-y-3">
                  {profile.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {rec.name || `Career ${index + 1}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {rec.match_percentage || 0}% match
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {rec.growth_rate || 0}% growth
                        </p>
                        <p className="text-sm text-gray-500">
                          {rec.salary_range ? 
                            `$${rec.salary_range[0].toLocaleString()}-$${rec.salary_range[1].toLocaleString()}` :
                            'Salary N/A'
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;