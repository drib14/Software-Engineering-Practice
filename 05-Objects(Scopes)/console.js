
/*
==========================================================
STUDENT INFORMATION AND ACADEMIC RECORDS MANAGEMENT SYSTEM
JavaScript Objects: Zero-to-Hero Challenge
==========================================================
Concepts:
- Objects, properties, and values
- Dot and bracket notation
- Object creation, modification, and deletion
- Functions and returned objects
- Arrays containing objects
- Searching, validation, and CRUD
- Object inspection and iteration
- Object references and shallow copying
- Academic calculations and edge cases
==========================================================
*/

// ========================================================
// PART 1: INITIAL STUDENT DATA
// ========================================================

let students = [
    {
        id: 1001,
        name: "Alice Johnson",
        age: 20,
        course: "BSIT",
        yearLevel: 2,
        grades: [95, 88, 91],
        isEnrolled: true
    },
    {
        id: 1002,
        name: "Bob Smith",
        age: 22,
        course: "BSCS",
        yearLevel: 3,
        grades: [78, 82, 79],
        isEnrolled: true
    },
    {
        id: 1003,
        name: "Charlie Davis",
        age: 19,
        course: "BSIT",
        yearLevel: 1,
        grades: [85, 89, 90],
        isEnrolled: false
    },
    {
        id: 1004,
        name: "David Wilson",
        age: 21,
        course: "BSIS",
        yearLevel: 3,
        grades: [68, 72, 70],
        isEnrolled: true
    },
    {
        id: 1005,
        name: "Emma Brown",
        age: 20,
        course: "BSCS",
        yearLevel: 2,
        grades: [92, 94, 96],
        isEnrolled: true
    }
];

// ========================================================
// PART 2: OBJECT CREATION AND VALIDATION
// ========================================================

// Return a new student object.
function createStudent(
    id,
    name,
    age,
    course,
    yearLevel,
    grades,
    isEnrolled = true
) {
    return {
        id: id,
        name: name,
        age: age,
        course: course,
        yearLevel: yearLevel,
        grades: grades,
        isEnrolled: isEnrolled
    };
}

function isValidName(name) {
    return typeof name === "string" &&
        name.trim().length > 0;
}

function isValidId(id) {
    return Number.isSafeInteger(id) && id > 0;
}

function isValidAge(age) {
    return Number.isInteger(age) &&
        age >= 16 &&
        age <= 100;
}

function isValidCourse(course) {
    return typeof course === "string" &&
        course.trim().length > 0;
}

function isValidYearLevel(yearLevel) {
    return Number.isInteger(yearLevel) &&
        yearLevel >= 1 &&
        yearLevel <= 6;
}

function isValidGrade(grade) {
    return typeof grade === "number" &&
        Number.isFinite(grade) &&
        grade >= 0 &&
        grade <= 100;
}

function isValidGrades(grades) {
    if (!Array.isArray(grades)) {
        return false;
    }

    for (let i = 0; i < grades.length; i++) {
        if (!isValidGrade(grades[i])) {
            return false;
        }
    }

    return true;
}

// ========================================================
// PART 3: SEARCH FUNCTIONS
// ========================================================

function findStudentById(id) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            return students[i];
        }
    }

    return null;
}

function findStudentByName(name) {
    if (!isValidName(name)) {
        return null;
    }

    let searchName = name.trim().toLowerCase();

    for (let i = 0; i < students.length; i++) {
        if (students[i].name.toLowerCase() === searchName) {
            return students[i];
        }
    }

    return null;
}

function findStudentIndexById(id) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            return i;
        }
    }

    return -1;
}

// ========================================================
// PART 4: VALIDATE COMPLETE STUDENT DATA
// ========================================================

function validateStudentData(
    id,
    name,
    age,
    course,
    yearLevel,
    grades,
    isEnrolled = true
) {
    if (!isValidId(id)) {
        console.error("ID must be a positive safe integer.");
        return false;
    }

    if (findStudentById(id) !== null) {
        console.error(`Student ID ${id} already exists.`);
        return false;
    }

    if (!isValidName(name)) {
        console.error("Student name cannot be empty.");
        return false;
    }

    if (!isValidAge(age)) {
        console.error("Age must be an integer from 16 to 100.");
        return false;
    }

    if (!isValidCourse(course)) {
        console.error("Course cannot be empty.");
        return false;
    }

    if (!isValidYearLevel(yearLevel)) {
        console.error("Year level must be an integer from 1 to 6.");
        return false;
    }

    if (!isValidGrades(grades)) {
        console.error("Grades must be an array of numbers from 0 to 100.");
        return false;
    }

    if (typeof isEnrolled !== "boolean") {
        console.error("Enrollment status must be true or false.");
        return false;
    }

    return true;
}

