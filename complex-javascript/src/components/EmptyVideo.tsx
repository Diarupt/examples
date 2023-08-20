import { FC } from "react";
import { Card } from "./Card";

interface EmptyVideoProps {
  mini?: boolean;
  className?: string;
  url: string;
}

interface PulsingAvatarProps {
  url: string;
  type?: "small" | "large";
}

const PulsingAvatar: FC<PulsingAvatarProps> = ({ url, type }) => (
  <div className={`w-[20%] max-w-[300px] aspect-square`}>
    {type === "small" ? (
      <div className="relative">
        <div className="rounded-full p-1 bg-teal-800/10 animate-pulse">
          <div className="w-2xl aspect-square bg-green-800 rounded-full flex items-center justify-center animate-none" />
        </div>
        <img
          src={url}
          alt="avatar"
          className=" w-[calc(100%-0.5em)] aspect-square absolute top-1 left-1 mx-aut color-white rounded-full flex items-center justify-center animate-none"
        />
      </div>
    ) : (
      <div className="relative">
        <div className="rounded-full p-2 bg-teal-800/10 animate-pulse">
          <div className="rounded-full p-4 bg-teal-800/20 animate-pulse">
            <div className="w-2xl aspect-square bg-black rounded-full flex items-center justify-center animate-none" />
          </div>
        </div>
        <img
          src={url}
          alt="avatar"
          className=" w-[calc(100%-2.5em)] aspect-square absolute top-5 left-5 mx-aut color-white rounded-full flex items-center justify-center animate-none"
        />
      </div>
    )}
  </div>
);

export const EmptyVideo: FC<EmptyVideoProps> = ({ mini, url, className }) => {
  if (mini)
    return (
      <div className={`w-[250px] h-[150px] ${className}`}>
        <Card className="relative w-full h-full flex justify-center items-center overflow-hidden border-slate-200 shadow-md">
          <PulsingAvatar type="small" url={url} />
          <span className="absolute top-5 left-5 bg-black/30 py-2 px-2 rounded-full text-white font-semibold text-sm">
            {" "}
          </span>
        </Card>
      </div>
    );

  return (
    <div
      className={`w-screen aspect-video relative bg-white flex justify-center items-center overflow-hidden p-3 max-h-[90vh] ${className}`}>
      <PulsingAvatar url={url} />
    </div>
  );
};
