import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

 function BasicSelect({onChange , value},ref) {
  const [status, setStatus] = React.useState(value || "");

  const handleChange = (event) => {
    setStatus(event.target.value);
    onChange(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth className='outline-none rounded-lg hover:outline-blue-500'>
        <InputLabel id="demo-simple-select-label" className='dark:text-white text-gray-800' >Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          label="Age"
          className='dark:text-blue-400 text-gray-800 active:outline-none'
          onChange={handleChange}
        >
          <MenuItem value={"active"} className='dark:text-blue-400 text-gray-600'>Active</MenuItem>
          <MenuItem value={"inactive"} className='dark:text-blue-400 text-gray-600' >Inactive</MenuItem>

        </Select>
      </FormControl>
    </Box>
  );
}

export default React.forwardRef(BasicSelect);

