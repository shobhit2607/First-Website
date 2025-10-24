import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  BookOpen,
  ExternalLink,
  ChevronRight,
  Brain,
  Target,
  Users,
  Award
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CareerExplorer = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    salaryRange: '',
    growthRate: '',
    experienceLevel: ''
  });
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    filterCareers();
  }, [careers, searchTerm, filters]);

  const fetchCareers = async () => {
    try {
      const response = await axios.get('/api/careers');
      setCareers(response.data.careers);
      setFilteredCareers(response.data.careers);
    } catch (error) {
      console.error('Error fetching careers:', error);
      toast.error('Failed to load careers');
    } finally {
      setLoading(false);
    }
  };

  const filterCareers = () => {
    let filtered = careers.filter(career => {
      const matchesSearch = career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           career.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSalary = !filters.salaryRange || 
        (filters.salaryRange === 'low' && career.salary_range[0] < 60000) ||
        (filters.salaryRange === 'medium' && career.salary_range[0] >= 60000 && career.salary_range[0] < 100000) ||
        (filters.salaryRange === 'high' && career.salary_range[0] >= 100000);
      
      const matchesGrowth = !filters.growthRate || 
        (filters.growthRate === 'low' && career.growth_rate < 15) ||
        (filters.growthRate === 'medium' && career.growth_rate >= 15 && career.growth_rate < 25) ||
        (filters.growthRate === 'high' && career.growth_rate >= 25);

      return matchesSearch && matchesSalary && matchesGrowth;
    });

    setFilteredCareers(filtered);
  };

  const handleCareerSelect = async (career) => {
    try {
      const response = await axios.get(`/api/career/${career.name}`);
      setSelectedCareer(response.data.career);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching career details:', error);
      toast.error('Failed to load career details');
    }
  };

  const getSalaryRange = (range) => {
    return `$${range[0].toLocaleString()} - $${range[1].toLocaleString()}`;
  };

  const getGrowthColor = (rate) => {
    if (rate >= 25) return 'text-green-600';
    if (rate >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Career Explorer</h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover and explore different career paths with detailed information
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Careers</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by career name or description..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Salary Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
              <select
                value={filters.salaryRange}
                onChange={(e) => setFilters(prev => ({ ...prev, salaryRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Ranges</option>
                <option value="low">Under $60k</option>
                <option value="medium">$60k - $100k</option>
                <option value="high">Over $100k</option>
              </select>
            </div>

            {/* Growth Rate Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Growth Rate</label>
              <select
                value={filters.growthRate}
                onChange={(e) => setFilters(prev => ({ ...prev, growthRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Rates</option>
                <option value="low">Under 15%</option>
                <option value="medium">15% - 25%</option>
                <option value="high">Over 25%</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredCareers.length} career{filteredCareers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Career Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCareerSelect(career)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{career.name}</h3>
                    <div className="flex items-center mt-1">
                      <TrendingUp className={`h-4 w-4 mr-1 ${getGrowthColor(career.growth_rate)}`} />
                      <span className={`text-sm font-medium ${getGrowthColor(career.growth_rate)}`}>
                        {career.growth_rate}% growth
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{career.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Salary Range</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getSalaryRange(career.salary_range)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Required Skills</span>
                  <span className="text-sm font-medium text-gray-900">
                    {career.required_skills?.length || 0} skills
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <span>Learn more</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No careers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Career Details Modal */}
        {showDetails && selectedCareer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCareer.name}</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
                      <p className="text-gray-600">{selectedCareer.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Salary & Growth</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Salary Range</span>
                          <span className="text-sm font-medium text-gray-900">
                            {getSalaryRange(selectedCareer.salary_range)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Growth Rate</span>
                          <span className={`text-sm font-medium ${getGrowthColor(selectedCareer.growth_rate)}`}>
                            {selectedCareer.growth_rate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.required_skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Soft Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.soft_skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Learning Resources */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Resources</h3>
                    <div className="space-y-3">
                      {selectedCareer.learning_resources?.map((resource, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{resource.title}</h4>
                              <p className="text-sm text-gray-600">{resource.platform}</p>
                              <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {resource.type}
                              </span>
                            </div>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // Navigate to learning path or add to favorites
                        toast.success('Added to your learning path!');
                        setShowDetails(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add to Learning Path
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerExplorer;