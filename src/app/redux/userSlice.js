import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (page = 1) => {
  const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
  return { data: response.data.data, total_pages: response.data.total_pages };
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    page: 1,
    totalPages: 0,
    loading: false,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage } = userSlice.actions;
export default userSlice.reducer;
