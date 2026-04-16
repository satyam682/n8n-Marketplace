import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Search, Plus, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  // Dropdown items data - Badhi Links update kari didhi che
  const categories = [
    { 
      title: "E-commerce", 
      links: [
        { name: "50 n8n ideas", href: "/ecommerce-ideas" },
        { name: "Top 10 AI Agent", href: "/agent-list" }
      ] 
    },
    { 
      title: "SaaS", 
      links: [
        { name: "50 n8n ideas", href: "/saas-ideas" },
        { name: "Top 10 AI Agent", href: "/ideas/saas-ai" }
      ] 
    },
    { 
      title: "Software Dev & QA", 
      links: [
        { name: "50 n8n ideas", href: "/dev-ideas" },
        { name: "Top 10 AI Agent", href: "/ideas/dev-ai" }
      ] 
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-neo-white border-b-4 border-neo-black py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-neo-black text-neo-white p-1 neo-border group-hover:rotate-12 transition-transform">
            <Search size={20} className="md:w-6 md:h-6" strokeWidth={3} />
          </div>
          <span className="text-xl md:text-2xl font-black uppercase tracking-tighter text-neo-black">n8n Marketplace</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">Browse</Button>
          </Link>

          {/* Desktop Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Button variant="ghost" className="gap-1 font-bold">
              Top Ideas <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isDropdownOpen && (
              <div className="absolute top-[100%] left-0 w-[260px] pt-2 z-50">
                <div className="bg-neo-white border-4 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2">
                  {categories.map((cat, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      <div className="px-2 py-1 text-[10px] font-black uppercase bg-neo-black text-neo-white inline-block mb-1">
                        {cat.title}
                      </div>
                      {cat.links.map((link, i) => (
                        <Link 
                          key={i} 
                          to={link.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-2 py-1.5 text-sm font-bold hover:bg-yellow-300 border-2 border-transparent hover:border-neo-black transition-all"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {user ? (
            <>
              <Link to="/publish">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Plus size={18} strokeWidth={3} />
                  Publish
                </Button>
              </Link>

              <Link to="/profile">
                <Button variant="outline" size="icon" className="overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={20} strokeWidth={3} />
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut size={20} strokeWidth={3} />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Join Now</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 neo-border bg-neo-black text-neo-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-neo-white border-b-4 border-neo-black p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200 max-h-[90vh] overflow-y-auto">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start font-black">Browse Templates</Button>
          </Link>

          {/* Mobile Category List */}
          <div className="border-4 border-neo-black p-4 bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black uppercase text-sm mb-4 border-b-2 border-neo-black pb-1">Top Idea Categories</p>
            <div className="flex flex-col gap-6">
              {categories.map((cat, idx) => (
                <div key={idx}>
                  <p className="text-[10px] font-black bg-neo-black text-neo-white inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">{cat.title}</p>
                  <div className="flex flex-col gap-3 pl-2">
                    {cat.links.map((link, i) => (
                      <Link 
                        key={i} 
                        to={link.href} 
                        className="font-bold text-sm hover:text-blue-600 flex items-center gap-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="h-1.5 w-1.5 bg-neo-black rounded-full" /> {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {user ? (
            <>
              <Link to="/publish" onClick={() => setIsMenuOpen(false)}>
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Plus size={18} strokeWidth={3} />
                  Publish Workflow
                </Button>
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-neo-black" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={18} strokeWidth={3} />
                  )}
                  My Profile
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start gap-2 text-red-600" onClick={handleLogout}>
                <LogOut size={18} strokeWidth={3} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" className="w-full">Join Now</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}