import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from './taskService';

export const getTasks = createAsyncThunk('tasks/getAll', async (projectId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await taskService.getTasks(projectId, token);
  } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await taskService.createTask(taskData, token);
  } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (taskData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await taskService.updateTask(taskData, token);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await taskService.updateTaskStatus(id, status, token);
  } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    await taskService.deleteTask(taskId, token);
    return taskId;
  } catch (error) { 
    return thunkAPI.rejectWithValue(error.response.data); 
  }
});

const taskSlice = createSlice({
  name: 'task',
  initialState: { tasks: [], isLoading: false },
  reducers: {
    clearTasks: (state) => { state.tasks = []; } // Add this
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        state.tasks = [];
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createTask.fulfilled, (state, action) => { state.tasks.push(action.payload); })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload; // Updates the list in UI
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
  },
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;