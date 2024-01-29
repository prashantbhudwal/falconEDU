import React from "react";

const AnalyticsWidgetFallback = () => {
  return (
    <div className="h-[200px] w-[250px] rounded-xl bg-base-200 p-3">
      <div className="h-7 animate-pulse rounded-xl bg-base-100"></div>
      <div className="mt-3 h-4 animate-pulse rounded-xl bg-base-100"></div>
      <div className="mt-3 h-4 animate-pulse rounded-xl bg-base-100"></div>
    </div>
  );
};

export default AnalyticsWidgetFallback;
