import { Avatar, Paper, Stack, Typography } from '@mui/material';
import React from 'react';

const UserDetails = () => {
  return (
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        py: '15px',
        px: '15px',
        backgroundColor: '#F9F9F9',
      }}
    >
      <Avatar
        sx={{ width: 56, height: 56 }}
        src="https://i.pravatar.cc/300"
      ></Avatar>
      <Stack ml="10px">
        <Typography variant="body1" fontFamily="Medium">
          Remy Sharp
        </Typography>
        <Typography variant="body2" fontFamily="Medium">
          Mentee
        </Typography>
      </Stack>
    </Paper>
  );
};

export default UserDetails;
