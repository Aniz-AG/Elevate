import React from 'react';
import { Box, Avatar, Typography, Stack } from '@mui/material';

const CommentCard = ({ author, content }) => {
  // const formattedAuthor = author
  //   .split(' ')
  //   .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  //   .join(' ');

  return (
    <Box mb={2} p={2} bgcolor="grey.800" borderRadius={2}>
      <Stack direction="row" alignItems="center">
        <Avatar alt={author} src="" sx={{ width: 30, height: 30 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white', ml: 1 }}>
          {author}
        </Typography>
      </Stack>
      <Typography sx={{ color: 'grey.300', mt: 1 }}>
        {content}
      </Typography>
    </Box>
  );
};

export default CommentCard;
