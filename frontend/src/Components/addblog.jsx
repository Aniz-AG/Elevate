import React, { useState, useContext } from 'react';
import { Button, TextField, Stack, Box, useTheme, Snackbar, Alert,useMediaQuery } from '@mui/material';
import { DataContext } from '../Context/DataContext';
import api from '../api/api';
import Cookies from 'js-cookie'; 

const AddBlog = ({ onClose, onBlogAdded }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const theme = useTheme();
  const [formData, setFormData] = useState({
    tag: '',
    title: '',
    description: '',
    content: ''
  });
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await api.post('/user/createBlog', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Blog creation response", response);
      onBlogAdded();
      setToastMessage('Blog created successfully!');
      setToastSeverity('success');
      setOpenToast(true);
      onClose();
    } catch (error) {
      setToastMessage(error.response?.data?.message || 'Something went wrong.');
      setToastSeverity('error');
      setOpenToast(true);
    }
  };

  return (
    <Box
        p={2} mb={4} w="100%" border="1px solid" borderColor={theme.palette.grey[300]} borderRadius="8px" bgcolor={theme.palette.background.paper} boxShadow={3}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="tag"
            label="Tag"
            variant="outlined"
            value={formData.tag}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="title"
            label="Title"
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="description"
            label="Description"
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
          />
          <TextField
            name="content"
            label="Content"
            variant="outlined"
            value={formData.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={6}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth size="large">
            Submit Blog
          </Button>
        </Stack>
      </form>

      {/* Snackbar for showing success/error messages */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
      >
        <Alert onClose={() => setOpenToast(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddBlog;
