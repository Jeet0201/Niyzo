export type QuestionStatus = 'New' | 'Assigned' | 'In Progress' | 'Resolved';

export interface Question {
  id: string;
  studentName: string;
  studentEmail?: string;
  subject: string;
  question: string;
  createdAt: number;
  status: QuestionStatus;
  assignedMentorId?: string;
}

const KEY = 'ys:questions:v1';

export function getAllQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Question[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAllQuestions(list: Question[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addQuestion(q: Omit<Question, 'id' | 'createdAt' | 'status'>): Question {
  const all = getAllQuestions();
  const newQ: Question = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    status: 'New',
    ...q,
  };
  const updated = [newQ, ...all];
  saveAllQuestions(updated);
  return newQ;
}

export function updateQuestion(id: string, patch: Partial<Question>): Question | undefined {
  const all = getAllQuestions();
  const idx = all.findIndex(q => q.id === id);
  if (idx === -1) return undefined;
  const updated = { ...all[idx], ...patch };
  all[idx] = updated;
  saveAllQuestions(all);
  return updated;
}
