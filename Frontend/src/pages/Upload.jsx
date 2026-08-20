import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileDetails, setFileDetails] = useState({ name: '', size: '' });
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Format file size in KB or MB
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle file selection
  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, JPEG, WEBP, GIF, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    setError(null);
    setImage(file);
    setFileDetails({
      name: file.name,
      size: formatFileSize(file.size),
    });

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
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
    setFileDetails({ name: '', size: '' });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      formData.append('caption', caption.trim());

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok || resData.success === false) {
        const message = resData.message || (typeof resData.error === 'string' ? resData.error : resData.error?.message) || 'Failed to create post. Please try again.';
        throw new Error(message);
      }

      setSuccess(true);
      setImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl('');
      setCaption('');

      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Something went wrong during upload.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <header className="upload-header">
        <span className="upload-eyebrow">CREATE SOMETHING</span>
        <h1 className="upload-title">Share a moment</h1>
        <p className="upload-subtitle">Publish a photograph to the PixelShare community.</p>
      </header>

      <div className="upload-card">
        {error && (
          <div className="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="alert-icon">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="alert-icon">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Post created successfully! Redirecting to Feed...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* FILE UPLOAD / PREVIEW AREA */}
          <div className="form-group">
            <label className="form-label">Photograph</label>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {previewUrl ? (
              <div className="preview-card">
                <div className="preview-image-wrapper">
                  <img src={previewUrl} alt="Preview" className="preview-image" />
                </div>
                <div className="preview-info">
                  <div className="preview-file-meta">
                    <span className="preview-file-name">{fileDetails.name}</span>
                    <span className="preview-file-size">{fileDetails.size}</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn-remove-preview" 
                    onClick={removePreview}
                    title="Remove selected image"
                    aria-label="Remove image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    <span>Remove</span>
                  </button>
                </div>
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
                <div className="dropzone-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="dropzone-icon">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="dropzone-text">
                  <span className="dropzone-prompt">Drag and drop your image here, or </span>
                  <span className="dropzone-action">browse</span>
                </div>
                <div className="dropzone-subtext">
                  JPEG · PNG · WEBP · GIF up to 10MB
                </div>
              </div>
            )}
          </div>

          {/* CAPTION TEXT AREA */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="caption" className="form-label">Caption</label>
              <span className={`char-count ${caption.length > 500 ? 'exceeded' : ''}`}>
                {caption.length}/500
              </span>
            </div>
            <textarea
              id="caption"
              className="form-textarea"
              placeholder="Write a catchy caption about this moment..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={uploading}
              maxLength={500}
              rows={4}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            className="btn-submit"
            disabled={uploading || !image}
          >
            {uploading ? (
              <>
                <span className="spinner" />
                <span>Publishing Post...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Share Post</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
