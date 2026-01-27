import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Mentor {
  id: string;
  name: string;
  designation: string;
  subject: string;
  university: string;
  profileImage?: string;
  status: string;
}

const MentorSection = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await api.getPublicMentors();
        
        // Map API response to our Mentor interface
        const mentorData = (response as any[]).map((mentor) => ({
          id: mentor._id || mentor.id,
          name: mentor.name || 'Unknown Mentor',
          designation: mentor.designation || mentor.subject || 'Professor',
          subject: mentor.subject || 'Not specified',
          university: mentor.university || 'University',
          profileImage: mentor.profileImage || mentor.image,
          status: mentor.status || 'Available'
        }));
        
        setMentors(mentorData);
      } catch (err) {
        console.error('Failed to fetch mentors:', err);
        setError('Failed to load mentors');
        
        // Fallback data for testing
        setMentors([
          {
            id: '1',
            name: 'Dr. Sarah Johnson',
            designation: 'Computer Science Professor',
            subject: 'Machine Learning & AI',
            university: 'MIT',
            status: 'Available'
          },
          {
            id: '2', 
            name: 'Prof. Michael Chen',
            designation: 'Mathematics Expert',
            subject: 'Advanced Calculus',
            university: 'Stanford',
            status: 'Available'
          },
          {
            id: '3',
            name: 'Dr. Emily Rodriguez',
            designation: 'Physics Professor',
            subject: 'Quantum Mechanics',
            university: 'Harvard',
            status: 'Available'
          },
          {
            id: '4',
            name: 'Prof. David Kim',
            designation: 'Chemistry Expert',
            subject: 'Organic Chemistry',
            university: 'Berkeley',
            status: 'Available'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Generate initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading mentors...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <p className="text-gray-600 mt-2">Showing fallback mentors</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="mentors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            World-Class Mentors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from verified professors and industry experts from top universities 
            who are passionate about student success.
          </p>
        </div>

        {/* Mentor Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-20 h-20 mb-3">
                  {/* Profile Image */}
                  {mentor.profileImage ? (
                    <img
                      src={mentor.profileImage}
                      alt={`${mentor.name} profile`}
                      className="w-full h-full rounded-full object-cover"
                      onError={handleImageError}
                    />
                  ) : null}
                  
                  {/* Fallback Avatar */}
                  <div
                    className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg"
                    style={{ display: mentor.profileImage ? 'none' : 'flex' }}
                  >
                    {getInitials(mentor.name)}
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  mentor.status === 'Available' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    mentor.status === 'Available' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  {mentor.status}
                </span>
              </div>

              {/* Mentor Information */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mentor.name}
                </h3>
                <p className="text-sm font-medium text-blue-600">
                  {mentor.designation}
                </p>
                <p className="text-sm text-gray-600">
                  {mentor.subject}
                </p>
                <p className="text-xs text-gray-500">
                  {mentor.university}
                </p>
              </div>

              {/* Action Button */}
              <button 
                className="w-full mt-4 bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                onClick={() => {
                  // Scroll to question form or handle mentor selection
                  const questionSection = document.getElementById('ask-question');
                  if (questionSection) {
                    questionSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Ask Question
              </button>
            </div>
          ))}
        </div>

        {/* No Mentors Message */}
        {mentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No mentors available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MentorSection;
