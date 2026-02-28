
export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

 const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "React Summit US 2025",
    slug: "react-summit-us-2025",
    location: "San Francisco, CA, USA",
    date: "2025-11-07",
    time: "09:00 AM",
  },
  {
    image: "/images/event2.png",
    title: "KubeCon + CloudNativeCon Europe 2026",
    slug: "kubecon-cloudnativecon-europe-2026",
    location: "Vienna, Austria",
    date: "2026-03-18",
    time: "10:00 AM",
  },
  {
    image: "/images/event3.png",
    title: "Next.js Conf 2025",
    slug: "nextjs-conf-2025",
    location: "San Francisco, CA, USA",
    date: "2025-10-25",
    time: "08:30 AM",
  },
  {
    image: "/images/event4.png",
    title: "JSWorld Conference 2026",
    slug: "jsworld-conference-2026",
    location: "Amsterdam, Netherlands",
    date: "2026-02-12",
    time: "09:30 AM",
  },
  {
    image: "/images/event5.png",
    title: "Web Directions Summit 2025",
    slug: "web-directions-summit-2025",
    location: "Sydney, Australia",
    date: "2025-12-04",
    time: "09:00 AM",
  },
  {
    image: "/images/event6.png",
    title: "Render ATL 2026",
    slug: "render-atl-2026",
    location: "Atlanta, GA, USA",
    date: "2026-06-10",
    time: "10:00 AM",
  },
];

export default events;