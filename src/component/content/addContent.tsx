import React, { useEffect, useState } from 'react';
import { getS3UploadURL, uploadToS3 } from '../../services/s3';
import { createContent } from '../../services/content';
import { validateContentDetails } from '../../utils/validators';
import { fetchAllContents } from '../../store/contentSlice';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { StyledButton } from '../login/styles';

export type ContentType = 'AUDIO' | 'TEXT' | 'VIDEO';

interface AddContentFields {
  title: string;
  description: string;
  contentType: ContentType;
  readTime: string;
}

const initialDetails: AddContentFields = {
  title: '',
  description: '',
  contentType: 'AUDIO',
  readTime: '',
};

type Props = {
  closeModal: () => void;
};

const AddContent: React.FC<Props> = ({ closeModal }: Props) => {
  const [{ uploadURL, Key }, setUploadResponse] = useState<{
    uploadURL: string;
    Key: string;
  }>({ uploadURL: '', Key: '' });

  const [file, setFile] = useState<File | null>(null);

  const [{ title, description, contentType, readTime }, setContentDetails] =
    useState<AddContentFields>(initialDetails);
  const [error, setError] = useState<string>('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      fetchUploadURL(file.name);
    }
  }, [file]);

  const fetchUploadURL = async (fileName: string) => {
    try {
      const { data } = await getS3UploadURL(fileName);
      const { uploadURL, Key } = data.data;
      if (uploadURL && Key) setUploadResponse({ uploadURL, Key });
    } catch (error) {
      console.error('Error occurred while fetching upload URL:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');

    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    setContentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    e: SelectChangeEvent<'AUDIO' | 'TEXT' | 'VIDEO'>
  ) => {
    setError('');
    const { name, value } = e.target;
    setContentDetails((prevDetails) => ({
      ...prevDetails,
      [name as string]: value as string,
    }));
  };

  const handleContentSubmit = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    if (
      !error &&
      contentType &&
      validateContentDetails(title, description, contentType, readTime, Key)
    ) {
      try {
        const response = await uploadToS3(uploadURL, file, (progress) => {});

        if (response.statusText === 'OK') {
          const createContentResponse = await createContent(
            title,
            description,
            Key,
            contentType,
            readTime
          );

          if (createContentResponse) {
            dispatch(fetchAllContents() as any);
            setFile(null);
            setContentDetails(initialDetails);
          }
        }
      } catch (error) {
        setError(`Error creating content: ${error}`);
      } finally {
        closeModal();
      }
    } else {
      setError('Please fill all the content details');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxWidth="400px"
      minWidth="300px"
      mx="auto"
      p={2}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <label htmlFor="upload-file">
          <Button
            component="label"
            sx={(theme) => ({
              background: theme.palette.primary.main,
              color: theme.palette.secondary.main,
              fontWeight: 600,
              padding: '20px',
              borderRadius: '8px',
              height: '45px',
              textTransform: 'none',
              '&:hover': {
                background: theme.palette.primary.main,
              },
            })}
          >
            Upload File
            <input
              hidden
              type="file"
              onChange={handleFileChange}
              id="upload-file"
            />
          </Button>
        </label>
        <Box>{file && <Typography>{file.name}</Typography>}</Box>
      </Stack>
      <TextField
        value={title}
        name="title"
        onChange={updateForm}
        label="Title"
        variant="outlined"
        margin="normal"
      />
      <TextField
        value={description}
        name="description"
        onChange={updateForm}
        label="Description"
        variant="outlined"
        margin="normal"
      />
      <FormControl variant="outlined" margin="normal">
        <InputLabel htmlFor="contentType">Content Type</InputLabel>
        <Select
          value={contentType}
          name="contentType"
          onChange={handleSelectChange}
          label="Content Type"
          id="contentType"
        >
          <MenuItem value="AUDIO">Audio</MenuItem>
          <MenuItem value="TEXT">Text</MenuItem>
          <MenuItem value="VIDEO">Video</MenuItem>
        </Select>
      </FormControl>
      <TextField
        value={readTime}
        name="readTime"
        onChange={updateForm}
        label="Read Time"
        variant="outlined"
        margin="normal"
        sx={{ mb: 3 }}
      />

      {error && <Typography color="error">{error}</Typography>}

      <StyledButton onClick={handleContentSubmit} style={{ marginTop: '20px' }}>
        Create
      </StyledButton>
    </Box>
  );
};

export default AddContent;
