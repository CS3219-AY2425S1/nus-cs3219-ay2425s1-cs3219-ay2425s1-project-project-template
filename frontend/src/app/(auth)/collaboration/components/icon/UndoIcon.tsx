import Image from "next/image";
import Link from "next/link";

const UndoIcon = () => {
  const iconSize = 24;
  return (
    <div className="inline-block">
        <Image
          alt="Undo Icon"
          src="/undo.svg"
          width={iconSize}
          height={iconSize}
        />
    </div>
  );
};

export default UndoIcon;
