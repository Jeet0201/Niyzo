import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";

// Lazy load non-critical components
const Index = lazy(() => import("./pages/Index").then(module => ({ default: module.default })));
const About = lazy(() => import("./pages/About"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const MentorQuestions = lazy(() => import("./pages/MentorQuestions"));
const MentorDashboard = lazy(() => import("./pages/MentorQuestions").then(module => ({ default: module.MentorDashboard })));
const SignIn = lazy(() => import("./pages/SignIn"));
const MentorLogin = lazy(() => import("./pages/NotFound"));
const MentorSignup = lazy(() => import("./pages/NotFound").then(module => ({ default: module.MentorSignup })));
const NotFound = lazy(() => import("./pages/Index").then(module => ({ default: module.NotFound })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
