import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker, TimePicker } from '@mui/x-date-pickers';

const availabilities = [
  {
    startTime: '2022-01-01 01:00:00.0',
    endTime: '2022-01-01 02:00:00.0',
  },
  {
    startTime: '2022-01-01 02:00:00.0',
    endTime: '2022-01-01 03:00:00.0',
  },
  {
    startTime: '2022-01-01 03:00:00.0',
    endTime: '2022-01-01 04:00:00.0',
  },
  {
    startTime: '2022-10-21 05:00:00.0',
    endTime: '2022-01-01 06:00:00.0',
  },
];

const calendarEvents = [
  {
    startTime: '1970-01-01 00:00:01.0',
    endTime: '1971-01-01 01:00:01.0',
    meetingStatus: 'PENDING',
    title: 'Meeting1',
    description: 'Java advanced class',
  },
  {
    startTime: '2009-10-11 4:00:00.0',
    endTime: '2020-10-12 5:00:00.0',
    meetingStatus: 'CONFIRMED',
    title: 'Meeting 4',
    description: 'Dijkistra Algorithm',
  },
  {
    startTime: '2010-01-01 6:00:00.0',
    endTime: '2010-01-01 7:00:00.0',
    meetingStatus: 'CONFIRMED',
    title: 'Meeting3',
    description: 'Kubernetes session',
  },
];

