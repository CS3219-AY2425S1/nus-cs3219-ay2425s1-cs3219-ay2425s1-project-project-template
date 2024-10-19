import { MatchingRequestFormState } from "../../types/MatchingRequestFormState";

interface MatchingRequestFormProps {
  handleSubmit: () => Promise<void>;
  formData: MatchingRequestFormState;
  setFormData: React.Dispatch<React.SetStateAction<MatchingRequestFormState>>;
}

const MatchingRequestForm: React.FC<MatchingRequestFormProps> = ({
  handleSubmit,
  formData,
  setFormData,
}) => {
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* Topic input */}
      <div className="mb-4">
        <label htmlFor="topic">Topic:</label>
        <input
          type="text"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleInputChange}
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
          required
        />
      </div>

      {/* Difficulty input */}
      <div>
        <label htmlFor="difficulty">Difficulty:</label>
        <input
          type="text"
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleInputChange}
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
          required
        />
      </div>

      {/* Submit button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Find Match here
        </button>
      </div>
    </form>
  );
};

export default MatchingRequestForm;
