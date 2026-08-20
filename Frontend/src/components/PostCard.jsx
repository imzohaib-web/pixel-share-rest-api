import React, { useState } from 'react';

const PostCard = ({ post, onUpdatePost, onDeletePost }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(post.caption || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const imageUrl = post.image || post.imaage;

  // Handle opening edit mode
  const handleStartEdit = () => {
    setCaption(post.caption || '');
    setUpdateError(null);
    setUpdateSuccess(false);
    setIsEditing(true);
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setCaption(post.caption || '');
    setUpdateError(null);
    setIsEditing(false);
  };

  // Save caption update
  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);

    if (caption.trim().length > 500) {
      setUpdateError('Caption must not exceed 500 characters.');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caption: caption.trim() }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to update post.');
      }

      const updatedPost = resData.data || { ...post, caption: caption.trim() };
      onUpdatePost(updatedPost);

      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 2500);
    } catch (err) {
      setUpdateError(err.message || 'Something went wrong while updating.');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle post deletion
  const handleConfirmDelete = async () => {
    setDeleteError(null);
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to delete post.');
      }

      onDeletePost(post._id);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete post.');
      setIsDeleting(false);
      console.error(err);
    }
  };

  return (
    <article className="post-card">
      {/* IMAGE MEDIA CONTAINER */}
      <div className="post-image-container">
        <img 
          src={imageUrl} 
          alt={post.caption || 'Shared photograph'} 
          className="post-image"
          loading="lazy"
        />
        <div className="post-image-overlay" />

        {updateSuccess && (
          <div className="post-card-badge success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="badge-icon">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Updated</span>
          </div>
        )}
      </div>

      {/* CARD CONTENT */}
      <div className="post-content">
        {/* EDIT MODE */}
        {isEditing ? (
          <form onSubmit={handleSaveUpdate} className="post-edit-form">
            {updateError && (
              <div className="post-card-alert alert-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="alert-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{updateError}</span>
              </div>
            )}
            <textarea
              className="post-edit-textarea"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for this moment..."
              maxLength={500}
              disabled={isUpdating}
              rows={3}
              autoFocus
            />
            <div className="post-edit-meta">
              <span className={`char-count ${caption.length > 500 ? 'exceeded' : ''}`}>
                {caption.length}/500
              </span>
              <div className="post-edit-actions">
                <button
                  type="button"
                  className="btn-card-cancel"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-card-save"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <span className="spinner-sm" />
                      <span>Saving</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* DISPLAY MODE */
          <>
            <p className="post-caption">
              {post.caption ? (
                post.caption
              ) : (
                <em className="no-caption">Untitled moment</em>
              )}
            </p>

            <div className="post-footer">
              <span className="post-time">Posted recently</span>

              {/* DELETE CONFIRMATION DIALOG */}
              {showDeleteConfirm ? (
                <div className="delete-confirm-box">
                  {deleteError && (
                    <div className="post-card-alert alert-error">
                      <span>{deleteError}</span>
                    </div>
                  )}
                  <p className="delete-confirm-title">Delete this post?</p>
                  <p className="delete-confirm-sub">This action cannot be undone.</p>
                  <div className="delete-confirm-actions">
                    <button
                      type="button"
                      className="btn-card-cancel"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteError(null);
                      }}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-card-delete-confirm"
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <span className="spinner-sm" />
                          <span>Deleting</span>
                        </>
                      ) : (
                        'Delete Post'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* CARD ACTIONS (EDIT / DELETE) */
                <div className="post-actions">
                  <button
                    type="button"
                    className="btn-action-edit"
                    onClick={handleStartEdit}
                    aria-label="Edit caption"
                    title="Edit caption"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="action-icon">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn-action-delete"
                    onClick={() => setShowDeleteConfirm(true)}
                    aria-label="Delete post"
                    title="Delete post"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="action-icon">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </article>
  );
};

export default PostCard;
