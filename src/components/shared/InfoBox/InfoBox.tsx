import { ReactNode } from "react";
import "./InfoBox.css";

export interface InfoItem {
  label: string;
  value: string | ReactNode;
}

interface InfoBoxProps {
  items: InfoItem[];
}

export const InfoBox = ({ items }: InfoBoxProps) => {
  return (
    <div className="info-box">
      {items.map((item, index) => (
        <div key={index} className="info-box__item">
          <strong className="info-box__label">{item.label}:</strong>{" "}
          <span className="info-box__value">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
