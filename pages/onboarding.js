import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import Head from 'next/head';
import React, { useState } from 'react';
import {
  MENTORPRO_MAIN_LOGO,
  ONBOARDING_IMG_1,
  ONBOARDING_IMG_2,
  ONBOARDING_IMG_3,
  ONBOARDING_IMG_4,
} from '../libs/config';
import PersonalPage from '../components/onBoarding/PersonalPage';
import SkillPage from '../components/onBoarding/SkillPage';
import EducationalPage from '../components/onBoarding/EducationalPage';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const welcomePage = 0;
const personalPage = 1;
const educationalPage = 2;
const skillPage = 3;

const Onboarding = () => {
  const [currentPreview, setCurrentPreview] = useState(welcomePage);
  const [onBoardingState, setOnBoardingState] = useState({});

  const handleNextPage = () => {
    setCurrentPreview(
      currentPreview <= 2 ? currentPreview + 1 : currentPreview
    );
  };

  const handlePreviousPage = () => {
    setCurrentPreview(currentPreview - 1);
  };

  return (
    <>
      <Head>
        <title>Mentor Pro Onboarding</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={0}
          sm={0}
          md={5}
          sx={{
            position: 'relative',
            backgroundColor: '#5c89fc',
            overflow: 'hidden',
          }}
        >
          <Box mt="10px">
            <Typography
              component="img"
              src={MENTORPRO_MAIN_LOGO}
              sx={{ width: '142px' }}
              ml="50px"
              mt="30px"
            />
          </Box>

          {currentPreview === welcomePage ? (
            <Typography
              component="img"
              src={ONBOARDING_IMG_1}
              sx={{
                width: '100%',
                height: '131vh',
                objectFit: 'cover',
                position: 'absolute',
              }}
            />
          ) : (
            <Box
              mt="50px"
              sx={{
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Box display="flex" flexDirection="column" ml="50px">
                <Typography
                  variant="h5"
                  component="span"
                  color="white"
                  mt="15px"
                  width="300px"
                  fontFamily="Bold"
                >
                  {currentPreview === personalPage
                    ? `Tell Us about yourself`
                    : currentPreview === educationalPage
                    ? 'Tell Us about your Education & Profession'
                    : 'Tell Us about your Skills & your Availability'}
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  color="white"
                  mt="5px"
                  fontFamily="Medium"
                >
                  Let&apos;s start with the basic! Share a bit about <br />
                  yourself to introduce yourself to the world of <br /> mentees
                </Typography>

                <Grid>
                  <FiberManualRecordIcon
                    fontSize="small"
                    sx={{
                      color:
                        currentPreview === personalPage ? 'white' : '#7da0fc',
                    }}
                  />
                  <FiberManualRecordIcon
                    fontSize="small"
                    sx={{
                      color:
                        currentPreview === educationalPage
                          ? 'white'
                          : '#7da0fc',
                    }}
                  />
                  <FiberManualRecordIcon
                    fontSize="small"
                    sx={{
                      color: currentPreview === skillPage ? 'white' : '#7da0fc',
                    }}
                  />
                </Grid>
              </Box>
              <Typography
                component="img"
                src={
                  currentPreview === personalPage
                    ? ONBOARDING_IMG_2
                    : currentPreview === educationalPage
                    ? ONBOARDING_IMG_3
                    : ONBOARDING_IMG_4
                }
                sx={{
                  width: '100%',
                  height: `${
                    currentPreview === personalPage
                      ? '57vh'
                      : currentPreview === educationalPage
                      ? '52vh'
                      : '52vh'
                  }`,
                  position: 'absolute',
                  bottom: '125px',
                }}
              />
            </Box>
          )}
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          component={Paper}
          elevation={1}
          sx={{
            overflow: 'auto',
            height: '100vh',
            px: '30px',
          }}
        >
          {currentPreview === welcomePage && (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              sx={{
                height: '100vh',
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold' }}
                  fontFamily="Medium"
                >
                  Welcome to Mentor Pro!
                </Typography>
                <Typography variant="subtitle1" mt="5px" fontFamily="Medium">
                  Lets Setup Your Account in 3 Simple Steps
                </Typography>

                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  sx={{ mt: '20px', backgroundColor: '#5c89fc' }}
                  onClick={handleNextPage}
                >
                  Let&apos;s Get Started
                </Button>
              </Box>
            </Grid>
          )}

          <Container sx={{ px: '50px' }}>
            {currentPreview === personalPage && (
              <PersonalPage
                handleNextPage={handleNextPage}
                onBoardingState={onBoardingState}
                setOnBoardingState={setOnBoardingState}
              />
            )}

            {currentPreview === educationalPage && (
              <EducationalPage
                handleNextPage={handleNextPage}
                onBoardingState={onBoardingState}
                handlePreviousPage={handlePreviousPage}
                setOnBoardingState={setOnBoardingState}
              />
            )}

            {currentPreview === skillPage && (
              <SkillPage
                onBoardingState={onBoardingState}
                handlePreviousPage={handlePreviousPage}
                setOnBoardingState={setOnBoardingState}
              />
            )}
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default Onboarding;
