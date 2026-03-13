import api from "../../api/axiosConfig";

const API_URL = '/api/tasks/';

const createTask = async (taskData) => {
  const response = await api.post(API_URL, taskData);
  return response.data;
};

const getTasks = async (projectId) => {
  const response = await api.get(`${API_URL}?projectId=${projectId}`);
  return response.data;
};

const updateTask = async (taskData) => {  
  const response = await api.put(API_URL + taskData.id, taskData);
  return response.data;
};

const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(`${API_URL}${taskId}`, { status });
  return response.data;
};

const deleteTask = async (taskId) => {
  const response = await api.delete(API_URL + taskId);
  return response.data;
};

const taskService = { createTask, getTasks, updateTask, updateTaskStatus, deleteTask };
export default taskService;