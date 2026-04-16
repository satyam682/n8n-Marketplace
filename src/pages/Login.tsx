import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { LogIn, Github, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      login(email, 'n8n Expert', 'user1');
      setIsSubmitting(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto py-12 md:py-20 px-4 md:px-6">
      <Card className="neo-shadow-lg overflow-hidden">
        <CardHeader className="text-center px-6 pt-8 pb-6">
          <div className="mx-auto bg-neo-black text-neo-white p-3 neo-border w-fit mb-4">
            <LogIn className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
          </div>
          <CardTitle className="text-3xl md:text-4xl">Welcome Back</CardTitle>
          <CardDescription className="text-base md:text-lg font-bold mt-2">
            Login to your account to publish and download templates.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-black uppercase">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 md:h-14 w-full !box-border"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs md:text-sm font-black uppercase">
                  Password
                </label>
                <a href="#" className="text-[10px] md:text-xs font-bold hover:underline">
                  Forgot?
                </a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 md:h-14 w-full !box-border"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 md:h-14 text-lg md:text-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-5 h-5 md:w-6 md:h-6" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-neo-black" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neo-white px-3 font-black">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="gap-2 w-full">
              <Github size={20} />
              GitHub
            </Button>
            <Button variant="outline" className="gap-2 w-full">
              <Mail size={20} />
              Google
            </Button>
          </div>
        </CardContent>

        <div className="px-6 py-5 text-center border-t-2 border-neo-black">
          <p className="font-bold">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="underline decoration-2 underline-offset-4 hover:bg-neo-black hover:text-neo-white px-1"
            >
              Register here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}