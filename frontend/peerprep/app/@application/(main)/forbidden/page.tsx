// pages/403.js
import React from "react";

const ForbiddenPage = () => {
  return (
    <div className="p-20">
      <h1 className="text-secondary text-3xl font-bold">403 Forbidden</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Oops! You don't have permission to access this page.
      </p>
    </div>
  );
};

export default ForbiddenPage;
