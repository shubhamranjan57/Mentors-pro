import {
  Autocomplete,
  Box,
  Button,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import { React } from 'react';
import {
  CollegeOptions,
  CompanyOptions,
  QualificationOptions,
  RoleOptions,
  SpecializationOptions,
} from '../../constant/mockData';
import { DatePicker } from '@mui/x-date-pickers';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const validationSchema = Yup.object().shape({
  // educationalDetailsList: Yup.array().of(
  //   Yup.object().shape({
  qualification: Yup.string()
    .required('Please enter your Highest Qualification')
    .nullable(false),
  institute: Yup.string()
    .required('Please enter your institute')
    .nullable(false),
  specialization: Yup.string()
    .required('Please enter your Specialization')
    .nullable(false),
  startingYear: Yup.string().required('please enter startingYear'),
  //   })
  // ),
});

const convertDate = (inputFormat) => {
  function pad(s) {
    return s < 10 ? '0' + s : s;
  }
  const d = new Date(inputFormat);

  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
};

const EducationalPage = (props) => {
  const {
    handleNextPage,
    onBoardingState,
    setOnBoardingState,
    handlePreviousPage,
  } = props;

  const formik = useFormik({
    initialValues: {
      institute: onBoardingState.educationalDetailsList?.[0]?.institute,
      instituteCity: onBoardingState.educationalDetailsList?.[0]?.instituteCity,
      passingYear: onBoardingState.educationalDetailsList?.[0]?.passingYear,
      qualification: onBoardingState.educationalDetailsList?.[0]?.qualification,
      rankOfQualification: 1,
      specialization:
        onBoardingState.educationalDetailsList?.[0]?.specialization,
      startingYear: onBoardingState.educationalDetailsList?.[0]?.startingYear,
      professionalDetailsRequestList:
        onBoardingState?.professionalDetailsRequestList === undefined
          ? []
          : onBoardingState?.professionalDetailsRequestList,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      setOnBoardingState((preState) => ({
        ...preState,
        professionalDetailsRequestList:
          values.professionalDetailsRequestList?.length > 0 &&
          Object.keys(values.professionalDetailsRequestList[0]).length === 0
            ? []
            : [...values.professionalDetailsRequestList],
        educationalDetailsList: [
          {
            institute: values.institute,
            instituteCity: values.instituteCity,
            rankOfQualification: 1,
            passingYear: values.passingYear,
            qualification: values.qualification,
            specialization: values.specialization,
            startingYear: values.startingYear,
          },
        ],
      }));

      handleNextPage();
    },
  });

  const handlePreviousBtnClick = () => {
    const values = formik.values;
    setOnBoardingState((preState) => ({
      ...preState,
      professionalDetailsRequestList: [
        ...values.professionalDetailsRequestList,
      ],
      educationalDetailsList: [
        {
          institute: values.institute,
          instituteCity: values.instituteCity,
          passingYear: values.passingYear,
          rankOfQualification: 1,
          qualification: values.qualification,
          specialization: values.specialization,
          startingYear: values.startingYear,
        },
      ],
    }));
    handlePreviousPage();
  };
  // const [show, setShow] = useState(true);

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="end" mt="10px">
          <Box textAlign="end">
            <Typography component="body1" fontFamily="Medium">
              2 of 3
            </Typography>
            <LinearProgress
              variant="determinate"
              value={66}
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
            Educational Details
          </Typography>

          <Grid container rowspacing={1} columnSpacing={3} mt="20px">
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                mt="20px"
                mb="5px"
                fontFamily="Medium"
              >
                Highest Qualification*
              </Typography>
              <Autocomplete
                fullWidth
                freeSolo
                popupIcon={<KeyboardArrowDownIcon />}
                forcePopupIcon={true}
                defaultValue={formik.values?.qualification}
                onChange={(e, val) => {
                  formik.setFieldValue('qualification', val);
                }}
                options={QualificationOptions}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      style: { fontFamily: 'Medium' },
                    }}
                    placeholder="Make selection"
                    size="small"
                    error={formik.errors?.qualification}
                    helperText={formik.errors?.qualification}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                mt="20px"
                mb="5px"
                fontFamily="Medium"
              >
                Specialization*
              </Typography>
              <Autocomplete
                fullWidth
                freeSolo
                popupIcon={<KeyboardArrowDownIcon />}
                forcePopupIcon={true}
                options={SpecializationOptions}
                defaultValue={formik.values?.specialization}
                filterSelectedOptions
                onChange={(e, val) =>
                  formik.setFieldValue('specialization', val)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      style: { fontFamily: 'Medium' },
                    }}
                    placeholder="Make selection"
                    size="small"
                    error={formik.errors?.specialization}
                    helperText={formik.errors?.specialization}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container rowspacing={1} columnSpacing={3} mt="20px">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                Institute*
              </Typography>
              <Autocomplete
                fullWidth
                freeSolo
                sx={{ mt: '5px' }}
                forcePopupIcon
                defaultValue={formik.values?.institute}
                options={CollegeOptions}
                onChange={(e, val) => formik.setFieldValue('institute', val)}
                filterSelectedOptions
                popupIcon={<KeyboardArrowDownIcon />}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Make selection"
                    size="small"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontFamily: 'Medium' },
                    }}
                    error={formik.errors?.institute}
                    helperText={formik.errors?.institute}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                Institute City
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter here"
                size="small"
                defaultValue={formik.values?.instituteCity}
                onChange={(e) => {
                  formik.setFieldValue('instituteCity', e.target.value);
                }}
                inputProps={{ style: { fontFamily: 'Medium' } }}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container rowspacing={1} columnSpacing={3} mt="20px">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                Starting Year*
              </Typography>
              <DatePicker
                disableFuture
                openTo="year"
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
                  new Date(
                    formik.values?.startingYear?.replace(
                      /(\d+[/])(\d+[/])/,
                      '$2$1'
                    )
                  )
                }
                onChange={(val) =>
                  formik.setFieldValue('startingYear', convertDate(val))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    fullWidth
                    inputProps={{
                      ...params.inputProps,
                      style: { fontFamily: 'Medium' },
                    }}
                    error={formik.errors?.startingYear}
                    helperText={formik.errors?.startingYear}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" mb="5px" fontFamily="Medium">
                Passing Year
              </Typography>
              <DatePicker
                openTo="year"
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
                  new Date(
                    formik.values?.passingYear?.replace(
                      /(\d+[/])(\d+[/])/,
                      '$2$1'
                    )
                  )
                }
                onChange={(val) =>
                  formik.setFieldValue('passingYear', convertDate(val))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontFamily: 'Medium' },
                    }}
                    error={false}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        <FieldArray
          name="professionalDetailsRequestList"
          render={(arrayHelpers) => (
            <Box mt="20px">
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="h6" component="span" fontFamily="Bold">
                    Profession Details
                  </Typography>
                </Grid>

                <Grid
                  item
                  alignItems="center"
                  mr="20px"
                  sx={{
                    cursor: 'pointer',
                    display:
                      formik.values.professionalDetailsRequestList?.length >= 1
                        ? 'none'
                        : 'block',
                  }}
                >
                  <AddCircleOutlineIcon
                    fontSize="small"
                    onClick={() => arrayHelpers.push({})}
                    sx={{ color: '#5c89fc', verticalAlign: 'middle' }}
                  />
                  <Typography
                    variant="body2"
                    component="span"
                    ml="3px"
                    mb="5px"
                    onClick={() => arrayHelpers.push({})}
                    sx={{ color: '#5c89fc' }}
                  >
                    Add
                  </Typography>
                </Grid>
              </Grid>

              {formik.values.professionalDetailsRequestList.map(
                (arryitem, index) => {
                  return (
                    <>
                      {/* <Dialog open={show}> */}
                      <DialogContent style={{ position: 'relative' }}>
                        <IconButton
                          style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                          }}
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </DialogContent>
                      {/* </Dialog> */}
                      <Grid container rowspacing={1} columnSpacing={3} mt="0px">
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body2"
                            mt="20px"
                            mb="5px"
                            fontFamily="Medium"
                          >
                            Company Name
                          </Typography>
                          <Autocomplete
                            fullWidth
                            freeSolo
                            popupIcon={<KeyboardArrowDownIcon />}
                            forcePopupIcon={true}
                            options={CompanyOptions}
                            defaultValue={arryitem?.company}
                            filterSelectedOptions
                            onChange={(e, val) =>
                              formik.setFieldValue(
                                `professionalDetailsRequestList[${index}].company`,
                                val
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  style: { fontFamily: 'Medium' },
                                }}
                                placeholder="Make selection"
                                size="small"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body2"
                            mt="20px"
                            mb="5px"
                            fontFamily="Medium"
                          >
                            Choose Your Role
                          </Typography>
                          <Autocomplete
                            fullWidth
                            freeSolo
                            popupIcon={<KeyboardArrowDownIcon />}
                            forcePopupIcon={true}
                            options={RoleOptions}
                            defaultValue={arryitem?.role}
                            filterSelectedOptions
                            onChange={(e, val) =>
                              formik.setFieldValue(
                                `professionalDetailsRequestList[${index}].role`,
                                val
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  style: { fontFamily: 'Medium' },
                                }}
                                placeholder="Make selection"
                                size="small"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        rowspacing={1}
                        columnSpacing={3}
                        mt="20px"
                      >
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body2"
                            mb="5px"
                            fontFamily="Medium"
                          >
                            Company City
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="Enter here"
                            size="small"
                            defaultValue={arryitem?.companyCity}
                            onChange={formik.handleChange}
                            inputProps={{ style: { fontFamily: 'Medium' } }}
                            name={`professionalDetailsRequestList[${index}].companyCity`}
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body2"
                            mb="5px"
                            fontFamily="Medium"
                          >
                            Company URL
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="Enter here"
                            size="small"
                            onChange={formik.handleChange}
                            defaultValue={arryitem?.companyUrl}
                            inputProps={{ style: { fontFamily: 'Medium' } }}
                            name={`professionalDetailsRequestList[${index}].companyUrl`}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        rowspacing={1}
                        columnSpacing={3}
                        mt="20px"
                      >
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body2"
                            mb="5px"
                            fontFamily="Medium"
                          >
                            Joining Date
                          </Typography>
                          <DatePicker
                            openTo="year"
                            views={['year', 'month', 'day']}
                            inputFormat="dd/MM/yyyy"
                            value={
                              new Date(
                                arryitem?.joiningDate?.replace(
                                  /(\d+[/])(\d+[/])/,
                                  '$2$1'
                                )
                              )
                            }
                            onChange={(val) =>
                              formik.setFieldValue(
                                `professionalDetailsRequestList[${index}].joiningDate`,
                                convertDate(val)
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                size="small"
                                inputProps={{
                                  ...params.inputProps,
                                  style: { fontFamily: 'Medium' },
                                }}
                                error={false}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body2"
                            mb="5px"
                            fontFamily="Medium"
                          >
                            Last Date
                          </Typography>
                          <DatePicker
                            openTo="year"
                            views={['year', 'month', 'day']}
                            inputFormat="dd/MM/yyyy"
                            value={
                              new Date(
                                arryitem?.leavingDate?.replace(
                                  /(\d+[/])(\d+[/])/,
                                  '$2$1'
                                )
                              )
                            }
                            disabled={arryitem?.iscurrentCompany}
                            onChange={(val) =>
                              formik.setFieldValue(
                                `professionalDetailsRequestList[${index}].leavingDate`,
                                convertDate(val)
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                size="small"
                                inputProps={{
                                  ...params.inputProps,
                                  style: { fontFamily: 'Medium' },
                                }}
                                error={false}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>

                      {/* <FormControlLabel
                        control={<Checkbox />}
                        sx={{ mt: '10px' }}
                        onChange={(e) => {
                          formik.setFieldValue(
                            `professionalDetailsRequestList[${index}].iscurrentCompany`,
                            e.target.checked
                          );
                          formik.setFieldValue(
                            `professionalDetailsRequestList[${index}].leavingDate`,
                            null
                          );
                        }}
                        label={
                          <Typography fontFamily="Medium">
                            Check if this is your current company
                          </Typography>
                        }
                      /> */}
                    </>
                  );
                }
              )}

              {formik.values.professionalDetailsRequestList?.length >= 1 && (
                <Grid
                  container
                  mt="7px"
                  alignItems="center"
                  justifyContent="end"
                >
                  <AddCircleOutlineIcon
                    sx={{ color: '#5c89fc' }}
                    onClick={() => arrayHelpers.push({})}
                  />
                  <Typography
                    variant="body2"
                    component="span"
                    ml="3px"
                    onClick={() => arrayHelpers.push({})}
                    sx={{ color: '#5c89fc', cursor: 'pointer' }}
                  >
                    Add More
                  </Typography>
                </Grid>
              )}
            </Box>
          )}
        />

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
            // onClick={handleNextPage}
            sx={{ textTransform: 'none', fontFamily: 'Medium' }}
          >
            Continue
          </Button>
        </Grid>
      </form>
    </FormikProvider>
  );
};

export default EducationalPage;
