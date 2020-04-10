import React from 'react'
//import styled from 'styled-components'
import FileInput from 'react-simple-file-input'
//import ImageUploader from 'react-images-upload';

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/*const Label = styled.label`
cursor: pointer;
flex-basis: 100%;
display: flex;
flex-direction: row;
justify-content: space-around;
align-items: center;
`

const ImageFileInput = styled(FileInput)`
display: none; 
`

const FileName = styled.span`
box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.3);
flex-basis: 80%;
text-align: center;
padding: 10px;
`
/*const FileIcon = styled(FontAwesomeIcon)`
font-size: 2em;
`*/

const allowedFileTypes = ["image/png", "image/jpeg", "image/gif", "image/bmp"];
const fileIsIncorrectFiletype = (file) => {
    if (allowedFileTypes.indexOf(file.type) === -1) {
      return true;
    } else {
      return false;
    }
  }

const LoadPhotoBox = (props) => {
    return (
        <label>
            <FileInput
            accept="image/*"
                readAs='dataUrl'
                onLoadStart={props.onLoadStart}
                onLoad={props.onLoad}
                cancelIf={fileIsIncorrectFiletype}
            />

            {/*<FileIcon icon={props.icon} />*/}

            <span>
                {/*props.fileName*/}
            </span>
        </label>
        
    )
}

export default LoadPhotoBox
