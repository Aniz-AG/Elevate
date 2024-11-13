import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
  TextField,
  Card,CardContent
} from '@mui/material';
import api from '../api/api';
import AddBlog from '../Components/addblog';
import BlogCard from '../Components/blogCard';
import { DataContext } from '../Context/DataContext';

// BlogPage Component
const BlogPage = () => {
  const { userInfo } = useContext(DataContext);
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleAddBlog = () => {
    setIsOpen(prev => !prev);
  };

  const getAllBlogs = async (tag) => {
    try {
      const res = await api.get(`/user/getAllBlogs/${tag}`);
      return res.data.blogs;
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  const getBlogs = async (tag) => {
    if (!userInfo || !userInfo.id) return;
    const blogData = await getAllBlogs(tag);

    const updatedBlogs = blogData.map((blog) => {
      const initiallyLiked = blog?.likes?.some(like => like.createdBy._id === userInfo.id);
      return { ...blog, initiallyLiked };
    });

    setBlogs(updatedBlogs);
    setLoading(false);
  };

  const getMyBlog = async () => {
    try {
      const res = await api.get('/user/getMyBlog');
      setMyBlogs(res.data.blogs);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.id) {
      getBlogs(selectedTag);
      getMyBlog();
    }
  }, [userInfo, selectedTag]);

  const handleBlogAdded = () => {
    getBlogs(selectedTag);
    setIsOpen(false);
    window.location.reload();
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
  };

  // Filter the blogs based on search query
  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(query) || blog.description.toLowerCase().includes(query)
    );
  });

  return (
    <Box sx={{ margin: '32px', display: 'flex' }}>
      {/* Left Section (60%) */}
      <Box sx={{ flex: 0.6, paddingRight: '16px' }}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Latest Blogs
        </Typography>

        {/* Add Blog and Search Bar*/}
        <Box className="flex justify-between mb-4">
            <Button variant="contained" color="primary" onClick={toggleAddBlog}>
              Add Blog
            </Button>

            {/* Search Bar */}
            <div className="flex items-center w-2/3">
              <input
                type="text"
                placeholder="Search Blogs"
                value={searchQuery}
                onChange={handleSearchChange}
                className="text-white bg-transparent w-full p-1 rounded border-2 border-white focus:border-blue-500"
              />
            </div>
          </Box>
        <Stack direction="row" spacing={2} sx={{ marginBottom: '16px' }}>
          {['all','AI-ML', 'Web3', 'DSA', 'Maths','Web-Dev','DevOps','Software Eng','Interview'].map((tag) => (
            <Chip
              key={tag}
              label={tag}
              color={selectedTag === tag ? 'primary' : 'default'}
              onClick={() => handleTagClick(tag)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>

        {isOpen && <AddBlog onClose={toggleAddBlog} onBlogAdded={handleBlogAdded} />}

        {loading ? (
          <CircularProgress size={50} />
        ) : (
          filteredBlogs.map((blog) => ( // Show filtered blogs
            <BlogCard
              key={blog._id}
              blogId={blog._id}
              title={blog.title}
              author={blog.createdBy.name}
              description={blog.description}
              content={blog.content}
              likes={blog.likes.length}
              comments={blog.comments.length}
              initiallyLiked={blog.initiallyLiked}
            />
          ))
        )}
      </Box>

      {/* Right Section (40%) */}
      <Box sx={{ flex: 0.4 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          My Blogs
        </Typography>

        {myBlogs.length > 0 ? (
          myBlogs.map((blog) => (
            <Card key={blog._id} sx={{ marginBottom: '16px', backgroundColor: '#333', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="body2" color="white" fontWeight="bold">
                  {blog.title}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                  <Typography variant="caption" color="text.secondary">
                    Likes: {blog.likes.length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Comments: {blog.comments.length || 0}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No blogs found...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BlogPage;
