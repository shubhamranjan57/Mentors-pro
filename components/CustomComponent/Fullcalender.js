import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box,
  Button,
  Checkbox,
  Fade,
  FormControlLabel,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../../libs/config';
import { DateTimePicker } from '@mui/x-date-pickers';

const localizer = momentLocalizer(moment);

const availabilities = [
  {
    start: new Date('2022-07-22 01:00:00.0'),
    end: new Date('2022-07-22 03:00:00.0'),
    aaa: true,
  },
  {
    start: new Date('2022-07-22 05:00:00.0'),
    end: new Date('2022-07-22 10:00:00.0'),
    aaa: true,
  },
];

const calendarEvents = [
  {
    start: new Date('2022-07-22 08:00:01.0'),
    end: new Date('2022-07-22 10:00:01.0'),
    meetingStatus: 'PENDING',
    title: 'Meeting1',
    description: 'Java advanced class',
  },
  {
    start: new Date('2022-07-22 02:00:01.0'),
    end: new Date('2022-07-22 03:00:01.0'),
    meetingStatus: 'CONFIRMED',
    title: 'Meeting 4',
    description: 'Dijkistra Algorithm',
  },
  {
    start: new Date('2022-07-22 06:00:01.0'),
    end: new Date('2022-07-22 07:00:01.0'),
    meetingStatus: 'CONFIRMED',
    title: 'Meeting3',
    description: 'Kubernetes session',
  },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign: 'center',
  pt: 2,
  px: 4,
  pb: 3,
};

const getDayWithDate = (date, weekStartDate, dayindex) => {
  const customdate = new Date(`${date}`);
  return new Date(
    moment(weekStartDate)
      .add(dayindex, 'days')
      .toDate()
      .setHours(customdate.getHours() - 5, customdate.getMinutes() - 30)
  );
};

