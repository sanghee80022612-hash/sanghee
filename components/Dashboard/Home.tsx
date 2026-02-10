
import React from 'react';
import { logOut } from '../../services/authService';
import { LogOut, User, Layout, ShieldCheck } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import PostBoard from '../Board/PostBoard';

interface HomeProps {
  user: FirebaseUser;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <ShieldCheck className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">ClassicAuth</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-semibold text-gray-900">{user.email}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-tighter">인증된 사용자</span>
              </div>
              <button
                onClick={() => logOut()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-all border border-gray-200"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Profile Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-inner">
                  <User size={40} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{user.email?.split('@')[0]}</h3>
                <p className="text-xs text-gray-500 break-all">{user.email}</p>
                
                <div className="w-full mt-6 grid grid-cols-2 gap-2 pt-6 border-t border-gray-50">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">상태</p>
                    <p className="text-xs font-bold text-emerald-500">온라인</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">등급</p>
                    <p className="text-xs font-bold text-blue-600">일반</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Layout size={18} />
                <h4 className="font-bold text-sm">커뮤니티 소식</h4>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                실시간으로 다른 사용자들의 생각을 확인하고 당신의 이야기를 나누어 보세요.
              </p>
            </div>
          </div>

          {/* Main Board Area */}
          <div className="lg:col-span-8">
            <PostBoard currentUser={{ uid: user.uid, email: user.email }} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Home;
