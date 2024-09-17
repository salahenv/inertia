import React, { useState, useEffect } from "react";

const SkeletonLoaderFocus = ({classNames}: any) => {
  return (
    <div>
      <div className={"animate-pulse" + classNames}>
        <div className="space-y-1">
          <div className="h-8 bg-gray-200 rounded-md w-full"></div>
          <div className="h-8 bg-gray-200 rounded-md w-full"></div>
          <div className="h-8 bg-gray-200 rounded-md w-full"></div>
          <div className="h-8 bg-gray-200 rounded-md w-full"></div>
          <div className="h-8 bg-gray-200 rounded-md w-full"></div>
          <div className="h-8 bg-gray-200 rounded-md w-full"></div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoaderTodo = ({classNames}: any) => {
  return (
    <div>
      <div className={"animate-pulse" + classNames}>
        <div className="space-y-1">
          <div className="h-16 bg-gray-200 rounded-md w-full"></div>
          <div className="h-16 bg-gray-200 rounded-md w-full"></div>
          <div className="h-16 bg-gray-200 rounded-md w-full"></div>
          <div className="h-16 bg-gray-200 rounded-md w-full"></div>
        </div>
      </div>
    </div>
  );
};

export {
    SkeletonLoaderFocus,
    SkeletonLoaderTodo
};
