// import { useState, useEffect } from 'react';
// import { Scanner } from '@yudiel/react-qr-scanner';
// import { supabase } from '../supabaseClient';

// export default function WatchmanScanner() {
//   const [watchman, setWatchman] = useState(null);
//   const [statusMsg, setStatusMsg] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const getWatchman = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       const { data } = await supabase
//         .from('profiles')
//         .select('hostel_id, full_name')
//         .eq('id', user.id)
//         .single();
//       setWatchman(data);
//     };
//     getWatchman();
//   }, []);

//   const handleScan = async (result) => {
//     if (!result || loading) return;
//     const outingId = result[0].rawValue;
//     setLoading(true);

//     // 1. FETCH WITHOUT HOSTEL RESTRICTION
//     // This allows the one watchman to scan ANY valid QR code from any hostel.
//     const { data: outing, error: fetchError } = await supabase
//       .from('outings')
//       .select('*')
//       .eq('id', outingId)
//       .single();

//     if (fetchError || !outing) {
//       setStatusMsg({ type: 'error', text: 'INVALID PASS - NOT FOUND' });
//       setLoading(false);
//       return;
//     }

//     let nextStatus = '';
//     let logAction = '';
//     let isLate = false;

//     // 2. Comprehensive Status Transition Logic
//     if (outing.status === 'approved') {
//       nextStatus = 'out';
//       logAction = 'exit';
//     } else if (outing.status === 'out') {
//       nextStatus = 'returned';
//       logAction = 'entry';
//       // Lateness Detection Logic
//       if (new Date() > new Date(outing.expected_return_at)) {
//         isLate = true;
//       }
//     } else if (outing.status === 'pending') {
//       setStatusMsg({ type: 'error', text: 'NOT APPROVED BY WARDEN' });
//       setLoading(false);
//       return;
//     } else {
//       // Handles 'returned' or 'rejected' statuses
//       setStatusMsg({ type: 'error', text: `ERROR: PASS IS ${outing.status.toUpperCase()}` });
//       setLoading(false);
//       return;
//     }

//     // 3. Update Database with nextStatus and is_late flag
//     const { error: updateError } = await supabase
//       .from('outings')
//       .update({ 
//         status: nextStatus, 
//         is_late: isLate 
//       })
//       .eq('id', outingId);

//     if (updateError) {
//       alert("Database Update Failed: " + updateError.message);
//     } else {
//       // 4. Record the audit history in gate_logs
//       await supabase.from('gate_logs').insert([{ 
//         outing_id: outingId, 
//         action: logAction 
//       }]);
      
//       setStatusMsg({ 
//         type: isLate ? 'error' : 'success', 
//         text: isLate ? 'RETURNED LATE' : `STUDENT ${nextStatus.toUpperCase()}` 
//       });
//     }

//     setLoading(false);
//     // Reset scanner message after 4 seconds to be ready for next student
//     setTimeout(() => setStatusMsg(null), 4000);
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 flex flex-col p-6 font-sans items-center justify-center">
//       <header className="mb-10 text-center">
//         <h1 className="text-white text-xl font-black uppercase tracking-widest italic tracking-tighter">Gate Control</h1>
//         <p className="text-indigo-400 text-[10px] font-bold tracking-widest uppercase">
//           Campus Access: {watchman?.hostel_id || 'Global'}
//         </p>
//       </header>

//       <main className="w-full flex flex-col items-center">
//         {!statusMsg ? (
//           <div className="w-full max-w-sm aspect-square rounded-[3rem] overflow-hidden border-4 border-indigo-500 shadow-2xl shadow-indigo-500/20">
//             <Scanner 
//               onScan={handleScan} 
//               constraints={{ facingMode: 'environment' }} 
//             />
//           </div>
//         ) : (
//           <div className={`w-full max-w-sm p-12 rounded-[3rem] text-center shadow-2xl transition-all ${
//             statusMsg.type === 'success' ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'
//           }`}>
//             <p className="text-white font-black text-2xl uppercase italic leading-tight">
//               {statusMsg.text}
//             </p>
//             <div className="mt-4 w-12 h-1 bg-white/30 mx-auto rounded-full animate-pulse"></div>
//           </div>
//         )}
//       </main>
      
