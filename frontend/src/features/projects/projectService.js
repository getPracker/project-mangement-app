// import axios from 'axios';
import api from '../../api/axiosConfig';

const API_URL = '/api/projects/';

const createProject = async (projectData) => {
  const response = await api.post(API_URL, projectData);
  return response.data;
};

const getProjects = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const projectService = { createProject, getProjects };
export default projectService;