
import React, { useState, useEffect } from 'react';
import { createPost, subscribePosts } from '../../services/postService';
import { Post } from '../../types/post';
import { Send, MessageSquare, Clock, User, Loader2 } from 'lucide-react';

interface PostBoardProps {
  currentUser: {
    uid: string;
    email: string | null;
  };
}

const PostBoard: React.FC<PostBoardProps> = ({ currentUser }) => {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 컴포넌트 마운트 시 실시간 구독 시작
  useEffect(() => {
    const unsubscribe = subscribePosts((newPosts) => {
      setPosts(newPosts);
      setFetching(false);
    });
    return () => unsubscribe();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      await createPost(content, currentUser.uid, currentUser.email || '익명');
      setContent('');
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '방금 전';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-8">
      {/* 글쓰기 섹션 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <form onSubmit={handlePostSubmit}>
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-600" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">새로운 생각 공유</span>
          </div>
          <div className="p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="무슨 생각을 하고 계신가요?"
              className="w-full min-h-[100px] p-3 text-sm border-none focus:ring-0 resize-none placeholder-gray-400"
              required
            />
          </div>
          <div className="p-3 bg-gray-50 flex justify-end items-center px-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              <span>게시하기</span>
            </button>
          </div>
        </form>
      </div>

      {/* 게시글 목록 섹션 */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">최근 게시물</h3>
        
        {fetching ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="text-xs">글을 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center">
            <p className="text-gray-400 text-sm italic">아직 작성된 글이 없습니다. 첫 번째 글을 남겨보세요!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">
                      {post.authorEmail?.split('@')[0]}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                      <Clock size={10} />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap pl-10">
                {post.content}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-gray-300 font-mono tracking-tighter">ID: {post.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostBoard;
