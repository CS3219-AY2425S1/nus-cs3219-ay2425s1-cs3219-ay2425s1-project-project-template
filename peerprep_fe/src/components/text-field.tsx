export default function Textfield({ secure=false, placeholder_text="Enter your text" }:
  { secure?: boolean, placeholder_text?: string }) {
  return (
    <input
      type = { secure ? "password" : "text" }
      className = "bg-slate-200 dark:bg-slate-700 rounded-lg w-full p-4 my-3 focus:outline-none"
      placeholder = { placeholder_text }
    />
  );
}