// ========================================================
// PART 5: DISPLAY STUDENT RECORDS
// ========================================================

function displayAllStudents(list = students) {
    console.log("\n===== STUDENT RECORDS =====");

    if (list.length === 0) {
        console.log("No student records found.");
        return;
    }

    for (let i = 0; i < list.length; i++) {
        let student = list[i];

        console.log(
            `ID: ${student.id} | ` +
            `Name: ${student["name"]} | ` +
            `Age: ${student.age} | ` +
            `Course: ${student["course"]} | ` +
            `Year: ${student.yearLevel} | ` +
            `Grades: [${student.grades.join(", ")}] | ` +
            `Enrolled: ${student.isEnrolled}`
        );
    }

    console.log(`Total students: ${list.length}`);
}

function displayStudentById(id) {
    let student = findStudentById(id);

    if (student === null) {
        console.error(`Student ID ${id} not found.`);
        return;
    }

    console.log("\n===== STUDENT DETAILS =====");
    console.log(`ID: ${student.id}`);
    console.log(`Name: ${student.name}`);
    console.log(`Age: ${student.age}`);
    console.log(`Course: ${student.course}`);
    console.log(`Year level: ${student.yearLevel}`);
    console.log(`Grades: ${student.grades.join(", ")}`);
    console.log(`Enrolled: ${student.isEnrolled}`);
}

function displayEnrolledStudents() {
    console.log("\n===== ENROLLED STUDENTS =====");

    let count = 0;

    for (let i = 0; i < students.length; i++) {
        if (students[i].isEnrolled) {
            console.log(
                `${students[i].name} - ${students[i].course}`
            );
            count++;
        }
    }

    console.log(`Total enrolled: ${count}`);
}

function displayStudentsByCourse(course) {
    if (!isValidCourse(course)) {
        console.error("Please provide a valid course.");
        return;
    }

    let count = 0;
    let searchCourse = course.trim().toLowerCase();

    console.log(`\n===== COURSE: ${course.trim()} =====`);

    for (let i = 0; i < students.length; i++) {
        if (students[i].course.toLowerCase() === searchCourse) {
            console.log(
                `${students[i].name} - ID: ${students[i].id}`
            );
            count++;
        }
    }

    if (count === 0) {
        console.log("No students found in this course.");
    }
}

function displayStudentsByMinAge(minAge) {
    if (!Number.isFinite(minAge) || minAge < 0) {
        console.error("Minimum age must be a valid nonnegative number.");
        return;
    }

    let count = 0;

    console.log(`\n===== STUDENTS AGED ${minAge} OR OLDER =====`);

    for (let i = 0; i < students.length; i++) {
        if (students[i].age >= minAge) {
            console.log(
                `${students[i].name} - Age: ${students[i].age}`
            );
            count++;
        }
    }

    if (count === 0) {
        console.log("No students meet the age requirement.");
    }
}

// ========================================================
// PART 6: PROPERTY ACCESS AND MODIFICATION
// ========================================================

