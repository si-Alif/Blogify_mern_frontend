import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";

function InputWithIcon(
  { label, onChange, value, type, className, required, icon = "true" },
  ref
) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        cursor: "crosshair",
        padding: "20px",
      }}
    >
      {icon ? (
        <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
      ) : null}
      <TextField
        id="input-with-sx"
        style={{ color: "white" }}
        label={label}
        InputLabelProps={{
          style: {
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            paddingLeft:"20px",
          },
        }}
        inputProps={{
          style: {
            color: "white",
            
            fontSize: "18px",
            borderRadius:"10px",
            paddingLeft:"20px",
            paddingTop:"4px",
            paddingBottom:"4px",
            fontWeight: "normal",
            
            border: "none",
            
          },
        }}
        type={type}
        defaultValue={value}
        required={required}
        variant="standard"
        ref={ref}
        onChange={onChange}
        className={className}
      />
    </Box>
  );
}

export default React.forwardRef(InputWithIcon);
