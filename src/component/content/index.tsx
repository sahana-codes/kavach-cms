import React, { useState } from 'react';
import { deleteContent, getContentDetails } from '../../services/content';
import { fetchAllContents, selectContents } from '../../store/contentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { StyledButton } from '../login/styles';
import ModalContent from '../common/modalContent';
import { openSnackbar } from '../../store/snackbarSlice';

const ContentTable = React.lazy(() => import('./contentTable'));
const ContentDetails = React.lazy(() => import('./contentDetails'));
const AddContent = React.lazy(() => import('./addContent'));
const AreYouSure = React.lazy(() => import('../common/areYouSure'));

export enum ContentType {
  AUDIO = 'AUDIO',
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
}
export interface Content {
  _id: string;
  title: string;
  contentType: ContentType;
  readTime?: string;
  createdAt: string;
}

export interface SelectedContent extends Content {
  contentKey: string;
  description: string;
  updatedAt: string;
}

const ContentPage: React.FC = () => {
  const contents = useSelector(selectContents);
  const [selectedContent, setSelectedContent] =
    useState<SelectedContent | null>(null);
  const [showSelectedContent, setShowSelectedContent] = useState(false);
  const [showAddContent, setShowAddContent] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [contentToDelete, setContentToDelete] = useState('');
  const [contentLoading, setContentLoading] = useState(false);

  const dispatch = useDispatch();

  const onSelectContent = async (contentId: string) => {
    try {
      const { data } = await getContentDetails(contentId);
      setSelectedContent(data.data);
      setShowSelectedContent(true);
    } catch (error) {
      openSnackbar({
        message: 'Error occurred while fetching content details',
        severity: 'error',
      });
    }
  };

  const openConfirmDelete = (_id: string) => {
    setContentToDelete(_id);
    setShowConfirmDelete(true);
  };

  const handleDeleteContent = async () => {
    try {
      // const { data } = await deleteContent(contentToDelete);
      const data = deleteContent(contentToDelete);
      if (data) {
        setContentLoading(true);
        dispatch(fetchAllContents() as any);
        setShowConfirmDelete(false);
        setContentLoading(false);
      }
    } catch (error: any) {
      setContentLoading(false);
      openSnackbar({
        message: 'Error occurred while deleting content',
        severity: 'error',
      });
    }
  };

  return (
    <Box
      maxWidth="800px"
      mx="auto"
      my="50px"
      p={2}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <StyledButton
        onClick={() => setShowAddContent(true)}
        sx={{ mb: 2, alignSelf: 'flex-start' }}
      >
        Add New Content
      </StyledButton>
      {showAddContent && (
        <ModalContent
          title="Add New Content"
          onClose={() => setShowAddContent(false)}
          open={showAddContent}
        >
          <React.Suspense fallback={<CircularProgress />}>
            <AddContent closeModal={() => setShowAddContent(false)} />
          </React.Suspense>
        </ModalContent>
      )}

      {showSelectedContent && selectedContent && (
        <ModalContent
          title="Update Content"
          onClose={() => setShowSelectedContent(false)}
          open={showSelectedContent}
        >
          <React.Suspense fallback={<CircularProgress />}>
            <ContentDetails
              content={selectedContent}
              updateContentDetails={onSelectContent}
            />
          </React.Suspense>
        </ModalContent>
      )}

      {showConfirmDelete && contentToDelete && (
        <ModalContent
          title="Confirm Delete"
          onClose={() => setShowConfirmDelete(false)}
          open={showConfirmDelete}
        >
          <React.Suspense fallback={<CircularProgress />}>
            <AreYouSure
              onCancel={() => setShowConfirmDelete(false)}
              message={`Are you sure you want to delete this content? This action is irreversible.`}
              onConfirm={handleDeleteContent}
            />
          </React.Suspense>
        </ModalContent>
      )}
      <React.Suspense fallback={<CircularProgress />}>
        <ContentTable
          contents={contents}
          onSelectContent={onSelectContent}
          openConfirmDelete={openConfirmDelete}
          contentLoading={contentLoading}
        />
      </React.Suspense>
    </Box>
  );
};

export default ContentPage;