function demonstratePropertyModifications() {
    if (students.length === 0) {
        console.log("No student available for demonstration.");
        return;
    }

    let target = students[0];

    // Save original values so this demo does not permanently
    // change the student's record.
    let originalName = target.name;
    let originalCourse = target.course;
    let originalYear = target.yearLevel;
    let originalEnrollment = target.isEnrolled;

    console.log("\n===== PROPERTY MODIFICATION DEMO =====");

    // Dot and bracket notation.
    console.log("Dot notation:", target.name);
    console.log("Bracket notation:", target["course"]);

    // Update a property.
    target.name = "Temporary Name";
    console.log("Updated name:", target.name);

    // Update another property.
    target.course = "Temporary Course";
    console.log("Updated course:", target.course);

    // Change enrollment.
    target.isEnrolled = !target.isEnrolled;
    console.log("Updated enrollment:", target.isEnrolled);

    // Add a property.
    console.log("Email exists before:", "email" in target);

    target.email = "temporary@example.com";

    console.log("Email exists after:", "email" in target);
    console.log("Email value:", target.email);

    // Dynamic property name.
    let dynamicKey = "honorStatus";
    target[dynamicKey] = "Dean's Lister";

    console.log("Dynamic property:", target[dynamicKey]);

    // Property existence.
    console.log("'email' in target:", "email" in target);
    console.log(
        "Own email property:",
        Object.prototype.hasOwnProperty.call(target, "email")
    );

    console.log(
        "Own scholarship property:",
        Object.prototype.hasOwnProperty.call(target, "scholarship")
    );

    // Optional chaining.
    console.log(
        "Guardian contact:",
        target?.guardian?.contact ?? "No guardian recorded"
    );

    // Delete temporary properties.
    delete target.email;
    delete target[dynamicKey];

    console.log("Email after deletion:", "email" in target);

    // Restore the original student data.
    target.name = originalName;
    target.course = originalCourse;
    target.yearLevel = originalYear;
    target.isEnrolled = originalEnrollment;

    console.log("Original values restored.");
}

// ========================================================
// PART 7: ACADEMIC PERFORMANCE
// ========================================================

function calculatePerformance(student) {
    if (
        student === null ||
        typeof student !== "object" ||
        !Array.isArray(student.grades) ||
        !isValidGrades(student.grades)
    ) {
        return {
            studentName:
                student && typeof student.name === "string"
                    ? student.name
                    : "Unknown",
            totalGrades: 0,
            average: null,
            highest: null,
            lowest: null,
            standing: "Invalid Student Data"
        };
    }

    let grades = student.grades;
    let count = grades.length;

    if (count === 0) {
        return {
            studentName: student.name,
            totalGrades: 0,
            average: null,
            highest: null,
            lowest: null,
            standing: "No Grades Recorded"
        };
    }

    let total = 0;
    let highest = grades[0];
    let lowest = grades[0];

    for (let i = 0; i < count; i++) {
        total += grades[i];

        if (grades[i] > highest) {
            highest = grades[i];
        }

        if (grades[i] < lowest) {
            lowest = grades[i];
        }
    }

    let average = total / count;
    let standing;

    if (average >= 90) {
        standing = "Excellent";
    } else if (average >= 85) {
        standing = "Very Good";
    } else if (average >= 80) {
        standing = "Good";
    } else if (average >= 75) {
        standing = "Passed";
    } else {
        standing = "Failed";
    }

    return {
        studentName: student.name,
        totalGrades: count,
        average: Number(average.toFixed(2)),
        highest: highest,
        lowest: lowest,
        standing: standing
    };
}

function displayAllPerformanceReports() {
    console.log("\n===== ACADEMIC PERFORMANCE =====");

    if (students.length === 0) {
        console.log("No student records available.");
        return;
    }

    for (let i = 0; i < students.length; i++) {
        let performance = calculatePerformance(students[i]);

        console.log(
            `${performance.studentName} | ` +
            `Average: ${performance.average ?? "N/A"} | ` +
            `Standing: ${performance.standing} | ` +
            `Grades: ${performance.totalGrades} | ` +
            `Highest: ${performance.highest ?? "N/A"} | ` +
            `Lowest: ${performance.lowest ?? "N/A"}`
        );
    }
}

// ========================================================
// PART 8: ADD, UPDATE, AND REMOVE STUDENTS
// ========================================================

function addStudent(
    id,
    name,
    age,
    course,
    yearLevel,
    grades,
    isEnrolled = true
) {
    if (
        !validateStudentData(
            id,
            name,
            age,
            course,
            yearLevel,
            grades,
            isEnrolled
        )
    ) {
        console.error("Student was not added.");
        return false;
    }

    // Copy the grades array to avoid sharing the caller's array.
    let newStudent = createStudent(
        id,
        name.trim(),
        age,
        course.trim(),
        yearLevel,
        [...grades],
        isEnrolled
    );

    students.push(newStudent);

    console.log(`Successfully added ${newStudent.name}.`);
    return true;
}

function updateStudentName(id, newName) {
    let student = findStudentById(id);

    if (student === null) {
        console.error("Student not found.");
        return false;
    }

    if (!isValidName(newName)) {
        console.error("Name cannot be empty.");
        return false;
    }

    let oldName = student.name;
    student.name = newName.trim();

    console.log(
        `Name changed from ${oldName} to ${student.name}.`
    );

    return true;
}

