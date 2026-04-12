import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Mail, Lock, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Blur Vectors */}
      <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-violet-600 rounded-full blur-[120px] opacity-20"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500 shadow-xl shadow-indigo-500/30 mb-6">
              <Zap className="h-8 w-8 text-white" />
           </div>
           <h2 className="text-3xl font-extrabold text-white tracking-tight">
             Welcome back
           </h2>
           <p className="mt-2 text-sm text-indigo-200">
             Sign in to access your dashboard
           </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border-white/20">
           <CardContent className="p-8">
             <form className="space-y-5" onSubmit={handleSubmit}>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email context</label>
                  <Input 
                    type="email" 
                    required 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    icon={Mail}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Security Token</label>
                  <Input 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    icon={Lock}
                  />
               </div>
               
               <div className="pt-2">
                 <Button 
                   type="submit" 
                   className="w-full" 
                   size="lg" 
                   isLoading={isSubmitting}
                 >
                   Secure Login
                 </Button>
               </div>
             </form>
           </CardContent>
           <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 rounded-b-2xl text-center">
              <p className="text-sm text-slate-600 font-medium">
                New to the platform?{' '}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-bold transition-colors">
                  Initialize Profile
                </Link>
              </p>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
