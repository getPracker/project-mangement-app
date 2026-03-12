function Spinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col justify-center items-center p-10 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      {message && (
        <p className="text-gray-500 font-medium animate-pulse">{`Loading ${message}`}</p>
      )}
    </div>
  );
}

export default Spinner;