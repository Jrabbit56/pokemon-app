import React from "react";

type NavigationButtonProps = {
  onPrevClick: () => void;
  onNextClick: () => void;
  number: number;
  className?: string;
  buttonClassName?: string;
  nextText?: string;
  prevText?: string;
};

const NavigationButton = ({
  onPrevClick,
  onNextClick,
  number,
  className,
  buttonClassName,
  nextText = "Next",
  prevText = "Previous",
}: NavigationButtonProps) => {
  return (
    <div className={`flex justify-between mb-4 ${className}`}>
      <button
        className={`btn ${buttonClassName}`}
        onClick={onPrevClick}
        disabled={number <= 0}
      >
        {prevText}
      </button>
      <button className={`btn ${buttonClassName}`} onClick={onNextClick}>
        {nextText}
      </button>
    </div>
  );
};

export default NavigationButton;
