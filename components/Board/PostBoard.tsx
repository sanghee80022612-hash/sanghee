
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

  useEffect(() => {
    // 실시간 구독 시작
    const unsubscribe = subscribePosts((newPosts) => {
      setPosts(newPosts);
      setFetching(false);
    });

    // 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      await createPost(content, currentUser.uid, currentUser.email || '익명 사용자');
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 글쓰기 섹션 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <form onSubmit={handlePostSubmit}>
          <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-600" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">새로운 생각 나누기</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="무슨 생각을 하고 계신가요?"
            className="w-full p-4 min-h-[120px] focus:outline-none resize-none text-gray-800 placeholder-gray-400"
          />
          <div className="p-3 bg-gray-50/50 flex justify-end items-center gap-3 border-t border-gray-100">
            <span className="text-[11px] text-gray-400 font-medium">
              {content.length} / 500
            </span>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              <span>게시하기</span>
            </button>
          </div>
        </form>
      </div>

      {/* 게시글 목록 섹션 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            타임라인
            <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">
              {posts.length}
            </span>
          </h3>
        </div>

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
            <p className="text-sm text-gray-400 font-medium">게시글을 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-xl py-16 text-center">
            <p className="text-gray-400 text-sm">아직 등록된 게시글이 없습니다. 첫 글을 남겨보세요!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <User className="text-blue-500" size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{post.authorEmail}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                      <Clock size={10} />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostBoard;