function updateStudentCourse(id, newCourse) {
    let student = findStudentById(id);

    if (student === null) {
        console.error("Student not found.");
        return false;
    }

    if (!isValidCourse(newCourse)) {
        console.error("Course cannot be empty.");
        return false;
    }

    let oldCourse = student.course;
    student.course = newCourse.trim();

    console.log(
        `${student.name}'s course changed from ` +
        `${oldCourse} to ${student.course}.`
    );

    return true;
}

function updateStudentEnrollment(id, isEnrolled) {
    let student = findStudentById(id);

    if (student === null) {
        console.error("Student not found.");
        return false;
    }

    if (typeof isEnrolled !== "boolean") {
        console.error("Enrollment status must be a boolean.");
        return false;
    }

    student.isEnrolled = isEnrolled;

    console.log(
        `${student.name} enrollment: ${student.isEnrolled}`
    );

    return true;
}

function updateStudentGrades(id, newGrades) {
    let student = findStudentById(id);

    if (student === null) {
        console.error("Student not found.");
        return false;
    }

    if (!isValidGrades(newGrades)) {
        console.error("Grades must contain only valid numbers.");
        return false;
    }

    student.grades = [...newGrades];

    console.log(`Updated grades for ${student.name}.`);
    return true;
}

function removeStudent(id) {
    let index = findStudentIndexById(id);

    if (index === -1) {
        console.error(`Student ID ${id} was not found.`);
        return false;
    }

    let removedStudent = students.splice(index, 1)[0];

    console.log(
        `Removed ${removedStudent.name} (ID: ${removedStudent.id}).`
    );

    return true;
}

// ========================================================
// PART 9: ENROLLMENT SUMMARY
// ========================================================

function displayEnrollmentSummary() {
    let enrolled = 0;
    let unenrolled = 0;

    for (let i = 0; i < students.length; i++) {
        if (students[i].isEnrolled) {
            enrolled++;
        } else {
            unenrolled++;
        }
    }

    console.log("\n===== ENROLLMENT SUMMARY =====");
    console.log(`Total students: ${students.length}`);
    console.log(`Enrolled: ${enrolled}`);
    console.log(`Unenrolled: ${unenrolled}`);
}

// ========================================================
// PART 10: OBJECT INSPECTION AND ITERATION
// ========================================================

function demonstrateObjectInspection() {
    if (students.length === 0) {
        console.log("No student available for inspection.");
        return;
    }

    let sample = students[0];

    console.log("\n===== OBJECT INSPECTION =====");

    // Iterate through properties.
    for (let key in sample) {
        if (Object.prototype.hasOwnProperty.call(sample, key)) {
            console.log(`${key}:`, sample[key]);
        }
    }

    // Object.keys().
    let keys = Object.keys(sample);
    console.log("Keys:", keys.join(", "));

    // Object.values().
    let values = Object.values(sample);
    console.log("Values count:", values.length);

    // Object.entries().
    let entries = Object.entries(sample);

    for (let i = 0; i < entries.length; i++) {
        console.log(`${entries[i][0]} ->`, entries[i][1]);
    }
}

// ========================================================
// PART 11: REFERENCES AND COPYING
// ========================================================

function demonstrateReferencesAndCopying() {
    console.log("\n===== OBJECT REFERENCES AND COPYING =====");

    let ref1 = students[0];
    let ref2 = students[0];

    let standaloneA = { id: 9999, name: "Test" };
    let standaloneB = { id: 9999, name: "Test" };

    console.log("Same reference:", ref1 === ref2);
    console.log("Separate objects:", standaloneA === standaloneB);

    // Shallow copy.
    let spreadCopy = { ...students[1] };

    console.log(
        "Spread copy is separate:",
        spreadCopy !== students[1]
    );

    // Object.assign().
    let assignedCopy = Object.assign({}, students[1], {
        campus: "Main Campus"
    });

    console.log("Assigned campus:", assignedCopy.campus);

    // Isolated nested-reference demonstration.
    let original = {
        name: "Test Student",
        grades: [80, 90]
    };

    let shallowCopy = { ...original };

    shallowCopy.name = "Modified Name";

    console.log("Original name:", original.name);

    // Both objects share the same grades array.
    shallowCopy.grades.push(100);

    console.log("Original grades:", original.grades.join(", "));

    // Copy both the object and its nested array.
    let safeCopy = {
        ...original,
        grades: [...original.grades]
    };

    safeCopy.grades.push(95);

    console.log("Safe copy grades:", safeCopy.grades.join(", "));
    console.log("Original grades:", original.grades.join(", "));
}

