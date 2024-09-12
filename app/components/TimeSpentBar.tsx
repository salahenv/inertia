import React from 'react';

const TimeSpentBar = ({ data }: { data: any[] }) => {
  // Helper function to calculate time difference in minutes
  const calculateTimeDifference = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return (endTime - startTime) / (1000 * 60); // Convert milliseconds to minutes
  };

  // Calculate total time spent for each tag
  const timeSpentByTag: { [key: string]: number } = {};
  data.forEach(item => {
    const timeSpent = calculateTimeDifference(item.startTime, item.endTime);
    if (timeSpentByTag[item.tag]) {
      timeSpentByTag[item.tag] += timeSpent;
    } else {
      timeSpentByTag[item.tag] = timeSpent;
    }
  });

  // Calculate total time spent
  const totalTimeSpent = Object.values(timeSpentByTag).reduce((acc, time) => acc + time, 0);

  // Extended list of colors
  const colors = [
    'bg-green-400',
    'bg-red-400',
    'bg-blue-400',
    'bg-yellow-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-teal-400',
    'bg-orange-400',
    'bg-indigo-400',
    'bg-cyan-400',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-indigo-500',
    'bg-cyan-500',
    'bg-yellow-600',
    'bg-green-600',
    'bg-blue-600',
    'bg-red-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-teal-600',
    'bg-orange-600',
    'bg-indigo-600',
    'bg-gray-400'
  ];

  // Map tags to colors dynamically
  const tagColors: { [key: string]: string } = {};
  Object.keys(timeSpentByTag).forEach((tag, index) => {
    tagColors[tag] = colors[index % colors.length];
  });

  // Calculate widths and offsets and sort by width descending
  const segments = Object.entries(timeSpentByTag)
    .map(([tag, timeSpent]) => {
      const width = (timeSpent / totalTimeSpent) * 100;
      return { tag, width, color: tagColors[tag] };
    })
    .sort((a, b) => b.width - a.width); // Sort by width in descending order

  // Calculate offsets based on sorted segments
  let offset = 0;
  const segmentElements = segments.map(({ tag, width, color }) => {
    const segment = (
      <div
        key={tag}
        className={`absolute top-0 h-full ${color} rounded flex items-center justify-center`}
        style={{ width: `${width}%`, left: `${offset}%` }}
      >
        <span className="text-xs text-gray-700">{Math.round(width)}%</span>
      </div>
    );
    offset += width;
    return segment;
  });

  return (
    <div className="w-full">
      <div className="relative w-full bg-gray-200 rounded h-8">
        {segmentElements}
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {Object.keys(tagColors).map(tag => (
          <div key={tag} className="flex items-center">
            <div className={`w-4 h-4 rounded mr-2 ${tagColors[tag]}`} />
            <span>{tag.replace("_", " ").toLocaleLowerCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSpentBar;
