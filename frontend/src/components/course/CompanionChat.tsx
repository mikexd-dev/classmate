import React from "react";
import Image from "next/image";
import BuddySVG from "public/demo-profile.svg";
type Props = {};

const CompanionChat = (props: Props) => {
  return (
    <div className="rounded-3xl bg-stone-200 w-[352px] h-full shadow-md pb-10 mt-5">
      <div className="w-full h-full rounded-t-3xl flex flex-row p-5 pt-3">
        <Image
          src={BuddySVG}
          height={64}
          width={64}
          alt={"buddy"}
          className=""
        />
        <div className="flex flex-col p-5 ">
          <div className="text-black font-oi text-sm font-normal">Gang</div>
          <div className="text-black font-oi text-sm font-normal">
            Too friendly for his own good
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-white absolute top-[24%] w-[352px] h-[500px] shadow-xl p-8 flex flex-col items-end justify-between"></div>
    </div>
  );
};

export default CompanionChat;
