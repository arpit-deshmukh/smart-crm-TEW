import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Home from "../pages/Home";
import UserLeads from "../pages/user/UserLeads";
import UserDeals from "../pages/user/UserDeals";
import UserContacts from "../pages/user/UserContacts";
import UserCompanies from "../pages/user/UserCompanies";
import UserEmailTemplates from "../pages/user/UserEmailTemplates";
import UserFollowups from "../pages/user/UserFollowups";
import Features from "../pages/footerpages/Features";
import Pricing from "../pages/footerpages/Pricing";
import Integration from "../pages/footerpages/Integration";
import Documentation from "../pages/footerpages/Documentation";
import HelpCenter from "../pages/footerpages/HelpCenter";
import SystemStatus from "../pages/footerpages/SystemStatus";
import About from "../pages/footerpages/About";
import PrivacyPolicy from "../pages/footerpages/PrivacyPolicy";
import ContactSales from "../pages/footerpages/ContactSales";
import UserProfile from "../pages/user/UserProfile";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminRequests from "../pages/admin/AdminRequests";
import AdminActivity from "../pages/admin/AdminActivity";
import TermsOfService from "../pages/footerpages/TermsOfService";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import AdminRevenueSummary from "../pages/admin/AdminRevenueSummary";
import AdminProfile from "../pages/admin/AdminProfile";
import ChatbotWidget from "../components/chatbot/ChatbotWidget";

const AppRoutes = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< Home />} />
        <Route path="/home" element={< Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/integrations" element={<Integration/>} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/status" element={<SystemStatus />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

       
        
        




        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
        path="/user/leads"
        element={
          <ProtectedRoute allowedRole="user">
            <UserLeads />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/deals"
        element={
          <ProtectedRoute allowedRole="user">
            <UserDeals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/contacts"
        element={
          <ProtectedRoute allowedRole="user">
            <UserContacts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/companies"
        element={
          <ProtectedRoute allowedRole="user">
            <UserCompanies />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/templates"
        element={
          <ProtectedRoute allowedRole="user">
            <UserEmailTemplates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/followups"
        element={
          <ProtectedRoute allowedRole="user">
            <UserFollowups />
          </ProtectedRoute>
        }
      />

       <Route 
        path="/user/contact" 
        element={
        <ProtectedRoute allowedRole="user">
          <ContactSales />
        </ProtectedRoute>
        }
      />

      <Route
        path="/user/profile"
        element={
        <ProtectedRoute allowedRole="user">
          <UserProfile /> 
        </ProtectedRoute>
          }
      />

      <Route 
        path="/admin/users" 
        element={
        <ProtectedRoute allowedRole="admin">
          <AdminUsers />
        </ProtectedRoute>
        }
      />

      <Route
        path="/admin/revenue-summary"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminRevenueSummary />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/admin/requests" 
        element={
        <ProtectedRoute allowedRole="admin">
          <AdminRequests />
        </ProtectedRoute>
        } 
      />

      <Route 
          path="/admin/activity" 
          element={
            <ProtectedRoute allowedRole="admin">
          <AdminActivity />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/profile" 
        element={
        <ProtectedRoute allowedRole="admin">
        <AdminProfile />
        </ProtectedRoute>
      } 
    />


      </Routes>
          <ChatbotWidget />
    </BrowserRouter>

    </>
  );
};

const ChatbotWrapper = () => {
  return <ChatbotWidget />;
};

export default AppRoutes;