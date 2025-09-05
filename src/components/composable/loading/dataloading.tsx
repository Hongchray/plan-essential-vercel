// components/DataLoading.tsx
import React from "react";

interface DataLoadingProps {
  size?: string; // e.g., "30px"
  color?: string; // Tailwind color class, e.g., "text-gray-500"
}

const DataLoading: React.FC<DataLoadingProps> = ({
  size = "30px",
  color = "text-gray-400",
}) => {
  return (
    <div
      className={`inline-block rounded-full border-4 border-t-4 border-gray-200 ${color} animate-spin`}
      style={{
        width: size,
        height: size,
        borderTopColor: "currentColor", // make the spinning color match Tailwind text color
        animationDuration: "0.5s", // spins twice as fast
      }}
    />
  );
};

export default DataLoading;
