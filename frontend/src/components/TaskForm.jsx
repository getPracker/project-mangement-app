import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { taskSchema } from '../schemas/taskSchemas';
import { createTask, updateTask } from '../features/tasks/taskSlice';
import api from '../api/axiosConfig';

function TaskForm({ projectId, onClose, taskToEdit }) {
  const dispatch = useDispatch();

  // Form setup
  const { register, handleSubmit, setValue, formState: { errors, isValid, isDirty } } = useForm({
    resolver: yupResolver(taskSchema),
    mode: 'onTouched',
    defaultValues: {
      title: taskToEdit?.title || '',
      description: taskToEdit?.description || '',
      priority: taskToEdit?.priority || 'Medium',
      dueDate: taskToEdit?.dueDate ? taskToEdit.dueDate.substring(0, 10) : '',
      assignedTo: taskToEdit?.assignedTo?._id || ''
    }
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [userQuery, setUserQuery] = useState(taskToEdit?.assignedTo?.name || '');
  const [userResults, setUserResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false); // NEW: Track focus

  // Debounce logic for user search
  useEffect(() => {
    if (searchQuery.length <= 1) {
      setUserResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await api.get(`/api/auth/search?q=${searchQuery}`);
        setUserResults(res.data);
      } catch (err) { console.error("Search failed", err); }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const onSubmit = async (data) => {
    try {
      if (taskToEdit) {
        await dispatch(updateTask({ id: taskToEdit._id, ...data })).unwrap();
      } else {
        await dispatch(createTask({ ...data, projectId })).unwrap();
      }
      onClose();
    } catch (error) {
      alert(error?.message || "Failed to save task");
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setUserQuery(val);
    setSearchQuery(val);
    if (val === '') {
      setValue('assignedTo', null, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleSelect = (u) => {
    setValue('assignedTo', u._id, { shouldValidate: true, shouldDirty: true });
    setUserQuery(u.name);
    setUserResults([]);
    setIsFocused(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">{taskToEdit ? 'Edit Task' : 'Create Task'}</h2>

        {/* Title & Description & Priority & Date inputs remain the same... */}
        <div className="mb-3">
          <input {...register('title')} className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`} placeholder="Title" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="mb-3">
          <textarea {...register('description')} className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Description" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <select {...register('priority')} className="w-full p-2 border mb-3 rounded">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <div className="mb-3">
          <input type="date" {...register('dueDate')} className={`w-full p-2 border rounded ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
        </div>

        {/* User Assignment Search */}
        <div className="relative mb-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Search user to assign..."
            value={userQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          {isFocused && userResults.length > 0 && (
            <ul className="absolute bg-white border w-full z-10 shadow-lg rounded-b-lg">
              {userResults.map(u => (
                <li key={u._id} className="p-2 hover:bg-gray-100 cursor-pointer" onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(u);
                }}>{u.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 py-2 text-gray-600 rounded-lg transition-colors hover:bg-gray-100 cursor-pointer">Cancel</button>
          <button
            type="submit"
            disabled={!isValid || !isDirty}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold disabled:bg-gray-400"
          >
            {taskToEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;