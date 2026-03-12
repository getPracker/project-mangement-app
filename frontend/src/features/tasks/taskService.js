import axios from 'axios';

const API_URL = '/api/tasks/';

const createTask = async (taskData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, taskData, config);
  return response.data;
};

const getTasks = async (projectId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}?projectId=${projectId}`, config);
  return response.data;
};

const updateTask = async (taskData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  const response = await axios.put(API_URL + taskData.id, taskData, config);
  return response.data;
};

const updateTaskStatus = async (taskId, status, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.patch(`${API_URL}${taskId}`, { status }, config);
  return response.data;
};

const deleteTask = async (taskId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(API_URL + taskId, config);
  return response.data;
};

const taskService = { createTask, getTasks, updateTask, updateTaskStatus, deleteTask };
export default taskService;