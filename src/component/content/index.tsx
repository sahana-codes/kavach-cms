import React, { useState } from 'react';
import ContentTable from './contentTable';
import { deleteContent, getContentDetails } from '../../services/content';
import ContentDetails from './contentDetails';
import Modal from '../common/modal';
import AddContent from './addContent';
import AreYouSure from '../common/areYouSure';
import { fetchAllContents, selectContents } from '../../store/contentSlice';
import { useDispatch, useSelector } from 'react-redux';

export interface Content {
  _id: string;
  title: string;
  contentType: string;
  readTime?: string;
  createdAt: string;
}

export interface SelectedContent extends Content {
  contentKey: string;
  description: string;
  updatedAt: string;
}

const Content: React.FC = () => {
  const contents = useSelector(selectContents);
  const [selectedContent, setSelectedContent] =
    useState<SelectedContent | null>(null);
  const [showSelectedContent, setShowSelectedContent] = useState(false);
  const [showAddContent, setShowAddContent] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [contentToDelete, setContentToDelete] = useState('');

  const dispatch = useDispatch();

  const onSelectContent = async (contentId: string) => {
    try {
      const { data } = await getContentDetails(contentId);
      setSelectedContent(data.data);
      setShowSelectedContent(true);
    } catch (error) {
      console.error('Error occurred while fetching content details:', error);
    }
  };

  const openConfirmDelete = (_id: string) => {
    setContentToDelete(_id);
    setShowConfirmDelete(true);
  };

  const handleDeleteAdmin = async () => {
    try {
      // const { data } = await deleteContent(contentToDelete);
      const data = deleteContent(contentToDelete);
      if (data) {
        dispatch(fetchAllContents() as any);
        setShowConfirmDelete(false);
      }
    } catch (error: any) {
      console.error('Error occurred while deleting admin:', error);
    }
  };

  return (
    <>
      <button onClick={() => setShowAddContent(true)}>Add Content</button>
      <ContentTable
        contents={contents}
        onSelectContent={onSelectContent}
        openConfirmDelete={openConfirmDelete}
      />
      {showSelectedContent && selectedContent && (
        <Modal onClose={() => setShowSelectedContent(false)}>
          <ContentDetails
            content={selectedContent}
            updateContentDetails={onSelectContent}
          />
        </Modal>
      )}
      {showAddContent && (
        <Modal onClose={() => setShowAddContent(false)}>
          <AddContent />
        </Modal>
      )}
      {showConfirmDelete && contentToDelete && (
        <Modal onClose={() => setShowConfirmDelete(false)}>
          <AreYouSure
            onCancel={() => setShowConfirmDelete(false)}
            message={`Are you sure you want to delete this content? This action is irreversible.`}
            onConfirm={handleDeleteAdmin}
          />
        </Modal>
      )}
    </>
  );
};

export default Content;
