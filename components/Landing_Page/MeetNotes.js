import Drawer from '@mui/material/Drawer';

export default function MeetNotes({ openDrawer, toggleDrawer, list }) {
  return (
    <Drawer
      anchor={'right'}
      open={openDrawer}
      onMouseLeave={toggleDrawer(false)}
    >
      {list()}
    </Drawer>
  );
}
