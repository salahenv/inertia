import React, { useState, useEffect } from "react";

const SkeletonLoaderFocus = ({classNames}: any) => {
  return (
    <div>
      <div className={"animate-pulse" + classNames}>
        <div className="space-y-1">
          <div className="h-8 bg-gray-300 rounded-md w-full"></div>
          <div className="h-8 bg-gray-300 rounded-md w-full"></div>
          <div className="h-8 bg-gray-300 rounded-md w-full"></div>
          <div className="h-8 bg-gray-300 rounded-md w-full"></div>
          <div className="h-8 bg-gray-300 rounded-md w-full"></div>
          <div className="h-8 bg-gray-300 rounded-md w-full"></div>
        </div>
      </div>
    </div>
  );
};

export {
    SkeletonLoaderFocus,
};
