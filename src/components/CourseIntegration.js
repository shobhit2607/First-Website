import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Star, 
  Clock, 
  DollarSign,
  Filter,
  Search,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CourseIntegration = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState('');
  const [filters, setFilters] = useState({
    platform: '',
    priceRange: '',
    rating: '',
    duration: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const platforms = ['All', 'Coursera', 'Udemy', 'edX', 'freeCodeCamp', 'Pluralsight', 'LinkedIn Learning'];
  const priceRanges = ['All', 'Free', 'Under $50', '$50-$100', '$100-$200', 'Over $200'];
  const ratings = ['All', '4.5+', '4.0+', '3.5+', '3.0+'];
  const durations = ['All', 'Under 10 hours', '10-20 hours', '20-40 hours', '40+ hours'];

  const careers = [
    'Software Developer',
    'Data Analyst',
    'UX Designer',
    'Product Manager',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Cybersecurity Specialist',
    'Digital Marketer'
  ];

  // Mock course data - in production, this would come from APIs
  const mockCourses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      platform: 'Udemy',
      instructor: 'Dr. Angela Yu',
      rating: 4.7,
      students: 1250000,
      price: 89.99,
      originalPrice: 199.99,
      duration: '65 hours',
      level: 'Beginner',
      language: 'English',
      description: 'Learn web development with HTML, CSS, JavaScript, React, Node.js, and more.',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
      image: 'https://via.placeholder.com/300x200',
      url: 'https://udemy.com/course/web-development-bootcamp'
    },
    {
      id: 2,
      title: 'Data Science Specialization',
      platform: 'Coursera',
      instructor: 'Johns Hopkins University',
      rating: 4.6,
      students: 890000,
      price: 39,
      originalPrice: 39,
      duration: '8 months',
      level: 'Intermediate',
      language: 'English',
      description: 'Learn data science with R programming, statistical analysis, and machine learning.',
      skills: ['R Programming', 'Statistics', 'Machine Learning', 'Data Visualization'],
      image: 'https://via.placeholder.com/300x200',
      url: 'https://coursera.org/specializations/jhu-data-science'
    },
    {
      id: 3,
      title: 'UX Design Fundamentals',
      platform: 'edX',
      instructor: 'MIT',
      rating: 4.5,
      students: 450000,
      price: 0,
      originalPrice: 0,
      duration: '12 weeks',
      level: 'Beginner',
      language: 'English',
      description: 'Learn user experience design principles and methodologies.',
      skills: ['User Research', 'Wireframing', 'Prototyping', 'User Testing'],
      image: 'https://via.placeholder.com/300x200',
      url: 'https://edx.org/course/ux-design-fundamentals'
    }
  ];

  useEffect(() => {
    fetchCourses();
  }, [selectedCareer, filters]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      if (selectedCareer) {
        const response = await axios.get(`/api/courses?career=${selectedCareer}`);
        setCourses(response.data.courses);
      } else {
        setCourses(mockCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses(mockCourses); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filters.platform === '' || filters.platform === 'All' || course.platform === filters.platform;
    const matchesRating = filters.rating === '' || filters.rating === 'All' || course.rating >= parseFloat(filters.rating);
    const matchesPrice = filters.priceRange === '' || filters.priceRange === 'All' || 
                        (filters.priceRange === 'Free' && course.price === 0) ||
                        (filters.priceRange === 'Under $50' && course.price > 0 && course.price < 50) ||
                        (filters.priceRange === '$50-$100' && course.price >= 50 && course.price <= 100) ||
                        (filters.priceRange === '$100-$200' && course.price > 100 && course.price <= 200) ||
                        (filters.priceRange === 'Over $200' && course.price > 200);

    return matchesSearch && matchesPlatform && matchesRating && matchesPrice;
  });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 text-yellow-400 fill-current opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course & Learning Resources</h1>
          <p className="mt-2 text-lg text-gray-600">Discover courses and resources to advance your career</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Career Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Career Path</label>
              <select
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Careers</option>
                {careers.map(career => (
                  <option key={career} value={career}>{career}</option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={filters.platform}
                onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ratings.map(rating => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {loading ? 'Loading courses...' : `Found ${filteredCourses.length} courses`}
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Course Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {course.platform}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>

                  {/* Rating and Students */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {renderStars(course.rating)}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{course.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students.toLocaleString()}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{course.description}</p>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {course.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {course.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{course.skills.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {course.level}
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {course.price === 0 ? (
                        <span className="text-lg font-bold text-green-600">Free</span>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-900">${course.price}</span>
                          {course.originalPrice > course.price && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${course.originalPrice}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Course
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseIntegration;