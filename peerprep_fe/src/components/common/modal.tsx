export interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function Modal(props: ModalProps) {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-zinc-900 bg-opacity-80 flex justify-center items-center z-50 ${
        props.isOpen ? "" : "hidden"
      }`}
    >
      <div
        className={`bg-white dark:bg-black w-1/2 max-w-${props.size ?? "xl"} p-8 rounded-lg`}
      >
        <div className="flex justify-between items-center pb-5">
          <h3 className="text-2xl font-bold">{props.title}</h3>
          <button onClick={props.onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-10">{props.children}</div>
      </div>
    </div>
  );
}
