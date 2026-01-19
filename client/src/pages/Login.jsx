// import { useState } from 'react';
// import { supabase } from '../supabaseClient';
// import { useNavigate, Link } from 'react-router-dom';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password });

//     if (error) {
//       alert(error.message);
//     } else {
//       const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();

//       if (profile?.role === 'student') navigate('/dashboard');
//       else if (profile?.role === 'warden') navigate('/admin');
//       else if (profile?.role === 'watchman') navigate('/scanner');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-indigo-600 p-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl">
//         <h1 className="text-3xl font-black text-center text-indigo-600 mb-2">HOPMS</h1>
//         <p className="text-center text-gray-400 mb-8">Hostel Outing Management</p>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 border-none rounded-2xl" onChange={(e) => setEmail(e.target.value)} />
//           <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border-none rounded-2xl" onChange={(e) => setPassword(e.target.value)} />
//           <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200">Sign In</button>
//         </form>
//         <p className="text-center mt-6 text-sm text-gray-500">
//           New student? <Link to="/signup" className="text-indigo-600 font-bold">Create Account</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'student') navigate('/dashboard');
      else if (profile?.role === 'warden') navigate('/admin');
      else if (profile?.role === 'watchman') navigate('/scanner');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 font-sans relative overflow-hidden">
      {/* Dynamic Animated Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2">
              HOPMS<span className="text-indigo-500 text-6xl not-italic">.</span>
            </h1>
            <div className="h-1 w-12 bg-indigo-500 mx-auto rounded-full mb-4"></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">
              Campus Access Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest group-focus-within:text-indigo-400 transition-colors">
                Institution Email
              </label>
              <input 
                type="email" 
                placeholder="name@college.edu" 
                required
                className="w-full p-5 bg-slate-800/40 border-2 border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all duration-300" 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest group-focus-within:text-indigo-400 transition-colors">
                Security Key
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full p-5 bg-slate-800/40 border-2 border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all duration-300" 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-900/20 active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Authorize Entry'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-10 text-center space-y-4">
            <p className="text-sm text-slate-500">
              Identity required for campus exit.
            </p>
            <div className="pt-4 border-t border-slate-800/50">
              <p className="text-xs text-slate-400">
                New to the system?{' '}
                <Link to="/signup" className="text-indigo-400 font-black uppercase tracking-widest hover:text-indigo-300 transition-colors">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Subtle Branding Bottom */}
        <p className="text-center mt-8 text-[9px] text-slate-700 font-bold uppercase tracking-[0.5em]">
          Powered by Smart Campus Protocol v2.0
        </p>
      </div>
    </div>
  );
}