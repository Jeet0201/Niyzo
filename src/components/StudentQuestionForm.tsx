import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StudentQuestionForm: React.FC = () => {
  const { toast } = useToast();
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState<{ id: string; name: string; subject: string; designation?: string; imageUrl?: string }[]>([]);
  const [assignedMentorId, setAssignedMentorId] = useState<string>('');

  useEffect(() => {
    console.log('StudentQuestionForm: Loading mentors...');
    const load = async () => {
      try {
        setLoading(true);
        console.log('Calling api.getPublicMentors()...');
        const list = await api.getPublicMentors();
        console.log('Raw mentors response:', list);
        console.log('Number of mentors received:', Array.isArray(list) ? list.length : 'Not an array');
        
        if (!Array.isArray(list)) {
          console.error('Mentors response is not an array:', typeof list, list);
          setMentors([]);
          return;
        }
        
        // Normalize mentor IDs to match backend format
        const normalizedMentors = list.map((m, index) => {
          console.log(`Processing mentor ${index + 1}:`, m);
          return {
            id: m._id || m.id || `mentor-${index}`,
            name: m.name || 'Unknown Mentor',
            subject: m.subject || 'Unknown Subject',
            designation: m.designation || m.title || m.role,
            imageUrl: m.imageUrl || m.profileImage || m.avatar || m.image
          };
        });
        
        console.log('Final normalized mentors:', normalizedMentors);
        setMentors(normalizedMentors);
      } catch (err) {
        console.error('Failed to load mentors:', err);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('=== FORM SUBMIT STARTED ===');
    e.preventDefault();
    console.log('Form data:', { studentName, studentEmail, studentPhone, subject, question, assignedMentorId });
    
    // Validate all required fields
    if (!studentName.trim()) {
      toast({ title: 'Name Required', description: 'Please enter your full name.', variant: 'destructive' });
      return;
    }

    // CHANGE 2: Validate student contact (email OR phone required)
    if (!studentEmail.trim() && !studentPhone.trim()) {
      toast({ 
        title: 'Contact Required', 
        description: 'Please provide either your email address or phone number so the mentor can contact you.', 
        variant: 'destructive' 
      });
      return;
    }

    // Validate email format if provided
    if (studentEmail.trim() && !studentEmail.match(/.+@.+\..+/)) {
      toast({ 
        title: 'Invalid Email', 
        description: 'Please enter a valid email address.', 
        variant: 'destructive' 
      });
      return;
    }

    // Validate phone format if provided (10 digits only)
    if (studentPhone.trim()) {
      const digitsOnly = studentPhone.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        toast({ 
          title: 'Invalid Phone', 
          description: 'Phone number must be exactly 10 digits.', 
          variant: 'destructive' 
        });
        return;
      }
    }
    
    if (!subject.trim()) {
      toast({ title: 'Subject Required', description: 'Please specify the subject/topic of your question.', variant: 'destructive' });
      return;
    }
    
    if (!question.trim()) {
      toast({ title: 'Question Required', description: 'Please describe your question in detail.', variant: 'destructive' });
      return;
    }
    
    // Validate mentor selection
    if (!assignedMentorId || assignedMentorId === 'none') {
      toast({ 
        title: 'Mentor Required', 
        description: 'Please select a specific mentor for your question.', 
        variant: 'destructive' 
      });
      return;
    }
    
    console.log('Validation passed, submitting...');
    setLoading(true);
    try {
      const questionData = {
        studentName,
        studentEmail: studentEmail.trim(),
        studentPhone: studentPhone.replace(/\D/g, ''), // Store digits only
        subject,
        question,
        assignedMentorId: assignedMentorId
      };
      console.log('Final question data to submit:', questionData);
      console.log('Calling api.createQuestion with payload:', questionData);
      const result = await api.createQuestion(questionData);
      console.log('✅ Question created successfully:', result);
      const selectedMentor = mentors.find(m => m.id === assignedMentorId);
      setStudentName('');
      setStudentEmail('');
      setStudentPhone('');
      setSubject('');
      setQuestion('');
      setAssignedMentorId('');
      toast({ 
        title: 'Question submitted successfully! ✅', 
        description: selectedMentor 
          ? `Your question has been sent to ${selectedMentor.name}. You'll get a response soon!`
          : 'Your question has been submitted successfully!'
      });
    } catch (err: any) {
      console.error('❌ Failed to submit question:', err);
      console.error('Error details:', { message: err.message, stack: err.stack });
      toast({ title: 'Submit failed', description: err.message || 'Please try again later', variant: 'destructive' });
    } finally {
      console.log('=== FORM SUBMIT FINISHED ===');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mentor Selection Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Mentor</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Select from our expert mentors to get personalized help with your question.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-muted-foreground mt-4">Loading mentors...</p>
            </div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-lg mb-2">No mentors available</p>
                <p className="text-sm">Please check your connection or try again later.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Found {mentors.length} available mentors
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {/* Mentor cards */}
                {mentors.map((mentor, index) => {
                  console.log(`Rendering mentor ${index + 1}:`, mentor);

                  const initials = (mentor.name || 'M')
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join('');

                  return (
                    <div 
                      key={mentor.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        assignedMentorId === mentor.id
                          ? 'ring-4 ring-blue-500 shadow-xl scale-105 bg-blue-50' 
                          : 'bg-white hover:shadow-lg hover:scale-[1.02]'
                      } rounded-xl p-6 border-2 ${
                        assignedMentorId === mentor.id ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() => {
                        console.log('Mentor clicked:', mentor);
                        setAssignedMentorId(mentor.id);
                      }}
                    >
                      <div className="text-center">
                        <div className="relative mx-auto mb-4 w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                          {mentor.imageUrl ? (
                            <img
                              src={mentor.imageUrl}
                              alt={mentor.name}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                              onLoad={(e) => {
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                if (fallback) fallback.style.display = 'none';
                              }}
                            />
                          ) : null}
                          <span
                            className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-900"
                            style={{ display: mentor.imageUrl ? 'none' : 'flex' }}
                          >
                            {initials || '?'}
                          </span>
                        </div>
                        
                        <h3 className={`text-lg font-bold mb-2 ${
                          assignedMentorId === mentor.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {mentor.name || 'Unknown'}
                        </h3>

                        {mentor.designation ? (
                          <p className={`text-sm font-medium mb-1 ${
                            assignedMentorId === mentor.id ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {mentor.designation}
                          </p>
                        ) : null}
                        
                        <p className={`text-sm font-medium mb-3 ${
                          assignedMentorId === mentor.id ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {mentor.subject || 'No subject'}
                        </p>
                        
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">Available</span>
                        </div>
                        
                        {assignedMentorId === mentor.id && (
                          <div className="bg-green-100 border border-green-300 rounded-lg p-2">
                            <div className="flex items-center justify-center gap-2 text-green-800">
                              <span className="text-lg">✓</span>
                              <span className="text-sm font-bold">SELECTED</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Question Form Section */}
      <section id="ask-question" className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Ask Your Question</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {assignedMentorId 
                ? `Your question will be sent to ${mentors.find(m => m.id === assignedMentorId)?.name}`
                : 'Please select a mentor above to continue'}
            </p>
          </div>
        
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Your Information</h3>
                  <div>
                    <Label htmlFor="studentName" className="text-sm font-medium">Your Name *</Label>
                    <Input 
                      id="studentName" 
                      value={studentName} 
                      onChange={(e) => setStudentName(e.target.value)} 
                      placeholder="Enter your full name" 
                      className="mt-1"
                      required
                    />
                  </div>

                  {/* CHANGE 2: Student Contact Field */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="studentEmail" className="text-sm font-medium">
                        Email Address
                        <span className="text-muted-foreground text-xs ml-1">(or Phone below) *</span>
                      </Label>
                      <Input 
                        id="studentEmail" 
                        type="email"
                        value={studentEmail} 
                        onChange={(e) => setStudentEmail(e.target.value)} 
                        placeholder="your.email@example.com" 
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        We'll use this to send you the answer
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="studentPhone" className="text-sm font-medium">
                        Phone Number (10 digits)
                        <span className="text-muted-foreground text-xs ml-1">(or Email above) *</span>
                      </Label>
                      <Input 
                        id="studentPhone" 
                        type="tel"
                        value={studentPhone} 
                        onChange={(e) => setStudentPhone(e.target.value.replace(/\D/g, ''))} 
                        placeholder="1234567890" 
                        className="mt-1"
                        maxLength="10"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        10 digits only, we'll call or text you
                      </p>
                    </div>
                  </div>
                </div>

                {/* Question Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Question Details</h3>
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium">Subject/Topic *</Label>
                    <Input 
                      id="subject" 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)} 
                      placeholder="e.g., Calculus, Physics, Programming, Chemistry..." 
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="mentorSelect" className="text-sm font-medium text-primary">Select Your Mentor *</Label>
                    
                    {/* Current Selection Display */}
                    {assignedMentorId ? (
                      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-white">
                              {mentors.find(m => m.id === assignedMentorId)?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-lg font-bold text-blue-900">
                              {mentors.find(m => m.id === assignedMentorId)?.name || 'Unknown Mentor'}
                            </div>
                            <div className="text-sm text-blue-700 font-medium">
                              Subject: {mentors.find(m => m.id === assignedMentorId)?.subject || 'N/A'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-full">
                            <span className="text-green-600 text-lg">✓</span>
                            <span className="text-sm font-bold text-green-800">SELECTED</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⚠️</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-lg font-bold text-red-800">No Mentor Selected</div>
                            <div className="text-sm text-red-600 font-medium">
                              You must choose a mentor to continue
                            </div>
                          </div>
                          <div className="text-red-500 font-bold">
                            REQUIRED
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Mentor Selection Dropdown */}
                    <Select value={assignedMentorId || ''} onValueChange={(v) => {
                      console.log('Mentor selected from dropdown:', v);
                      console.log('Available mentors:', mentors);
                      const selectedMentor = mentors.find(m => m.id === v);
                      console.log('Selected mentor object:', selectedMentor);
                      setAssignedMentorId(v);
                    }}>
                      <SelectTrigger id="mentorSelect" className="h-14 border-2 border-blue-300 hover:border-blue-500 transition-colors">
                        <SelectValue placeholder="👥 Click here to choose your mentor">
                          {assignedMentorId ? (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                  {mentors.find(m => m.id === assignedMentorId)?.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              </div>
                              <div className="flex-1">
                                <span className="font-bold text-gray-900">
                                  {mentors.find(m => m.id === assignedMentorId)?.name || 'Unknown Mentor'}
                                </span>
                                <span className="text-sm text-blue-600 ml-2">
                                  • {mentors.find(m => m.id === assignedMentorId)?.subject || 'Unknown Subject'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">👥 Click here to choose your mentor</span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-80 z-[9999] bg-white border-2 border-gray-300 shadow-2xl">
                        {mentors.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            <div className="text-sm">No mentors available</div>
                            <div className="text-xs mt-1">Please refresh the page</div>
                          </div>
                        ) : (
                          <>
                            <div className="px-4 py-3 text-sm font-bold text-gray-800 bg-gray-100 border-b border-gray-200">
                              📋 Choose from {mentors.length} available mentors:
                            </div>
                            {mentors.map((m, index) => {
                              console.log(`Rendering dropdown option ${index + 1}:`, m);
                              return (
                                <SelectItem 
                                  key={m.id} 
                                  value={m.id} 
                                  className="p-4 cursor-pointer hover:bg-blue-100 focus:bg-blue-100 border-b border-gray-100"
                                >
                                  <div className="flex items-center gap-4 w-full">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-base font-bold text-white">
                                        {m.name?.charAt(0)?.toUpperCase() || '?'}
                                      </span>
                                    </div>
                                    <div className="flex-1 text-left">
                                      <div className="font-black text-base text-black mb-1">
                                        {m.name || `Mentor ${index + 1}`}
                                      </div>
                                      <div className="text-sm font-semibold text-blue-700">
                                        {m.subject || 'Unknown Subject'}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <div className="w-3 h-3 bg-green-500 rounded-full" title="Available"></div>
                                      <span className="text-xs font-medium text-green-600">Available</span>
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    
                    <div className="text-sm text-center font-medium">
                      {assignedMentorId ? (
                        <div className="text-green-700 bg-green-50 p-2 rounded">
                          📤 Your question will be sent directly to <strong>{mentors.find(m => m.id === assignedMentorId)?.name}</strong>
                        </div>
                      ) : (
                        <div className="text-red-700 bg-red-50 p-2 rounded">
                          👆 You must select a mentor from the dropdown above to continue
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="question" className="text-sm font-medium">Your Question *</Label>
                    <Textarea 
                      id="question" 
                      value={question} 
                      onChange={(e) => setQuestion(e.target.value)} 
                      placeholder="Please describe your question in detail. Include any specific concepts you're struggling with, what you've tried, and what kind of help you need..." 
                      rows={6} 
                      className="mt-1 resize-none"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {question.length}/500 characters • Be specific for better help
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting Question...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>📤</span>
                        Submit Question
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

    </>
  );
};

export default StudentQuestionForm;
