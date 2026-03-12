import * as Yup from 'yup';

export const taskSchema = Yup.object({
  title: Yup.string().required('Title is required').min(3, 'Min 3 characters'),
  description: Yup.string().required('Description is required'),
  priority: Yup.string().oneOf(['Low', 'Medium', 'High']).required(),
  
  dueDate: Yup.date()
    .nullable()
    .transform((curr, orig) => {
      // If it's a number (timestamp), convert it to a Date object
      if (typeof orig === 'number') return new Date(orig);
      // If it's an empty string, convert to null
      if (orig === '') return null;
      return curr;
    })
    .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Due date cannot be in the past'),
    
  assignedTo: Yup.string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .optional(),
});