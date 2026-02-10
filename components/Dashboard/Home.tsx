
import React from 'react';
import { logOut } from '../../services/authService';
import { LogOut, Layout, ShieldCheck, Zap } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import PostBoard from '../Board/PostBoard';

interface HomeProps {
  user: FirebaseUser;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                <ShieldCheck className="text-white" size={18} />
              </div>
              <span className="text-lg font-black text-gray-900 tracking-tight">ClassicBoard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-gray-900">{user.email?.split('@')[0]}</span>
                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Active Member</span>
              </div>
              <button
                onClick={() => logOut()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 relative">
          <div className="absolute -left-12 top-0 hidden lg:block">
            <Zap className="text-blue-100" size={80} />
          </div>
          <div className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
            Community Dashboard
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
            Hello, <span className="text-blue-600">{user.email?.split('@')[0]}</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-lg leading-relaxed">
            안전하게 인증되었습니다. 지금 바로 커뮤니티에 참여하여 당신의 아이디어를 공유해보세요.
          </p>
        </header>

        {/* 게시판 컴포넌트 호출 */}
        <PostBoard currentUser={{ uid: user.uid, email: user.email }} />
        
        <footer className="mt-24 pb-12 text-center">
          <p className="text-gray-300 text-[11px] font-bold tracking-[0.2em] uppercase">
            Built with Firebase & React &copy; 2024 ClassicBoard
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
