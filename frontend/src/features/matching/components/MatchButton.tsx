import React from "react";
import GreenButton from "../../../components/GreenButton";

const MatchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return <GreenButton onClick={onClick} label="Find Match!" />;
};

export default MatchButton;
