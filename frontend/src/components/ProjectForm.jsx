import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { projectSchema } from '../schemas/projectSchemas';
import { createProject } from '../features/projects/projectSlice';

function ProjectForm({ onClose }) {
  const dispatch = useDispatch();

  // Initialize react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isDirty, isSubmitting } 
  } = useForm({
    resolver: yupResolver(projectSchema),
    mode: 'onTouched',
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // unwrap() ensures we only close if the dispatch succeeds
      await dispatch(createProject(data)).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
      // Optional: Add a toast notification here
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              {...register('name')}
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter project name"
            />
            <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Describe your project"
              rows="4"
            />
            <p className="text-red-500 text-xs mt-1">{errors.description?.message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2 text-gray-600 hover:text-gray-800 transition rounded-lg transition-colors hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!isValid || !isDirty || isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;