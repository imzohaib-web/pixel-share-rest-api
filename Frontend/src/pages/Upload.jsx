import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (file) => {
    if (!file) return;

    // Validate if it is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, JPEG, WEBP, etc.)');
      return;
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    setError(null);
    setImage(file);
    
    // Revoke previous URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removePreview = (e) => {
    e.stopPropagation();
    setImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('An image is required to post.');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append('image', image);
      formData.append('caption', caption);

      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create post. Please try again.');
      }

      setSuccess(true);
      // Clean up local states
      setImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl('');
      setCaption('');

      // Redirect to feed after 1.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Something went wrong during upload.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Create a Post</h2>
        
        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <strong>Success!</strong> Post created successfully. Redirecting to Feed...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File Upload / Preview area */}
          <div className="form-group">
            <span className="form-label">Upload Image</span>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Preview" className="preview-image" />
                <button 
                  type="button" 
                  className="btn-remove-preview" 
                  onClick={removePreview}
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            ) : (
              <div 
                className={`dropzone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="dropzone-icon">📤</div>
                <div className="dropzone-text">
                  Drag and drop your image here, or <span>browse</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text)' }}>
                  Supports JPEG, PNG, WEBP, GIF up to 10MB
                </div>
              </div>
            )}
          </div>

          {/* Caption text field */}
          <div className="form-group">
            <label htmlFor="caption" className="form-label">Caption</label>
            <textarea
              id="caption"
              className="form-textarea"
              placeholder="Write a catchy caption for your photo..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={uploading}
              maxLength={300}
            />
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="btn-submit"
            disabled={uploading || !image}
          >
            {uploading ? (
              <>
                <span className="spinner"></span>
                <span>Sharing Post...</span>
              </>
            ) : (
              <span>Share Post</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
