import React, { useEffect, useState } from 'react';
import { SelectedContent } from '.';
import { getS3DownloadURL } from '../../services/s3';
import { formatDate } from '../../utils/formatDate';
import { updateContent } from '../../services/content';
import { openSnackbar } from '../../store/snackbarSlice';

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
  const [editable, setEditable] = useState<boolean>(false);
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
    } catch (error) {
      console.error('Error fetching media URL:', error);
      setMediaUrl(null);
      setTextContent(null);
    }
  };

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const renderMediaPreview = () => {
    if (!mediaUrl) {
      return <div>No preview available</div>;
    }

    const type = contentType.toUpperCase();

    switch (type) {
      case 'AUDIO':
        return (
          <audio controls>
            <source src={mediaUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
      case 'VIDEO':
        return (
          <video controls>
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        );
      case 'TEXT':
        return <pre>{textContent}</pre>;
      default:
        return <div>No preview available</div>;
    }
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
        setEditable(false);
        updateContentDetails(_id);
        openSnackbar({ message: 'Updated successfully', severity: 'success' });
      }
    } catch (error) {
      openSnackbar({ message: 'Error updating content', severity: 'error' });
    }
  };

  return (
    <>
      <div>
        <div>{renderMediaPreview()}</div>

        <button
          onClick={() => {
            setEditable(true);
          }}
        >
          Edit
        </button>

        <div>
          <div>
            <label>
              Title:
              <input
                type="text"
                name="newTitle"
                value={!editable ? title : newTitle}
                onChange={updateForm}
                readOnly={!editable}
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <input
                type="text"
                name="newDescription"
                value={!editable ? description : newDescription}
                onChange={updateForm}
                readOnly={!editable}
              />
            </label>
          </div>

          <div>
            <label>
              Read Time:
              <input
                type="text"
                name="newReadTime"
                value={!editable ? readTime : newReadTime}
                onChange={updateForm}
                readOnly={!editable}
              />
            </label>
          </div>
          <div>
            <label>
              Created At:
              <input
                type="text"
                name="createdAt"
                value={formatDate(createdAt)}
                readOnly
              />
            </label>
          </div>
          <div>
            <label>
              Updated At:
              <input
                type="text"
                name="updatedAt"
                value={formatDate(updatedAt)}
                readOnly
              />
            </label>
          </div>
        </div>
        {editable && <button onClick={handleUpdateContent}>Update</button>}
      </div>
    </>
  );
}

export default ContentDetails;
