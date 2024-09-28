import Link from "next/link";

export default function Button({
  type = "button",
  text = "Button",
  link = "",
  onClick,
}: {
  type?: "button" | "submit" | "reset" | undefined;
  text?: string;
  link?: string;
  onClick?: () => void;
}) {
  const button = (
    <button
      type={type}
      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold px-3 py-3 my-3 w-full rounded-lg"
      onClick={onClick}
    >
      {text}
    </button>
  );

  if (link != "") {
    return <Link href={link}>{button}</Link>;
  }
  return button;
}
