"use client";
import { useParams } from "next/navigation";

interface Props {
  // params : Promise<{id: string}>
}

const page = ({}: Props) => {
  const {id} = useParams();
  console.log(id);
  return <div>this dynamic page for {id}</div>;
};

export default page;
