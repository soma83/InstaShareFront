import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import BackupIcon from '@material-ui/icons/Backup';
import {URL_USERS} from "../../config/config";

const UploadComp = ({userId, setLocalMsg, notifyFinished, enabled}) => {
  const [uploading, setUploading] = useState(false);

  const upload = () => ({target}) => {
    setUploading(true);
    const f = target.files[0];
    if (f.size > 5242880) {
      setLocalMsg({message: 'File exceeds 5 megabytes!', type: 'error'});
      setUploading(false);
      return;
    }

    const data = new FormData();
    data.append('path[name]', f.name);
    data.append('path[size]', f.size);
    data.append('path[public]', 'false');
    data.append('path[file_element]', f);

    fetch(URL_USERS + `/${userId}/paths`, { method: 'POST', body: data })
      .then(response => response.json())
      .then(_ => {
        setLocalMsg({message: 'File uploaded successfully!', type: 'success'});
        setUploading(false);
        notifyFinished();
      })
      .catch(_ => {
        setLocalMsg({message: 'Unable to upload the file!', type: 'error'});
        setUploading(false);
      });
  };

  return (
    <>
      <input
        disabled={!enabled}
        accept="*"
        style={{display: 'none'}}
        id="contained-button-file"
        type="file"
        onChange={upload()}
      />
      <label htmlFor="contained-button-file">
        <Button
          disabled={uploading || !enabled}
          variant="contained"
          color="primary"
          component="span"
          startIcon={<BackupIcon/>}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </label>
    </>
  );
};

UploadComp.defaultProps = {
  enabled: true
};

UploadComp.propTypes = {
  userId: PropTypes.string.isRequired,
  notifyFinished: PropTypes.func.isRequired,
  setLocalMsg: PropTypes.func.isRequired,
  enabled: PropTypes.bool
};

export default UploadComp;
