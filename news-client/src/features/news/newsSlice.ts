import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store';
import INews from '../../interfaces/news';
import IComment from '../../interfaces/comment';

const initialState : { news: { [key: string]: INews } } = { news: {} };

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    incrementLikes: (state, action: PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      console.log(state.news[action.payload]);
      state.news[action.payload].likes += 1;
      state.news[action.payload].liked = true;
    },
    decrementLikes: (state, action: PayloadAction<string>) => {
        console.log(state.news[action.payload]);
        state.news[action.payload].likes -= 1;
        state.news[action.payload].liked = false;
    },
    incrementDislikes: (state, action: PayloadAction<string>) => {
        console.log(state.news[action.payload]);
        state.news[action.payload].dislikes += 1;
        state.news[action.payload].disliked = true;
    },
    decrementDislikes: (state, action: PayloadAction<string>) => {
        console.log(state.news[action.payload]);
        state.news[action.payload].dislikes -= 1;
        state.news[action.payload].disliked = false;
    },
    changeCategory: (state, action: PayloadAction<{ id: string, category: string}>) => {
        state.news[action.payload.id].category = action.payload.category;
    },
    addComment: (state, action: PayloadAction<{ postId: string, comment: IComment }>) => {
        state.news[action.payload.postId].comments.push(action.payload.comment);
    },
    removeComment: (state, action: PayloadAction<{ postId: string, commentId: string}>) => {
        state.news[action.payload.postId].comments =
            state.news[action.payload.postId].comments.filter(comment => comment.id !== action.payload.commentId);
    },
    receiveNews: (state, action: PayloadAction<INews[]>) => {
        console.log('receive', action.payload);
        const newState : { [key: string]: INews } = {};
        action.payload.forEach(news => {
            newState[news.id] = news;
        });
        state.news = newState;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
    incrementLikes,
    decrementLikes,
    incrementDislikes,
    decrementDislikes,
    changeCategory,
    addComment,
    removeComment,
    receiveNews
} = newsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectNews = (state: RootState) => state.news

export default newsSlice.reducer;