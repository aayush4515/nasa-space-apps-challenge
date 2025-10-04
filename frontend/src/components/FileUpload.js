import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import axios from 'axios';

const UploadContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const UploadSection = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 40px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-bottom: 40px;
`;

const SectionTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin-bottom: 8px;
  text-align: center;
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 40px;
  font-family: 'Space Mono', monospace;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#4a9eff' : 'rgba(74, 158, 255, 0.3)'};
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  background: ${props => props.isDragActive ? 'rgba(74, 158, 255, 0.1)' : 'rgba(26, 26, 46, 0.5)'};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #4a9eff;
    background: rgba(74, 158, 255, 0.05);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(74, 158, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const DropzoneIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.8;
`;

const DropzoneText = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #4a9eff;
  margin-bottom: 8px;
  font-family: 'Orbitron', monospace;
`;

const DropzoneSubtext = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
`;

const FileList = styled.div`
  margin-top: 24px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.2);
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(74, 158, 255, 0.5);
    background: rgba(0, 0, 0, 0.5);
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileIcon = styled.div`
  font-size: 24px;
`;

const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileName = styled.div`
  font-weight: 700;
  color: white;
  font-family: 'Space Mono', monospace;
`;

const FileSize = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
`;

const FileStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Space Mono', monospace;
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch(props.status) {
      case 'uploading': return '#ff9800';
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  animation: ${props => props.status === 'uploading' ? 'pulse 1.5s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

const UploadButton = styled.button`
  background: linear-gradient(45deg, #4a9eff, #6bb6ff);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(74, 158, 255, 0.3);
  margin-top: 24px;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 158, 255, 0.4);
    background: linear-gradient(45deg, #6bb6ff, #4a9eff);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function FileUpload({ onFileUpload, isLoading, setIsLoading }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: 'pending'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: true
  });

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setIsLoading(true);
    
    try {
      for (const fileItem of uploadedFiles) {
        if (fileItem.status === 'pending') {
          // Update status to uploading
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileItem.id ? { ...f, status: 'uploading' } : f
            )
          );

          const formData = new FormData();
          formData.append('file', fileItem.file);

          // FIXME: Replace with actual API endpoint
          const response = await axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data) {
            // Update status to success
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === fileItem.id ? { 
                  ...f, 
                  status: 'success',
                  response: response.data 
                } : f
              )
            );
            
            toast.success(`File ${fileItem.name} uploaded successfully`);
            onFileUpload(response.data);
          }
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
      
      // Update status to error
      setUploadedFiles(prev => 
        prev.map(f => 
          f.status === 'uploading' ? { ...f, status: 'error' } : f
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <UploadContainer>
      <UploadSection>
        <SectionTitle>Upload Dataset</SectionTitle>
        <SectionSubtitle>
          Upload CSV files containing exoplanet data for training or testing your models
        </SectionSubtitle>

        <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <DropzoneIcon>📁</DropzoneIcon>
          <DropzoneText>
            {isDragActive ? 'Drop files here...' : 'Drag & drop CSV files here'}
          </DropzoneText>
          <DropzoneSubtext>
            or click to select files (CSV format only)
          </DropzoneSubtext>
        </DropzoneContainer>

        {uploadedFiles.length > 0 && (
          <FileList>
            {uploadedFiles.map((fileItem) => (
              <FileItem key={fileItem.id}>
                <FileInfo>
                  <FileIcon>📄</FileIcon>
                  <FileDetails>
                    <FileName>{fileItem.name}</FileName>
                    <FileSize>{formatFileSize(fileItem.size)}</FileSize>
                  </FileDetails>
                </FileInfo>
                <FileStatus>
                  <StatusIndicator status={fileItem.status} />
                  {fileItem.status.toUpperCase()}
                  {fileItem.status === 'pending' && (
                    <button 
                      onClick={() => removeFile(fileItem.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#f44336', 
                        cursor: 'pointer',
                        marginLeft: '8px'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </FileStatus>
              </FileItem>
            ))}
          </FileList>
        )}

        <UploadButton 
          onClick={handleUpload} 
          disabled={isLoading || uploadedFiles.length === 0}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Uploading...
            </>
          ) : (
            'Upload Files'
          )}
        </UploadButton>
      </UploadSection>
    </UploadContainer>
  );
}

export default FileUpload;
