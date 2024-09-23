import { NextIcon, PrevIcon } from "../icons";
import { useAppData } from "../hooks/AppDataProvider";

const durationFilters = [
  {
    label: "Daily",
    value: "daily",
  },
  {
    label: "Weekly",
    value: "weekly",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
];

function PrevNextNav(props: any) {
  const {
    selectedStartDay,
    selectedEndDay,
    dayOffset,
    setDayOffset,
    range,
    setRange,
    onPrevClick,
    onNextClick,
    isFocusLoading,
  } = props;

  const appData = useAppData();
  const { deviceType = "desktop" } = appData;

  const onDurationClick = (value: string) => {
    setDayOffset(0);
    setRange(value);
  };

  return (
    <div className="flex items-center">
      <div className="hidden md:block">
        <div className="flex">
          {durationFilters.map((duration, index) => {
            return (
              <div
                onClick={
                  duration.value !== range
                    ? () => onDurationClick(duration.value)
                    : () => {}
                }
                className={`mr-2 px-2 rounded border border-gray-300 text-gray-800 ${
                  duration.value === range ? " bg-blue-500 text-white" : ""
                }`}
                key={index}
              >
                {duration.label}
              </div>
            );
          })}
        </div>
      </div>

      <div onClick={() => onPrevClick()}>
        <PrevIcon
          color={
            isFocusLoading ? "rgba(37, 99, 235, .5)" : "rgba(37, 99, 235, 1)"
          }
        />
      </div>
      {deviceType === "mobile" || range === 'daily' ? (
        <div className="text-gray-800 font-bold text-xl ml-2 mr-2">
          {selectedStartDay}
        </div>
      ) : null}
      {deviceType === "desktop" && range !== 'daily' ? (
        <div className="text-gray-800 font-medium text-xl ml-2 mr-2">
          {selectedStartDay}
          <span className="text-lg text-gray-600">{" to "}</span>
          {selectedEndDay}
        </div>
      ) : null}
      <div onClick={() => onNextClick()}>
        <NextIcon
          color={
            dayOffset === 0 || isFocusLoading
              ? "rgba(37, 99, 235, .5)"
              : "rgba(37, 99, 235, 1)"
          }
        />
      </div>
    </div>
  );
}

export default PrevNextNav;
