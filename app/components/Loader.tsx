import React, { useState, useEffect } from "react";

const SkeletonLoaderFocus = ({}: any) => {
  return (
    <div>
      <div className="animate-pulse">
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded-md w-full"></div>
          <div className="h-6 bg-gray-300 rounded-md w-full"></div>
          <div className="h-6 bg-gray-300 rounded-md w-full"></div>
          <div className="h-6 bg-gray-300 rounded-md w-full"></div>
          <div className="h-6 bg-gray-300 rounded-md w-full"></div>
          <div className="h-6 bg-gray-300 rounded-md w-full"></div>
        </div>
      </div>
    </div>
  );
};

export {
    SkeletonLoaderFocus,
};
