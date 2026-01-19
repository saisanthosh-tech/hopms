// import { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';

// export default function WardenDashboard() {
//   const [requests, setRequests] = useState([]);
//   const [wardenInfo, setWardenInfo] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchWardenAndRequests();
//   }, []);

//   const fetchWardenAndRequests = async () => {
//     setLoading(true);
//     // 1. Get the current logged-in user
//     const { data: { user } } = await supabase.auth.getUser();
    
//     // 2. Identify Warden's specific H1 profile
//     const { data: profile } = await supabase
//       .from('profiles')
//       .select('hostel_id, full_name')
//       .eq('id', user.id)
//       .single();
    
//     setWardenInfo(profile);

//     // 3. Fetch only H1 requests (The Link)
//     const { data: outings } = await supabase
//       .from('outings')
//       .select(`*, student:profiles!student_id (full_name, parent_number)`)
//       .eq('status', 'pending')
//       .eq('hostel_id', profile.hostel_id) // Strict H1 match
//       .order('is_emergency', { ascending: false }); // Priorities medical issues first

//     setRequests(outings || []);
//     setLoading(false);
//   };

//   const handleAction = async (id, status) => {
//     // Updates status in database
//     const { error } = await supabase.from('outings').update({ status }).eq('id', id);
    
//     if (!error) {
//       // Refresh local list after approval/rejection
//       setRequests(requests.filter(r => r.id !== id));
//     }
//   };

//   if (loading) return (
//     <div className="flex h-screen items-center justify-center bg-gray-50">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <header className="bg-indigo-900 text-white p-8 rounded-b-[3rem] shadow-xl -mx-6 -mt-6 mb-8">
//         <h1 className="text-2xl font-black uppercase tracking-tight">
//           {wardenInfo?.hostel_id || 'H1 Panel'}
//         </h1>
//         <p className="text-indigo-300 font-bold">Warden: {wardenInfo?.full_name}</p>
//       </header>
      
//       <div className="max-w-xl mx-auto space-y-4">
//         {requests.length === 0 ? (
//           <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
//             <p className="text-gray-400">No pending requests for {wardenInfo?.hostel_id}.</p>
//           </div>
//         ) : (
//           requests.map((req) => (
//             <div key={req.id} className={`p-6 rounded-3xl shadow-sm border-l-8 transition-all ${
//               req.is_emergency ? 'bg-red-50 border-red-500' : 'bg-white border-indigo-600'
//             }`}>
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-800 leading-tight">
//                     {req.student?.full_name}
//                   </h3>
//                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
//                     {req.type} Pass Requested
//                   </p>
//                 </div>
//                 {/* Direct parent call link */}
//                 <a 
//                   href={`tel:${req.student?.parent_number}`} 
//                   className="bg-green-500 text-white p-3 rounded-2xl shadow-lg shadow-green-100 hover:scale-110 transition-transform"
//                 >
//                   📞
//                 </a>
//               </div>
//               <p className="text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
//                 "{req.reason}"
//               </p>
//               <div className="flex gap-3">
//                 <button 
//                   onClick={() => handleAction(req.id, 'approved')} 
//                   className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
//                 >
//                   Approve
//                 </button>
//                 <button 
//                   onClick={() => handleAction(req.id, 'rejected')} 
//                   className="flex-1 bg-gray-100 text-gray-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 active:scale-95 transition-all"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function WardenDashboard() {
  const [requests, setRequests] = useState([]);
  const [wardenInfo, setWardenInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWardenAndRequests();
  }, []);

  const fetchWardenAndRequests = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('hostel_id, full_name')
      .eq('id', user.id)
      .single();
    
    setWardenInfo(profile);

    const { data: outings } = await supabase
      .from('outings')
      .select(`*, student:profiles!student_id (full_name, parent_number)`)
      .eq('status', 'pending')
      .eq('hostel_id', profile.hostel_id)
      .order('is_emergency', { ascending: false });

    setRequests(outings || []);
    setLoading(false);
  };

  const handleAction = async (id, status) => {
    const { error } = await supabase.from('outings').update({ status }).eq('id', id);
    if (!error) {
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#020617]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-indigo-600/5 to-transparent"></div>

      {/* Header Command Center Style */}
      <header className="relative z-10 p-8 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
              {wardenInfo?.hostel_id || 'Staff Panel'}<span className="text-indigo-500 not-italic">.</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">
              Authorized Warden: {wardenInfo?.full_name}
            </p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              {requests.length} Active Tasks
            </p>
          </div>
        </div>
      </header>
      
      <main className="relative z-10 p-6 max-w-xl mx-auto space-y-6 mt-6">
        {requests.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800 animate-in fade-in duration-700">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">All Clearance Protocols Complete</p>
          </div>
        ) : (
          requests.map((req) => (
            <div 
              key={req.id} 
              className={`group p-8 rounded-[2.5rem] border backdrop-blur-md transition-all duration-300 shadow-2xl relative overflow-hidden ${
                req.is_emergency 
                ? 'bg-red-500/5 border-red-500/20 shadow-red-900/10' 
                : 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/30 shadow-black/20'
              }`}
            >
              {/* Emergency Pulsing Indicator */}
              {req.is_emergency && (
                <div className="absolute top-4 right-8 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Urgent Medical</span>
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-white italic tracking-tight leading-none mb-2">
                    {req.student?.full_name}
                  </h3>
                  <div className="flex space-x-3 items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      Type: {req.type}
                    </span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                      Pass Required
                    </span>
                  </div>
                </div>
                
                {/* Emergency Parent Contact Button */}
                <a 
                  href={`tel:${req.student?.parent_number}`} 
                  className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 p-4 rounded-2xl hover:bg-emerald-500/20 hover:scale-110 transition-all shadow-lg"
                >
                  📞
                </a>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/50 p-5 rounded-2xl mb-8">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Stated Reason</p>
                <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
                  "{req.reason}"
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handleAction(req.id, 'approved')} 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-indigo-900/20 active:scale-95 transition-all duration-300"
                >
                  Authorize
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'rejected')} 
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-all duration-300"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}