//       <footer className="mt-12 text-center">
//         <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
//           Active Watchman: {watchman?.full_name}
//         </p>
//       </footer>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { supabase } from '../supabaseClient';

export default function WatchmanScanner() {
  const [watchman, setWatchman] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getWatchman = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('profiles')
        .select('hostel_id, full_name')
        .eq('id', user.id)
        .single();
      setWatchman(data);
    };
    getWatchman();
  }, []);

  const handleScan = async (result) => {
    if (!result || loading) return;
    const outingId = result[0].rawValue;
    setLoading(true);

    const { data: outing, error: fetchError } = await supabase
      .from('outings')
      .select('*')
      .eq('id', outingId)
      .single();

    if (fetchError || !outing) {
      setStatusMsg({ type: 'error', text: 'INVALID ENCRYPTION - NOT FOUND' });
      setLoading(false);
      return;
    }

    let nextStatus = '';
    let logAction = '';
    let isLate = false;

    if (outing.status === 'approved') {
      nextStatus = 'out';
      logAction = 'exit';
    } else if (outing.status === 'out') {
      nextStatus = 'returned';
      logAction = 'entry';
      if (new Date() > new Date(outing.expected_return_at)) isLate = true;
    } else if (outing.status === 'pending') {
      setStatusMsg({ type: 'error', text: 'AUTHORIZATION PENDING' });
      setLoading(false);
      return;
    } else {
      setStatusMsg({ type: 'error', text: `PROTOCOL ERROR: ${outing.status.toUpperCase()}` });
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('outings')
      .update({ status: nextStatus, is_late: isLate })
      .eq('id', outingId);

    if (updateError) {
      alert("System Sync Failed: " + updateError.message);
    } else {
      await supabase.from('gate_logs').insert([{ outing_id: outingId, action: logAction }]);
      
      // Haptic feedback for professional feel
      if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);

      setStatusMsg({ 
        type: isLate ? 'error' : 'success', 
        text: isLate ? 'LATE RETURN DETECTED' : `CLEARANCE: ${nextStatus.toUpperCase()}` 
      });
    }

    setLoading(false);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col p-6 font-sans items-center justify-center relative overflow-hidden">
      {/* Tactical Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)]"></div>
      
      <header className="mb-12 text-center relative z-10">
        <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">
          Gate Control<span className="text-indigo-500 not-italic">.</span>
        </h1>
        <div className="flex items-center justify-center space-x-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          <p className="text-slate-500 text-[9px] font-black tracking-[0.4em] uppercase">
            {watchman?.hostel_id || 'System Global'}
          </p>
        </div>
      </header>

      <main className="w-full max-w-sm relative z-10">
        {!statusMsg ? (
          <div className="relative group">
            {/* Animated Scanner Frame */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden border-2 border-slate-800 bg-slate-900/50 backdrop-blur-xl">
              <Scanner 
                onScan={handleScan} 
                constraints={{ facingMode: 'environment' }} 
              />
              
              {/* Tactical Overlay */}
              <div className="absolute inset-0 pointer-events-none border-[20px] border-slate-900/40"></div>
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-[scan_2s_linear_infinite]"></div>
            </div>
          </div>
        ) : (
          <div className={`w-full aspect-square flex flex-col items-center justify-center p-10 rounded-[3.5rem] text-center shadow-2xl transition-all duration-500 animate-in zoom-in-95 ${
            statusMsg.type === 'success' 
            ? 'bg-emerald-500/10 border-2 border-emerald-500/20 shadow-emerald-500/10' 
            : 'bg-red-500/10 border-2 border-red-500/20 shadow-red-500/10'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
              statusMsg.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              <span className="text-3xl">{statusMsg.type === 'success' ? '✓' : '✕'}</span>
            </div>
            <p className={`font-black text-xl uppercase tracking-tighter italic ${
              statusMsg.type === 'success' ? 'text-emerald-400' : 'text-red-500'
            }`}>
              {statusMsg.text}
            </p>
            <p className="mt-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              Ready for next scan in 4s...
            </p>
          </div>
        )}
      </main>
      
      <footer className="mt-16 text-center relative z-10">
        <div className="bg-slate-900/50 border border-slate-800 px-6 py-3 rounded-2xl backdrop-blur-md">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Authenticated Officer</p>
          <p className="text-white text-xs font-bold uppercase italic">{watchman?.full_name}</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}