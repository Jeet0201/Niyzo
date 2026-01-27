  import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, ArrowLeft, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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

const AdminPanel = () => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    university: '',
    status: 'Available'
  });

  const generateInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };


  const handleAdd = async () => {
    if (!formData.name || !formData.subject || !formData.university) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await api.createMentor({
        name: formData.name,
        subject: formData.subject,
        university: formData.university,
        status: formData.status
      });
      
      // Reload mentors from backend
      const m = await api.getMentors();
      setMentors((m as any[]).map((it) => ({
        id: it._id || it.id,
        name: it.name,
        subject: it.subject,
        initials: it.initials || it.name.split(' ').map((w: string) => w[0]).join('').toUpperCase(),
        status: it.status || 'Available',
        university: it.university || '—',
      })));
      
      setFormData({ name: '', subject: '', university: '', status: 'Available' });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Mentor added successfully!"
      });
    } catch (err: any) {
      toast({
        title: 'Failed to add mentor',
        description: err.message || 'Please try again',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (mentor: Mentor) => {
    setEditingMentor(mentor);
    setFormData({
      name: mentor.name,
      subject: mentor.subject,
      university: mentor.university,
      status: mentor.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.subject || !formData.university || !editingMentor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await api.updateMentor(editingMentor.id, {
        name: formData.name,
        subject: formData.subject,
        university: formData.university,
        status: formData.status
      });
      
      // Reload mentors from backend
      const m = await api.getMentors();
      setMentors((m as any[]).map((it) => ({
        id: it._id || it.id,
        name: it.name,
        subject: it.subject,
        initials: it.initials || it.name.split(' ').map((w: string) => w[0]).join('').toUpperCase(),
        status: it.status || 'Available',
        university: it.university || '—',
      })));
      
      setFormData({ name: '', subject: '', university: '', status: 'Available' });
      setEditingMentor(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Mentor updated successfully!"
      });
    } catch (err: any) {
      toast({
        title: 'Failed to update mentor',
        description: err.message || 'Please try again',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMentor(id);
      
      // Reload mentors from backend
      const m = await api.getMentors();
      setMentors((m as any[]).map((it) => ({
        id: it._id || it.id,
        name: it.name,
        subject: it.subject,
        initials: it.initials || it.name.split(' ').map((w: string) => w[0]).join('').toUpperCase(),
        status: it.status || 'Available',
        university: it.university || '—',
      })));
      
      toast({
        title: "Success",
        description: "Mentor deleted successfully!"
      });
    } catch (err: any) {
      toast({
        title: 'Failed to delete mentor',
        description: err.message || 'Please try again',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', subject: '', university: '', status: 'Available' });
    setEditingMentor(null);
  };

  useEffect(() => {
    // Load questions and mentors from API
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
        console.log('Loaded questions:', qNormalized);
        
        // Map backend mentors to include initials/status/university placeholders if needed
        const normalizedMentors = (m as any[]).map((it) => ({
          id: it._id || it.id,
          name: it.name,
          subject: it.subject,
          initials: it.initials || it.name.split(' ').map((w: string) => w[0]).join('').toUpperCase(),
          status: it.status || 'Available',
          university: it.university || '—',
        }));
        setMentors(normalizedMentors);
        console.log('Loaded mentors:', normalizedMentors);
      } catch (err: any) {
        toast({ title: 'Failed to load', description: err.message || 'Could not load data from server', variant: 'destructive' });
      }
    };
    load();
  }, [toast]);



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/mentor-questions">
                <Button variant="outline" size="sm">
                  <List className="h-4 w-4 mr-2" />
                  Question List
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold text-foreground">{questions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Questions</p>
                  <p className="text-2xl font-bold text-foreground">{questions.filter(q => q.status !== 'Resolved').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-foreground">{questions.filter(q => q.status === 'Resolved').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Mentors</p>
                  <p className="text-2xl font-bold text-foreground">{mentors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mentor Management</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Mentor
                  </Button>
                </DialogTrigger>
                <DialogContent aria-describedby={undefined}>
                  <DialogHeader>
                    <DialogTitle>Add New Mentor</DialogTitle>
                    <DialogDescription>Fill in the details below to add a new mentor.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="add-name">Name *</Label>
                      <Input
                        id="add-name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter mentor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="add-subject">Subject *</Label>
                      <Input
                        id="add-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Enter subject"
                      />
                    </div>
                    <div>
                      <Label htmlFor="add-university">University *</Label>
                      <Input
                        id="add-university"
                        value={formData.university}
                        onChange={(e) => setFormData({...formData, university: e.target.value})}
                        placeholder="Enter university"
                      />
                    </div>
                    <div>
                      <Label htmlFor="add-status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Busy">Busy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAdd} className="w-full">
                      Add Mentor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell className="font-medium">{mentor.name}</TableCell>
                    <TableCell>{mentor.subject}</TableCell>
                    <TableCell>{mentor.university}</TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          mentor.status === 'Available' 
                            ? 'bg-success/10 text-success border border-success/20' 
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        <div 
                          className={`w-2 h-2 rounded-full mr-1 ${
                            mentor.status === 'Available' ? 'bg-success' : 'bg-muted-foreground'
                          }`}
                        />
                        {mentor.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(mentor)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(mentor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Edit Mentor</DialogTitle>
              <DialogDescription>Update mentor information and save your changes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter mentor name"
                />
              </div>
              <div>
                <Label htmlFor="edit-subject">Subject *</Label>
                <Input
                  id="edit-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <Label htmlFor="edit-university">University *</Label>
                <Input
                  id="edit-university"
                  value={formData.university}
                  onChange={(e) => setFormData({...formData, university: e.target.value})}
                  placeholder="Enter university"
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdate} className="w-full">
                Update Mentor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPanel;