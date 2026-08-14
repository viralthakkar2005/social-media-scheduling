import React, { useEffect, useState } from 'react';
import { List, Loader2 } from 'lucide-react';
import PostCard from '../component/PostCard';

const API_BASE = 'http://localhost:5000/api';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`${API_BASE}/posts`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load posts');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDeleted = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <List className="w-8 h-8 text-[#5bc983]" />
        <h1 className="text-3xl font-bold text-[#1e293b]">All Posts</h1>
      </div>
      <p className="text-slate-500 mb-8">Manage all drafts, scheduled, and published posts.</p>

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-rose-600 min-h-[300px] flex flex-col items-center justify-center">
          Couldn't load your posts — please try again.
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 min-h-[300px] flex flex-col items-center justify-center">
          <List className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-lg font-medium text-slate-700">No posts yet</p>
          <p className="text-sm text-slate-400 mt-1 max-w-md">
            Create your first post to see it show up here.
          </p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} showActions onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
