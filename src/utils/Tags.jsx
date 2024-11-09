import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function MultipleSelectChip({ onChange, vals, onBlur , value }, ref) {
  const theme = useTheme();
  const [selectedChips, setSelectedChips] = React.useState([]);
  const [values, setValues] = React.useState([]);

  React.useEffect(() => {
    if (vals.length > 0) {
      setValues(vals);
    }
  }, [vals]);

  const handleChange = (event) => {
    const { target: { value } } = event;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    setSelectedChips(selectedValues);
    onChange(selectedValues);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="multiple-chip-label" className="dark:text-white text-gray-800">Select Tags *(optional)</InputLabel>
        <Select
          labelId="multiple-chip-label"
          id="multiple-chip"
          multiple
          ref={ref}
          value={selectedChips}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Status" />}
          renderValue={(selected) => (
            <Box className="flex flex-wrap gap-1">
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  className="text-sm bg-blue-100 dark:bg-blue-700 dark:text-white text-gray-800 rounded-lg px-2"
                />
              ))}
            </Box>
          )}
          className="dark:text-blue-400 text-gray-800 active:outline-none bg-gray-100 dark:bg-gray-800"
        >
          {values.map((name) => (
            <MenuItem
              key={name}
              value={name}
              className="dark:text-gray-600 text-gray-800"
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default React.forwardRef(MultipleSelectChip);
