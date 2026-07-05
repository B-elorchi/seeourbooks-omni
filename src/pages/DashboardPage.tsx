import { Link } from 'react-router-dom';
import { Wand2, Library, Clock, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 truncate">Welcome back{user?.email ? `, ${user.email.split("@")[0]}!` : "!"}</h1>
        <p className="text-gray-500 mt-1">Here's a quick overview of your Omni Portal.</p>
      </div>

      {/* Trial Status */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white mb-8 shadow-lg shadow-emerald-500/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Zap size={20} className="text-emerald-100" />
              Free Trial Active
            </h2>
            <p className="text-emerald-50">You have 2 free AI generations remaining.</p>
          </div>
          <Link to="/process" className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-medium hover:bg-emerald-50 transition-colors shadow-sm">
            Use a Generation
          </Link>
        </div>
        <div className="mt-6">
          <div className="w-full bg-emerald-900/30 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '33%' }}></div>
          </div>
          <p className="text-xs text-emerald-100 mt-2 font-medium">1 / 3 Uses Consumed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4">
            <Wand2 size={20} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Start Processing</h3>
          <p className="text-sm text-gray-500 mb-4">Upload a file, choose a book, or paste a YouTube link to generate AI content.</p>
          <Link to="/process" className="text-sm font-medium text-purple-600 hover:text-purple-700">Get started &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
            <Library size={20} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Your Library</h3>
          <p className="text-sm text-gray-500 mb-4">View your previously generated summaries, audio, and mind maps.</p>
          <Link to="/library" className="text-sm font-medium text-blue-600 hover:text-blue-700">View library &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4">
            <Clock size={20} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Recent Activity</h3>
          <p className="text-sm text-gray-500 mb-4">You generated "Atomic Habits Summary" 2 days ago.</p>
          <Link to="/library" className="text-sm font-medium text-orange-600 hover:text-orange-700">See history &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
