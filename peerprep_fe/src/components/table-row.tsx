import TextButton from "@/components/text-button";

export default function TableRow({
  title,
  difficulty,
  topics,
}: {
  title: string;
  difficulty: string;
  topics: string[];}
) {
  const questionLink = title.toLocaleLowerCase().replace(/\s/g, '_');

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-6 text-left whitespace-nowrap">
        <TextButton text={title} link={`questions/${questionLink}`}/>
      </td>
      <td className="py-3 px-6 text-left">
        {difficulty}
      </td>
      <td className="py-3 px-6 text-left flex flex-row">
        {topics.map(
          (topic, index) => {
            return (
              <span 
                className="bg-indigo-500 text-white font-bold py-2 my-3 w-fit p-2 m-0.5 rounded-full"
                key={index}
              >
                {topic}
              </span>
            )
          }
        )}
      </td>
    </tr>
  );
}