const Fullcalender = () => {
  const [selectedSlot, setSelectedSlot] = useState();
  const [events, setEvents] = useState(calendarEvents);
  const [availableEvents, setAvailableEvents] = useState(availabilities);
  // const [data, setdata] = useState(calendarEvents);

  const [tvData, setTvData] = useState({});
  const [error, setError] = useState();
  const [isMeetingLink, setIsMeetingLink] = useState(true);

  useEffect(() => {
    const fetchCalenderData = async () => {
      try {
        const req = await axios.get(
          `${BASE_URL}/calendar/?endDate=${moment(
            moment().endOf('week').toDate()
          )
            .format('DD/MM/YYYY HH:mm')
            .toString()}&startDate=${moment(moment().startOf('week').toDate())
            .format('DD/MM/YYYY HH:mm')
            .toString()}`,

          {
            headers: {
              Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
              email: sessionStorage.getItem('email'),
            },
          }
        );

        const startingDate = moment().startOf('week');
        // const days = [];
        // for (let i = 0; i <= 6; i++) {
        // days.push(moment(startingDate).add(i, 'days').toDate());
        // }

        const avlties = req.data.availabilities.map(function (obj) {
          // console.log('>>>>>>>>>>>>>>>>>>>', days);

          if (obj.day === 'Sunday') {
            obj.start = getDayWithDate(obj.startTime, startingDate, 0);
            obj.end = getDayWithDate(obj.endTime, startingDate, 0);
          } else if (obj.day === 'Monday') {
            obj.start = getDayWithDate(obj.startTime, startingDate, 1);
            obj.end = getDayWithDate(obj.endTime, startingDate, 1);
          } else if (obj.day === 'Tuesday') {
            obj.start = getDayWithDate(obj.startTime, startingDate, 2);
            obj.end = getDayWithDate(obj.endTime, startingDate, 2);
          } else if (obj.day === 'Wednesday') {
            obj.start = getDayWithDate(obj.startTime, startingDate, 3);
            obj.end = getDayWithDate(obj.endTime, startingDate, 3);
          } else if (obj.day === 'Thursday') {
            obj.start = getDayWithDate(obj.startTime, startingDate, 4);
            obj.end = getDayWithDate(obj.endTime, startingDate, 4);
          } else if (obj.day === 'Friday') {
            obj.start = getDayWithDate(obj.startTime, startingDate, 5);
            obj.end = getDayWithDate(obj.endTime, startingDate, 5);
          } else if (obj.day === 'Saturday') {
            obj.start = getDayWithDate(obj.startTime, startingDate, 6);
            obj.end = getDayWithDate(obj.endTime, startingDate, 6);
          }

          // obj.start = obj.startTime;
          delete obj.startTime;
          // obj.end = obj.endTime;
          delete obj.endTime;
          return obj;
        });

        const calEvents = req.data.calendarEvents.map(function (obj) {
          obj.start = new Date(obj.startTime);
          delete obj.startTime;
          obj.end = new Date(obj.endTime);
          delete obj.endTime;
          return obj;
        });

        setEvents(calEvents.length <= 0 ? calendarEvents : calEvents);
        // setdata(calEvents.length <= 0 ? calendarEvents : calEvents);
        setAvailableEvents(avlties.length <= 0 ? availabilities : avlties);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCalenderData();
  }, []);

  const handleConfirmClick = async () => {
    if (tvData.title === undefined || tvData.title.lenght <= 0) {
      setError((prv) => ({ ...prv, terror: 'Please enter title' }));
    } else if (
      tvData.joineeEmail === undefined ||
      tvData.joineeEmail.lenght <= 0
    ) {
      setError((prv) => ({ ...prv, jerror: 'Please enter Joinee Email' }));
    } else {
      const obj = {
        title: tvData.title,
        description: tvData.description,
        start: selectedSlot?.start,
        end: selectedSlot?.end,
        meetingStatus: 'PENDING',
      };
      try {
        const req = await axios.post(
          `${BASE_URL}/calendar/`,
          {
            hostEmail: sessionStorage.getItem('email'),
            joineeEmail: [tvData.joineeEmail],
            startDateTime: new Date(selectedSlot?.start).toISOString(),

            // moment(selectedSlot?.start).format(
            //   'DD/mm/yyyy HH:mm'
            // ),
            endDateTime: new Date(selectedSlot?.end).toISOString(),
            // moment(selectedSlot?.end).format('DD/mm/yyyy HH:mm'),
            title: tvData.title,
            description: tvData.description,
            eventUrl: isMeetingLink,
            eventStatus: 'PENDING',
          },
          {
            headers: {
              Authorization: ` Bearer ${sessionStorage.getItem('token')}`,
            },
          }
        );
        console.log('res ', req);
      } catch (e) {
        console.log('>>>>>>>>>>>>>>>>> errrrrrrrrrrrrrrrr');
        console.error(e);
      }

      setEvents([...events, obj]);
      setSelectedSlot(undefined);
    }
  };

  return (
    <>
      <Grid>
        <Grid container justifyContent="center" mt="10px">
          <Typography variant="body1">Available</Typography>
          <Typography
            component="span"
            width="20px"
            height="20px"
            ml="10px"
            backgroundColor="#e4b5f3"
          ></Typography>

          <Typography variant="body1" ml="10px">
            Booked
          </Typography>
          <Typography
            component="span"
            width="20px"
            height="20px"
            ml="10px"
            backgroundColor="#039BE5"
          />
          <Typography variant="body1" ml="10px">
            Pending
          </Typography>
          <Typography
            component="span"
            width="20px"
            height="20px"
            ml="10px"
            border="2px solid #039BE5"
          />
        </Grid>

        <Calendar
          formats={{
            timeGutterFormat: 'HH:mm',
          }}
          localizer={localizer}
          backgroundEvents={availableEvents}
          events={events}
          defaultView={Views.WEEK}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          selectable
          timeslots={4}
          step={15}
          popup={true}
          scrollToTime={new Date(1970, 1, 1, 6)}
          onSelectSlot={(obj) => {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> onSelectSlot', obj);
            setSelectedSlot(obj);
          }}
          onSelectEvent={(_) => {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> onSelectEvent', _);
          }}
          style={{
            height: '73vh',
            width: '78vw',
            marginTop: '20px',
            paddingRight: '20px',
            paddingLeft: '20px',
          }}
          eventPropGetter={(event, start, end, isSelected) => {
            const newStyle = {
              color: 'black',
              borderRadius: '4px',
              fontSize: '11px',
              fontfamily: 'Helvetica',
            };

            if (event?.aaa) {
              newStyle.backgroundColor = '#e4b5f3';
              newStyle.boxShadow =
                '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
            }

            if (event.title) {
              if (event.meetingStatus === 'PENDING') {
                newStyle.backgroundColor = 'white';
                newStyle.border = '2px solid #039BE5';
              } else {
                newStyle.color = 'white';
                newStyle.backgroundColor = '#039BE5';
              }
            }

            return {
              className: '',
              style: newStyle,
            };
          }}
        />
      </Grid>
      <Modal
        open={Boolean(selectedSlot)}
        keepMounted={false}
        onClose={() => setSelectedSlot(undefined)}
        // closeAfterTransition
        // BackdropComponent={Backdrop}
        // BackdropProps={{
        //   timeout: 500,
        // }}
      >
        <Fade in={selectedSlot}>
          <Box sx={style}>
            <Typography variant="h6" mb="10px">
              Schedule a Meeting
            </Typography>

            <TextField
              label="Enter Meeting Title*"
              size="small"
              value={tvData?.title}
              fullWidth
              onChange={(e) => {
                setTvData({ ...tvData, title: e.target.value });
                setError('');
              }}
              error={error?.terror}
              helperText={error?.terror}
            />
            <TextField
              label="Enter Meeting Joinee Email*"
              size="small"
              value={tvData?.joineeEmail}
              sx={{ mt: '20px' }}
              fullWidth
              onChange={(e) => {
                setTvData({ ...tvData, joineeEmail: e.target.value });
                setError('');
              }}
              error={error?.jerror}
              helperText={error?.jerror}
            />

            <DateTimePicker
              label="Start time"
              value={selectedSlot?.start}
              inputFormat="dd/MM/yyyy hh:mm a"
              onChange={(newValue) => {
                setSelectedSlot((prv) => ({ ...prv, start: newValue }));
                console.log(
                  '>>>>>>>>>>>>>> moment',
                  moment(newValue).format('DD/mm/yyyy HH:mm')
                );
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  sx={{ mt: '20px' }}
                  size="small"
                />
              )}
            />

            <DateTimePicker
              label="End time"
              value={selectedSlot?.end}
              inputFormat="dd/MM/yyyy hh:mm a"
              onChange={(newValue) => {
                setSelectedSlot((prv) => ({ ...prv, end: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  sx={{ mt: '20px' }}
                  size="small"
                />
              )}
            />
            <TextField
              label="Enter Meeting Description"
              fullWidth
              value={tvData?.description}
              rows={5}
              multiline
              size="small"
              sx={{ mt: '20px' }}
              onChange={(e) => {
                setTvData({ ...tvData, description: e.target.value });
              }}
            />
            <Box textAlign="start">
              <FormControlLabel
                control={
                  <Checkbox
                    value={isMeetingLink}
                    onChange={(e) => setIsMeetingLink(e.target.checked)}
                  />
                }
                label="Meeting Link"
              />
            </Box>

            <Button
              variant="contained"
              sx={{ mt: '20px', float: 'right' }}
              onClick={handleConfirmClick}
            >
              Confirm
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Fullcalender;
