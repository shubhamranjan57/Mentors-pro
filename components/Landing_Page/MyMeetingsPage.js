import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import MeetNotes from './MeetNotes';
import { useState, useEffect } from 'react';
import { BASE_URL } from '../../libs/config';
import axios from 'axios';
import { Avatar } from '@mui/material';
import moment from 'moment';
export default function MyMeetingsPage() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const [notesArr, setNotesArr] = useState([]);
  const [noteData, setNoteData] = useState();
  const [eventId, setEventId] = useState();
  const [meetingData, setMeetingData] = useState([]);
  const [hasCalled, setHasCalled] = useState(false);
  const [meetType, setMeetType] = useState();
  const [upcomingCt, setUpComingCt] = useState(0);
  const [completedCt, setCompltedCt] = useState(0);
  const [rejectedCt, setRejectedCt] = useState(0);

  useEffect(() => {
    const get = async () => {
      try {
        getMeetData('UPCOMING', true);
        const completedData = await makeMeetApiCall('COMPLETED');
        setCompltedCt(completedData.data.length);
        const rejectedData = await makeMeetApiCall('REJECTED');
        setRejectedCt(rejectedData.data.length);
      } catch (error) {
        console.log(error);
      }
    };
    get();
  }, []);

  const saveNotes = async (event) => {
    // calls the post api for saving all notes in backend
    try {
      if (isExist) {
        const response = await axios.put(
          `${BASE_URL}/meeting/notes/${noteData.noteId}`,
          {
            eventId,
            note: noteData.notes,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              email: sessionStorage.getItem('email'),
            },
          }
        );
        if (response.data === 'Note updated') return;
        throw new Error("Note couldn't be updated");
      } else {
        const res = await axios.post(
          `${BASE_URL}/meeting/notes`,
          {
            eventId,
            note: noteData.notes,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              email: sessionStorage.getItem('email'),
            },
          }
        );
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDrawer = (isOpen) => (event) => {
    setOpenDrawer(isOpen);
  };

  const list = () => (
    <Box sx={{ width: 500, textAlign: 'end' }} padding={3} role="presentation">
      <Fab
        size="small"
        color="danger"
        aria-label="add"
        onClick={toggleDrawer(false)}
      >
        <CloseIcon />
      </Fab>
      <h1
        style={{
          textAlign: 'center',
        }}
      >
        Meeting Notes
      </h1>
      <div
        contentEditable={!isExist}
        suppressContentEditableWarning={!isExist}
        onInput={handleChangeNotes}
        style={{
          overflow: 'scroll',
          overflowX: 'hidden',
          marginBottom: '8px',
          height: '70vh',
          fontSize: '18px',
          textAlign: 'left',
          outline: '1px solid black',
        }}
      >
        {notesArr.map((element, index) => {
          return (
            <div key={index}>
              <h4>
                {element.firstName}{' '}
                {new Date(element.lastModified).toLocaleString()}
              </h4>
              <p
                id={element.eventId + ' ' + element.noteId}
                style={{ marginTop: '5px' }}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={handleEditNotes}
                onBlur={(event) => console.log('Hello')}
              >
                {element.notes}
              </p>
            </div>
          );
        })}
      </div>
      <Button variant="contained" size="medium" onClick={saveNotes}>
        Save
      </Button>
    </Box>
  );

  const makeMeetApiCall = async (value) => {
    const response = await axios.get(`${BASE_URL}/meeting?tag=${value}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        email: sessionStorage.getItem('email'),
      },
    });
    return response;
  };

  const getMeetData = async (value, setUpComingMeets = false) => {
    try {
      const response = await makeMeetApiCall(value);
      console.log(response);
      const meetList = response.data;
      if (setUpComingMeets) {
        setUpComingCt(meetList.length);
      }
      setMeetingData([]);
      setHasCalled(true);
      setMeetType(value === 'REJECTED' ? 'cancelled' : value.toLowerCase());
      meetList.forEach((meet) => {
        setMeetingData((prevData) => [...prevData, meet]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeNotes = (event) => {
    if (!isExist) {
      setNoteData({
        notes: event.target.innerText,
      });
    }
  };

  const handleEditNotes = (event) => {
    const ids = event.target.id.split(' ');
    setEventId(ids[0]);
    const notes = event.target.innerText;
    setNoteData({
      noteId: ids[1],
      notes,
    });
  };

  const handleMeetingNotes = async (data) => {
    try {
      setOpenDrawer(true);
      setEventId(data);
      const response = await axios.get(`${BASE_URL}/meeting/${data}/notes`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      console.log(response);
      const resData = response.data; // returns array
      setNotesArr([]);
      setIsExist(
        resData.length === 0
          ? false
          : resData.filter(
              (element) =>
                (element.email === sessionStorage.getItem('email').length) !== 0
            )
      );
      resData.forEach((element) => {
        setNotesArr((prevArr) => [...prevArr, element]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <h1>My Meetings</h1>
      <Grid container spacing={2}>
        <Grid item sm={6} md={8}>
          <Grid container spacing={5}>
            {[
              {
                text: 'Upcoming Meetings',
                tag: 'UPCOMING',
                color: '#ADD8E6',
              },
              {
                text: 'Completed Meetings',
                tag: 'COMPLETED',
                color: '#ADD8B6',
              },
              {
                text: 'Cancelled Meetings',
                tag: 'REJECTED',
                color: '#FFC0CB',
              },
            ].map((element, index) => {
              return (
                <Grid item sm={4} md={4} key={index}>
                  <Card
                    sx={{
                      minWidth: 50,
                      minHeight: 50,
                      border: '2px solid black',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      backgroundColor: element.color,
                    }}
                    onClick={() => getMeetData(element.tag)}
                  >
                    <CardContent>
                      <Typography sx={{ fontSize: 30, textAlign: 'center' }}>
                        {element.text}
                      </Typography>
                    </CardContent>
                    <CardContent>
                      <Typography sx={{ fontSize: 25, textAlign: 'center' }}>
                        {element.tag === 'UPCOMING'
                          ? upcomingCt
                          : element.tag === 'COMPLETED'
                          ? completedCt
                          : rejectedCt}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      <Stack spacing={3} sx={{ marginTop: 5 }}>
        {meetingData.length ? (
          meetingData.map((data, index) => {
            return (
              <Paper
                key={index}
                elevation={3}
                sx={{ padding: 2, minHeight: 30, borderRadius: '10px' }}
              >
                <Grid container spacing={3}>
                  <Grid item sm={4} md={6}>
                    <Typography>{data.title}</Typography>
                    <Typography>{data.description}</Typography>
                    <Typography>Status: {data.eventStatus}</Typography>
                    <Typography>
                      {`${new Date(data.startTime).getDate()}th ${moment(
                        new Date(data.startTime)
                      ).format('MMMM')} ${new Date(
                        data.startTime
                      ).getFullYear()} `}
                    </Typography>
                    <Typography>
                      {` ${moment(new Date(data.startTime)).format('hh:mm A')}`}{' '}
                      {'-'}
                      {` ${moment(new Date(data.endTime)).format('hh:mm A')}`}
                    </Typography>
                  </Grid>
                  <Grid item sm={4} md={3}>
                    <Button
                      variant="contained"
                      color="inherit"
                      onClick={() => handleMeetingNotes(data.eventId)}
                    >
                      View Notes
                    </Button>
                  </Grid>
                  <Grid container item sm={4} md={3}>
                    <Avatar />
                    <Avatar />
                  </Grid>
                </Grid>
              </Paper>
            );
          })
        ) : hasCalled ? (
          <h2
            style={{ textAlign: 'center', justify: 'center', fontSize: '30px' }}
          >
            No {meetType} meetings found
          </h2>
        ) : null}
      </Stack>
      <MeetNotes
        toggleDrawer={toggleDrawer}
        list={list}
        openDrawer={openDrawer}
      />
    </Box>
  );
}
