import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Radio,
  Stack,
  Typography,
} from '@mui/material';
import { CalendarPicker } from '@mui/x-date-pickers';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  APP_COLOR,
  BASE_URL,
  CONNECT_ICON,
  FOLLOW_ICON,
  PROFILE_PERCENTAGE_IMG,
} from '../../libs/config';

const LandingPage = (props) => {
  const { setvalue } = props;
  const [date, setDate] = useState(new Date());
  const [fetchMentordata, setFetchMentorData] = useState([]);
  const [fetchCalenderdata, setFetchCalenderData] = useState([]);

  useEffect(() => {
    getDate();
    getCalenderDate(new Date());
  }, []);

  const getDate = async () => {
    try {
      const req = await axios.get(`${BASE_URL}/dashboard/mentors`, {
        headers: {
          email: sessionStorage.getItem('email'),
          Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setFetchMentorData(req.data);
    } catch (e) {
      console.error(e);
    }
  };

  const getCalenderDate = async (date) => {
    try {
      const req = await axios.get(
        `${BASE_URL}/calendar/?startDate=${moment(date.setHours(0, 0, 0, 0))
          .format('DD/MM/YYYY HH:mm')
          .toString()}&endDate=${moment(date.setHours(23, 59, 59, 999))
          .format('DD/MM/YYYY HH:mm')
          .toString()}`,

        {
          headers: {
            Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
            email: sessionStorage.getItem('email'),
          },
        }
      );
      setFetchCalenderData(req.data.calendarEvents);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFollow = async (email, isFollowing) => {
    if (isFollowing) {
      try {
        const req = await axios.delete(
          `${BASE_URL}/network/unfollow?followerEmail=${email}`,
          {
            headers: {
              Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
              email: sessionStorage.getItem('email'),
            },
          }
        );
        getDate();
        console.log('>>>>>>>>>>>>>>>> req', req);
      } catch (e) {
        console.error(e);
      }
    } else
      try {
        const req = await axios.post(
          `${BASE_URL}/network/follow`,
          { email },
          {
            headers: {
              Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
              email: sessionStorage.getItem('email'),
            },
          }
        );
        getDate();
        console.log('>>>>>>>>>>>>>>>> req', req);
      } catch (e) {
        console.error(e);
      }
  };

  const handleConnect = async (email) => {
    try {
      const req = await axios.post(
        `${BASE_URL}/network/connection`,
        { email },
        {
          headers: {
            Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
            email: sessionStorage.getItem('email'),
          },
        }
      );
      getDate();
      console.log('>>>>>>>>>>>>>>>> req', req);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item container spacing={3}>
          <Grid
            item
            // xs={12}
            // sm={6}
            md={8}
            lg={8}
            xl={8}
          >
            <Stack
              component={Paper}
              direction="row"
              sx={{ p: '15px', height: '170px' }}
              justifyContent="space-between"
            >
              <Stack>
                <Typography variant="h5" fontFamily="Bold">
                  Welcome Kartik!
                </Typography>
                <Typography
                  variant="body1"
                  fontFamily="Medium"
                  pr="15px"
                  mt="5px"
                >
                  You have completed{' '}
                  <span style={{ color: APP_COLOR }}>80% </span>
                  of your profile, Tell us more about you so that we can find a
                  perfect match.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: APP_COLOR,
                    width: '150px',
                    mt: '10px',
                  }}
                >
                  Complete
                </Button>
              </Stack>

              <Typography
                height="126px"
                component="img"
                src={PROFILE_PERCENTAGE_IMG}
              />
            </Stack>
          </Grid>
          <Grid
            item
            // xs={12}
            // sm={6}
            md={4}
            lg={4}
            xl={4}
          >
            <Stack
              component={Paper}
              sx={{ p: '20px', height: '170px' }}
              justifyContent="space-between"
            >
              <Stack direction="row">
                <Avatar
                  sx={{ width: 72, height: 72 }}
                  alt="Remy Sharp"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                />
                <Stack ml="10px">
                  <Typography variant="h6" fontFamily="Bold">
                    Kartik AJ
                  </Typography>
                  <Typography variant="body2" fontFamily="Medium">
                    UI/UX Designer
                  </Typography>
                </Stack>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={50}
                sx={{
                  backgroundColor: '#eeeeee',
                  height: '8px',
                  mt: '10px',
                  borderRadius: '5px',
                  '.MuiLinearProgress-bar': {
                    background: 'linear-gradient(#88a1e1, #424ed9)',
                  },
                }}
              />

              <Stack direction="row" justifyContent="space-between" mb="-7px">
                <Typography variant="body2" fontFamily="Medium">
                  Level 1
                </Typography>
                <Typography
                  variant="body2"
                  fontFamily="Medium"
                  color={APP_COLOR}
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Level Up
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Grid item container spacing={3}>
          <Grid item md={8} lg={8} xl={8}>
            <Paper
              sx={{
                p: '10px',
                minHeight: '60vh',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <Typography variant="h6" fontFamily="Bold" mb="5px">
                Recommended Mentors
              </Typography>
              <Grid
                container
                // justifyContent="center"
                columnSpacing={4}
                rowSpacing={3}
                // sx={{ overflow: 'auto' }}
              >
                {fetchMentordata.map(
                  (item, index) =>
                    index <= 9 && (
                      <Grid item md={6} key={index}>
                        <Paper
                          elevation={1}
                          sx={{
                            display: 'flex',
                            py: '15px',
                            px: '15px',
                            flexDirection: 'column',
                            backgroundColor: '#F9F9F9',
                          }}
                        >
                          <Stack direction="row">
                            <Avatar
                              sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: APP_COLOR,
                              }}
                            >{`${item.firstName[0].toUpperCase()}`}</Avatar>
                            <Stack ml="10px" overflow="hidden">
                              <Typography variant="body1" fontFamily="Medium">
                                {`${item.firstName} ${item.lastName}`}
                              </Typography>
                              <Typography variant="body2" fontFamily="Medium">
                                {item.userRole}
                              </Typography>
                              <Stack
                                direction="row"
                                mt="5px"
                                height="27px"
                                className="hidden"
                                sx={{ overflowX: 'auto', overflowY: 'hidden' }}
                              >
                                {item.skills.map((chipitem, i) => (
                                  <Chip
                                    label={chipitem}
                                    key={i}
                                    size="small"
                                    onClick={() => {}}
                                    sx={{
                                      fontFamily: 'light',
                                      borderRadius: '4px',
                                      ml: i > 0 ? '5px' : 0,
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack mt="15px">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => setvalue(4)}
                              sx={{
                                borderRadius: '6px',
                                fontFamily: 'Medium',
                                textTransform: 'none',
                                backgroundColor: APP_COLOR,
                              }}
                            >
                              Schedule Meeting
                            </Button>

                            <Stack
                              direction="row"
                              justifyContent="center"
                              height="35px"
                              mt="10px"
                            >
                              <Button
                                sx={{
                                  textTransform: 'none',
                                  borderRadius: '6px',
                                  color: item.isFollowing
                                    ? APP_COLOR
                                    : '#222222',
                                  fontFamily: 'Medium',
                                }}
                                onClick={() =>
                                  handleFollow(item.email, item.isFollowing)
                                }
                              >
                                <Box
                                  component="img"
                                  mr="5px"
                                  sx={{ width: '16px' }}
                                  src={FOLLOW_ICON}
                                />
                                {item.isFollowing ? 'Following' : 'Follow'}
                              </Button>
                              <Divider
                                orientation="vertical"
                                sx={{
                                  borderColor: 'black',
                                  mr: '10px',
                                  ml: '10px',
                                }}
                              />
                              <Button
                                onClick={() => handleConnect(item.email)}
                                sx={{
                                  textTransform: 'none',
                                  borderRadius: '6px',
                                  fontFamily: 'Medium',
                                  color: item.isConnected
                                    ? APP_COLOR
                                    : '#222222',
                                }}
                              >
                                <Box
                                  component="img"
                                  mr="5px"
                                  sx={{ width: '16px' }}
                                  src={CONNECT_ICON}
                                />
                                {item.isConnected ? 'Connected' : 'Connect'}
                              </Button>
                            </Stack>
                          </Stack>
                        </Paper>
                      </Grid>
                    )
                )}
              </Grid>
            </Paper>
          </Grid>
          <Grid item md={4}>
            <Paper sx={{ minHeight: '10vh', maxHeight: '90vh' }}>
              <Stack
                direction="row"
                px="20px"
                pt="20px"
                justifyContent="space-between"
              >
                <Typography variant="body1" fontFamily="Medium" color="gray">
                  {`${moment(date).format(
                    'MMMM'
                  )} ${date.getDate()}, ${date.getFullYear()}`}
                </Typography>
                <Typography
                  variant="body2"
                  fontFamily="Medium"
                  color={APP_COLOR}
                  onClick={() => setvalue(4)}
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  view calendar
                </Typography>
              </Stack>
              <CalendarPicker
                // sx={{
                //   backgroundColor: 'red',
                //   ' .MuiCalendarPicker-root': { backgroundColor: 'red' },
                //   ' &.MuiPickersArrowSwitcher-root': { backgroundColor: 'red' },
                // }}
                // style={{ backgroundColor: 'red' }}
                // components={{
                //   // OpenPickerIcon: MoreTimeIcon,
                //   LeftArrowIcon: AbcIcon,
                //   RightArrowIcon: AbcIcon,
                //   // SwitchViewIcon: ChangeCircleIcon,
                // }}
                // componentsProps={{
                //   LeftArrowIcon: {
                //     color: 'secondary',
                //   },
                // }}
                date={date}
                onChange={(newDate) => {
                  setDate(newDate);
                  getCalenderDate(newDate);
                }}
              />

              <Stack
                direction="row"
                sx={{
                  minHeight: '0px',
                  maxHeight: '204px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                <Stack alignItems="center" mt="20px">
                  {fetchCalenderdata.map((item, index) => (
                    <>
                      <Radio checked />
                      {index <= fetchCalenderdata.length - 2 && (
                        <Divider
                          orientation="vertical"
                          sx={{ height: '60px' }}
                        />
                      )}
                    </>
                  ))}
                </Stack>

                <Grid container alignItems="center">
                  {fetchCalenderdata.map((item, index) => (
                    <Grid item xs={11} key={index}>
                      <Paper
                        sx={{
                          p: '10px',
                          mb: '20px',
                          backgroundColor:
                            item.meetingStatus === 'CONFIRMED'
                              ? '#7da0fc'
                              : '#F9F9F9',
                          color:
                            item.meetingStatus === 'CONFIRMED'
                              ? 'white'
                              : 'black',
                        }}
                      >
                        {console.log('>>>>>>>>>>>>>>>>>>>> item', item)}
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontFamily="Medium">
                            1 on 1 meet
                          </Typography>
                          {/* <Typography fontFamily="Medium">
                            {`${String(item.start.getHours()).padStart(
                              2,
                              '0'
                            )}:${String(item.start.getMinutes()).padStart(
                              2,
                              '0'
                            )}`}
                          </Typography> */}
                        </Stack>
                        <Stack direction="row" mt="10px">
                          <Avatar
                            sx={{ width: 25, height: 25, mr: '5px' }}
                            alt="Remy Sharp"
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                          />

                          <Typography
                            fontFamily="Medium"
                            width="90%"
                            sx={{ wordWrap: 'break-word' }}
                          >
                            {item?.joineeEmail}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LandingPage;
