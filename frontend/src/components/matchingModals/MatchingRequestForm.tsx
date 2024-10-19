import { MatchingRequestFormState } from "../../types/MatchingRequestFormState";

interface MatchingRequestFormProps {
  handleSubmit: () => Promise<void>;
  formData: MatchingRequestFormState;
  setFormData: React.Dispatch<React.SetStateAction<MatchingRequestFormState>>;
}

// MatchingRequestForm.tsx
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
      className="flex flex-col space-y-6" // Use consistent spacing for form fields
    >
      {/* Topic input */}
      <div className="flex items-center space-x-4">
        <label htmlFor="topic" className="w-1/3 text-right">Topic:</label>
        <input
          type="text"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleInputChange}
          className="w-2/3 block rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      {/* Difficulty input */}
      <div className="flex items-center space-x-4">
        <label htmlFor="difficulty" className="w-1/3 text-right">Difficulty:</label>
        <input
          type="text"
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleInputChange}
          className="w-2/3 block rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      {/* Submit button */}
      <div className="flex justify-center mb-4">
        <button
          type="submit"
          className="px-6 py-2 text-white bg-black rounded hover:bg-gray-700"
        >
          Find Match
        </button>
      </div>
    </form>
  );
};

export default MatchingRequestForm;