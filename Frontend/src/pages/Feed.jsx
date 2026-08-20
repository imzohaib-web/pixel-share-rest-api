import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/posts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts. Make sure backend is running.');
      }
      
      const data = await response.json();
      setPosts(data.data || data.posts || []);
    } catch (err) {
      setError(err.message || 'Something went wrong while fetching feeds.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUpdatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  return (
    <div className="feed-page">
      <header className="feed-header">
        <div className="feed-header-content">
          <span className="feed-eyebrow">PIXELSHARE</span>
          <h1 className="feed-title">Recent moments</h1>
          <p className="feed-subtitle">A collection of photographs shared by the community.</p>
        </div>
      </header>

      <section className="feed-container">
        {/* LOADING SKELETON STATE */}
        {loading ? (
          <div className="feed-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div className="post-card-skeleton" key={n}>
                <div className="skeleton-image" />
                <div className="skeleton-content">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line tiny" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* ERROR STATE */
          <div className="state-box error-state">
            <div className="state-icon-wrapper error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="state-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button type="button" className="btn-primary" onClick={fetchPosts}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>Try Again</span>
            </button>
          </div>
        ) : posts.length === 0 ? (
          /* EMPTY STATE */
          <div className="state-box empty-state">
            <div className="state-icon-wrapper empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="state-icon">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <h2>Nothing here yet</h2>
            <p>Be the first to share a moment with the community.</p>
            <Link to="/upload" className="btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Share Your First Post</span>
            </Link>
          </div>
        ) : (
          /* POSTS GRID */
          <div className="feed-grid">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Feed;
