import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Comprehensive Exam Coverage',
      description: 'JEE, NEET, SSC, UPSC, and more Indian competitive exams'
    },
    {
      icon: ClockIcon,
      title: 'Timed Practice Tests',
      description: 'Real exam-like experience with built-in timers'
    },
    {
      icon: ChartBarIcon,
      title: 'Detailed Analytics',
      description: 'Track your progress and identify weak areas'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert-Curated Content',
      description: 'Questions prepared by subject matter experts'
    }
  ];

  const examTypes = [
    { name: 'JEE Main & Advanced', color: 'bg-blue-500', students: '2M+' },
    { name: 'NEET', color: 'bg-green-500', students: '1.5M+' },
    { name: 'SSC CGL', color: 'bg-purple-500', students: '1M+' },
    { name: 'UPSC Civil Services', color: 'bg-red-500', students: '800K+' },
    { name: 'Banking Exams', color: 'bg-yellow-500', students: '600K+' },
    { name: 'Railway Exams', color: 'bg-indigo-500', students: '400K+' }
  ];

  const stats = [
    { number: '50K+', label: 'Active Students' },
    { number: '100K+', label: 'Questions Available' },
    { number: '95%', label: 'Success Rate' },
    { number: '24/7', label: 'Available' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Master Indian Competitive Exams
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Practice with thousands of questions, get instant feedback, and track your progress 
              for JEE, NEET, SSC, UPSC, and more.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/signup"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                Start Free Practice
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ExamPrep?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in your competitive exam journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="card text-center hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Exam Types
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Practice for the most competitive exams in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examTypes.map((exam, index) => (
              <motion.div 
                key={exam.name}
                className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-4 h-4 ${exam.color} rounded-full mr-3`}></div>
                  <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Comprehensive practice tests with detailed explanations
                </p>
                <div className="text-sm text-gray-500">
                  {exam.students} students practicing
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Ace Your Exam?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of successful students who have achieved their dream scores
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/signup"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center"
            >
              Get Started Now
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;