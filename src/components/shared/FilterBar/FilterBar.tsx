import { ReactNode } from "react";
import "./FilterBar.css";

interface FilterBarProps {
  children: ReactNode;
}

export const FilterBar = ({ children }: FilterBarProps) => {
  return <div className="filter-bar">{children}</div>;
};
