import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from './projectService';

const initialState = {
  projects: [],
  isError: false,
  isLoading: false,
  message: ''
};

// Async action to get projects
export const getProjects = createAsyncThunk('projects/getAll', async (_, thunkAPI) => {
  try { 
    const token = thunkAPI.getState().auth.user.token;
    return await projectService.getProjects(token); 
  }
  catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const createProject = createAsyncThunk('projects/create', async (projectData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await projectService.createProject(projectData, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => { state.isLoading = true; })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload); // Adds the new project to your list
      });
  },
});

export const { reset } = projectSlice.actions;
export default projectSlice.reducer;