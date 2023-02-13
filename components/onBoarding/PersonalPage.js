import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { genderOptions } from '../../constant/mockData';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import {
  DEMOGRAPHY_API_KEY,
  DEMOGRAPHY_BASE_URL,
  FACEBOOK_ICON,
  INSTAGRAM_ICON,
  LINKDIN_ICON,
  LINK_ICON,
  TWITTER_ICON,
} from '../../libs/config';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Please enter your first name')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for first name '),
  lastName: Yup.string()
    .required('Please enter your last name')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for last name '),
  dob: Yup.string().required('please enter Date of Birth'),
  gender: Yup.string().required('please enter gender').nullable(false),
});

export const socialMenuItems = [
  { value: 'Facebook', icon: FACEBOOK_ICON },
  { value: 'Instagram', icon: INSTAGRAM_ICON },
  { value: 'Twitter', icon: TWITTER_ICON },
];

// const convertDate = (inputFormat) => {
//   function pad(s) {
//     return s < 10 ? '0' + s : s;
//   }
//   const d = new Date(inputFormat);
//   return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
// };

const PersonalPage = (props) => {
  const { handleNextPage, onBoardingState, setOnBoardingState } = props;

  const [demographyData, setDemographyData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState();

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuitem, setMenuitem] = useState([
    { value: 'Linkedin', icon: LINKDIN_ICON },
    { value: 'Website', icon: LINK_ICON },
  ]);

  const formik = useFormik({
    initialValues: {
      firstName: onBoardingState.personalDetail?.firstName,
      lastName: onBoardingState.personalDetail?.lastName,
      bio: onBoardingState.personalDetail?.bio,
      dob: onBoardingState.personalDetail?.dob,
      gender: onBoardingState.personalDetail?.gender,
      country: onBoardingState.personalDetail?.country,
      state: onBoardingState.personalDetail?.state,
      city: onBoardingState.personalDetail?.city,
      facebookUrl: onBoardingState.personalDetail?.facebookUrl,
      linkedinUrl: onBoardingState.personalDetail?.linkedinUrl,
      twitterUrl: onBoardingState.personalDetail?.twitterUrl,
      customUrl: onBoardingState.personalDetail?.customUrl,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,

    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      setOnBoardingState((preState) => ({
        ...preState,
        personalDetail: { ...values },
      }));

      handleNextPage();
    },
  });

  useEffect(() => {
    reqForDemography(DEMOGRAPHY_BASE_URL, 'countries');
  }, []);

  const reqForDemography = async (url, key, defaultval) => {
    try {
      const req = await axios.get(url, {
        headers: {
          'X-CSCAPI-KEY': DEMOGRAPHY_API_KEY,
        },
      });
      const value = await req.data;

      setDemographyData((prvstat) => ({
        ...prvstat,
        [key]: value?.length <= 0 ? [defaultval] : value,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="end" mt="10px">
          <Box textAlign="end">
            <Typography component="body1" fontFamily="Medium">
              1 of 3
            </Typography>
            <LinearProgress
              variant="determinate"
              value={33}
              sx={{
                borderRadius: '5px',
                width: '130px',
                backgroundColor: '#eeeeee',
              }}
            />
          </Box>
        </Grid>

        <Box>
          <Typography variant="h6" component="h2" fontFamily="Bold">
            Personal Details
          </Typography>
          <Grid container rowspacing={1} columnSpacing={3} mt="20px">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                First Name*
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter first name"
                variant="outlined"
                inputProps={{ style: { fontFamily: 'Medium' } }}
                size="small"
                name="firstName"
                onChange={formik.handleChange}
                defaultValue={formik.values.firstName}
                error={formik.errors?.firstName}
                helperText={formik.errors?.firstName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                Last Name*
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter last name"
                size="small"
                inputProps={{ style: { fontFamily: 'Medium' } }}
                variant="outlined"
                name="lastName"
                onChange={formik.handleChange}
                defaultValue={formik.values.lastName}
                error={formik.errors?.lastName}
                helperText={formik.errors?.lastName}
              />
            </Grid>
          </Grid>

          <Grid container rowspacing={1} columnSpacing={3} mt="15px">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                Date of Birth*
              </Typography>
              <DatePicker
                openTo="year"
                clearable
                disableFuture
                views={['year', 'month', 'day']}
                PopperProps={{
                  disablePortal: true,
                  modifiers: {
                    name: 'preventOverflow',
                    enabled: true,
                    options: {
                      altAxis: true,
                    },
                  },
                }}
                inputFormat="dd/MM/yyyy"
                placeholder="Make selection"
                value={
                  // formik.values?.dob
                  // moment(formik.values?.dob).toDate()
                  new Date(
                    formik.values?.dob?.replace(/(\d+[/])(\d+[/])/, '$2$1')
                  )
                }
                onChange={(val) => {
                  // formik.setFieldValue('dob', val?.toISOString());

                  formik.setFieldValue('dob', moment(val).format('DD/MM/YYYY'));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    fullWidth
                    inputProps={{
                      ...params.inputProps,
                      style: { fontFamily: 'Medium' },
                    }}
                    error={formik.errors?.dob}
                    helperText={formik.errors?.dob}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                Gender*
              </Typography>
              <Autocomplete
                fullWidth
                options={genderOptions}
                popupIcon={<KeyboardArrowDownIcon />}
                defaultValue={formik.values.gender}
                onChange={(e, val) => formik.setFieldValue('gender', val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Make selection"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontFamily: 'Medium' },
                    }}
                    size="small"
                    error={formik.errors?.gender}
                    helperText={formik.errors?.gender}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="body2" mt="15px" mb="5px" fontFamily="Medium">
            About Yourself
          </Typography>

          <TextField
            multiline
            inputProps={{ maxLength: 1000 }}
            fullWidth
            rows={5}
            name="bio"
            defaultValue={formik.values.bio}
            onChange={formik.handleChange}
          />

          <Grid container rowspacing={1} columnSpacing={3} mt="15px">
            <Grid item xs={12} md={4}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                Select Country
              </Typography>
              <Autocomplete
                fullWidth
                options={
                  demographyData.countries === undefined
                    ? []
                    : demographyData.countries
                }
                getOptionLabel={(option) => option?.name}
                popupIcon={<KeyboardArrowDownIcon />}
                onChange={(event, item) => {
                  reqForDemography(
                    `${DEMOGRAPHY_BASE_URL}/${item?.iso2}/states`,
                    'states',
                    item
                  );
                  setSelectedCountry(item);
                  formik.setFieldValue('country', item.name);
                }}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Make selection"
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                State
              </Typography>
              <Autocomplete
                fullWidth
                options={
                  demographyData?.states === undefined
                    ? []
                    : demographyData.states
                }
                loading={demographyData.states !== undefined}
                popupIcon={<KeyboardArrowDownIcon />}
                loadingText="Loading..."
                noOptionsText={'Please select country'}
                getOptionLabel={(option) => option?.name}
                onChange={(event, item) => {
                  reqForDemography(
                    `${DEMOGRAPHY_BASE_URL}/${selectedCountry?.iso2}/states/${item?.iso2}/cities`,
                    'city',
                    item
                  );

                  formik.setFieldValue('state', item.name);
                }}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Make selection"
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                City
              </Typography>
              <Autocomplete
                fullWidth
                options={
                  demographyData?.city === undefined ? [] : demographyData.city
                }
                loading={demographyData.city !== undefined}
                popupIcon={<KeyboardArrowDownIcon />}
                loadingText="Loading..."
                noOptionsText={'Please select state'}
                getOptionLabel={(option) => option?.name}
                onChange={(event, item) => {
                  formik.setFieldValue('city', item.name);
                }}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Make selection"
                    size="small"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt="20px">
          <Typography variant="h6" component="span" fontFamily="Bold">
            Socials{' '}
            <KeyboardArrowDownIcon
              sx={{ verticalAlign: 'middle' }}
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
              }}
            />
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {socialMenuItems.map((item, index) => (
              <MenuItem
                sx={{ width: '170px' }}
                onClick={() => {
                  setMenuitem([...menuitem, item]);
                  setAnchorEl(null);
                }}
                key={index}
                disableRipple
                fontFamily="Medium"
              >
                <img src={item.icon} style={{ marginRight: '10px' }} />
                {item.value}
                <AddCircleOutlineIcon
                  sx={{
                    color: '#5c89fc',
                    ml: '120px',
                    position: 'absolute',
                  }}
                />
              </MenuItem>
            ))}
          </Menu>

          {menuitem.map((val, index) => (
            <TextField
              key={index}
              multiline
              size="small"
              placeholder={`${val.value} Url`}
              sx={{ mt: '10px' }}
              onChange={(e) =>
                formik.setFieldValue(
                  `${val.value.toLowerCase()}Url`,
                  e.target.value
                )
              }
              fullWidth
              inputProps={{ style: { fontFamily: 'Medium' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={val.icon} />
                  </InputAdornment>
                ),
              }}
            />
          ))}
        </Box>

        <Grid container justifyContent="end" mt="20px" mb="20px">
          <Button
            variant="contained"
            // onClick={handleNextPage}
            type="submit"
            sx={{ textTransform: 'none', fontFamily: 'Medium' }}
          >
            Continue
          </Button>
        </Grid>
      </form>
    </FormikProvider>
  );
};

export default PersonalPage;
