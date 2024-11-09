import React, { useState, forwardRef, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { debounce } from "lodash";  // Ensure lodash is installed, or use your own debounce implementation

const MyEditor = forwardRef(({ onChange , value }, ref) => {
  const [content, setContent] = useState(value || "");

  // Debounce function to reduce the frequency of onChange calls
  const debouncedChangeHandler = useCallback(
    debounce((content) => {
      onChange(content);  // Call react-hook-form's onChange method with debounced content
    }, 300),  // Adjust debounce time as needed
    [onChange]
  );

  const handleEditorChange = (content, editor) => {
    setContent(content);
    debouncedChangeHandler(content);
  };

  return (
    <div>
      <Editor
      
        ref={ref}
        apiKey="4u9b39hszef9wrd68spzj4xh8626ss121neysc3hop7pt9b1"
        value={content}
        onEditorChange={handleEditorChange}
        
        init={{
          selector: 'textarea',
          height: "70vh",
          width:"95vw",
          menubar: true,
          resize:"both",
          plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
          toolbar:
            "newdocument undo redo | formatselect fontselect fontsizeselect | bold italic underline strikethrough superscript subscript | forecolor backcolor removeformat | " +
            "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | cut copy paste pastetext | " +
            "link unlink anchor image media | blockquote code codesample fullscreen | " +
            "table emoticons charmap hr insertdatetime preview searchreplace | visualblocks visualchars ltr rtl | " +
            "insertfile template toc pagebreak | help print spellchecker wordcount",
        }}
      />

    </div>
  );
});

export default MyEditor;
