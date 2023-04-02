import { configureStore } from '@reduxjs/toolkit'
import newsReducer from './features/news/newsSlice';

const store = configureStore({
  reducer: {
    news: newsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch