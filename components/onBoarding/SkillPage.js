import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  daysOptions,
  ExpertiseOptions,
  SkillsOptions,
  timesArry,
  timeZoneArry,
} from '../../constant/mockData';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';

import { DatePicker } from '@mui/x-date-pickers';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { BASE_URL } from '../../libs/config';
import Router from 'next/router';

const validationSchema = Yup.object().shape({
  timezone: Yup.string().required().min(1, 'please enter timezone'),
  availableTimeSlotsList: Yup.array()
    .of(
      Yup.object().shape({
        day: Yup.string(),
        timeSlots: Yup.array().min(1, 'please select any time'),
      })
    )
    .min(1, 'please select any day'),
});

const convertToMonth = (inputFormat) => {
  function pad(s) {
    return s < 10 ? '0' + s : s;
  }
  const d = new Date(inputFormat);
  return [pad(d.getMonth() + 1), d.getFullYear()].join('/');
};

const convertMonthDate = (inputFormat) => {
  if (inputFormat === undefined) return null;
  const d = inputFormat.split('/');
  return new Date(d[2] + '/' + d[1] + '/' + d[0]);
};

const SkillPage = (props) => {
  const { onBoardingState, setOnBoardingState, handlePreviousPage } = props;

  const formik = useFormik({
    initialValues: {
      skillsList:
        onBoardingState?.skillsList === undefined
          ? []
          : onBoardingState?.skillsList,
      expertisesList:
        onBoardingState?.expertisesList === undefined
          ? []
          : onBoardingState?.expertisesList,
      timezone: onBoardingState?.timezone,
      userCertificationsList:
        onBoardingState?.userCertificationsList === undefined
          ? [{}]
          : onBoardingState?.userCertificationsList,
      availableTimeSlotsList:
        onBoardingState?.availableTimeSlotsList === undefined
          ? []
          : onBoardingState?.availableTimeSlotsList,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
    onSubmit: (values) => {
      values.userCertificationsList =
        values.userCertificationsList?.length > 0 &&
        Object.keys(values.userCertificationsList[0]).length === 0
          ? []
          : [...values.userCertificationsList];

      // const copyvalue = { ...values };

      sendOnBoardingData(values);
    },
  });

  const handlePreviousBtnClick = () => {
    const values = formik.values;
    setOnBoardingState((preState) => ({
      ...preState,
      ...values,
    }));
    handlePreviousPage();
  };

  const sendOnBoardingData = async (values) => {
    // const dumyarry = values.availableTimeSlotsList?.map((item) => {
    //   const obj = [...item.timeSlots];
    //   return { timeSlots: obj };
    // });
    delete values.timezone;

    try {
      await axios.post(
        `${BASE_URL}/user/${sessionStorage.getItem('role')}`,
        {
          ...onBoardingState,
          ...values,
          // availableTimeSlotsList: dumyarry,
          email: sessionStorage.getItem('email'),
        },
        {
          headers: {
            Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );

      Router.push('/dashboard');
    } catch (e) {
      if (e.response.status === 409) {
        Router.push('/dashboard');
      }
      console.error(' error ', e);
    }
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="end" mt="10px">
          <Box textAlign="end">
            <Typography component="body1">3 of 3</Typography>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                borderRadius: '5px',
                width: '130px',
                backgroundColor: '#eeeeee',
              }}
            />
          </Box>
        </Grid>

        <Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: '600' }}>
            Skill Details
          </Typography>
          <Box mt="10px">
            <Typography variant="body2" mb="5px">
              Select Your Area of Expertise
            </Typography>

            <Autocomplete
              multiple
              fullWidth
              options={ExpertiseOptions}
              forcePopupIcon
              freeSolo
              popupIcon={<KeyboardArrowDownIcon />}
              filterSelectedOptions
              defaultValue={formik.values.expertisesList}
              onChange={(e, val) => formik.setFieldValue('expertisesList', val)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="filled"
                    key={index}
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Make a Selection"
                  size="small"
                  error={formik.errors?.expertisesList}
                  helperText={formik.errors?.expertisesList}
                />
              )}
            />

            <Typography variant="body2" mt="20px" mb="5px">
              Choose Skills
            </Typography>

            <Autocomplete
              multiple
              fullWidth
              options={SkillsOptions}
              forcePopupIcon
              freeSolo
              popupIcon={<KeyboardArrowDownIcon />}
              filterSelectedOptions
              defaultValue={formik.values.skillsList}
              onChange={(e, val) => formik.setFieldValue('skillsList', val)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="filled"
                    key={index}
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Make a Selection"
                  size="small"
                  error={formik.errors?.skillsList}
                  helperText={formik.errors?.skillsList}
                />
              )}
            />
          </Box>
        </Box>

        <Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: '600' }}
            mt="20px"
          >
            Certifications
          </Typography>
          <FieldArray
            name="userCertificationsList"
            render={(arrayHelpers) => (
              <>
                <Box mt="10px">
                  {formik.values.userCertificationsList.map(
                    (arryitem, index) => (
                      <>
                        {index >= 1 && (
                          <CloseIcon
                            sx={{
                              float: 'right',
                              mt: '7px',
                              cursor: 'pointer',
                            }}
                            onClick={() => arrayHelpers.remove(index)}
                          />
                        )}
                        <Grid container spacing={1} sx={{ mt: '7px' }}>
                          <Grid item xs={12} md={5}>
                            <Typography variant="body2" mb="5px">
                              Certification Name
                            </Typography>
                            <TextField
                              fullWidth
                              name={`userCertificationsList[${index}].certificationName`}
                              placeholder="Certification Name"
                              value={
                                formik.values.userCertificationsList[index]
                                  ?.certificationName
                              }
                              size="small"
                              onChange={formik.handleChange}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" mb="5px">
                              Expiry Date
                            </Typography>

                            <DatePicker
                              views={['month', 'year']}
                              name={`userCertificationsList[${index}].certificationValidTill`}
                              placeholder="Expiry Date"
                              value={convertMonthDate(
                                formik.values.userCertificationsList[index]
                                  ?.certificationValidTill
                              )}
                              onChange={(val) =>
                                formik.setFieldValue(
                                  `userCertificationsList[${index}].certificationValidTill`,
                                  convertToMonth(val)
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  helperText={null}
                                  size="small"
                                  inputProps={{
                                    ...params.inputProps,
                                    placeholder: 'mm/yyyy',
                                  }}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" mb="5px">
                              URL
                            </Typography>
                            <TextField
                              fullWidth
                              name={`userCertificationsList[${index}].certificationUrl`}
                              placeholder="Enter url"
                              value={
                                formik.values.userCertificationsList[index]
                                  ?.certificationUrl
                              }
                              onChange={formik.handleChange}
                              size="small"
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </>
                    )
                  )}
                </Box>

                <Grid
                  container
                  mt="7px"
                  alignItems="center"
                  justifyContent="end"
                >
                  <AddCircleOutlineIcon sx={{ color: '#5c89fc' }} />
                  <Typography
                    variant="body2"
                    component="span"
                    onClick={() => arrayHelpers.push({})}
                    ml="3px"
                    sx={{ color: '#5c89fc', cursor: 'pointer' }}
                  >
                    Add More
                  </Typography>
                </Grid>
              </>
            )}
          />
        </Box>

        <Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: '600' }}
            mt="10px"
          >
            Avaliablity
          </Typography>

          <Box mt="10px">
            <Typography variant="body2" mb="5px">
              Select Time Zone*
            </Typography>

            <Autocomplete
              onChange={(e, val) => formik.setFieldValue('timezone', val)}
              fullWidth
              options={timeZoneArry}
              defaultValue={formik.values.timezone}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Make a Selection"
                  size="small"
                  error={formik.errors?.timezone}
                  helperText={formik.errors?.timezone}
                />
              )}
            />

            <FieldArray
              name="availableTimeSlotsList"
              render={(arrayHelpers, index) => (
                <>
                  <Typography variant="body2" mt="20px" mb="5px">
                    Choose Days You Are Avaliable For Mentoring*
                  </Typography>

                  <Autocomplete
                    multiple
                    fullWidth
                    options={daysOptions}
                    value={formik.values.availableTimeSlotsList.map(
                      (item) => item.day
                    )}
                    onChange={(e, val, reason) => {
                      if (reason === 'selectOption') {
                        arrayHelpers.push({ day: val[val.length - 1] });
                      } else if (reason === 'removeOption') {
                        arrayHelpers.remove(
                          val.findIndex(
                            (item, index) =>
                              formik.values.availableTimeSlotsList[index]
                                .day !== item
                          )
                        );
                      }
                    }}
                    filterSelectedOptions
                    popupIcon={<KeyboardArrowDownIcon />}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Make a Selection"
                        size="small"
                        error={formik.errors?.availableTimeSlotsList}
                        helperText={formik.errors?.availableTimeSlotsList}
                      />
                    )}
                  />

                  {formik.values.availableTimeSlotsList.map((arryitem, i) => (
                    <Grid
                      container
                      spacing={2}
                      key={i}
                      mt="7px"
                      mb="15px"
                      alignItems="center"
                    >
                      <Grid item xs={2}>
                        <Typography
                          variant="body2"
                          py="8px"
                          textAlign="center"
                          sx={{
                            border: '1px solid #5c89fc',
                            borderRadius: '5px',
                          }}
                        >
                          {arryitem.day?.slice(0, 3).toUpperCase()}
                        </Typography>
                      </Grid>

                      <Grid item xs={10}>
                        <Autocomplete
                          multiple
                          fullWidth
                          options={timesArry}
                          filterSelectedOptions
                          value={
                            formik.values.availableTimeSlotsList?.[i]?.timeSlots
                          }
                          onChange={(e, val) =>
                            formik.setFieldValue(
                              `availableTimeSlotsList.${i}.timeSlots`,
                              val.map((item, index) => (item = `${val[index]}`))
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select time slot"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </>
              )}
            />
          </Box>
        </Box>

        <Grid
          container
          justifyContent="space-between"
          sx={{ mt: '40px', mb: '20px' }}
        >
          <Button
            variant="contained"
            sx={{ minWidth: '50px', padding: '0px' }}
            onClick={handlePreviousBtnClick}
          >
            <ArrowBackIosNewIcon />
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{ textTransform: 'none', fontFamily: 'Medium' }}
          >
            Save
          </Button>
        </Grid>
      </form>
    </FormikProvider>
  );
};

export default SkillPage;
