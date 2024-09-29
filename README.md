[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)
# CS3219 Project (PeerPrep) - AY2425S1
## Group: G38

### Team Members:
- [Daniel](https://github.com/dloh2236)
- [James](https://github.com/jayllo-c)
- [Johan](https://github.com/delishad21)
- [Joshua](https://github.com/dloh2236)

### Milestone 2 Submission - Question Service SPA

For viewing questions, we opted for two types of views. The first is a master view presented as a table, allowing users to quickly browse 10 questions per page with essential details. On the backend, we retrieve only the necessary information to keep the query lean for faster response times. Users can navigate through the questions using pagination, which limits the view to 10 questions per page for a cleaner and more user-friendly interface.


#### Retrieval of Questions (Master view)


#### Table view of questions (master view)

##### Table-view Features:

- **Pagination:** Displays 10 questions per page with navigation options to jump to specific pages or use next/previous buttons for smooth browsing.
- **Search:** A non-case-sensitive search feature allows users to quickly find specific questions.
- **Filter by Complexity:** Users can filter questions by specific complexity levels (Easy, Medium, Hard).
- **Filter by Category:** Select one or more categories to filter questions. Questions containing any of the selected categories will appear in the table.
- **Total Question Count:** Displays the total number of questions based on the applied filters.
- **Quick Actions:** Users can easily edit or delete a question directly from the table.
- **Sort by Title:** Sort questions alphabetically by title for easier navigation.
- **Sort by Complexity:** Sort questions by difficulty level, either increasing or decreasing.
- **Detailed View:** Click on a question to see more detailed information.
- **Asynchronous Loading:** All modifications and loading of questions are done asynchronously, fetching 10 questions at a time for optimal performance.
- **Question Caching:** Previously retrieved questions are cached to enable faster reloading, ensuring quick access to both the list and individual question details.

#### Retrieval of Questions (Detailed View) with Form for Editing and Adding Questions

#### Individual question view (detailed view)

##### Detailed-View Features:

- **Input Validation:** Ensures that both input and output fields are filled for each test case, and prevents the submission of duplicate question titles.
- **Multiple Category Selection:** Allows users to tag questions with multiple categories, providing a list of existing categories while also enabling users to create new ones.
- **Template Code Input with Syntax Highlighting:** Supports syntax highlighting and auto-completion for template code input, with the option to switch between different programming languages for tailored syntax highlighting.

#### Confirmation Messages (Modals)

Confirmation messages are shown as pop-up modals to improve user feedback during actions like creating, updating, or deleting a question. These modals provide clear responses, confirming success or asking for deletion confirmation. This approach reduces mistakes, enhances clarity, and offers a smoother user experience.


### Setting Up the Project

#### Prerequisites

1. Clone this repository to your local machine.
2. Ensure you have the following installed:
   - Node.js (v16.0 or higher) – Download here
   - npm (comes with Node.js)
3. Sign up for a MongoDB Atlas account

#### Remote DB Setup (MongoDB Atlas)



