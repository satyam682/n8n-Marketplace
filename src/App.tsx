import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Marketplace } from './pages/Marketplace';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TemplateDetail } from './pages/TemplateDetail';
import { Publish } from './pages/Publish';
import { Profile } from './pages/Profile';
import ECommerceIdea from './pages/ECommerceIdea';
import ECommerceDetails from './pages/ECommerceDetails';
import AgentList from './pages/AgentList';
import AgentDetails from './pages/AgentDetails';
import SaasIdea from './pages/SaasIdea';
import SaasDetails from './pages/SaasDetails';
import { AuthProvider } from './context/AuthContext';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neo-white text-neo-black font-sans selection:bg-neo-black selection:text-neo-white">
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <footer className="border-t-4 border-neo-black py-12 px-6 bg-neo-white mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-black uppercase tracking-tighter">
            n8n <span className="bg-neo-black text-neo-white px-2">Marketplace</span>
          </div>
          <div className="flex gap-8 font-bold uppercase text-sm">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Documentation</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
          </div>
          <div className="font-black uppercase text-sm">
            © 2024 Built for the community
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/template/:id" element={<TemplateDetail />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/ecommerce-ideas" element={<ECommerceIdea />} />
            <Route path="/ecommerce-detail/:id" element={<ECommerceDetails />} />
            <Route path="/agent-list" element={<AgentList />} />
            <Route path="/agent-detail/:id" element={<AgentDetails />} />
            <Route path="/saas-ideas" element={<SaasIdea />} />
            <Route path="/saas-detail/:id" element={<SaasDetails />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
