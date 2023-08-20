import { FC, HTMLAttributes, PropsWithChildren } from "react";

interface IconButtonProps  {
  className?: string;
}

export const IconButton: FC<PropsWithChildren<
  IconButtonProps & HTMLAttributes<HTMLButtonElement>
>> = ({ children, className, ...rest }) => (
  <button
    {...rest}
    className={`p-5 text-sm font-semibold text-white bg-black/50 rounded-full hover:bg-black/60 ${className}`}>
    {children}
  </button>
);
