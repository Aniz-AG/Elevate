import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Stack,
  Collapse,
} from '@mui/material';
import { FaThumbsUp, FaComment } from 'react-icons/fa';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import CommentSection from './commentSection.jsx';
import api from '../api/api.jsx';

const BlogCard = ({ blogId, title, author,description, content, likes, comments,initiallyLiked }) => {
  const [showContent, setShowContent] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(initiallyLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const handleLike = async () => {
    try {
      const res = await api.post(`/user/like/${blogId}`);
      setLiked(!liked);
      setLikeCount(liked?likeCount-1:likeCount+1);
      console.log(res);
    } catch (err) {
      console.error('Error in liking:', err);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);  
    setShowContent(!showContent);    
  };

  const formattedAuthor = author
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <Card sx={{ marginBottom: '16px', backgroundColor: '#333', borderRadius: '8px' }}>
      <CardHeader
        avatar={<Avatar sx={{ backgroundColor: '#1976d2' }} />}
        title={<Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>{title}</Typography>}
        subheader={`Posted by ${formattedAuthor}`}
        sx={{ color: 'white' }}
      />
      <CardContent>
        <Typography variant="h6" color="white" gutterBottom>
          {description}
        </Typography>
        <Collapse in={showContent}>
          <Typography variant="body2" color="text.secondary" paragraph>
            {content}
          </Typography>
        </Collapse>

        {/* Like and Comment section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center">
            <IconButton onClick={handleLike} color={liked ? 'primary' : 'default'}>
              <FaThumbsUp />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {likeCount} Likes
            </Typography>
            <IconButton onClick={toggleComments} color="default">
              <FaComment />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {comments} Comments
            </Typography>
          </Stack>

          {/* Toggle button for content */}
          <IconButton onClick={() => setShowContent(!showContent)} color="primary">
            {showContent ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Stack>

        {/* Conditionally render the comments section */}
        {showContent && showComments && <CommentSection blogId={blogId} />}
      </CardContent>
    </Card>
  );
};

export default BlogCard;
