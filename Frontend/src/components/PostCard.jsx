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

      // Notify parent component with updated post object
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

      // Notify parent component to remove post from list immediately
      onDeletePost(post._id);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete post.');
      setIsDeleting(false);
      console.error(err);
    }
  };

  return (
    <div className="post-card">
      <div className="post-image-container">
        <img 
          src={post.image || post.imaage} 
          alt={post.caption || 'Shared post'} 
          className="post-image"
          loading="lazy"
        />
        {updateSuccess && (
          <div className="post-card-badge success">Updated</div>
        )}
      </div>

      <div className="post-info">
        {/* EDIT MODE */}
        {isEditing ? (
          <form onSubmit={handleSaveUpdate} className="post-edit-form">
            {updateError && (
              <div className="post-card-alert alert-error">
                {updateError}
              </div>
            )}
            <textarea
              className="post-edit-textarea"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
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
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* DISPLAY MODE */
          <>
            <p className="post-caption">{post.caption || <em className="no-caption">No caption</em>}</p>

            <div className="post-meta">
              <span>Posted recently</span>
            </div>

            {/* DELETE CONFIRMATION DIALOG */}
            {showDeleteConfirm ? (
              <div className="delete-confirm-box">
                {deleteError && (
                  <div className="post-card-alert alert-error">
                    {deleteError}
                  </div>
                )}
                <p className="delete-confirm-text">Are you sure you want to delete this post?</p>
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
                    {isDeleting ? 'Deleting...' : 'Delete'}
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
                  title="Edit caption"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-action-delete"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete post"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
