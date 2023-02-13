import {
  AppBar,
  Autocomplete,
  Avatar,
  Box,
  Drawer,
  IconButton,
  InputAdornment,
  InputBase,
  Menu,
  MenuItem,
  Popper,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { MENTORPRO_MAIN_LOGO, APP_COLOR, BASE_URL } from '../libs/config';
import Fullcalender from '../components/CustomComponent/Fullcalender';
import SearchIcon from '@mui/icons-material/Search';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import GridViewIcon from '@mui/icons-material/GridView';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchResult from '../components/Landing_Page/SearchResult';
import LandingPage from '../components/Landing_Page';
import axios from 'axios';
import MentorsPage from '../components/Landing_Page/MentorsPage';
import MyMeetingsPage from '../components/Landing_Page/MyMeetingsPage';
import QuickTour from '../components/Quick_tour';

const debounce = (func, wait) => {
  let timeout;

  return (...args) => {
    const context = this;

    const later = () => {
      timeout = null;
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const settings = ['Profile', 'Quick Tour', 'Logout'];

const DashboardView = 0;
const MentorView = 1;
const MyMeetings = 2;

const ScheduleMeeting = 4;

const Dashboard = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [value, setvalue] = useState(DashboardView);
  const [searchData, setSearchData] = useState([]);
  const [searchStr, setSearchStr] = useState('');
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isOpenQuickTour, setIsOpenQuickTour] = useState(true);

  useEffect(() => {
    if (searchStr.trim().length > 0) {
      debounce((name) => {
        handleSearch();
      }, 200)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStr]);

  const handleSearch = async () => {
    console.log('>>>>>>>>>>>>>>>>>>>>> serch call');
    try {
      const req = await axios.get(
        `${BASE_URL}/user/search/?search=${searchStr}`,
        {
          headers: {
            Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
            email: sessionStorage.getItem('email'),
          },
        }
      );
      console.log('>>>>>>>>>>>>>>>>> res ', req);
      setSearchData(req.data);
    } catch (e) {
      console.log('>>>>>>>>>>>>>>>>> errrrrrrrrrrrrrrrr');
      console.error(e);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (value) => {
    setAnchorElUser(null);
    if (value === 'Quick Tour') {
      setIsOpenQuickTour(true);
      setvalue(DashboardView);
    } else if (value === 'Logout') {
      sessionStorage.clear();
      Router.push('/');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* , backgroundColor: '#f2f2f2' */}
      <Box>
        <AppBar
          position="fixed"
          sx={{
            boxShadow: 'none',
            backgroundColor: APP_COLOR,
            zIndex: '1300',
          }}
        >
          <Toolbar>
            <IconButton size="large" edge="start" sx={{ mr: 2 }} disableRipple>
              <Typography component="img" src={MENTORPRO_MAIN_LOGO} />
            </IconButton>
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body1"
                fontFamily="Medium"
                mr="15px"
                sx={{ cursor: 'pointer' }}
              >
                My Meeting
              </Typography>
              <Typography
                variant="body1"
                fontFamily="Medium"
                mr="15px"
                sx={{ cursor: 'pointer' }}
              >
                My Network
              </Typography>

              <Autocomplete
                freeSolo
                disableClearable
                onChange={(event, newValue) => {
                  console.log('>>>>>>>>>> event', event);
                  console.log('>>>>>>>>>> newValue', newValue);
                  if (event.type === 'click') {
                    setSearchData(
                      searchData.filter(
                        (item) =>
                          newValue === `${item.firstName} ${item.lastName}`
                      )
                    );
                  }
                  setIsShowSearch(true);
                }}
                options={searchData.map(
                  (item) => `${item.firstName} ${item.lastName}`
                )}
                // options={searchData}
                // getOptionLabel={(option) => {
                //   console.log('>>>>>>>>>>>>>>>>>> optionssss', option);
                //   return 'dd';
                // }}
                // getOptionLabel={
                //   (option) => option.firstName
                //   // `${option.firstName} ${option.lastName}`
                // }
                sx={{
                  borderRadius: '6px',
                  width: '360px',
                  height: '40px',
                  backgroundColor: 'white',
                  mr: '15px',
                  pt: '6px',
                  px: '10px',
                }}
                PopperComponent={(props) => (
                  <Popper {...props} sx={{ pt: '10px' }}></Popper>
                )}
                renderOption={(props, option, state) => (
                  <Box
                    {...props}
                    style={{ marginTop: '5px', color: '#564f4f' }}
                  >
                    {/* {console.log('>>>>>>>>>>>> optionoption', option)} */}
                    <SearchIcon sx={{ mr: '10px' }} />
                    {/* {`${option.firstName} ${option.lastName}`} */}
                    {/* {option.firstName} */}
                    {option}
                  </Box>
                )}
                renderInput={(params) => (
                  <InputBase
                    placeholder="Search"
                    {...params}
                    {...params.InputProps}
                    onChange={(e) => {
                      // console.log('>>>>>>>>>>>> eeee', e);
                      setSearchStr(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            console.log('>>>>>>>>>> Click');
                            setIsShowSearch(true);
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu}>
                  <Avatar
                    alt="Remy Sharp"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          border: 'none',
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            color: 'white',
            backgroundColor: APP_COLOR,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />

        <Tabs
          orientation="vertical"
          value={value}
          onChange={(_, val) => {
            console.log('>>>>>>>>>>>>>>>>', val);
            setvalue(val);
          }}
          sx={{
            mt: '20px',
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
              borderRadius: '6px',
              width: '200px',
              height: '60px !important',
              mt: '4px',
              textAlign: 'center',
              zIndex: '-1',
              right: '8%',
            },
            '& .MuiTab-root.Mui-selected': {
              color: APP_COLOR,
            },
          }}
        >
          <Tab
            sx={{
              color: 'white',
              textTransform: 'none',
              fontFamily: 'Medium',
            }}
            label="Dashboard"
            icon={<GridViewIcon />}
            iconPosition="start"
            disableRipple
          />
          <Tab
            sx={{
              color: 'white',
              textTransform: 'none',
              fontFamily: 'Medium',
            }}
            label="Mentors"
            icon={<PeopleOutlineIcon />}
            iconPosition="start"
            disableRipple
          />
          <Tab
            sx={{
              color: 'white',
              textTransform: 'none',
              fontFamily: 'Medium',
            }}
            label="My Meetings"
            iconPosition="start"
            disableRipple
          />
          <Tab
            sx={{
              color: 'white',
              textTransform: 'none',
              fontFamily: 'Medium',
            }}
            label="Profile"
            icon={<PermIdentityIcon />}
            iconPosition="start"
            disableRipple
          />

          <Tab
            sx={{
              color: 'white',
              textTransform: 'none',
              fontFamily: 'Medium',
            }}
            label="Calendar"
            icon={<CalendarMonthIcon />}
            iconPosition="start"
            disableRipple
          />
        </Tabs>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {value === DashboardView &&
          (isShowSearch ? (
            <SearchResult
              setIsShowSearch={setIsShowSearch}
              searchData={searchData}
            />
          ) : (
            <LandingPage setvalue={setvalue} />
          ))}

        {value === MentorView && <MentorsPage setvalue={setvalue} />}
        {value === MyMeetings && <MyMeetingsPage />}
        {value === ScheduleMeeting && <Fullcalender />}
      </Box>

      <Menu
        sx={{ mt: '45px' }}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        // keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
      <QuickTour
        isOpenQuickTour={isOpenQuickTour}
        setIsOpenQuickTour={setIsOpenQuickTour}
      />
    </Box>
  );
};

export default Dashboard;
