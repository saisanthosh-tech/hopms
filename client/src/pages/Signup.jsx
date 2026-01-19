// import { useState } from 'react';
// import { supabase } from '../supabaseClient';
// import { useNavigate } from 'react-router-dom';

// export default function Signup() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [role, setRole] = useState('student'); 
//   const [gender, setGender] = useState('male');
//   const [hostelNum, setHostelNum] = useState('1');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // 1. Security Check for Staff Roles
//     if (role === 'warden' || role === 'watchman') {
//       const adminPassword = prompt("Enter Administration Secret Key:");
//       if (adminPassword !== "KJSSE_ADMIN_2026") {
//         alert("Unauthorized! You cannot sign up for this role.");
//         setLoading(false);
//         return;
//       }
//     }

//     // 2. LOGIC MERGE: Handle Global Watchman vs Scoped Student/Warden
//     let userGender = gender;
//     let finalHostelId = `${gender === 'male' ? 'Male' : 'Female'} Hostel ${hostelNum}`;

//     if (role === 'watchman') {
//       userGender = 'male';      // Force Male for Watchman
//       finalHostelId = 'All Hostels'; // Global Access for Scanner
//     }

//     // 3. Supabase Auth Signup
//     const { data, error: authError } = await supabase.auth.signUp({ email, password });

//     if (authError) {
//       alert(authError.message);
//     } else if (data.user) {
//       // 4. Create Profile with calculated Global or Scoped Hostel ID
//       const { error: profileError } = await supabase.from('profiles').insert([{ 
//         id: data.user.id, 
//         full_name: fullName, 
//         role: role,
//         gender: userGender,
//         hostel_id: finalHostelId
//       }]);

//       if (!profileError) {
//         alert(role === 'watchman' ? "Watchman account created with Global Access!" : "Account created! Log in to continue.");
//         navigate('/');
//       } else {
//         alert("Error creating profile: " + profileError.message);
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
//       <form onSubmit={handleSignup} className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl space-y-4 border border-gray-100">
//         <h2 className="text-2xl font-black text-center text-indigo-600 uppercase tracking-tight">Create Account</h2>
        
//         <input 
//           type="text" 
//           placeholder="Full Name" 
//           required 
//           className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
//           onChange={(e) => setFullName(e.target.value)} 
//         />
//         <input 
//           type="email" 
//           placeholder="Email" 
//           required 
//           className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
//           onChange={(e) => setEmail(e.target.value)} 
//         />
//         <input 
//           type="password" 
//           placeholder="Password" 
//           required 
//           className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
//           onChange={(e) => setPassword(e.target.value)} 
//         />
        
//         <div className="space-y-3">
//           <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Role & Hostel Configuration</label>
          
//           {/* Dynamic Grid: Adjusts layout based on role */}
//           <div className={`grid ${role === 'watchman' ? 'grid-cols-1' : 'grid-cols-3'} gap-2`}>
//             <select 
//               value={role} 
//               onChange={(e) => setRole(e.target.value)} 
//               className="p-3 bg-gray-100 border-none rounded-xl text-[11px] font-bold uppercase cursor-pointer"
//             >
//               <option value="student">Student</option>
//               <option value="warden">Warden</option>
//               <option value="watchman">Watchman</option>
//             </select>
            
//             {/* Conditional Rendering: Only show Gender/Hostel if NOT a Watchman */}
//             {role !== 'watchman' && (
//               <>
//                 <select 
//                   value={gender} 
//                   onChange={(e) => setGender(e.target.value)} 
//                   className="p-3 bg-gray-100 border-none rounded-xl text-[11px] font-bold uppercase cursor-pointer"
//                 >
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                 </select>

//                 <select 
//                   value={hostelNum} 
//                   onChange={(e) => setHostelNum(e.target.value)} 
//                   className="p-3 bg-gray-100 border-none rounded-xl text-[11px] font-bold uppercase cursor-pointer"
//                 >
//                   {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>H-{n}</option>)}
//                 </select>
//               </>
//             )}
//           </div>
          
