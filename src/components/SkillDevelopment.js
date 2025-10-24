import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Circle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Brain,
  Award,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const SkillDevelopment = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);
  const [improvementPlan, setImprovementPlan] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    if (user) {
      setSkills(Object.entries(user.skills || {}).map(([name, level]) => ({ name, level })));
      setProgress(user.progress || {});
    }
    setLoading(false);
  }, [user]);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const updatedSkills = [...skills, { name: newSkill, level: 0 }];
      setSkills(updatedSkills);
      setNewSkill('');
      setShowAddSkill(false);
      toast.success('Skill added successfully!');
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const handleUpdateSkillLevel = async (skillName, newLevel) => {
    try {
      await axios.post('/api/progress', {
        skill: skillName,
        progress: newLevel
      });

      setSkills(prev => prev.map(skill => 
        skill.name === skillName ? { ...skill, level: newLevel } : skill
      ));

      setProgress(prev => ({
        ...prev,
        [skillName]: {
          value: newLevel,
          updated_at: new Date().toISOString()
        }
      }));

      toast.success('Skill level updated!');
    } catch (error) {
      toast.error('Failed to update skill level');
    }
  };

  const handleRemoveSkill = (skillName) => {
    setSkills(prev => prev.filter(skill => skill.name !== skillName));
    toast.success('Skill removed');
  };

  const handleGetImprovementPlan = async (skillName) => {
    try {
      const response = await axios.post('/api/skill-improvement', {
        skill: skillName,
        career: user.recommendations?.[0]?.name || ''
      });
      setImprovementPlan(response.data.improvement_plan);
      setSelectedSkill(skillName);
    } catch (error) {
      toast.error('Failed to get improvement plan');
    }
  };

  const getSkillLevelColor = (level) => {
    if (level >= 80) return 'text-green-600';
    if (level >= 60) return 'text-yellow-600';
    if (level >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSkillLevelText = (level) => {
    if (level >= 80) return 'Expert';
    if (level >= 60) return 'Advanced';
    if (level >= 40) return 'Intermediate';
    if (level >= 20) return 'Beginner';
    return 'Novice';
  };

  const progressData = Object.entries(progress).map(([skill, data]) => ({
    skill,
    progress: data.value,
    date: new Date(data.updated_at).toLocaleDateString()
  }));

  const skillsData = skills.map(skill => ({
    skill: skill.name,
    level: skill.level
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Skill Development</h1>
          <p className="mt-2 text-lg text-gray-600">
            Track your skills, set goals, and get personalized improvement plans
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add New Skill */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">My Skills</h2>
                <button
                  onClick={() => setShowAddSkill(!showAddSkill)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </button>
              </div>

              {showAddSkill && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter skill name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddSkill(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Skills List */}
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">{skill.name}</h3>
                        <span className={`ml-2 text-sm font-medium ${getSkillLevelColor(skill.level)}`}>
                          {getSkillLevelText(skill.level)} ({skill.level}%)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleGetImprovementPlan(skill.name)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Get improvement plan"
                        >
                          <Brain className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveSkill(skill.name)}
                          className="text-red-600 hover:text-red-700"
                          title="Remove skill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>

                    {/* Level Selector */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Level:</span>
                      <div className="flex space-x-1">
                        {[0, 20, 40, 60, 80, 100].map((level) => (
                          <button
                            key={level}
                            onClick={() => handleUpdateSkillLevel(skill.name, level)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                              skill.level >= level
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {skills.length === 0 && (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h3>
                    <p className="text-gray-600">Add your first skill to start tracking your progress</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Charts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Overview</h2>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Skills</span>
                  <span className="text-lg font-semibold text-gray-900">{skills.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Expert Level</span>
                  <span className="text-lg font-semibold text-green-600">
                    {skills.filter(s => s.level >= 80).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Average Level</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {skills.length > 0 ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Progress */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Progress</h2>
              {progressData.length > 0 ? (
                <div className="space-y-3">
                  {progressData.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-900">{item.skill}</span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">{item.progress}%</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent progress</p>
              )}
            </div>

            {/* Learning Resources */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.href = '/courses'}
                  className="w-full flex items-center p-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-3" />
                  Browse Courses
                </button>
                <button
                  onClick={() => window.location.href = '/chat'}
                  className="w-full flex items-center p-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Brain className="h-4 w-4 mr-3" />
                  Ask AI Advisor
                </button>
                <button
                  onClick={() => window.location.href = '/quiz'}
                  className="w-full flex items-center p-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Target className="h-4 w-4 mr-3" />
                  Retake Career Quiz
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Plan Modal */}
        {improvementPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Improvement Plan for {selectedSkill}
                  </h2>
                  <button
                    onClick={() => setImprovementPlan(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {improvementPlan}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setImprovementPlan(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillDevelopment;