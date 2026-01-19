// import { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
// import OutingForm from '../components/OutingForm'; 
// import QRCode from 'react-qr-code';

// export default function StudentDashboard() {
//   const [activeOuting, setActiveOuting] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     refreshData();
//   }, []);

//   const refreshData = async () => {
//     setLoading(true);
//     await fetchActiveOuting();
//     await fetchHistory();
//     setLoading(false);
//   };

//   const fetchActiveOuting = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
    
//     // Fetches the latest outing that is NOT yet 'returned'
//     const { data, error } = await supabase
//       .from('outings')
//       .select('*')
//       .eq('student_id', user.id)
//       .neq('status', 'returned') 
//       .order('created_at', { ascending: false })
//       .limit(1)
//       .maybeSingle(); 

//     if (error) {
//       console.error("Error fetching status:", error);
//     }

//     // Ensures UI updates with the latest DB status (Pending/Approved/Out)
//     setActiveOuting(data || null);
//   };

//   const fetchHistory = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     const { data } = await supabase
//       .from('outings')
//       .select('*')
//       .eq('student_id', user.id)
//       .eq('status', 'returned') 
//       .order('created_at', { ascending: false });
      
//     setHistory(data || []);
//   };

//   const handleCancel = async (id) => {
//     const confirmCancel = window.confirm("Are you sure you want to cancel this request?");
//     if (!confirmCancel) return;

//     const { error } = await supabase
//       .from('outings')
//       .delete()
//       .eq('id', id);

//     if (error) {
//       alert("Error canceling request: " + error.message);
//     } else {
//       alert("Request canceled successfully.");
//       refreshData(); 
//     }
//   };

//   if (loading) return (
//     <div className="flex h-screen items-center justify-center bg-gray-50">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20 font-sans">
//       <header className="bg-indigo-600 text-white p-8 rounded-b-[3rem] shadow-xl mb-8">
//         <h1 className="text-2xl font-black uppercase tracking-tight">My Outings</h1>
//         <p className="text-indigo-100 text-[10px] font-bold mt-1 opacity-80 uppercase tracking-widest italic">
//           Hostel Outing Management System
//         </p>
//       </header>

//       <main className="px-4 space-y-10 max-w-lg mx-auto">
//         <section>
//           {!activeOuting ? (
//             <OutingForm onSuccess={refreshData} />
//           ) : (
//             <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-300">
//                <div className="mb-6 inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700">
//                  Current Status: {activeOuting.status}
//                </div>

//                {(activeOuting.status === 'approved' || activeOuting.status === 'out') ? (
//                  <div className="flex flex-col items-center space-y-6">
//                    <div className="p-4 bg-white border-8 border-indigo-50 rounded-[3rem] shadow-inner">
//                      <QRCode value={activeOuting.id} size={180} />
//                    </div>
//                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Digital Gate Pass</p>
//                    {/* Student can still refresh if they are 'Approved' to see if status changes to 'Out' after scan */}
//                    <button 
//                     onClick={refreshData}
//                     className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
//                   >
//                     🔄 Update View
//                   </button>
//                  </div>
//                ) : (
//                  <div className="py-12 flex flex-col items-center">
//                    <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
//                    <p className="text-gray-400 font-bold text-sm tracking-tight mb-8">
//                      Waiting for Warden verification...
//                    </p>
                   
//                    <button 
//                     onClick={refreshData}
//                     className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6 hover:bg-indigo-100 transition-colors shadow-sm"
//                   >
//                     🔄 Check Status
//                   </button>

//                    <button 
//                      onClick={() => handleCancel(activeOuting.id)}
//                      className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline"
//                    >
//                      Cancel Request
//                    </button>
//                  </div>
//                )}
//             </div>
//           )}
//         </section>

