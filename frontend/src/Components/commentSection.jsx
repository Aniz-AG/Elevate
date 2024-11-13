import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import api from '../api/api';
import CommentCard from './commentCard.jsx';

const CommentSection = ({ blogId }) => {
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/user/getComments/${blogId}`);
      setComments(res.data.comments || []);
      console.log("Comments:",res.data.comments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;

    try {
      const res = await api.post(`/user/comment/${blogId}`,{ content: commentContent },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      setCommentContent('');
      fetchComments();
      // setComments((prev) => [...prev, res.data.comment]);
    } catch (err) {
      console.error('Error in adding comment:', err);
    }
  };


  useEffect(() => {
    fetchComments();
  }, [blogId]);

  return (
    <Box mt={4} p={3} sx={{ color:"black",backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Comments
      </Typography>

      <TextField
        placeholder="Leave a comment..."
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        size="small"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        sx={{ backgroundColor: '#fff', marginBottom: '8px' }}
        inputProps={{ style: { color: 'black' } }}
        />
      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={handleCommentSubmit}
        sx={{ marginBottom: '16px' }}
      >
        Submit
      </Button>

      {/* Loading Spinner while fetching comments */}
      {loading ? (
        <CircularProgress size={24} sx={{ marginTop: '16px' }} />
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment?._id} author={comment?.createdBy?.name} content={comment?.content} />
        ))
      )}
    </Box>
  );
};

export default CommentSection;
