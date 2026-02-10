
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStatusChange } from './services/authService';
import AuthUI from './components/Auth/AuthUI';
import Home from './components/Dashboard/Home';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // 인증 상태 변경 리스너 등록
    const unsubscribe = onAuthStatusChange((currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">인증 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="antialiased text-gray-900">
      {user ? <Home user={user} /> : <AuthUI />}
    </div>
  );
};

export default App;
