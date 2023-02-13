import {
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';

const qicktour = [
  {
    title: 'Searching a mentor/ mentee',
    des: 'The users can search for other users and connect with them using the search user functionality. The users can search for other users with some specific search criteria such as their skills, roles, company, etc.',
  },
  {
    title: 'Meetings',
    des: 'The platform delivers the audio-video chat, and calendar resources essential to have a rich mentoring experience with meetings. The users can manage the meetings through calendar resources according to their time zone and availability.',
  },
  {
    title: 'Feedback',
    des: 'The mentors or mentees can give feedback on sessions they attend. Mentors can give feedback for the mentees who attended the sessions. And mentees can give feedback about the session and the mentor.',
  },
  {
    title: 'Recommendations',
    des: 'To ensure the learning and sharing of skills, the mentoring platform allows mentors and mentees to focus on specific mentoring subjects through recommendations.',
  },
  {
    title: 'Goals',
    des: 'The user can set some goals along with a date to achieve them. Also, your Mentor can add some goals to your profile.',
  },
];

const QuickTour = (props) => {
  const { isOpenQuickTour, setIsOpenQuickTour } = props;
  const [isfade, setIsFade] = useState(true);
  const [data, setData] = useState({
    tvValue: qicktour[0],
    index: 0,
  });

  useEffect(() => {
    setData({
      tvValue: qicktour[localStorage.getItem('slideIndex') || 0],
      index: Number(localStorage.getItem('slideIndex') || 0),
    });
    setIsOpenQuickTour(
      localStorage.getItem('isQuickTourShown') === 'true' ||
        localStorage.getItem('isQuickTourShown') === null
    );
  }, []);

  return (
    <Modal open={isOpenQuickTour} disableAutoFocus>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          // height: '400px',
          textAlign: 'center',
          bgcolor: 'background.paper',
          p: 3,
        }}
      >
        <Typography variant="h6" fontWeight="Bold" display="inline">
          Quick Tour
        </Typography>
        <IconButton
          style={{
            position: 'absolute',
            top: '5px',
            right: '10px',
          }}
          onClick={() => {
            localStorage.setItem('isQuickTourShown', false);
            setIsOpenQuickTour(false);
          }}
        >
          <CloseIcon />
        </IconButton>

        <Fade in={isfade} timeout={500}>
          <Typography variant="body1" mt="10px">
            {data.tvValue.title}
          </Typography>
        </Fade>
        <Fade in={isfade} timeout={500}>
          <Typography
            component="img"
            src={
              data.index <= 2
                ? 'https://img.freepik.com/free-vector/seo-concept-illustration_114360-5846.jpg?w=740&t=st=1661148783~exp=1661149383~hmac=fc6f8de8e46de1bf81806991f091bf689b1aa8fde9a4bab68fb0e6a08f18cf63'
                : 'https://img.freepik.com/free-vector/participation-women-abstract-illustration_335657-5652.jpg?w=740&t=st=1661149929~exp=1661150529~hmac=59546f7ec50bcb62240615b79a77e535873e82c165cde6be799318b612671c6f'
            }
            mt="10px"
            width="250px"
          />
        </Fade>
        <Fade in={isfade} timeout={500}>
          <Typography variant="body2" mt="10px">
            {data.tvValue.des}
          </Typography>
        </Fade>
        <Stack direction="row" justifyContent="space-between" mt="20px">
          <Button
            variant="contained"
            disabled={data.index <= 0}
            onClick={() => {
              setIsFade(false);
              setTimeout(() => {
                setData({
                  index: data.index - 1,
                  tvValue: qicktour[data.index - 1],
                });
                setIsFade(true);
              }, 500);
            }}
          >
            Pre
          </Button>
          <Pagination
            count={qicktour.length}
            hidePrevButton
            hideNextButton
            page={data.index + 1}
            onChange={(event, value) => {
              setData({
                index: value - 1,
                tvValue: qicktour[value - 1],
              });
            }}
          />
          <Button
            variant="contained"
            disabled={data.index >= qicktour.length - 1}
            sx={{ ml: '15px' }}
            onClick={() => {
              localStorage.setItem('slideIndex', data.index);
              setIsFade(false);
              setTimeout(() => {
                setData({
                  index: data.index + 1,
                  tvValue: qicktour[data.index + 1],
                });
                setIsFade(true);
              }, 500);
            }}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default QuickTour;
