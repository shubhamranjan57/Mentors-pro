import { Avatar, Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { APP_COLOR } from '../../libs/config';
import { Box } from '@mui/system';

const SearchResult = (props) => {
  const { setIsShowSearch, searchData } = props;

  return (
    <>
      <Typography variant="h6" fontFamily="Bold">
        <ArrowBackIcon
          onClick={() => setIsShowSearch(false)}
          sx={{
            verticalAlign: 'text-top',
          }}
        />{' '}
        Search Result
      </Typography>
      {searchData?.length <= 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <Typography variant="h6" fontFamily="Bold">
            No result found
          </Typography>
        </Box>
      )}

      <Grid container columnSpacing={4} rowSpacing={3} mt="10px">
        {searchData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
            <Paper sx={{ display: 'flex', py: '15px', px: '15px' }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  backgroundColor: APP_COLOR,
                  fontFamily: 'Bold',
                }}
                // src="https://i.pravatar.cc/300"
              >
                {item && item.firstName && item.firstName.length > 0
                  ? `${item?.firstName[0].toUpperCase()}`
                  : ''}
              </Avatar>
              <Stack ml="10px">
                <Typography variant="body1" fontFamily="Medium">
                  {`${item.firstName} ${item.lastName}`}
                </Typography>
                <Typography variant="body2" fontFamily="Medium">
                  {item.userRole}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SearchResult;
