
/*
==========================================================
STUDENT GRADE MANAGEMENT SYSTEM
JavaScript Arrays: Zero-to-Hero Challenge
==========================================================
Rules:
- No custom objects or object literals
- No classes, promises, async/await, or API calls
- No external libraries
- Arrays, loops, functions, conditionals, and array methods
*/

// ========================================================
// PART 1: INITIAL ARRAYS
// ========================================================

let students = ["Alice", "Bob", "Charlie", "David", "Emma"];
let grades = [95, 78, 86, 64, 91];

// ========================================================
// PART 2: VALIDATION AND SEARCH
// ========================================================

// Return the matching student's index, or -1.
function findStudentIndex(name) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].toLowerCase() === name.toLowerCase()) {
            return i;
        }
    }

    return -1;
}

// Validate a student's name.
function isValidName(name) {
    return typeof name === "string" && name.trim().length > 0;
}

// Validate a grade.
function isValidGrade(grade) {
    return typeof grade === "number" &&
        Number.isFinite(grade) &&
        grade >= 0 &&
        grade <= 100;
}

// ========================================================
// PART 3: DISPLAY STUDENTS
// ========================================================

function displayStudents() {
    console.log("\n===== STUDENT ROSTER =====");

    if (students.length === 0) {
        console.log("No students found.");
        return;
    }

    for (let i = 0; i < students.length; i++) {
        console.log(
            `${i + 1}. ${students[i]} - Grade: ${grades[i]}`
        );
    }

    console.log(`Total students: ${students.length}`);
}

// ========================================================
// PART 4: ADD A STUDENT
// ========================================================

function addStudent(name, grade) {
    if (!isValidName(name)) {
        console.error("Student name cannot be empty.");
        return false;
    }

    name = name.trim();

    if (findStudentIndex(name) !== -1) {
        console.error("That student already exists.");
        return false;
    }

    if (!isValidGrade(grade)) {
        console.error("Grade must be a number from 0 to 100.");
        return false;
    }

    students.push(name);
    grades.push(grade);

    console.log(`Successfully added ${name}.`);
    return true;
}

// ========================================================
// PART 5: UPDATE A STUDENT
// ========================================================

function updateStudent(name, newGrade) {
    if (!isValidName(name)) {
        console.error("Please enter a valid student name.");
        return false;
    }

    if (!isValidGrade(newGrade)) {
        console.error("Grade must be a number from 0 to 100.");
        return false;
    }

    let index = findStudentIndex(name);

    if (index === -1) {
        console.error("Student not found.");
        return false;
    }

    let oldGrade = grades[index];
    grades[index] = newGrade;

    console.log(
        `${students[index]}'s grade changed from ${oldGrade} to ${newGrade}.`
    );

    return true;
}

// ========================================================
// PART 6: REMOVE A STUDENT
// ========================================================

function removeStudent(name) {
    if (!isValidName(name)) {
        console.error("Please enter a valid student name.");
        return false;
    }

    let index = findStudentIndex(name);

    if (index === -1) {
        console.error("Student not found.");
        return false;
    }

    let removedName = students[index];
    let removedGrade = grades[index];

    students.splice(index, 1);
    grades.splice(index, 1);

    console.log(
        `Removed ${removedName}, whose grade was ${removedGrade}.`
    );

    return true;
}

// ========================================================
// PART 7: SEARCH FOR A STUDENT
// ========================================================

function searchStudent(name) {
    if (!isValidName(name)) {
        console.error("Please enter a valid student name.");
        return -1;
    }

    let index = findStudentIndex(name);

    if (index === -1) {
        console.log("Student not found.");
        return -1;
    }

    console.log(
        `${students[index]} - Grade: ${grades[index]} - Index: ${index}`
    );

    return index;
}

// ========================================================
// PART 8: PASSING AND FAILING STUDENTS
// Passing grade: 75
// ========================================================

function displayPassingAndFailing() {
    console.log("\n===== PASSING STUDENTS =====");

    let passCount = 0;

    for (let i = 0; i < grades.length; i++) {
        if (grades[i] >= 75) {
            console.log(`${students[i]}: ${grades[i]}`);
            passCount++;
        }
    }

    console.log("\n===== FAILING STUDENTS =====");

    let failCount = 0;

    for (let i = 0; i < grades.length; i++) {
        if (grades[i] < 75) {
            console.log(`${students[i]}: ${grades[i]}`);
            failCount++;
        }
    }

    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);
}

// ========================================================
// PART 9: GRADE STATISTICS
// ========================================================

