import React from 'react';

interface Mentor {
  id: string;
  name: string;
  designation: string;
  subject: string;
  university: string;
  profileImage?: string;
  status: string;
}

// Sample mentor data - replace with your API response
const mentorData: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    designation: 'Computer Science Professor',
    subject: 'Machine Learning & AI',
    university: 'MIT',
    profileImage: 'https://picsum.photos/seed/sarah/200/200.jpg',
    status: 'Available'
  },
  {
    id: '2', 
    name: 'Prof. Michael Chen',
    designation: 'Mathematics Expert',
    subject: 'Advanced Calculus',
    university: 'Stanford',
    profileImage: 'https://picsum.photos/seed/michael/200/200.jpg',
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
    profileImage: 'https://picsum.photos/seed/david/200/200.jpg',
    status: 'Available'
  }
];

const SimpleMentorSection = () => {
  // Generate initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section id="mentors" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            World-Class Mentors
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn from verified professors and industry experts from top universities 
            who are passionate about student success.
          </p>
        </div>

        {/* Mentor Grid using map() */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mentorData.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-20 h-20 mb-3">
                  {/* Profile Image with fallback */}
                  {mentor.profileImage ? (
                    <img
                      src={mentor.profileImage}
                      alt={`${mentor.name} profile`}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        // Hide image on error and show fallback
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback Avatar - shown when image fails or doesn't exist */}
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
                    ? 'bg-green-900/30 text-green-400 border border-green-600/30' 
                    : 'bg-gray-800 text-gray-400 border border-gray-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    mentor.status === 'Available' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  {mentor.status}
                </span>
              </div>

              {/* Mentor Information */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  {mentor.name}
                </h3>
                <p className="text-sm font-medium text-blue-400">
                  {mentor.designation}
                </p>
                <p className="text-sm text-gray-300">
                  {mentor.subject}
                </p>
                <p className="text-xs text-gray-400">
                  {mentor.university}
                </p>
              </div>

              {/* Action Button */}
              <button 
                className="w-full mt-4 bg-white text-black py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                onClick={() => {
                  // Handle mentor selection
                  alert(`Selected mentor: ${mentor.name}`);
                  // Or scroll to question form:
                  // const questionSection = document.getElementById('ask-question');
                  // if (questionSection) {
                  //   questionSection.scrollIntoView({ behavior: 'smooth' });
                  // }
                }}
              >
                Ask Question
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimpleMentorSection;
