import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAttemptedQuestions } from '../services/userService';
import { getData } from '../services/questionService';

function HistoryComponent() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    search: '',
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}, ${hours}:${minutes}`;
  };

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await getAttemptedQuestions(userId);
        const questionPartialInfo = data.attemptedQuestions;

        // Fetch all question data in parallel
        const fetchedQuestions = await Promise.all(
          questionPartialInfo.map(async (partialInfo) => {
            try {
              const questionData = await getData(`/${partialInfo.questionId}`);
              return {
                title: questionData ? questionData.title : 'Unknown',
                difficulty: questionData
                  ? capitalizeFirstLetter(questionData.d)
                  : 'Unknown',
                topics: questionData ? questionData.c : ['Unknown'],
                attemptedAt: formatDate(partialInfo.attemptedAt),
                questionId: partialInfo.questionId,
              };
            } catch (error) {
              console.error(
                `Error fetching data for question ID ${partialInfo.questionId}:`,
                error
              );
              return {
                title: 'Unknown',
                difficulty: 'Unknown',
                topics: ['Unknown'],
                attemptedAt: formatDate(partialInfo.attemptedAt),
                questionId: partialInfo.questionId,
              };
            }
          })
        );

        setAllQuestions(fetchedQuestions);
        setDisplayedQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching attempted questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  const filterQuestions = () => {
    const { difficulty, category, search } = filters;
    const filtered = allQuestions.filter((question) => {
      const matchesDifficulty = difficulty
        ? question.difficulty.toLowerCase() === difficulty.toLowerCase()
        : true;
      const matchesCategory = category
        ? question.topics.some((cat) =>
            cat.toLowerCase().includes(category.toLowerCase())
          )
        : true;
      const matchesSearch = search
        ? question.title.toLowerCase().includes(search.toLowerCase()) ||
          question.questionId.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesDifficulty && matchesCategory && matchesSearch;
    });
    setDisplayedQuestions(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    filterQuestions();
  }, [filters, allQuestions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-65px)] w-full flex flex-col items-center bg-[#1a1a1a] px-4 py-8 overflow-y-auto">
      <h2 className="w-full text-center text-white text-4xl font-bold mb-6">
        History
      </h2>

      {/* Search Bar */}
      <div className="w-full md:w-1/2 mb-6">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          className="input w-full bg-[#2a2a2a] text-white border border-[#5b5b5b] rounded-lg p-2 h-[40px] box-border text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="Search by title"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row md:space-x-4 w-full md:w-1/2 mb-6 items-center">
        <select
          name="difficulty"
          value={filters.difficulty}
          onChange={handleInputChange}
          className="select w-full md:w-1/2 bg-[#2a2a2a] text-white border border-[#5b5b5b] rounded-lg p-2 h-[40px] box-border text-sm mb-4 md:mb-0 focus:outline-none focus:border-blue-500"
        >
          <option value="">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          className="input w-full md:w-1/2 bg-[#2a2a2a] text-white border border-[#5b5b5b] rounded-lg p-2 h-[40px] box-border text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="Filter by Topic"
        />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 w-full py-2 border-b border-[#5b5b5b] bg-[#282828] text-white font-semibold text-sm">
        <div className="text-center">Question ID</div>
        <div className="text-center">Title</div>
        <div className="text-center">Difficulty</div>
        <div className="text-center">Topics</div>
        <div className="text-center">Date/Time of Attempt</div>
      </div>

      {/* Display Filtered Questions */}
      {displayedQuestions.length > 0 ? (
        <div className="flex flex-col w-full">
          {displayedQuestions.map((question, index) => (
            <HistoryRow
              key={index}
              questionId={question.questionId}
              title={question.title}
              difficulty={question.difficulty}
              topics={question.topics}
              attemptTime={question.attemptedAt}
            />
          ))}
        </div>
      ) : (
        <div className="text-white mt-4 text-center">
          No questions match the selected filters.
        </div>
      )}
    </div>
  );
}

function HistoryRow({ questionId, title, difficulty, topics, attemptTime }) {
  return (
    <div className="grid grid-cols-5 w-full py-2 border-b border-[#5b5b5b] text-white text-sm hover:bg-[#343434] transition-all">
      <div className="text-center">{questionId}</div>
      <div className="text-center truncate">{title}</div>
      <div className="text-center text-yellow-400 font-semibold">
        {difficulty}
      </div>
      <div className="text-center space-x-1">
        {topics.map((topic, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-600 text-xs rounded-full hover:bg-blue-700 transition-all"
          >
            {topic}
          </span>
        ))}
      </div>
      <div className="text-center">{attemptTime}</div>
    </div>
  );
}

export default HistoryComponent;

