import { FC, PropsWithChildren } from "react";

interface CardProps  {
  className?: string;
}

export const Card: FC<PropsWithChildren<CardProps>> = ({ children, className }) => (
  <div
    className={` border-slate-200 border-[1px] flex flex-col shadow-xl rounded-3xl ${className}`}>
    {children}
  </div>
);
