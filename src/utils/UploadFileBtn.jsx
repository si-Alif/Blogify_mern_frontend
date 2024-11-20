import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import storageService from '../Appwrite/Storage';

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

function InputFileUpload({ onChange , value , defaultValue, imgClass=`w-96 h-52 object-cover rounded-lg` }, ref) {
  const [preview, setPreview] = React.useState(value || "");
  console.log(preview)

  React.useEffect(()=>{
    const img = async()=>{
      if(preview){
        const file =await storageService.filePreview(preview)
        setPreview("")
        if (file) {
          console.log(file)
          setPreview(file)
        }
      }
    }
    img()
  },[setPreview])

  const handleFileChange = (e) => {

    const file = e.target.files[0];
      
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
        onChange && onChange(file); // Notify parent of file change
      }
    }
  

  return (
    <div className='flex flex-col justify-center gap-2 items-center h-3/5'>

     
      {preview && (
        defaultValue="",
        <div >
          <img
            
            src={preview}
            alt="Selected Preview"
           
            className={imgClass}
          />
        </div>
      )}
     
      {defaultValue!="" && (
        <div >
          <img
            
            src={defaultValue}
            alt="Selected Preview"
           
            className={imgClass}
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
