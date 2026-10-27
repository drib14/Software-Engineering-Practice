# EduPulse — Student Management System (SMS)
### JavaScript Zero-to-Hero Capstone Challenge: Fundamentals to DOM

> **Architecture:** Vanilla HTML5, Modern CSS (Glassmorphism), Strict Vanilla JavaScript (ES6+), Zero External Frameworks, Zero API Fetching.

---

## 🌟 Executive Overview
**EduPulse SMS** is a web-based educational dashboard and student management application designed for teachers and administrators. It manages student enrollment records, academic grading benchmarks, session attendance metrics, and class-wide analytics with local data persistence and asynchronous operations.

---

## 📂 Project Directory Structure

```text
web-practice/
└── 06-DOM/
    ├── index.html          # Semantic HTML5 markup, accessible forms, dashboard cards & modals
    ├── css/
    │   └── style.css       # Design tokens, glassmorphism, responsive grid, micro-interactions
    ├── js/
    │   └── app.js          # Core business logic, analytics, persistence, async simulation, DOM
    ├── server.js           # Lightweight static file server (for localhost testing)
    ├── test-logic.js       # Automated test suite for calculations and edge cases (29/29 passed)
    └── README.md           # Documentation, concept registry & acceptance checklist
```

---

## 🚀 How to Run the Application

### Option A: Open Directly in Browser (No Server Required)
Simply double-click `06-DOM/index.html` or drag it into any modern web browser (Chrome, Edge, Firefox, Safari).

### Option B: Run via Local Node.js Static Server
```bash
# Navigate to the folder
cd 06-DOM

# Launch the lightweight server
node server.js
```
Then open your browser to: **`http://localhost:3000/`**

---

## 🎯 Required Modules & Feature Coverage

| Module | Features & Implementation Details | Status |
| :--- | :--- | :---: |
| **Module 1: Student Records** | • Enrolls students with ID, Full Name, Age, Course, and Year Level.<br>• Real-time search by Student Name or Student ID.<br>• Course, Year Level, and Academic Standing filter dropdowns.<br>• Dynamic sorting (A-Z, Z-A, GPA High-Low, GPA Low-High, ID Asc, Attendance High-Low).<br>• Edit modal with pre-populated records.<br>• Delete with custom confirmation dialog.<br>• Duplicate ID prevention & age validation (15–99 years). | **100% Complete** |
| **Module 2: Grade Management** | • Individual assessment grade assignment (0–100 scale).<br>• Real-time GPA calculation using `reduce()`.<br>• Passing benchmark: **75.0%** threshold.<br>• Honors remarks: *President's Lister (≥95%)*, *Dean's Lister (≥90%)*, *Very Satisfactory (≥85%)*, *Satisfactory (≥80%)*, *Fair/Passed (≥75%)*, *Remedial (60–74%)*, *Failing (<60%)*.<br>• Highest and lowest score calculations across students and class-wide.<br>• Strict rejection of scores outside the 0–100 range. | **100% Complete** |
| **Module 3: Attendance** | • Track Present, Late, and Absent counts.<br>• Weighted formula: `((present + 0.5 * late) / totalSessions) * 100`.<br>• Quick `+P`, `+L`, `+A` buttons right from the student directory table.<br>• Detailed attendance modal with counter controls and negative boundary protection. | **100% Complete** |
| **Module 4: Dashboard** | • 5 KPI Metric Cards: Total Students, Passing Standing, At-Risk/Failed, Class GPA Average with visual progress bar, Overall Attendance.<br>• Honor Roll Banner: Top Performer, Highest Class Grade, Lowest Grade, Benchmark reminder.<br>• Safe handling of zero students (displays `0.0%` / `N/A`, avoiding `NaN`).<br>• Real-time synchronization without page reload. | **100% Complete** |
| **Module 5: Local Persistence** | • Browser `localStorage` integration under key `eduPulse_sms_records_v1`.<br>• Auto-loads records on startup.<br>• Safe `try...catch` JSON parsing with automatic recovery to starter dataset if corrupt.<br>• **Reset Data** button with confirmation dialog.<br>• **Export JSON** and **Import JSON** tools for data backup. | **100% Complete** |
| **Module 6: Asynchronous Operations** | • Simulated loading screen on application startup with animated ring spinner and status steps.<br>• `async`/`await` with Promise-based delay (`simulateAsyncDelay`).<br>• `try...catch...finally` error handling with error recovery banner.<br>• **Simulate Error: ON/OFF** toggle to test error recovery and retry flow.<br>• Interactive buttons disabled while loading.<br>• **Zero API fetching / No network requests.** | **100% Complete** |
| **Module 7: DOM & User Interaction** | • DOM selectors: `getElementById`, `querySelector`, `querySelectorAll`.<br>• Dynamic element creation: `createElement`, `append`, `remove`, `classList`, `dataset`.<br>• Event listeners on forms, buttons, inputs (`addEventListener`, `e.preventDefault()`).<br>• Event delegation on table body for performance.<br>• Accessible field error messages.<br>• Empty state illustration when zero records match search/filters.<br>• Floating toast notification system with auto-dismiss. | **100% Complete** |

