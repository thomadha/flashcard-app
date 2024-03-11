import React from "react";

interface ActionProps {
  handleClick: () => void;
  type: string | JSX.Element;
  className: string;
}

const Action: React.FC<ActionProps> = ({ handleClick, type, className }) => {
  return (
    <div className={className} onClick={handleClick}>
      {type}
    </div>
  );
};

export default Action;
