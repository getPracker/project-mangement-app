import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../features/projects/projectSlice';
import ProjectForm from '../components/ProjectForm';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { projects, isLoading } = useSelector((state) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        <Spinner message='projects' />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Your Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold cursor-pointer hover:bg-blue-700"
        >
          + Create New Project
        </button>
      </header>

      {isModalOpen && <ProjectForm onClose={() => setIsModalOpen(false)} />}

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
              className="bg-white p-6 rounded-2xl border border-gray-200 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className='flex gap-4'>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                {user && project.createdBy === user._id && (
                  <div className="mb-2">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">
                      Created
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-6 text-sm h-12 line-clamp-2">
                {project.description}
              </p>

              {/* Stats Section */}
              <div className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-left">
                Project Tasks
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                  <p className="text-lg font-bold text-gray-800">{project.totalTasks || 0}</p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <p className="text-xs text-green-600 uppercase font-bold">Done</p>
                  <p className="text-lg font-bold text-green-700">{project.completedTasks || 0}</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <p className="text-xs text-yellow-600 uppercase font-bold">Pending</p>
                  <p className="text-lg font-bold text-yellow-700">{project.pendingTasks || 0}</p>
                </div>
              </div>

              <button className="cursor-pointer w-full py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                View Project
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No projects found. Time to start something new!</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;