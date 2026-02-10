
import React, { useState, useEffect } from 'react';
import { createPost, subscribePosts } from '../../services/postService';
import { Post } from '../../types/post';
import { Send, MessageSquare, Clock, User, Loader2, PenLine, AlignLeft } from 'lucide-react';

interface PostBoardProps {
  currentUser: {
    uid: string;
    email: string | null;
  };
}

const PostBoard: React.FC<PostBoardProps> = ({ currentUser }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // 실시간 게시글 구독 시작
    const unsubscribe = subscribePosts((newPosts) => {
      setPosts(newPosts);
      setFetching(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || loading) return;

    setLoading(true);
    try {
      await createPost(title, content, currentUser.uid, currentUser.email || '익명');
      setTitle('');
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
      {/* 글쓰기 영역 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex items-center gap-2">
          <PenLine size={16} className="text-blue-600" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">새 글 작성하기</span>
        </div>
        
        <form onSubmit={handlePostSubmit} className="p-6 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full text-lg font-bold placeholder-gray-300 border-none focus:ring-0 p-0 transition-all"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="어떤 생각을 공유하고 싶으신가요?"
            rows={4}
            className="w-full text-sm placeholder-gray-300 border-none focus:ring-0 p-0 resize-none min-h-[100px] transition-all"
            required
          />
          <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                <User className="text-blue-400" size={12} />
              </div>
              <span className="text-[11px] font-medium text-gray-500">{currentUser.email}</span>
            </div>
            
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-100"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              <span>게시하기</span>
            </button>
          </div>
        </form>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-400" />
            최신 타임라인
          </h3>
          <span className="text-[10px] bg-white border border-gray-200 text-gray-500 px-3 py-1 rounded-full font-bold shadow-sm">
            {posts.length} Posts
          </span>
        </div>
        
        {fetching ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100">
            <Loader2 className="animate-spin text-blue-500/20 mb-4" size={48} />
            <p className="text-gray-400 text-xs font-medium tracking-widest uppercase">Fetching Feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl py-24 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlignLeft className="text-gray-200" size={28} />
            </div>
            <p className="text-gray-400 text-sm font-medium">아직 등록된 글이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="group bg-white rounded-3xl border border-gray-200 p-8 hover:shadow-2xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-500 ease-out">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-all duration-500">
                      <User className="text-gray-300 group-hover:text-blue-400" size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-gray-900 mb-0.5">
                        {post.authorEmail.split('@')[0]}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-gray-300 group-hover:text-blue-300 transition-colors">
                    # {post.id?.slice(-4)}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-semibold">
                    <Clock size={12} />
                    <span>RECENTLY SHARED</span>
                  </div>
                  <button className="text-xs font-black text-blue-600 hover:translate-x-1 transition-transform">
                    View Thread &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostBoard;
