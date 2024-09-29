import { useState } from "react";

const Modal = ({ show, onClose, questionData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: questionData?.title || "",
    description: questionData?.description || "",
    category: questionData?.category || "",
    complexity: questionData?.complexity || "Easy",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-black">
      <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Edit Question</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Complexity</label>
            <select
              name="complexity"
              value={formData.complexity}
              onChange={handleChange}
              className="w-full rounded border p-2"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-red-500 px-4 py-2 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
