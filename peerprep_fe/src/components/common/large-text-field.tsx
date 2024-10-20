export default function LargeTextfield({
  id,
  name,
  secure = false,
  placeholder_text = "Enter your text",
  required = false,
  text,
  onChange,
}: {
  id?: string;
  name?: string;
  secure?: boolean;
  placeholder_text?: string;
  required?: boolean;
  text?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      id={id}
      required={required}
      name={name}
      type={secure ? "password" : "text"}
      className="bg-slate-200 dark:bg-slate-700 rounded-lg w-full h-16 p-4 my-3 focus:outline-none"
      placeholder={placeholder_text}
      defaultValue={text}
      onChange={onChange}
    />
  );
}
