import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function InputWithIcon(
  {
    label,
    onChange,
    value = "",
    type,
    className,
    required,
    icon = true,
    inputStyle = {},
    labelStyle = {color:"#4682B4"}
  },
  ref
) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        cursor: "crosshair",
        padding: "20px"
      }}
    >
      {icon ? (
        <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
      ) : null}
      <TextField
        id={label}
        style={inputStyle}
        label={label}
        InputLabelProps={{
          style: {
            ...labelStyle,
            fontSize: "16px",
            fontWeight: "bold",
            paddingLeft: "20px"
          }
        }}
        inputProps={{
          style: {
            ...inputStyle,
            fontSize: "18px",
            borderRadius: "10px",
            paddingLeft: "20px",
            paddingTop: "8px",
            paddingBottom: "8px",
            fontWeight: "normal",
            textJustify: "center",
            border: "none"
          }
        }}
        type={type === "password" && !showPassword ? "password" : "text"}
        defaultValue={value}
        required={required}
        variant="standard"
        ref={ref}
        onChange={onChange}
        className={className}
        InputProps={{
          endAdornment: type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null
        }}
      />
    </Box>
  );
}

export default React.forwardRef(InputWithIcon);