function calculateStatistics() {
    if (grades.length === 0) {
        console.log("No grades available.");
        return;
    }

    let total = 0;
    let highest = grades[0];
    let lowest = grades[0];

    for (let i = 0; i < grades.length; i++) {
        total += grades[i];

        if (grades[i] > highest) {
            highest = grades[i];
        }

        if (grades[i] < lowest) {
            lowest = grades[i];
        }
    }

    let average = total / grades.length;

    // Verify the total using reduce().
    let reduceTotal = grades.reduce(function(sum, grade) {
        return sum + grade;
    }, 0);

    console.log("\n===== GRADE STATISTICS =====");
    console.log(`Students: ${grades.length}`);
    console.log(`Total: ${total}`);
    console.log(`Total using reduce(): ${reduceTotal}`);
    console.log(`Average: ${average.toFixed(2)}`);
    console.log(`Highest: ${highest}`);
    console.log(`Lowest: ${lowest}`);
}

// ========================================================
// PART 10: SORTING
// ========================================================

function demonstrateSorting() {
    console.log("\n===== SORTING DEMONSTRATION =====");

    let ascending = [...grades];
    ascending.sort(function(a, b) {
        return a - b;
    });

    let descending = [...grades];
    descending.sort(function(a, b) {
        return b - a;
    });

    let reversed = [...grades];
    reversed.reverse();

    console.log("Original:", grades.join(", "));
    console.log("Ascending:", ascending.join(", "));
    console.log("Descending:", descending.join(", "));
    console.log("Reversed:", reversed.join(", "));

    if (typeof grades.toSorted === "function") {
        let sortedCopy = grades.toSorted(function(a, b) {
            return a - b;
        });

        console.log("toSorted():", sortedCopy.join(", "));
    }

    if (typeof grades.toReversed === "function") {
        let reversedCopy = grades.toReversed();

        console.log("toReversed():", reversedCopy.join(", "));
    }

    console.log("Original remains:", grades.join(", "));
}

// ========================================================
// PART 11: RANKED REPORT
// ========================================================

function displayRankedReport() {
    if (students.length === 0) {
        console.log("No students available for ranking.");
        return;
    }

    let rankedStudents = [...students];
    let rankedGrades = [...grades];

    // Bubble sort: keep names and grades synchronized.
    for (let i = 0; i < rankedGrades.length - 1; i++) {
        for (let j = 0; j < rankedGrades.length - 1 - i; j++) {
            if (rankedGrades[j] < rankedGrades[j + 1]) {
                let tempGrade = rankedGrades[j];
                rankedGrades[j] = rankedGrades[j + 1];
                rankedGrades[j + 1] = tempGrade;

                let tempName = rankedStudents[j];
                rankedStudents[j] = rankedStudents[j + 1];
                rankedStudents[j + 1] = tempName;
            }
        }
    }

    console.log("\n===== RANKED REPORT =====");

    for (let i = 0; i < rankedStudents.length; i++) {
        console.log(
            `Rank ${i + 1}: ${rankedStudents[i]} - ${rankedGrades[i]}`
        );
    }
}

// ========================================================
// PART 12: ARRAY METHODS DEMONSTRATION
// ========================================================

function demonstrateArrayMethods() {
    console.log("\n===== ARRAY METHODS =====");

    // Array creation
    let emptyArray = [];
    emptyArray.push(10);

    let constructedArray = new Array(3);
    let ofArray = Array.of(10, 20, 30);
    let fromArray = Array.from("GRADE");

    console.log("Empty array after push:", emptyArray.join(", "));
    console.log("Array(3) length:", constructedArray.length);
    console.log("Array.of():", ofArray.join(", "));
    console.log("Array.from():", fromArray.join(", "));
    console.log("Array.isArray():", Array.isArray(students));

    // Access
    console.log("First student:", students.at(0));
    console.log("Last student:", students.at(-1));
    console.log("Length:", students.length);

    // Add and remove
    let sample = ["B", "C"];

    sample.unshift("A");
    sample.push("D");

    console.log("After unshift and push:", sample.join(", "));

    sample.shift();
    sample.pop();

    console.log("After shift and pop:", sample.join(", "));

    // Copy and combine
    console.log("slice():", students.slice(0, 2).join(", "));
    console.log("concat():", students.concat(["Frank"]).join(", "));
    console.log("Spread:", [...students, "Frank"].join(", "));

    // Search
    console.log("indexOf():", students.indexOf("Alice"));
    console.log("includes():", students.includes("Alice"));
    console.log("find():", grades.find(g => g < 75));
    console.log("findIndex():", grades.findIndex(g => g < 75));
    console.log("every():", grades.every(g => g >= 0));
    console.log("some():", grades.some(g => g >= 95));

    if (typeof grades.findLast === "function") {
        console.log("findLast():", grades.findLast(g => g >= 80));
        console.log(
            "findLastIndex():",
            grades.findLastIndex(g => g >= 80)
        );
    }

    // Transform
    console.log("map():", grades.map(g => g + 2).join(", "));
    console.log("filter():", grades.filter(g => g >= 75).join(", "));
    console.log("reduce():", grades.reduce((sum, g) => sum + g, 0));

    let nested = [[10, 20], [30, 40]];

    console.log("flat():", nested.flat().join(", "));
    console.log(
        "flatMap():",
        [5, 10].flatMap(n => [n, n * 2]).join(", ")
    );

    // Fill and copyWithin
    let filled = new Array(3).fill(0);
    console.log("fill():", filled.join(", "));

    let copiedWithin = [1, 2, 3, 4, 5];
    copiedWithin.copyWithin(0, 3);

    console.log("copyWithin():", copiedWithin.join(", "));

    // keys, values, and entries
    console.log("keys():");

    for (let key of students.keys()) {
        console.log(key);
    }

    console.log("values():");

    for (let value of students.values()) {
        console.log(value);
    }

    console.log("entries():");

    for (let entry of students.entries()) {
        console.log(entry.join(": "));
    }
}