//         <section className="space-y-4">
//           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Past Outings</h3>
//           {history.length === 0 ? (
//             <div className="text-center py-12 bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-300 text-[10px] font-black uppercase tracking-widest">
//               No previous trips found
//             </div>
//           ) : (
//             history.map((trip) => (
//               <div key={trip.id} className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between border border-gray-50">
//                 <div className="flex items-center space-x-4">
//                   <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${trip.is_late ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
//                     {trip.is_late ? '⚠️' : '✅'}
//                   </div>
//                   <div>
//                     <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{trip.type}</p>
//                     <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(trip.created_at).toLocaleDateString()}</p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import OutingForm from '../components/OutingForm'; 
import QRCode from 'react-qr-code';

export default function StudentDashboard() {
  const [activeOuting, setActiveOuting] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    await fetchActiveOuting();
    await fetchHistory();
    setLoading(false);
  };

  const fetchActiveOuting = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('outings')
      .select('*')
      .eq('student_id', user.id)
      .neq('status', 'returned') 
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(); 

    if (error) console.error("Error fetching status:", error);
    setActiveOuting(data || null);
  };

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('outings')
      .select('*')
      .eq('student_id', user.id)
      .eq('status', 'returned') 
      .order('created_at', { ascending: false });
      
    setHistory(data || []);
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Terminate this request protocol?");
    if (!confirmCancel) return;

    const { error } = await supabase.from('outings').delete().eq('id', id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      refreshData(); 
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
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-600/10 to-transparent"></div>

      <header className="relative z-10 p-8 pt-12">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              My Passes<span className="text-indigo-500 not-italic">.</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">
              Campus Mobility Portal
            </p>
          </div>
          <button 
            onClick={refreshData}
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors shadow-xl"
          >
            🔄
          </button>
        </div>
      </header>

      <main className="relative z-10 px-6 space-y-12 max-w-lg mx-auto">
        
        {/* ACTIVE PASS SECTION */}
        <section>
          {!activeOuting ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <OutingForm onSuccess={refreshData} />
            </div>
          ) : (
            <div className="bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-slate-800 shadow-2xl text-center relative overflow-hidden group">
               {/* Status Badge */}
               <div className={`mb-8 inline-flex items-center px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                 activeOuting.status === 'approved' 
                 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                 : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
               }`}>
                 <span className={`w-1.5 h-1.5 rounded-full mr-2 ${activeOuting.status === 'approved' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                 {activeOuting.status}
               </div>

               {(activeOuting.status === 'approved' || activeOuting.status === 'out') ? (
                 <div className="flex flex-col items-center space-y-8">
                   <div className="p-6 bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 transform group-hover:scale-[1.02] transition-transform duration-500">
                     <QRCode value={activeOuting.id} size={180} fgColor="#020617" />
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Digital Entry Credentials</p>
                     <p className="text-[9px] text-indigo-400 font-bold italic uppercase">
                       Return by: {new Date(activeOuting.expected_return_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </p>
                   </div>
                 </div>
               ) : (
                 <div className="py-16 flex flex-col items-center">
                   <div className="relative w-20 h-20 mb-8">
                      <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
                      <div className="absolute inset-4 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50"></div>
                   </div>
                   <p className="text-slate-400 font-bold text-sm tracking-tight mb-8">
                     Awaiting Warden Authorization...
                   </p>
                   
                   <button 
                     onClick={() => handleCancel(activeOuting.id)}
                     className="text-red-500/60 text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-400 transition-colors"
                   >
                     Withdraw Request
                   </button>
                 </div>
               )}
            </div>
          )}
        </section>

        {/* TIMELINE / HISTORY SECTION */}
        <section className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Mission Log</h3>
          
          {history.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800 text-slate-600 text-[10px] font-black uppercase tracking-widest">
              Clear history
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((trip) => (
                <div key={trip.id} className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl flex items-center justify-between border border-slate-800/50 group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center space-x-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                      trip.is_late ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {trip.is_late ? '⚠️' : '✓'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">{trip.type} Outing</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date(trip.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${trip.is_late ? 'text-red-500' : 'text-slate-600'}`}>
                      {trip.is_late ? 'LATE RETURN' : 'COMPLETED'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}