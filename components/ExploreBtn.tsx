"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {}

const ExploreBtn = ({}: Props) => {
  return (
    <button className="mt-7 mx-auto" id="explore-btn" type="button">
      <Link href={"#events"}>
        Explore Events
        <Image
          src={"/icons/arrow-down.svg"}
          alt="arrow-down"
          width={24}
          height={24}
        />
      </Link>
    </button>
  );
};

export default ExploreBtn;
