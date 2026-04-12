import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Mail, Lock, Zap, User, UserCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Student' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await register(formData.name, formData.email, formData.password, formData.role);
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
        <div className="text-center mb-6">
           <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500 shadow-xl shadow-indigo-500/30 mb-4">
              <Zap className="h-7 w-7 text-white" />
           </div>
           <h2 className="text-3xl font-extrabold text-white tracking-tight">
             Join AlumniOS
           </h2>
           <p className="mt-2 text-sm text-indigo-200">
             Accelerate your structured career trajectories natively
           </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border-white/20">
           <CardContent className="p-8">
             <form className="space-y-4" onSubmit={handleSubmit}>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <Input name="name" type="text" required placeholder="John Doe" onChange={handleChange} icon={User} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Boundary</label>
                  <Input name="email" type="email" required placeholder="student@university.edu" onChange={handleChange} icon={Mail} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Encryption Key</label>
                  <Input name="password" type="password" required placeholder="••••••••" onChange={handleChange} icon={Lock} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Access Tier</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserCircle2 className="h-5 w-5" />
                    </div>
                    <select name="role" value={formData.role} onChange={handleChange} className="block w-full rounded-lg border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all appearance-none cursor-pointer bg-white">
                      <option value="Student">Student Matrix (Mentee)</option>
                      <option value="Alumni">Alumni Layout (Professional)</option>
                    </select>
                  </div>
               </div>
               
               <div className="pt-3">
                 <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                   Construct Profile
                 </Button>
               </div>
             </form>
           </CardContent>
           <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 rounded-b-2xl text-center">
              <p className="text-sm text-slate-600 font-medium">
                Already registered?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-bold transition-colors">
                  Login here
                </Link>
              </p>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
