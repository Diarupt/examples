import { FC, PropsWithChildren, ReactElement, useState } from "react";

export const Dropdown: FC<PropsWithChildren<{ trigger: ReactElement }>> = ({ children, trigger }) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
      <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        {trigger}
        {open &&
          <div className="absolute top-[100%] left-[-110%] flex flex-col py-2 border-slate-200 border-[1px] rounded-lg min-w-[200px] w-fit bg-slate-100">
            {children}
          </div>}
      </div>
    )
  }
  