// ========================================================
// PART 12: ISOLATED EMPTY-ARRAY TEST
// ========================================================

function testEmptyStudentList() {
    // Save the original array reference.
    let savedStudents = students;

    // Use a separate empty list for this test.
    students = [];

    console.log("\n===== EMPTY STUDENT LIST TEST =====");

    displayAllStudents();
    displayEnrolledStudents();
    displayAllPerformanceReports();
    displayEnrollmentSummary();

    console.log("Search missing ID:", findStudentById(9999));
    console.log("Remove missing ID:", removeStudent(9999));
    console.log("Update missing ID:", updateStudentCourse(9999, "BSIT"));

    // Adding a record to an empty list should work.
    addStudent(9001, "Temporary Student", 20, "BSIT", 1, []);

    displayAllStudents();

    // Restore the original array without changing its contents.
    students = savedStudents;

    console.log("Original student list restored.");
}

// ========================================================
// PART 13: REQUIRED TEST SCENARIOS
// ========================================================

function runAllTestScenarios() {
    console.log("\n===== TEST 1: VALID STUDENT =====");

    addStudent(
        1006,
        "Frank Miller",
        21,
        "BSIT",
        3,
        [88, 92, 85]
    );

    console.log("\n===== TEST 2: DUPLICATE ID =====");

    addStudent(
        1001,
        "Duplicate Student",
        21,
        "BSIT",
        2,
        [80, 80]
    );

    console.log("\n===== TEST 3: MISSING STUDENT =====");

    displayStudentById(9999);

    console.log("\n===== TEST 4: EMPTY GRADES =====");

    let noGradesStudent = createStudent(
        9002,
        "No Grades Student",
        18,
        "BSCS",
        1,
        [],
        true
    );

    console.log(calculatePerformance(noGradesStudent));

    console.log("\n===== TEST 5: INVALID GRADES =====");

    addStudent(1007, "Invalid Grade", 20, "BSIT", 2, [85, NaN]);
    addStudent(1008, "Invalid Grade", 20, "BSIT", 2, [85, 105]);

    console.log("\n===== TEST 6: EMPTY LIST =====");

    testEmptyStudentList();

    console.log("\n===== TEST 7: UPDATE ONE STUDENT =====");

    let otherStudent = findStudentById(1004);
    let oldOtherCourse = otherStudent.course;

    updateStudentCourse(1002, "BSIT");

    console.log(
        "Other student's course unchanged:",
        otherStudent.course === oldOtherCourse
    );

    // Restore the modified test record.
    updateStudentCourse(1002, "BSCS");

    console.log("\n===== TEST 8: DELETE A PROPERTY =====");

    let temporaryStudent = createStudent(
        9003,
        "Temporary",
        20,
        "BSIT",
        1,
        [],
        true
    );

    temporaryStudent.tempNote = "Temporary note";

    console.log("Before deletion:", temporaryStudent.tempNote);

    delete temporaryStudent.tempNote;

    console.log(
        "Property exists:",
        Object.prototype.hasOwnProperty.call(
            temporaryStudent,
            "tempNote"
        )
    );

    console.log("Name still exists:", temporaryStudent.name);

    console.log("\n===== TEST 9: REFERENCE COMPARISON =====");
    demonstrateReferencesAndCopying();

    console.log("\n===== TEST 10: PROPERTY MODIFICATION =====");
    demonstratePropertyModifications();
}

// ========================================================
// PART 14: FINAL REPORT
// ========================================================

function displayFinalReport() {
    console.log("\n========================================");
    console.log(" FINAL STUDENT ACADEMIC REPORT");
    console.log("========================================");

    displayAllStudents();
    displayEnrolledStudents();
    displayStudentsByCourse("BSIT");
    displayStudentsByMinAge(21);
    displayAllPerformanceReports();
    displayEnrollmentSummary();
    demonstrateObjectInspection();
}

// ========================================================
// PART 15: RUN APPLICATION
// ========================================================

runAllTestScenarios();
displayFinalReport();