const Customcalender = () => {
  const [date, setDate] = useState(new Date());
  const [timesArry, setTimesArry] = useState({});
  const [tvData, setTvData] = useState({
    title: '',
    starttime: null,
    endtime: null,
  });
  const [error, setError] = useState({});

  useEffect(() => {
    changeAvailabilities();
  }, []);

  const changeAvailabilities = () => {
    const startarry = [];
    const endarry = [];

    availabilities.forEach((item) => {
      startarry.push(new Date(item.startTime));
      endarry.push(new Date(item.endTime));
    });
    setTimesArry({ starttimeArry: startarry, endtimeArry: endarry });
  };

  const handleConfirmClick = () => {
    if (tvData.title === undefined || tvData.title.lenght <= 0)
      setError({ ...error, titleError: 'please enter title' });
    else if (tvData.starttime == null)
      setError({ ...error, startError: 'please enter start time' });
    else if (tvData.endtime == null)
      setError({ ...error, endError: 'please enter end time' });
    else if (tvData.starttime != null || tvData.endtime != null) {
      const errorstr = {};
      errorstr.startError = 'please select between available time';

      timesArry.starttimeArry.forEach((item, index) => {
        const currenthour = tvData.starttime.getHours();
        const starthour = item.getHours();
        const endhour = timesArry.endtimeArry[index].getHours();

        if (
          starthour <= currenthour &&
          endhour >= currenthour &&
          tvData.endtime?.getHours() > currenthour
        ) {
          errorstr.startError = '';
        }
      });

      errorstr.endError = 'please select between available time';
      timesArry.starttimeArry.forEach((item, index) => {
        const currenthour = tvData.endtime.getHours();
        const starthour = item.getHours();
        const endhour = timesArry.endtimeArry[index].getHours();

        if (
          starthour <= currenthour &&
          endhour >= currenthour &&
          tvData.starttime.getHours() < currenthour
        ) {
          errorstr.endError = '';
        }
      });

      setError({ ...error, ...errorstr });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ backgroundColor: '#e7ebf0', height: '100vh' }}>
        <Grid
          container
          // spacing={4}
          justifyContent="space-evenly"
          height="100vh"
          alignItems="center"
        >
          <Grid item xs={3}>
            <Box backgroundColor="white">
              <CalendarPicker
                disablePast
                date={date}
                onChange={(newDate) => setDate(newDate)}
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h6">
                  Available time
                  <Typography variant="caption"> (24h)</Typography>
                </Typography>
                <Typography variant="caption">
                  (click on view to select time)
                </Typography>
                <Grid
                  container
                  direction="column"
                  minHeight="100px"
                  maxHeight="220px"
                  width="200px"
                  sx={{ overflowY: 'auto' }}
                >
                  {timesArry?.starttimeArry?.map((item, index) => {
                    return (
                      <Chip
                        label={`${item.getHours()}:00 to ${timesArry?.endtimeArry[
                          index
                        ].getHours()}:00`}
                        variant="outlined"
                        key={index}
                        sx={{ mt: '10px', width: '200px' }}
                        onClick={() => {
                          setTvData({
                            starttime: item,
                            endtime: timesArry?.endtimeArry[index],
                          });
                        }}
                      />
                    );
                  })}
                </Grid>
              </Grid>

              <Grid item mt="20px">
                <Typography variant="h6">
                  Booked time
                  <Typography variant="caption"> (24h)</Typography>
                </Typography>
                <Grid
                  container
                  direction="column"
                  minHeight="100px"
                  maxHeight="220px"
                  width="200px"
                  sx={{ overflowY: 'auto' }}
                >
                  {calendarEvents.map(
                    (item, i) =>
                      item.meetingStatus === 'CONFIRMED' && (
                        <Chip
                          label={`${new Date(
                            item.startTime
                          ).getHours()}:00 to ${new Date(
                            item.endTime
                          ).getHours()}:00`}
                          sx={{ mt: '10px', width: '200px' }}
                          key={i}
                          color="success"
                        />
                      )
                  )}
                </Grid>
              </Grid>

              <Grid item mt="20px">
                <Typography variant="h6">
                  Pending Meeting time
                  <Typography variant="caption"> (24h)</Typography>
                </Typography>
                <Grid
                  container
                  direction="column"
                  minHeight="100px"
                  maxHeight="220px"
                  width="200px"
                  sx={{ overflowY: 'auto' }}
                >
                  {calendarEvents.map(
                    (item, i) =>
                      item.meetingStatus === 'PENDING' && (
                        <Chip
                          label={`${new Date(
                            item.startTime
                          ).getHours()}:00 to ${new Date(
                            item.endTime
                          ).getHours()}:00`}
                          sx={{ mt: '10px', width: '200px' }}
                        />
                      )
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={3}
            style={{ paddingLeft: '20px', paddingRight: '20px' }}
          >
            <Typography variant="h6" mb="10px">
              Schedule a Meeting
            </Typography>

            <TextField
              label="Enter Meeting Title*"
              size="small"
              fullWidth
              onChange={(e) => {
                setTvData({ ...tvData, title: e.target.value });
                setError({ ...error, titleError: '' });
              }}
              error={error?.titleError}
              helperText={error?.titleError}
            />
            <TextField
              label="Enter Meeting Description"
              fullWidth
              rows={5}
              multiline
              size="small"
              sx={{ mt: '20px' }}
              onChange={(e) => {
                setTvData({ ...tvData, description: e.target.value });
              }}
            />

            <TimePicker
              label="Start Time*"
              value={tvData.starttime}
              ampm={false}
              views={['hours']}
              inputFormat="HH:mm"
              onChange={(newValue) => {
                setTvData({ ...tvData, starttime: newValue });
                setError({ ...error, startError: null });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ mt: '20px' }}
                  fullWidth
                  error={error?.startError}
                  helperText={error?.startError}
                />
              )}
            />

            <TimePicker
              label="End Time*"
              value={tvData.endtime}
              views={['hours']}
              ampm={false}
              disabled={tvData.starttime == null}
              inputFormat="HH:mm"
              onChange={(newValue) => {
                setTvData({ ...tvData, endtime: newValue });
                setError({ ...error, endError: null });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  sx={{ mt: '20px' }}
                  error={error?.endError}
                  helperText={error?.endError}
                />
              )}
            />

            <Button
              variant="contained"
              sx={{ mt: '20px', float: 'right' }}
              onClick={handleConfirmClick}
              // disabled={!isConfirm}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Customcalender;
