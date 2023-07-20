import React, { useEffect, useState } from 'react';
import { getS3UploadURL, uploadToS3 } from '../../services/s3';
import { createContent } from '../../services/content';
import { validateContentDetails } from '../../utils/validators';

export type ContentType = 'AUDIO' | 'TEXT' | 'VIDEO';

interface AddContentFields {
  title: string;
  description: string;
  contentType: ContentType;
  readTime: string;
}
type AddContentProps = {
  fetchContents: () => Promise<void>;
};

const initialDetails: AddContentFields = {
  title: '',
  description: '',
  contentType: 'AUDIO',
  readTime: '',
};
const AddContent: React.FC<AddContentProps> = ({
  fetchContents,
}: AddContentProps) => {
  const [{ uploadURL, Key }, setUploadResponse] = useState<{
    uploadURL: string;
    Key: string;
  }>({ uploadURL: '', Key: '' });

  const [file, setFile] = useState<File | null>(null);
  const [{ title, description, contentType, readTime }, setContentDetails] =
    useState<AddContentFields>(initialDetails);
  const [error, setError] = useState<string>('');

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
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const updateForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setError('');
    const { name, value } = e.target;
    setContentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
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
        const response = await uploadToS3(uploadURL, file);
        if (response.statusText === 'OK') {
          const createContentResponse = await createContent(
            title,
            description,
            Key,
            contentType,
            readTime
          );
          if (createContentResponse) {
            fetchContents();
            setFile(null);
            setContentDetails(initialDetails);
          }
        }
      } catch (error) {
        setError(`Error creating content: ${error}`);
      }
    } else {
      setError('Please fill all the content details');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      <input
        type="text"
        value={title}
        name="title"
        onChange={updateForm}
        placeholder="Title"
      />
      <input
        type="text"
        value={description}
        name="description"
        onChange={updateForm}
        placeholder="Description"
      />
      <select value={contentType} name="contentType" onChange={updateForm}>
        <option value="AUDIO">Audio</option>
        <option value="TEXT">Text</option>
        <option value="VIDEO">Video</option>
      </select>
      <input
        type="text"
        value={readTime}
        name="readTime"
        onChange={updateForm}
        placeholder="Read Time"
      />
      {error && <p>{error}</p>}
      <button onClick={handleContentSubmit}>Create Content</button>
    </div>
  );
};

export default AddContent;
