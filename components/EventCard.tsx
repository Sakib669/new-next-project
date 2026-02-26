import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
}

const EventCard = ({ image, title }: Props) => {
  return (
    <Link href={"/events"}>
      <Image
        className="poster"
        src={image}
        alt={title}
        width={410}
        height={300}
      />
      <p className="title">{title}</p>
    </Link>
  );
};

export default EventCard;
