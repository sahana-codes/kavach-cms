import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Content } from '../component/content';
import { AppThunk, RootState } from '.';
import { getAllContent } from '../services/content';
import { openSnackbar } from './snackbarSlice';

interface ContentState {
  contents: Content[];
}

const initialState: ContentState = {
  contents: [],
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContents: (state, action: PayloadAction<Content[]>) => {
      state.contents = action.payload;
    },
    // addContent: (state, action: PayloadAction<Content>) => {
    //   state.contents.push(action.payload);
    // },
    // updateContent: (state, action: PayloadAction<Content>) => {
    //   const index = state.contents.findIndex(
    //     (c) => c._id === action.payload._id
    //   );
    //   if (index !== -1) {
    //     state.contents[index] = action.payload;
    //   }
    // },
    // deleteContent: (state, action: PayloadAction<string>) => {
    //   state.contents = state.contents.filter((c) => c._id !== action.payload);
    // },
  },
});

// Export the actions
export const {
  setContents,
  //  addContent, updateContent, deleteContent
} = contentSlice.actions;

export const fetchAllContents = (): AppThunk => async (dispatch) => {
  try {
    const { data } = await getAllContent();
    const allContents = data.data.map((content: Content) => ({
      _id: content._id,
      title: content.title,
      contentType: content.contentType,
    }));

    dispatch(setContents(allContents));
  } catch (error) {
    dispatch(
      openSnackbar({
        message: 'Error fetching all admins',
        severity: 'error',
      })
    );
  }
};

export const selectContents = (state: RootState) => state.content.contents;

export default contentSlice.reducer;
