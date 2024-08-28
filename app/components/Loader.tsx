import React, { useState, useEffect } from "react";

const SkeletonLoaderFocus = ({}: any) => {
  return (
    <div>
      <div className="animate-pulse">
        <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
        <div className="h-6 bg-gray-300 rounded-md mb-2 w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded-md w-full"></div>
          <div className="h-4 bg-gray-300 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded-md w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

export {
    SkeletonLoaderFocus,
};
