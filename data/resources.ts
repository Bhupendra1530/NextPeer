export const RESOURCES = [
  {
    slug: "resume-templates",
    title: "Resume Templates",
    description: "Two editable text layouts for freshers and students with internship experience.",
    content: `# NextPeer Resume Templates

Replace every placeholder with accurate information. Remove sections that do not apply. Paste into a document editor and export a readable PDF.

## Template 1: College student / fresher
[Full name]
[City] | [Professional email] | [Phone] | [Portfolio or LinkedIn] | [GitHub if relevant]

### Education
[Degree], [Institution], [Expected graduation]
[Relevant coursework or verified achievement]

### Projects
[Project title] | [Demo / repository link]
- Built [specific feature] using [tools] to solve [problem].
- Checked [behaviour] using [actual validation method].
- Documented [setup, limitations or design choice].

### Skills
[Skills you can demonstrate, grouped by area]

### Relevant activities / certifications
[Activity], [Your contribution], [Date]

## Template 2: Student with internship experience
[Full name and contact details]

### Profile
[One or two sentences connecting actual experience to the target role]

### Experience
[Role], [Organisation], [Dates]
- Delivered [your contribution] for [purpose].
- Collaborated on [task] and checked [result].

### Selected projects
[Project], [Link], [Your contribution]

### Education and skills
[Degree and dates]
[Demonstrable skills]

## Before sending
- Tailor the order to the role.
- Use metrics only when measured.
- Check all dates and links.
- Remove sensitive identity numbers.
- Confirm the exported PDF has selectable, readable text.
`,
  },
  {
    slug: "interview-preparation-guide",
    title: "Interview Preparation Guide",
    description: "A four-week plan, project explanation prompts and a mock-interview checklist.",
    content: `# NextPeer Interview Preparation Guide

## Week 1: Understand the role
- Read the job description and separate essential from optional requirements.
- Identify examples from your coursework, projects and experience.
- Practise a 60-second introduction using real details.

## Week 2: Practise core skills
- For coding roles: solve a few problems and explain correctness and complexity.
- For analytics roles: query a small dataset and interpret a chart.
- For business roles: work through a case and explain assumptions.
- Track mistakes and revisit the underlying concept.

## Week 3: Explain your projects
Answer: What problem did you solve? What did you build yourself? What failed? How did you test it? What would you improve?
Practise a two-minute overview and a deeper explanation of one feature.

## Week 4: Mock interviews and applications
- Practise one role-specific mock interview.
- Ask for feedback on clarity, reasoning and evidence.
- Check your resume links and application details.
- Record follow-up actions in an application tracker.

## Behavioural answer framework
Situation: relevant context.
Task: what you needed to achieve.
Action: what you personally did.
Result: what actually happened and what you learned.

## During the interview
Clarify the question, state assumptions, explain your approach and ask for a moment to think when needed. Say when you do not know; explain how you would investigate.

## Review sheet
Date:
Role:
Question:
What went well:
Knowledge gap:
Next practice task:

Preparation improves readiness; it does not guarantee selection.
`,
  },
  {
    slug: "dsa-cheat-sheet",
    title: "DSA Cheat Sheet",
    description: "Common structures, complexity assumptions and a problem-solving checklist.",
    content: `# NextPeer DSA Cheat Sheet

Complexities below describe common implementations. State assumptions and check the actual library or implementation.

## Structures
- Array: indexing O(1); linear search O(n); insertion in the middle typically O(n).
- Dynamic array: append amortised O(1), with occasional resizing.
- Hash map: lookup and insertion average O(1); worst cases depend on implementation and collisions.
- Stack / queue: typical push/pop or enqueue/dequeue O(1) with suitable implementations.
- Balanced search tree: search, insert and delete O(log n).
- Binary heap: peek O(1); insertion and removing the root O(log n).
- Graph adjacency list: storage O(V + E).

## Algorithms
- Binary search: O(log n) on sorted searchable data.
- Merge sort: O(n log n) time and typical O(n) extra storage.
- Quick sort: average O(n log n), worst O(n squared); details depend on pivot choice.
- BFS / DFS: O(V + E) with adjacency lists.

## Patterns
- Two pointers: ordered arrays, pairs, in-place transformations.
- Sliding window: contiguous segments with maintainable state.
- Hashing: membership checks, counts, grouping.
- Backtracking: exploring choices and undoing state.
- Dynamic programming: repeated subproblems with a defined state and recurrence.

## Solve deliberately
1. Clarify input, output and constraints.
2. Work through a small example.
3. Write a straightforward solution.
4. Identify the bottleneck.
5. Improve and justify the change.
6. Test empty input, boundaries, duplicates and normal cases.
7. Explain correctness, time and space costs.
`,
  },
  {
    slug: "web-development-roadmap",
    title: "Web Development Roadmap",
    description: "A project-based sequence from HTML and CSS to APIs and deployment.",
    content: `# NextPeer Web Development Roadmap

## 1. HTML and accessibility
Learn document structure, semantic elements, headings, links, forms and labels.
Build: a personal profile page with keyboard-accessible navigation.

## 2. CSS and responsive layouts
Learn selectors, the box model, spacing, typography, Flexbox and Grid.
Build: a layout that works on a narrow phone screen and a desktop.

## 3. JavaScript
Learn variables, functions, arrays, objects, DOM events, promises and fetch.
Build: a task list with validation and clear empty states.

## 4. React
Learn components, props, state and controlled inputs.
Build: a searchable catalogue and explain how state affects the interface.

## 5. Backend and data
Learn HTTP methods, APIs, input validation, database queries and permissions.
Build: a small application that saves and retrieves records.

## 6. Delivery
Use Git, write a README and deploy. Keep credentials on the server and out of the repository. Check errors, loading, keyboard access and mobile layout.

## Portfolio checkpoint
Publish one finished project with setup instructions, a demo and honest limitations. Explain one technical choice and one bug you fixed.
`,
  },
  {
    slug: "javascript-notes",
    title: "JavaScript Notes",
    description: "A beginner reference with practice prompts and pitfalls to check.",
    content: `# NextPeer JavaScript Notes

## Values and variables
Use const when the variable binding should not be reassigned; use let when reassignment is needed. Objects stored in const can still be mutated. Learn strings, numbers, booleans, null and undefined.

## Functions
Describe a function's inputs, output and side effects. Prefer small functions you can test with clear examples.

## Collections
Arrays represent ordered values. Objects represent properties. Practise map for transformation, filter for selection and reduce for accumulation. Check whether a method mutates the original array.

## Equality and missing values
Understand strict equality and type conversion. Check missing values explicitly when zero or an empty string is a valid input.

## Async work
A promise represents work that may complete later. async / await supports reading promise-based code in sequence. Handle rejected promises and show useful error messages.

## Browser interactions
Read form inputs, validate them and respond to events. Use textContent for untrusted text rather than inserting it as HTML. Keep API secrets out of client-side code.

## Practice
1. Count word frequencies in a sentence.
2. Filter a product list by price.
3. Calculate a total from an array of quantities and prices.
4. Build a form with required-field messages.
5. Fetch sample data and handle loading, success, empty and error states.

## Review checklist
Check types, null values, accidental mutation, unhandled promises and repeated submissions. Explain your code without reading a tutorial.
`,
  },
  {
    slug: "python-handbook",
    title: "Python Handbook",
    description: "Core concepts, small exercises and a simple practice routine.",
    content: `# NextPeer Python Handbook

## Core concepts
- Variables refer to objects; practise numbers, strings and booleans.
- Lists are ordered and mutable; tuples are ordered and immutable.
- Dictionaries map keys to values; sets track distinct elements.
- Conditions and loops control the flow of a program.
- Functions organise reusable behaviour with explicit inputs and results.

## Build good habits
Use descriptive names, small functions and readable formatting. Read tracebacks from the error message back to the relevant line. Handle exceptions you understand rather than hiding every error.

## Files and data
Use a context manager when opening a file. Understand the data format and validate inputs. Do not store private credentials in your program or repository.

## Environments
Use a project-specific virtual environment. Record required dependencies and document the supported Python version. Install packages from sources you trust and review what your program executes.

## Exercises
1. Build a command-line calculator with invalid-input handling.
2. Count words in a text file.
3. Store student marks and calculate averages.
4. Read a sample CSV and summarise a numeric column.
5. Create an expense tracker with save and load behaviour.

## Weekly routine
Learn one concept, practise small examples, add it to a project and explain it in your own words. Keep a list of mistakes and revisit them.

## Completion checklist
Test normal cases, empty inputs and invalid values. Add setup instructions, sample data and known limitations to your README.
`,
  },
];