//           {role === 'watchman' && (
//             <p className="text-[9px] text-indigo-400 font-bold uppercase text-center animate-pulse">
//               Note: Watchman profile locked to Male / Global Access
//             </p>
//           )}
//         </div>

//         <button 
//           disabled={loading} 
//           className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-100 mt-4 active:scale-95 transition-all disabled:opacity-50"
//         >
//           {loading ? 'Processing...' : 'Sign Up'}
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student'); 
  const [gender, setGender] = useState('male');
  const [hostelNum, setHostelNum] = useState('1');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (role === 'warden' || role === 'watchman') {
      const adminPassword = prompt("Enter Administration Secret Key:");
      if (adminPassword !== "KJSSE_ADMIN_2026") {
        alert("Unauthorized! You cannot sign up for this role.");
        setLoading(false);
        return;
      }
    }

    let userGender = gender;
    let finalHostelId = `${gender === 'male' ? 'Male' : 'Female'} Hostel ${hostelNum}`;

    if (role === 'watchman') {
      userGender = 'male'; 
      finalHostelId = 'All Hostels';
    }

    const { data, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      alert(authError.message);
    } else if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([{ 
        id: data.user.id, 
        full_name: fullName, 
        role: role,
        gender: userGender,
        hostel_id: finalHostelId
      }]);

      if (!profileError) {
        alert(role === 'watchman' ? "Watchman account created with Global Access!" : "Account created! Log in to continue.");
        navigate('/');
      } else {
        alert("Error creating profile: " + profileError.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 font-sans relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              Join HOPMS<span className="text-indigo-500 not-italic text-4xl">.</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">
              Registration Protocol
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Full Identity</label>
              <input 
                type="text" 
                placeholder="Ex: John Doe" 
                required 
                className="w-full p-4 bg-slate-800/40 border-2 border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all" 
                onChange={(e) => setFullName(e.target.value)} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Email Address</label>
              <input 
                type="email" 
                placeholder="id@college.edu" 
                required 
                className="w-full p-4 bg-slate-800/40 border-2 border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all" 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Secret Key</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                className="w-full p-4 bg-slate-800/40 border-2 border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all" 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            
            <div className="space-y-3 pt-2">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Permission Config</label>
              
              <div className={`grid ${role === 'watchman' ? 'grid-cols-1' : 'grid-cols-3'} gap-2`}>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="p-3 bg-slate-800 border-none rounded-xl text-[10px] font-bold uppercase text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  <option value="student">Student</option>
                  <option value="warden">Warden</option>
                  <option value="watchman">Watchman</option>
                </select>
                
                {role !== 'watchman' && (
                  <>
                    <select 
                      value={gender} 
                      onChange={(e) => setGender(e.target.value)} 
                      className="p-3 bg-slate-800 border-none rounded-xl text-[10px] font-bold uppercase text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>

                    <select 
                      value={hostelNum} 
                      onChange={(e) => setHostelNum(e.target.value)} 
                      className="p-3 bg-slate-800 border-none rounded-xl text-[10px] font-bold uppercase text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>H-{n}</option>)}
                    </select>
                  </>
                )}
              </div>
              
              {role === 'watchman' && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
                  <p className="text-[8px] text-indigo-400 font-black uppercase text-center tracking-widest leading-relaxed">
                    Global scanner profile active: Male / Campus-wide access
                  </p>
                </div>
              )}
            </div>

            <button 
              disabled={loading} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-indigo-900/20 mt-4 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Initialize Account'}
            </button>
          </form>

          <p className="text-center mt-8 text-xs text-slate-500">
            Already registered? <button onClick={() => navigate('/')} className="text-indigo-400 font-black uppercase tracking-widest ml-1 hover:text-indigo-300 transition-colors">Login</button>
          </p>
        </div>
      </div>
    </div>
  );
}