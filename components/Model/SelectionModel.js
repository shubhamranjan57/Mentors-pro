import {
  FormControlLabel,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import Router from 'next/router';
import React from 'react';

const SelectionModel = (props) => {
  const { isShowModel, setIsShowModel, role } = props;

  return (
    <div>
      <Modal
        open={isShowModel}
        disableAutoFocus
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            setIsShowModel(false);
          }
        }}
      >
        <Paper
          sx={{
            width: '300px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            padding: '20px',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h5" mb="15px" sx={{ fontWeight: 'bold' }}>
            Select Your Role
          </Typography>
          <RadioGroup
            name="radio-buttons-group"
            onChange={(e) => {
              sessionStorage.setItem('role', e.target.value);

              if (role === 'USER') Router.push('/onboarding');
              else if (role === 'ADMIN_USER') Router.push('/dashboard');
            }}
          >
            <FormControlLabel
              value="MENTEE"
              control={<Radio />}
              label="Mentee"
            />
            <FormControlLabel
              value="MENTOR"
              control={<Radio />}
              label="Mentor"
            />
          </RadioGroup>
        </Paper>
      </Modal>
    </div>
  );
};

export default SelectionModel;
