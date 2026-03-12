import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks, updateTaskStatus, deleteTask } from '../features/tasks/taskSlice';
import { getProjects } from '../features/projects/projectSlice';
import TaskForm from '../components/TaskForm';
import { clearTasks } from '../features/tasks/taskSlice';
import Spinner from '../components/Spinner';

function ProjectDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const { tasks, isLoading } = useSelector((state) => state.tasks);
  const { projects, isLoading: projectsLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const project = projects.find((p) => p._id === id);

  useEffect(() => {
    if (projects.length == 0) {
      dispatch(getProjects());
    }
    dispatch(clearTasks());
    if (id) {
      dispatch(getTasks(id));
    }
  }, [dispatch, id, projects.length]);


  const isAuthorized = user && project && (user.role === 'Admin' || user._id === project.createdBy);

  const canUpdateStatus = (task) => {
    return isAuthorized || (task.assignedTo?._id === user._id);
  };

  if (projectsLoading) return (
    <Spinner message='Projects' />
  )
  if (!project) return <div className="p-10 text-center">Project not found...</div>;

  const filteredTasks = statusFilter === 'All'
    ? tasks
    : tasks.filter(task => task.status === statusFilter);

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
            Filter:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
          {isAuthorized && (
            <button
              onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + New Task
            </button>
          )}
        </div>
      </header>

      {/* Task List Rendering */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500 italic">
            <Spinner message='tasks' />
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task._id} className="p-4 border rounded shadow-sm bg-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p>Status: {task.status} | Priority: {task.priority}</p>
                  <p>Assigned to: {task.assignedTo?.name || 'Unassigned'}</p>
                  <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Edit Button */}
                {isAuthorized && (
                  <button
                    onClick={() => { setTaskToEdit(task); setIsModalOpen(true); }}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Edit
                  </button>
                )}

                {isAuthorized && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this task?')) {
                        dispatch(deleteTask(task._id));
                      }
                    }}
                    className="text-red-600 hover:underline text-sm font-medium"
                  >
                    Delete
                  </button>
                )}

                {/* Status Select */}
                <select
                  value={task.status}
                  // This ensures the dropdown is unclickable for unauthorized users
                  disabled={!canUpdateStatus(task)}
                  onChange={(e) => dispatch(updateTaskStatus({ id: task._id, status: e.target.value }))}
                  className={`p-1 border rounded text-sm ${canUpdateStatus(task) ? 'cursor-pointer' : 'bg-gray-100 cursor-not-allowed opacity-70'}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-500">
            {statusFilter === 'All' ? 'No tasks found for this project.' : `No ${statusFilter} tasks found.`}
          </div>
        )}

      </div>

      {isModalOpen && (
        <TaskForm
          projectId={id}
          taskToEdit={taskToEdit}
          onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}
        />
      )}
    </div>
  );
}

export default ProjectDetails;