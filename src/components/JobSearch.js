import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Filter,
  Briefcase,
  Calendar,
  Users,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const JobSearch = () => {
  const [activeTab, setActiveTab] = useState('internships');
  const [internships, setInternships] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    career: '',
    location: '',
    experience: 'entry',
    type: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'internships') {
        const response = await axios.get('/api/internships', { params: filters });
        setInternships(response.data.internships);
      } else if (activeTab === 'jobs') {
        const response = await axios.get('/api/jobs', { params: filters });
        setJobs(response.data.jobs);
      } else if (activeTab === 'events') {
        const response = await axios.get('/api/events', { params: filters });
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = () => {
    let data = [];
    if (activeTab === 'internships') data = internships;
    else if (activeTab === 'jobs') data = jobs;
    else if (activeTab === 'events') data = events;

    return data.filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const formatSalary = (salary) => {
    if (typeof salary === 'string') return salary;
    if (typeof salary === 'number') return `$${salary.toLocaleString()}`;
    return 'Salary not specified';
  };

  const getExperienceColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-yellow-100 text-yellow-800';
      case 'senior': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderInternships = () => (
    <div className="space-y-4">
      {filteredData().map((internship, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{internship.title}</h3>
              <p className="text-lg text-gray-600 mb-2">{internship.company}</p>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="mr-4">{internship.location}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span className="mr-4">{internship.duration}</span>
                <DollarSign className="h-4 w-4 mr-1" />
                <span>{formatSalary(internship.salary)}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(internship.type)}`}>
              {internship.type}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{internship.description}</p>

          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
            <div className="flex flex-wrap gap-2">
              {internship.requirements?.map((req, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {req}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Posted {new Date().toLocaleDateString()}
            </div>
            <a
              href={internship.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Now
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-4">
      {filteredData().map((job, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-lg text-gray-600 mb-2">{job.company}</p>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="mr-4">{job.location}</span>
                <Briefcase className="h-4 w-4 mr-1" />
                <span className="mr-4">{job.type}</span>
                <DollarSign className="h-4 w-4 mr-1" />
                <span>{formatSalary(job.salary_range)}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(job.experience_level)}`}>
              {job.experience_level}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{job.description}</p>

          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
            <div className="flex flex-wrap gap-2">
              {job.requirements?.map((req, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {req}
                </span>
              ))}
            </div>
          </div>

          {job.benefits && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Posted {new Date().toLocaleDateString()}
            </div>
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Now
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-4">
      {filteredData().map((event, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{event.date}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span className="mr-4">{event.time}</span>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{event.location}</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {event.type}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{event.description}</p>

          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Related Careers:</h4>
            <div className="flex flex-wrap gap-2">
              {event.careers?.map((career, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                  {career}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Event on {new Date(event.date).toLocaleDateString()}
            </div>
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Register
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  const tabs = [
    { id: 'internships', label: 'Internships', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Search & Opportunities</h1>
          <p className="mt-2 text-lg text-gray-600">
            Find internships, jobs, and career events to advance your professional journey
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, company, or description..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Career</label>
                <select
                  value={filters.career}
                  onChange={(e) => handleFilterChange('career', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Careers</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="UX Designer">UX Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Enter location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {activeTab === 'jobs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Found ${filteredData().length} ${activeTab}`}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'internships' && renderInternships()}
            {activeTab === 'jobs' && renderJobs()}
            {activeTab === 'events' && renderEvents()}
          </>
        )}

        {!loading && filteredData().length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;