import React from "react";

interface ColoredProgressProps {
  value: number; // 0-100
  className?: string;
}

export const ColoredProgress: React.FC<ColoredProgressProps> = ({
  value,
  className,
}) => {
  const progress = Math.min(Math.max(value, 0), 100);

  // Determine color based on 5 steps
  const colorClass =
    progress <= 20
      ? "bg-red-500"
      : progress <= 40
      ? "bg-orange-400"
      : progress <= 60
      ? "bg-yellow-400"
      : progress <= 80
      ? "bg-lime-400"
      : "bg-green-500";

  return (
    <div
      className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}
    >
      <div
        className={`h-2 ${colorClass} rounded-full transition-all duration-200`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
