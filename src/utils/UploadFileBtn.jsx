import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function InputFileUpload({ onChange , value }, ref) {
  const [preview, setPreview] = React.useState(value || "");

  const handleFileChange = (e) => {

    if(preview){
      setPreview("")
      const file = e.target.files[0];
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
        onChange && onChange(e); // Notify parent of file change
      }
    }else{
      const file = e.target.files[0];
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
        onChange && onChange(e); // Notify parent of file change
      }
    }
  }

  

  return (
    <div className='flex flex-col justify-center gap-2 items-center h-3/5'>

      {/* Preview section */}
      {preview && (
        <div >
          <img
            src={preview}
            alt="Selected Preview"
            style={{ width: '300px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>
      )}


      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <VisuallyHiddenInput
          type="file"
          hidden={false}
          onChange={handleFileChange}
          ref={ref}
        />
      </Button>

      
    </div>
  );
}

export default React.forwardRef(InputFileUpload);
