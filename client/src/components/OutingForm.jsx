// import { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient';

// export default function OutingForm({ onSuccess }) {
//   const [loading, setLoading] = useState(false);
//   const [type, setType] = useState('local'); 
//   const [reason, setReason] = useState('');
//   const [returnDate, setReturnDate] = useState('');
//   const [studentProfile, setStudentProfile] = useState(null);

//   // Fetch student profile info on component load for the UI badge
//   useEffect(() => {
//     const getProfile = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         const { data } = await supabase
//           .from('profiles')
//           .select('hostel_id, full_name')
//           .eq('id', user.id)
//           .single();
//         setStudentProfile(data);
//       }
//     };
//     getProfile();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // 1. Get the current student's Auth ID
//       const { data: { user } } = await supabase.auth.getUser();

//       // 2. Fetch the student's profile to get their specific hostel_id (Prevents NULL error)
//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('hostel_id')
//         .eq('id', user.id)
//         .single();

//       if (profileError || !profile?.hostel_id) {
//         throw new Error("Could not find your hostel assignment. Please contact admin.");
//       }

//       // 3. Insert the outing with the student's hostel_id attached
//       const { error: insertError } = await supabase.from('outings').insert([
//         {
//           student_id: user.id,
//           hostel_id: profile.hostel_id, // Link to the specific Warden
//           type: type,
//           reason: reason,
//           expected_return_at: new Date(returnDate).toISOString(),
//           status: 'pending',
//           is_emergency: type === 'medical'
//         }
//       ]);

//       if (insertError) throw insertError;

//       // 4. Handle Success
//       alert(`Request sent to ${profile.hostel_id} Warden!`);
//       setReason('');
//       setReturnDate('');
      
//       if (onSuccess) onSuccess(); // Refreshes StudentDashboard to show "PENDING"

//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in duration-500">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-xl font-black text-gray-800 uppercase">Apply for Pass</h3>
//         {studentProfile && (
//           <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-bold uppercase tracking-widest">
//             {studentProfile.hostel_id}
//           </span>
//         )}
//       </div>
      
//       {/* Outing Type Selection */}
//       <div className="grid grid-cols-2 gap-2 mb-6">
//         {['local', 'weekend', 'festival', 'medical'].map((t) => (
//           <button
//             key={t}
//             type="button"
//             onClick={() => setType(t)}
//             className={`py-3 text-[10px] font-black rounded-xl border uppercase tracking-widest transition-all ${
//               type === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-gray-50 text-gray-400 border-transparent'
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       <div className="space-y-4">
//         {/* Reason Input */}
//         <textarea
//           required
//           className={`w-full rounded-2xl p-4 text-sm outline-none border-2 transition-all ${
//             type === 'medical' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-transparent'
//           }`}
//           placeholder={type === 'medical' ? "Emergency reason / symptoms..." : "Purpose of outing..."}
//           value={reason}
//           onChange={(e) => setReason(e.target.value)}
//         />

//         {/* Return Date Input */}
//         <div className="space-y-1">
//           <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Expected Return</label>
//           <input
//             type="datetime-local"
//             required
//             className="w-full bg-gray-50 border-transparent rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
//             value={returnDate}
//             onChange={(e) => setReturnDate(e.target.value)}
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-4 rounded-2xl font-black text-white uppercase tracking-widest transition-all active:scale-95 ${
//             type === 'medical' ? 'bg-red-600 shadow-lg shadow-red-100' : 'bg-indigo-600 shadow-lg shadow-indigo-100'
//           }`}
//         >
//           {loading ? 'Submitting...' : 'Submit Request'}
//         </button>
//       </div>
//     </form>
//   );
// }

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function OutingForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('local'); 
  const [reason, setReason] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('hostel_id, full_name')
          .eq('id', user.id)
          .single();
        setStudentProfile(data);
      }
    };
    getProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('hostel_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.hostel_id) {
        throw new Error("Could not find your hostel assignment.");
      }

      const { error: insertError } = await supabase.from('outings').insert([
        {
          student_id: user.id,
          hostel_id: profile.hostel_id,
          type: type,
          reason: reason,
          expected_return_at: new Date(returnDate).toISOString(),
          status: 'pending',
          is_emergency: type === 'medical'
        }
      ]);

      if (insertError) throw insertError;

      alert(`Request sent to ${profile.hostel_id} Warden!`);
      setReason('');
      setReturnDate('');
      if (onSuccess) onSuccess();

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative Background Glow */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/10 blur-[50px]"></div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Apply for Pass</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Digital Request Form</p>
        </div>
        {studentProfile && (
          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-black uppercase tracking-[0.1em]">
            {studentProfile.hostel_id}
          </span>
        )}
      </div>
      
      {/* Outing Type Selection with Animated Pills */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {['local', 'weekend', 'festival', 'medical'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`py-3.5 text-[10px] font-black rounded-2xl border uppercase tracking-[0.2em] transition-all duration-300 ${
              type === t 
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20 scale-[1.02]' 
                : 'bg-slate-800/50 text-slate-500 border-slate-700 hover:border-slate-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-6 relative z-10">
        {/* Reason Input with Modern Focus */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Outing Reason</label>
          <textarea
            required
            rows="3"
            className={`w-full rounded-2xl p-4 text-sm outline-none border-2 transition-all duration-300 bg-slate-800/30 text-slate-200 placeholder:text-slate-600 ${
              type === 'medical' 
                ? 'border-red-500/30 focus:border-red-500 bg-red-500/5' 
                : 'border-slate-700 focus:border-indigo-500'
            }`}
            placeholder={type === 'medical' ? "Describe emergency symptoms..." : "Mention your purpose..."}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Return Date Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Expected Return</label>
          <input
            type="datetime-local"
            required
            className="w-full bg-slate-800/30 border-2 border-slate-700 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-all appearance-none"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>

        {/* Submit Button with Gradient & Scale Effect */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-black text-white uppercase tracking-[0.3em] text-xs transition-all duration-300 active:scale-95 shadow-2xl ${
            type === 'medical' 
              ? 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-900/20' 
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-900/20'
          } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 hover:scale-[1.01]'}`}
        >
          {loading ? 'Processing Request...' : 'Send Request'}
        </button>
      </div>
    </form>
  );
}