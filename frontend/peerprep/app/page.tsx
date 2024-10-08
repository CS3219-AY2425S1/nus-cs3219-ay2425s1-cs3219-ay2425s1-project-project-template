"use client";

export default function Home() {
  const friends = [
    { name: "s_name", status: "online" },
    { name: "thisisalongusername", status: "online" },
    { name: "Friend3", status: "hidden" },
    { name: "Friend4", status: "offline" },
  ];

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-center">
        Placeholder landing page
      </h1>
    </div>
  );
}