// ========================================================
// PART 13: ARRAY LOOP DEMONSTRATION
// ========================================================

function demonstrateLoops() {
    console.log("\n===== ARRAY LOOPS =====");

    // 1. Traditional for
    for (let i = 0; i < students.length; i++) {
        console.log("for:", students[i]);
    }

    // 2. while
    let i = 0;

    while (i < students.length) {
        console.log("while:", students[i]);
        i++;
    }

    // 3. do...while
    let j = 0;

    if (students.length > 0) {
        do {
            console.log("do...while:", students[j]);
            j++;
        } while (j < students.length);
    }

    // 4. for...of
    for (let student of students) {
        console.log("for...of:", student);
    }

    // 5. for...in
    for (let index in students) {
        console.log("for...in:", index, students[index]);
    }

    // 6. forEach
    students.forEach(function(student, index) {
        console.log("forEach:", index, student);
    });

    // 7. map, filter, and reduce
    let upperNames = students.map(student => student.toUpperCase());
    let passingGrades = grades.filter(grade => grade >= 75);
    let total = grades.reduce((sum, grade) => sum + grade, 0);

    console.log("map:", upperNames.join(", "));
    console.log("filter:", passingGrades.join(", "));
    console.log("reduce:", total);

    // 8. Nested loops
    for (let a = 0; a < students.length && a < 2; a++) {
        for (let b = 0; b < students.length && b < 2; b++) {
            console.log("Pair:", students[a], students[b]);
        }
    }
}

// ========================================================
// PART 14: EMPTY ARRAY TEST
// ========================================================

function testEmptyArrays() {
    let savedStudents = [...students];
    let savedGrades = [...grades];

    students = [];
    grades = [];

    console.log("\n===== EMPTY ARRAY TEST =====");

    displayStudents();
    calculateStatistics();
    displayRankedReport();
    demonstrateSorting();

    // Restore the original arrays.
    students = savedStudents;
    grades = savedGrades;

    console.log("Original data restored.");
}

// ========================================================
// PART 15: INTERACTIVE MENU
// ========================================================

function runMenu() {
    let running = true;

    while (running) {
        console.log(`
===== STUDENT GRADE MANAGEMENT SYSTEM =====

1. Display students
2. Add student
3. Update student grade
4. Remove student
5. Search student
6. Display passing and failing students
7. Calculate statistics
8. Demonstrate sorting
9. Display ranked report
10. Demonstrate array methods
11. Demonstrate array loops
12. Test empty arrays
13. Exit
`);

        let choice = prompt("Choose an option (1-13):");

        if (choice === null) {
            console.log("Menu cancelled.");
            break;
        }

        switch (choice.trim()) {
            case "1":
                displayStudents();
                break;

            case "2": {
                let name = prompt("Enter student name:");

                if (name === null) break;

                let gradeInput = prompt("Enter grade (0-100):");

                if (gradeInput === null || gradeInput.trim() === "") {
                    console.log("Grade entry cancelled or empty.");
                    break;
                }

                addStudent(name, Number(gradeInput));
                break;
            }

            case "3": {
                let name = prompt("Enter student name:");

                if (name === null) break;

                let gradeInput = prompt("Enter new grade (0-100):");

                if (gradeInput === null || gradeInput.trim() === "") {
                    console.log("Grade entry cancelled or empty.");
                    break;
                }

                updateStudent(name, Number(gradeInput));
                break;
            }

            case "4": {
                let name = prompt("Enter student name to remove:");

                if (name !== null) {
                    removeStudent(name);
                }

                break;
            }

            case "5": {
                let name = prompt("Enter student name to search:");

                if (name !== null) {
                    searchStudent(name);
                }

                break;
            }

            case "6":
                displayPassingAndFailing();
                break;

            case "7":
                calculateStatistics();
                break;

            case "8":
                demonstrateSorting();
                break;

            case "9":
                displayRankedReport();
                break;

            case "10":
                demonstrateArrayMethods();
                break;

            case "11":
                demonstrateLoops();
                break;

            case "12":
                testEmptyArrays();
                break;

            case "13":
                running = false;
                console.log("Goodbye!");
                break;

            default:
                console.log("Invalid option. Enter a number from 1 to 13.");
        }
    }
}

// ========================================================
// PART 16: START APPLICATION
// ========================================================

runMenu();
