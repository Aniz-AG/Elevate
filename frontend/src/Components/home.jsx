import React from 'react';
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box m={2} p={1} maxWidth="600px">
      <Typography
        variant="h2"
        component="h1"
        fontWeight="bold"
        sx={{ lineHeight: '60px' }}
      >
        CONNECT , SKILL UP & LEARN
      </Typography>
    </Box>
  );
};

export default Home;
