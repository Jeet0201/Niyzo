import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Clock, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

type QuestionStatus = 'New' | 'Assigned' | 'In Progress' | 'Resolved';

interface Question {
  id: string;
  studentName: string;
  studentEmail?: string;
  subject: string;
  question: string;
  createdAt: number;
  status: QuestionStatus;
  assignedMentorId?: string;
}

interface Mentor {
  id: string;
  name: string;
  subject: string;
  initials: string;
  status: string;
  university: string;
}

const MentorQuestions = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<string>('all');
  const [answersDraft, setAnswersDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [q, m] = await Promise.all([api.getQuestions(), api.getMentors()]);
        const qNormalized: Question[] = (q as any[]).map((it) => ({
          id: it.id || it._id,
          studentName: it.studentName,
          studentEmail: it.studentEmail,
          subject: it.subject,
          question: it.question,
          createdAt: new Date(it.createdAt).getTime(),
          status: it.status,
          assignedMentorId: it.assignedMentorId || undefined,
        }));
        setQuestions(qNormalized);
        
        const normalizedMentors = (m as any[]).map((it) => ({
          id: it._id || it.id,
          name: it.name,
          subject: it.subject,
          initials: it.initials || it.name.split(' ').map((w: string) => w[0]).join('').toUpperCase(),
          status: it.status || 'Available',
          university: it.university || '—',
        }));
        setMentors(normalizedMentors);
      } catch (err: any) {
        toast({ title: 'Failed to load', description: err.message || 'Could not load data from server', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const handleStatusChange = async (questionId: string, status: QuestionStatus) => {
    try {
      const updated = await api.updateQuestion(questionId, { status });
      const norm = {
        id: (updated as any).id || (updated as any)._id,
        studentName: (updated as any).studentName,
        studentEmail: (updated as any).studentEmail,
        subject: (updated as any).subject,
        question: (updated as any).question,
        createdAt: new Date((updated as any).createdAt).getTime(),
        status: (updated as any).status,
        assignedMentorId: (updated as any).assignedMentorId || undefined,
      } as Question;
      setQuestions(prev => prev.map(item => (item.id === norm.id ? norm : item)));
      toast({ title: 'Updated', description: 'Question status updated.' });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message || 'Please try again', variant: 'destructive' });
    }
  };

  const handleResolveWithAnswer = async (q: Question, mentorId: string) => {
    try {
      const answerText = answersDraft[q.id]?.trim();
      if (!answerText) {
        toast({ title: 'Answer required', description: 'Please type an answer before marking as resolved.', variant: 'destructive' });
        return;
      }
      const updated = await api.updateQuestion(q.id, {
        status: 'Resolved',
        answerText,
        answeredByMentorId: mentorId,
        answeredAt: new Date().toISOString(),
      });
      const norm = {
        id: (updated as any).id || (updated as any)._id,
        studentName: (updated as any).studentName,
        studentEmail: (updated as any).studentEmail,
        subject: (updated as any).subject,
        question: (updated as any).question,
        createdAt: new Date((updated as any).createdAt).getTime(),
        status: (updated as any).status,
        assignedMentorId: (updated as any).assignedMentorId || undefined,
      } as Question;
      setQuestions(prev => prev.map(item => (item.id === norm.id ? norm : item)));
      setAnswersDraft(prev => ({ ...prev, [q.id]: '' }));
      toast({ title: 'Marked as resolved', description: 'The answer is now visible on the user panel.' });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message || 'Please try again', variant: 'destructive' });
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (q.status === 'Resolved') return false; // Hide resolved questions
    if (selectedMentor === 'all') return true;
    if (selectedMentor === 'unassigned') return !q.assignedMentorId;
    return q.assignedMentorId === selectedMentor;
  });

  const getQuestionCount = (mentorId: string) => {
    if (mentorId === 'all') return questions.filter(q => q.status !== 'Resolved').length;
    if (mentorId === 'unassigned') return questions.filter(q => !q.assignedMentorId && q.status !== 'Resolved').length;
    return questions.filter(q => q.assignedMentorId === mentorId && q.status !== 'Resolved').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Mentor Questions</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mentor Filter */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Filter by Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                <Button
                  variant={selectedMentor === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedMentor('all')}
                  className="h-auto p-3 flex flex-col items-center gap-2"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm">📋</span>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs">All Questions</div>
                    <div className="text-xs text-muted-foreground">{getQuestionCount('all')} active</div>
                  </div>
                </Button>
                
                <Button
                  variant={selectedMentor === 'unassigned' ? 'default' : 'outline'}
                  onClick={() => setSelectedMentor('unassigned')}
                  className="h-auto p-3 flex flex-col items-center gap-2"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">❓</span>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs">Unassigned</div>
                    <div className="text-xs text-muted-foreground">{getQuestionCount('unassigned')} active</div>
                  </div>
                </Button>

                {mentors.map((mentor) => (
                  <Button
                    key={mentor.id}
                    variant={selectedMentor === mentor.id ? 'default' : 'outline'}
                    onClick={() => setSelectedMentor(mentor.id)}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{mentor.initials}</span>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-xs truncate">{mentor.name}</div>
                      <div className="text-xs text-muted-foreground">{getQuestionCount(mentor.id)} active</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-muted-foreground">
                  {selectedMentor === 'all' ? 'No active questions found.' : 
                   selectedMentor === 'unassigned' ? 'No unassigned questions.' :
                   `No active questions for ${mentors.find(m => m.id === selectedMentor)?.name}.`}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredQuestions.map((question) => {
              const mentor = mentors.find(m => m.id === question.assignedMentorId);
              return (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Student Avatar */}
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{question.studentName}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(question.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {question.subject}
                              </div>
                              {mentor && (
                                <div className="text-primary font-medium">
                                  → {mentor.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            question.status === 'New' ? 'bg-blue-100 text-blue-700' :
                            question.status === 'Assigned' ? 'bg-yellow-100 text-yellow-700' :
                            question.status === 'In Progress' ? 'bg-purple-100 text-purple-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {question.status}
                          </span>
                        </div>

                        {/* Question */}
                        <div className="mb-4 p-3 bg-muted/30 rounded-lg border-l-2 border-primary/40">
                          <p className="text-sm text-foreground">{question.question}</p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Status:</span>
                            <Select value={question.status} onValueChange={(value) => handleStatusChange(question.id, value as QuestionStatus)}>
                              <SelectTrigger className="w-[120px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Assigned">Assigned</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Write your answer..."
                              value={answersDraft[question.id] || ''}
                              onChange={(e) => setAnswersDraft(prev => ({ ...prev, [question.id]: e.target.value }))}
                              className="min-h-[80px] text-sm resize-none"
                            />
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                {answersDraft[question.id]?.length || 0} characters
                              </span>
                              <Button 
                                size="sm" 
                                onClick={() => handleResolveWithAnswer(question, question.assignedMentorId || mentors[0]?.id)}
                                disabled={!answersDraft[question.id]?.trim()}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Submit Answer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorQuestions;

// Mentor Dashboard Component
interface MentorUser {
  id: string;
  name: string;
  email: string;
  subject: string;
  university: string;
  status: string;
}

interface MentorQuestion {
  _id: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  question: string;
  status: string;
  answerText?: string;
  createdAt: string;
}

export const MentorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mentorUser, setMentorUser] = useState<MentorUser | null>(null);
  const [questions, setQuestions] = useState<MentorQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('mentorToken');
        const userStr = localStorage.getItem('mentorUser');
        
        if (!token || !userStr) {
          navigate('/mentor-login');
          return;
        }
        
        const user = JSON.parse(userStr);
        setMentorUser(user);
        
        // Fetch mentor's questions
        const response = await fetch('/api/mentor/questions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to load questions');
        const data = await response.json();
        setQuestions(data);
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
        navigate('/mentor-login');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('mentorToken');
    localStorage.removeItem('mentorUser');
    navigate('/');
  };

  const handleUpdateAnswer = async (questionId: string) => {
    try {
      const token = localStorage.getItem('mentorToken');
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answerText, status: 'Resolved', answeredAt: new Date() })
      });
      
      if (!response.ok) throw new Error('Failed to update answer');
      
      setQuestions(questions.map(q => q._id === questionId ? { ...q, answerText, status: 'Resolved' } : q));
      setEditingQuestionId(null);
      setAnswerText('');
      toast({ title: 'Success', description: 'Answer submitted successfully!' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mentor Dashboard</h1>
              <p className="text-secondary mt-1">{mentorUser?.name} • {mentorUser?.subject}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary">Name</p>
                <p className="text-lg font-semibold">{mentorUser?.name}</p>
              </div>
              <div>
                <p className="text-sm text-secondary">Email</p>
                <p className="text-lg font-semibold">{mentorUser?.email}</p>
              </div>
              <div>
                <p className="text-sm text-secondary">Subject</p>
                <p className="text-lg font-semibold">{mentorUser?.subject}</p>
              </div>
              <div>
                <p className="text-sm text-secondary">University</p>
                <p className="text-lg font-semibold">{mentorUser?.university}</p>
              </div>
              <div>
                <p className="text-sm text-secondary">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  mentorUser?.status === 'Available' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {mentorUser?.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <p className="text-center text-secondary py-8">No questions assigned to you yet.</p>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q._id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{q.studentName}</p>
                        <p className="text-sm text-secondary">{q.subject}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        q.status === 'Resolved' ? 'bg-success/10 text-success' :
                        q.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {q.status}
                      </span>
                    </div>
                    <p className="text-foreground mb-3">{q.question}</p>
                    
                    {editingQuestionId === q._id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Write your answer here..."
                          className="min-h-24"
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdateAnswer(q._id)} size="sm">Submit Answer</Button>
                          <Button onClick={() => { setEditingQuestionId(null); setAnswerText(''); }} variant="outline" size="sm">Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {q.answerText && (
                          <div className="bg-muted p-3 rounded mb-2">
                            <p className="text-sm font-semibold mb-1">Your Answer:</p>
                            <p className="text-sm">{q.answerText}</p>
                          </div>
                        )}
                        {q.status !== 'Resolved' && (
                          <Button onClick={() => { setEditingQuestionId(q._id); setAnswerText(q.answerText || ''); }} size="sm">
                            {q.answerText ? 'Edit Answer' : 'Add Answer'}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
