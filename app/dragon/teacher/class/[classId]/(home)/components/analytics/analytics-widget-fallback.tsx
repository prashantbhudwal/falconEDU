import React from "react";

const AnalyticsWidgetFallback = () => {
  return (
    <div className="p-3 rounded-xl bg-base-200 w-[250px] h-[200px]">
      <div className="animate-pulse h-7 rounded-xl bg-base-100"></div>
      <div className="animate-pulse mt-3 h-4 rounded-xl bg-base-100"></div>
      <div className="animate-pulse mt-3 h-4 rounded-xl bg-base-100"></div>
    </div>
  );
};

export default AnalyticsWidgetFallback;