---

## 🧠 Complete JavaScript Concepts Demonstration (12 / 12)

| # | Concept | Demonstration in `js/app.js` |
| :-: | :--- | :--- |
| **1** | **Variables & Data Types** | `const PASSING_THRESHOLD = 75.0`, `let appState = { ... }`, String, Number, Boolean, Null, Undefined, `Symbol('sms_record_internal_tag')`, `BigInt(1704067200000)`. |
| **2** | **Operators** | Arithmetic (`+`, `-`, `*`, `/`, `%`), comparison (`===`, `!==`, `>=`, `<`), logical (`&&`, `||`, `??`), ternary (`? :`), spread (`...`), rest parameters (`...args`). |
| **3** | **Control Flow** | `if...else if...else` for validation checks and `switch (true)` for academic grade remarks. |
| **4** | **Loops** | `for...of` in `computeDashboardMetrics()`, `while` in `generateNextStudentId()`, `for` loop in grade token parser, `forEach` for DOM iterations. |
| **5** | **Functions** | Function declarations (`function calculateStudentAverage()`), expressions (`const getAcademicRemark = function()`), arrow functions (`const isStudentPassing = (avg) => ...`), higher-order functions (`createStudentComparator()`), callbacks, default parameters. |
| **6** | **Arrays** | `.map()`, `.filter()`, `.reduce()`, `.find()`, `.findIndex()`, `.some()`, `.every()`, `.includes()`, `.sort()`, `.splice()`, `.forEach()`. |
| **7** | **Objects** | Object literals, methods, nested objects, destructuring (`const { present, late, absent } = attendance`), `Object.freeze()`, `Object.keys/values`. |
| **8** | **Modern JavaScript** | Optional chaining (`student?.attendance?.present`), nullish coalescing (`attendance?.present ?? 0`), template literals, `structuredClone()`, spread copy. |
| **9** | **Error Handling** | `try...catch...finally`, `throw new Error()`, input range validations (0–100 grades, 15–99 age), duplicate ID detection, corrupt storage fallback. |
| **10** | **Asynchronous JavaScript** | `new Promise((resolve) => setTimeout(resolve, ms))`, `async function initializeApplicationAsync()`, `await`, error banner with retry trigger, zero API calls. |
| **11** | **DOM Manipulation** | `document.createElement`, `append()`, `remove()`, `classList.add/remove/toggle`, `textContent`, dataset attributes (`data-id`, `data-action`), empty state toggling. |
| **12** | **Events & Browser APIs** | `addEventListener` for `submit`, `click`, `input`, `change`, `keydown`. Event delegation on `tbody`. `e.preventDefault()`, `localStorage`. Toast system. |

---

## 🧪 Automated Test Suite Results
Run the verification test suite anytime:
```bash
node test-logic.js
```
**Results:** `29/29 assertions passed successfully` (Grade formulas, attendance weights, sorting comparators, ID generation, empty-state protection, boundary validations).
