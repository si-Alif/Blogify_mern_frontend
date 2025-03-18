const UserInfoItem = ({ label, value, isVerified }) => {
  return (
    <div className="flex flex-col p-4 bg-blue-50 dark:bg-gray-800 rounded-lg shadow-sm relative">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
        {isVerified && (
          <span className="ml-2 text-green-500" title="Verified">
            ✓
          </span>
        )}
      </span>
      <span className="text-gray-800 dark:text-gray-200 font-semibold truncate">
        {value || 'N/A'}
      </span>
    </div>
  );
};

export default UserInfoItem;