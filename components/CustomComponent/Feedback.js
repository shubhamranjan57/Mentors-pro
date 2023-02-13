import {
  Button,
  Grid,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from '../../libs/config';

const Feedback = (props) => {
  const { userRole } = props;
  const [value, setValue] = useState(0);
  const [textReview, setTextReview] = useState('');

  const submitReviewMeeting = async () => {
    try {
      await axios.post(
        `${BASE_URL}/meeting/review`,
        {
          userEmail: sessionStorage.getItem('email'),
          eventId: 0,
          overallRating: value,
          reviewMessage: textReview,
        },
        {
          headers: {
            Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Grid container alignItems="center" direction="column">
        <Typography variant="h5" fontFamily="Bold">
          Give Feedback
        </Typography>

        <Typography variant="body1" mt="30px" fontFamily="Medium">
          {`How was your interaction with ${
            userRole !== 'MENTEE' ? 'Mentor' : 'Mentee'
          }`}
        </Typography>
        <Rating
          // defaultValue={0}
          size="large"
          value={value}
          precision={0.5}
          sx={{ mt: '15px' }}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />

        <Box sx={{ width: '50%', mt: '80px' }}>
          <Typography variant="body2" mb="5px" pl="7px" fontFamily="Bold">
            Briefly explain your rating
          </Typography>
          <TextField
            multiline
            rows={5}
            size="small"
            onChange={(e) => setTextReview(e.target.value)}
            sx={{ width: '100%' }}
            inputProps={{ maxLength: 1000 }}
          />
        </Box>
        <Stack direction="row" mt="30px">
          <Button variant="outlined" sx={{ mr: '20px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ textTransform: 'none' }}
            onClick={submitReviewMeeting}
          >
            Submit
          </Button>
        </Stack>
      </Grid>
    </>
  );
};

export default Feedback;
