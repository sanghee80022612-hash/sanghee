
import React from 'react';
import { logOut } from '../../services/authService';
import { LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import PostBoard from '../Board/PostBoard';

interface HomeProps {
  user: FirebaseUser;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-200">
                <ShieldCheck className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">ClassicBoard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-gray-900">{user.email?.split('@')[0]}</span>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">Verified</span>
              </div>
              <button
                onClick={() => logOut()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Sidebar/Profile (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                  <UserIcon className="text-gray-300" size={40} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{user.email}</h3>
                <p className="text-xs text-gray-500 mt-1 font-medium italic">"{user.uid.substring(0, 8)}..."</p>
                
                <div className="w-full mt-6 pt-6 border-t border-gray-50 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">활동 상태</span>
                    <span className="text-green-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      온라인
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">권한 레벨</span>
                    <span className="text-gray-900 font-bold">Standard User</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-100">
              <h4 className="font-bold mb-2">커뮤니티 안내</h4>
              <p className="text-xs leading-relaxed opacity-90">
                자유롭게 의견을 나누되, 타인을 존중하는 마음으로 대화해 주세요. 따뜻한 커뮤니티를 함께 만들어 갑니다.
              </p>
            </div>
          </div>

          {/* Right Side: Board (8 cols) */}
          <div className="lg:col-span-8">
            <PostBoard currentUser={{ uid: user.uid, email: user.email }} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Home;
