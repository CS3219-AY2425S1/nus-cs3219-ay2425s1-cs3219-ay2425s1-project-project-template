import Link from "next/link";

export default function Button({ text="Button", link="", onClick }:
  { text?: string, link?: string, onClick?: () => void }) {
  return (
    <Link href={link}>
      <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 my-3 w-full rounded-lg"
          onClick={onClick}>
        {text}
      </button>
    </Link>
  );
}