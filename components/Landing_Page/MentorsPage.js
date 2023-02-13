import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  APP_COLOR,
  BASE_URL,
  CONNECT_ICON,
  FOLLOW_ICON,
} from '../../libs/config';

const MentorsPage = (props) => {
  const { setvalue } = props;

  const [data, setData] = useState([]);

  useEffect(() => {
    getDate();
  }, []);

  const getDate = async () => {
    try {
      const req = await axios.get(`${BASE_URL}/mentors`, {
        headers: {
          email: sessionStorage.getItem('email'),
          Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setData(req.data);
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
        await axios.post(
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
      {data.map((arryitem, dataindex) => (
        <>
          {arryitem.usersList.length > 0 && (
            <Stack key={dataindex} mt={dataindex >= 1 ? '20px' : ''}>
              <Typography variant="h6" fontFamily="Bold">
                {arryitem.keyword}
              </Typography>
              <Stack
                className="slimscroll"
                direction="row"
                sx={{ overflowX: 'auto', width: '78vw', mt: '5px', py: '5px' }}
              >
                {arryitem.usersList.map((item, index) => (
                  <Paper
                    elevation={1}
                    key={index}
                    sx={{
                      display: 'flex',
                      py: '15px',
                      px: '15px',
                      width: '300px',
                      mx: '10px',
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
                      >
                        {`${item.firstName[0].toUpperCase()}`}
                      </Avatar>
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
                    <Stack mt="12px">
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
                          onClick={() =>
                            handleFollow(item.email, item.isFollowing)
                          }
                          sx={{
                            textTransform: 'none',
                            borderRadius: '6px',
                            color: '#222222',
                            fontFamily: 'Medium',
                          }}
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
                ))}
              </Stack>
            </Stack>
          )}
        </>
      ))}
    </>
  );
};

export default MentorsPage;
