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
      // Supports standard API structure { success: true, message: "...", data: [...] }
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

  if (loading) {
    return (
      <div className="feed-container">
        <div className="loading-state">
          <div className="loading-state-icon">⏳</div>
          <h2>Loading Feeds</h2>
          <p>Fetching the latest posts for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-container">
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn-secondary" onClick={fetchPosts}>
            Retry Fetching
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>Recent Feeds</h1>
        <p>Explore images shared by the community</p>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h2>No posts yet</h2>
          <p>Be the first to share an image with a caption!</p>
          <Link to="/upload" className="btn-secondary">
            <span>➕</span> Upload First Post
          </Link>
        </div>
      ) : (
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
    </div>
  );
};

export default Feed;
