import { Details } from "@/types";
import { Icon } from "lucide-react";
import { FC } from "react";

interface CardProps {
  item: Details;
}

const Card: FC<CardProps> = ({ item }) => {
  return (
    <div className="flex w-full gap-2 rounded-xs  h-fit  bg-slate-200">
      <div
        className="w-[90px] h-[90px] rounded-l-xs flex justify-center  items-center "
        style={{
          background: `${item.color}`,
        }}
      >
        <item.icon color={"white"} size={50} />
      </div>
      <div>
        <p className="text-xs m-1 ">{item.title.toUpperCase()}</p>
        <p className="font-semibold ">{item.value}</p>
      </div>
    </div>
  );
};

export default Card;
