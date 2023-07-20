import React, { useEffect, useState } from 'react';
import Header from '../header';
import ContentTable from './contentTable';
import { getAllContent, getContentDetails } from '../../services/content';
import ContentDetails from './contentDetails';
import Modal from '../modal';
import AddContent from './addContent';

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
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] =
    useState<SelectedContent | null>(null);
  const [showSelectedContent, setShowSelectedContent] = useState(false);
  const [showAddContent, setShowAddContent] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data } = await getAllContent();
      setContents(
        data.data.map((content: Content) => ({
          _id: content._id,
          title: content.title,
          contentType: content.contentType,
        }))
      );
    } catch (error) {
      console.error('Error occurred while fetching contents:', error);
    }
  };

  const onSelectContent = async (contentId: string) => {
    try {
      const { data } = await getContentDetails(contentId);
      setSelectedContent(data.data);
      setShowSelectedContent(true);
    } catch (error) {
      console.error('Error occurred while fetching content details:', error);
    }
  };

  return (
    <>
      <Header />
      <button onClick={() => setShowAddContent(true)}>Add Content</button>
      <ContentTable contents={contents} onSelectContent={onSelectContent} />
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
          <AddContent fetchContents={fetchContents} />
        </Modal>
      )}
    </>
  );
};

export default Content;
