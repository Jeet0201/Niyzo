import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index, { NotFound } from "./pages/Index";
import About from "./pages/About";
import AdminPanel from "./pages/AdminPanel";
import MentorQuestions, { MentorDashboard } from "./pages/MentorQuestions";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import SignIn from "./pages/SignIn";
import MentorLogin, { MentorSignup } from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/mentor-login" element={<MentorLogin />} />
            <Route path="/mentor-signup" element={<MentorSignup />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminPanel />
                </RequireAuth>
              }
            />
            <Route
              path="/mentor-questions"
              element={
                <RequireAuth>
                  <MentorQuestions />
                </RequireAuth>
              }
            />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
