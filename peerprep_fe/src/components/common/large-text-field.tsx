export default function LargeTextfield({
  name,
  secure = false,
  placeholder_text = "Enter your text",
  text,
}: {
  name?: string;
  secure?: boolean;
  placeholder_text?: string;
  text?: string;
}) {
  return (
    <input
      name={name}
      type={secure ? "password" : "text"}
      className="bg-slate-200 dark:bg-slate-700 rounded-lg w-full h-16 p-4 my-3 focus:outline-none"
      placeholder={placeholder_text}
      defaultValue={text}
    />
  );
}
