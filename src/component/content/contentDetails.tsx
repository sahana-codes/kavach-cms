import React, { useEffect, useState } from 'react';
import { SelectedContent } from '.';
import { getS3DownloadURL } from '../../services/s3';
import { formatDate } from '../../utils/formatDate';
import { updateContent } from '../../services/content';
import { openSnackbar } from '../../store/snackbarSlice';
import {
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import { StyledButton } from '../login/styles';

type Props = {
  content: SelectedContent;
  updateContentDetails: (contentId: string) => Promise<void>;
};

type NewContentDetails = {
  newTitle: string;
  newDescription: string;
  newReadTime: string;
};

function ContentDetails({ content, updateContentDetails }: Props) {
  const {
    _id,
    title,
    contentType,
    description,
    readTime,
    createdAt,
    updatedAt,
    contentKey,
  } = content;

  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(true);

  const [{ newTitle, newDescription, newReadTime }, setNewDetails] =
    useState<NewContentDetails>({
      newDescription: description,
      newReadTime: readTime || '',
      newTitle: title,
    });

  useEffect(() => {
    fetchMediaUrl();
  }, [content]);

  const fetchMediaUrl = async () => {
    try {
      const { data } = await getS3DownloadURL(contentKey);
      const { downloadURL } = data.data;

      downloadURL && setMediaUrl(downloadURL);

      if (contentType === 'TEXT' && downloadURL) {
        const textResponse = await fetch(downloadURL);
        const textContent = await textResponse.text();
        setTextContent(textContent);
      }
      setPreviewLoading(false);
    } catch (error) {
      openSnackbar({
        message: 'Error fetching media URL',
        severity: 'error',
      });
      setMediaUrl(null);
      setTextContent(null);
      setPreviewLoading(false);
    }
  };

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateContent = async () => {
    try {
      const { data } = await updateContent(_id, {
        title: newTitle,
        description: newDescription,
        readTime: newReadTime,
      });
      if (data) {
        setNewDetails({
          newDescription: '',
          newReadTime: '',
          newTitle: '',
        });

        updateContentDetails(_id);
        openSnackbar({ message: 'Updated successfully', severity: 'success' });
      }
    } catch (error) {
      openSnackbar({ message: 'Error updating content', severity: 'error' });
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={6} sx={{ display: 'flex' }}>
        <Box
          style={{
            overflow: 'hidden',
            padding:
              contentType.toUpperCase() === 'TEXT' ? '10px 4px ' : '10px',
            minWidth: '285px',
            minHeight: '300px',
            maxWidth: contentType === 'TEXT' ? '380px' : '100%',
            maxHeight: contentType === 'TEXT' ? '370px' : '100%',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          {mediaUrl ? (
            previewLoading ? ( // Display loader if content is still previewLoading
              <CircularProgress />
            ) : (
              <Box
                sx={{
                  p: contentType.toUpperCase() === 'TEXT' ? '10px 0px ' : 2,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    padding: 0,
                  }}
                >
                  <Typography
                    gutterBottom
                    sx={{ fontSize: '0.9rem', fontWeight: 600 }}
                  >
                    {title}
                  </Typography>
                  {contentType.toUpperCase() === 'AUDIO' ? (
                    <audio controls>
                      <source src={mediaUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  ) : contentType.toUpperCase() === 'VIDEO' ? (
                    <video controls>
                      <source src={mediaUrl} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                  ) : contentType.toUpperCase() === 'TEXT' ? (
                    <Box
                      sx={{
                        maxHeight: '350px', // Limit the height of the scrollable area
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': {
                          width: 8,
                        },
                        '&::-webkit-scrollbar-track': {},
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: 'primary.main',
                          borderRadius: 9999,
                          backgroundClip: 'content-box',
                        },
                      }}
                    >
                      <pre
                        style={{
                          maxWidth: '300px',
                          maxHeight: '350px',
                          wordWrap: 'break-word', // Wrap the text content
                          whiteSpace: 'pre-wrap', // Limit the height of the <pre> element
                        }}
                      >
                        {textContent}
                      </pre>
                    </Box>
                  ) : (
                    <Typography>No preview available</Typography>
                  )}
                </div>
              </Box>
            )
          ) : (
            <Typography>No preview available</Typography>
          )}
        </Box>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <Box
          style={{
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            minWidth: '250px',
            minHeight: '400px',
          }}
        >
          <Typography sx={{ fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 600 }}>Created On:&nbsp;</span>
            {formatDate(createdAt)}
          </Typography>
          <Typography sx={{ fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 600 }}>Last updated:&nbsp;</span>
            {formatDate(updatedAt)}
          </Typography>
          <TextField
            label="Title"
            name="newTitle"
            value={newTitle}
            onChange={updateForm}
            placeholder={title}
            fullWidth
          />
          <TextField
            label="Description"
            name="newDescription"
            value={newDescription}
            onChange={updateForm}
            placeholder={description}
            fullWidth
          />
          <TextField
            label="Read Time"
            name="newReadTime"
            value={newReadTime}
            onChange={updateForm}
            placeholder={readTime}
            fullWidth
          />
          <StyledButton
            onClick={handleUpdateContent}
            style={{ marginTop: '10px' }}
          >
            Update
          </StyledButton>
        </Box>
      </Grid>
    </Grid>
  );
}

export default ContentDetails;
