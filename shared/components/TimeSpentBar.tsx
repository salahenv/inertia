import React from "react";
import { useStore } from "../hooks/useStore";

const TimeSpentBar = () => {
  const store = useStore();
  const {
    focus: {
      focuses = []
    } = {}
  } = store || {};
  const calculateTimeDifference = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return (endTime - startTime) / (1000 * 60); // Convert milliseconds to minutes
  };

  const timeSpentByTag: { [key: string]: number } = {};
  focuses.forEach((focus: any) => {
    const timeSpent = calculateTimeDifference(focus.startTime, focus.endTime);
    if (timeSpentByTag[focus.tag]) {
      timeSpentByTag[focus.tag] += timeSpent;
    } else {
      timeSpentByTag[focus.tag] = timeSpent;
    }
  });

  let bgColorClass = "bg-gray-200";
  let smiley = "";
  const totalTimeSpent = Object.values(timeSpentByTag).reduce(
    (acc, time) => acc + time,
    0
  );
  if (totalTimeSpent <= 0) {
  } else if (totalTimeSpent < 120) {
    bgColorClass = "bg-gradient-to-r from-red-100";
    smiley = "😞";
  } else if (totalTimeSpent >= 120 && totalTimeSpent < 180) {
    bgColorClass = "bg-gradient-to-r from-orange-200";
    smiley = "🙂";
  } else if (totalTimeSpent >= 180 && totalTimeSpent < 240) {
    bgColorClass = "bg-gradient-to-r from-orange-100";
    smiley = "🤩";
  } else if (totalTimeSpent >= 240 && totalTimeSpent < 300) {
    bgColorClass = "bg-gradient-to-r from-green-200";
    smiley = "😍";
  } else if (totalTimeSpent >= 300 && totalTimeSpent < 420) {
    bgColorClass = "bg-gradient-to-r from-green-300";
    smiley = "💐";
  } else if (totalTimeSpent >= 420) {
    bgColorClass = "bg-gradient-to-r from-green-400";
    smiley = "💐💐";
  }
  const minutes = Math.floor(totalTimeSpent / 60);
  const remainingSeconds = Math.floor(totalTimeSpent % 60);
  const totalformattedTimeSpent = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;

  const colors = [
    "bg-blue-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-teal-400",
    "bg-orange-400",
    "bg-indigo-400",
    "bg-cyan-400",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-yellow-600",
    "bg-blue-600",
    "bg-purple-600",
    "bg-teal-600",
    "bg-orange-600",
    "bg-indigo-600",
    "bg-gray-400",
  ];

  const tagColors: { [key: string]: string } = {};
  Object.keys(timeSpentByTag).forEach((tag, index) => {
    tagColors[tag] = colors[index % colors.length];
  });

  const segments = Object.entries(timeSpentByTag)
    .map(([tag, timeSpent]) => {
      const width = (timeSpent / totalTimeSpent) * 100;
      return { tag, width, color: tagColors[tag] };
    })
    .sort((a, b) => b.width - a.width); // Sort by width in descending order

  let offset = 0;
  const segmentElements = segments.map(({ tag, width, color }) => {
    const segment = (
      <div
        key={tag}
        className={`absolute top-0 h-full  ${color} flex items-center justify-center`}
        style={{ width: `${width}%`, left: `${offset}%` }}
      >
        {width > 5 && ( // Only show percentage if the segment is wide enough
          <span className="text-xs text-gray-700">{Math.round(width)}%</span>
        )}
      </div>
    );
    offset += width;
    return segment;
  });

  const sortedTags = Object.keys(timeSpentByTag).sort(
    (a, b) => timeSpentByTag[b] - timeSpentByTag[a]
  );

  return (
    <div className={`w-full p-4 rounded ${bgColorClass}`}>
        <div>
          <div className="font-medium text-lg mb-2 text-gray-800">
            Focused{" "}
            <span className={`font-bold p-1 text-green-900`}>
              {totalformattedTimeSpent}
            </span>
            {" " + "hours"} {" " + smiley}
          </div>
          {
            segmentElements && segmentElements.length ?
            <div className="relative w-full rounded h-8 overflow-hidden border border-solid border-gray-300">
              {" "}
              {segmentElements}
            </div> : <div className="w-full rounded h-8 border border-solid border-gray-300 bg-gray-300 text-center"></div>
          }
          <div className="mt-4 flex gap-2 flex-wrap">
            {sortedTags && sortedTags.length ? sortedTags.map((tag) => (
              <div key={tag} className="flex items-center text-gray-800">
                <div
                  className={`w-4 h-4 rounded mr-2 border border-solid border-gray-300 ${tagColors[tag]}`}
                />
                <span>{tag.replace("_", " ").toLocaleLowerCase()}</span>
              </div>
            )) : <div className="flex flex-wrap">
              <div className="w-4 h-4 rounded mr-2 border border-solid border-gray-300 bg-gray-300"></div>
              <div className="w-4 h-4 rounded mr-2 border border-solid border-gray-300 bg-gray-300"></div>
              <div className="w-4 h-4 rounded mr-2 border border-solid border-gray-300 bg-gray-300"></div>
              <div className="w-4 h-4 rounded mr-2 border border-solid border-gray-300 bg-gray-300"></div>
            </div>}
          </div>
        </div>
    </div>
  );
};

export default TimeSpentBar;
