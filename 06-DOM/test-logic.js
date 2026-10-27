/**
 * Test Suite for EduPulse Student Management System Core Business Logic
 */

const fs = require('fs');
const path = require('path');

// Read app.js code
const appJsPath = path.join(__dirname, 'js', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

console.log('--- TESTING EDUPULSE STUDENT MANAGEMENT SYSTEM CORE LOGIC ---');

// Extract and test pure functions in an isolated sandbox
const vm = require('vm');

// Mock browser globals for test environment
const mockLocalStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, val) { this.store[key] = String(val); },
    removeItem(key) { delete this.store[key]; }
};

const sandbox = {
    console,
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    Symbol,
    BigInt,
    setTimeout,
    clearTimeout,
    structuredClone,
    parseInt,
    parseFloat,
    isNaN,
    localStorage: mockLocalStorage,
    document: {
        getElementById: () => ({ addEventListener: () => {}, classList: { add: () => {}, remove: () => {} }, style: {} }),
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: () => ({ appendChild: () => {}, append: () => {}, classList: { add: () => {}, remove: () => {} }, style: {}, dataset: {} }),
        addEventListener: () => {}
    }
};

vm.createContext(sandbox);
vm.runInContext(appJsContent, sandbox);

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, message) {
    testsTotal++;
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        process.exitCode = 1;
    } else {
        console.log(`✅ PASSED: ${message}`);
        testsPassed++;
    }
}

// Helper to evaluate in sandbox
const evaluate = (expr) => vm.runInContext(expr, sandbox);

// 1. Grade Calculations
const avg1 = evaluate('calculateStudentAverage([96, 94, 98, 92])');
assert(avg1 === 95.0, `Average [96, 94, 98, 92] should be 95.0, got ${avg1}`);

const avgEmpty = evaluate('calculateStudentAverage([])');
assert(avgEmpty === null, `Average [] should be null, got ${avgEmpty}`);

// 2. Passing Check
assert(evaluate('isStudentPassing(95.0)') === true, 'GPA 95.0 should pass');
assert(evaluate('isStudentPassing(75.0)') === true, 'GPA 75.0 should pass (threshold)');
assert(evaluate('isStudentPassing(74.9)') === false, 'GPA 74.9 should fail');
assert(evaluate('isStudentPassing(null)') === false, 'null GPA should fail');

// 3. Academic Remarks
assert(evaluate('getAcademicRemark(96)').includes("President's Lister"), '96% is President\'s Lister');
assert(evaluate('getAcademicRemark(91)').includes("Dean's Lister"), '91% is Dean\'s Lister');
assert(evaluate('getAcademicRemark(87)').includes("Very Satisfactory"), '87% is Very Satisfactory');
assert(evaluate('getAcademicRemark(82)').includes("Satisfactory"), '82% is Satisfactory');
assert(evaluate('getAcademicRemark(76)').includes("Fair / Passed"), '76% is Fair / Passed');
assert(evaluate('getAcademicRemark(65)').includes("Remedial"), '65% is Remedial');
assert(evaluate('getAcademicRemark(55)').includes("Failing"), '55% is Failing');
assert(evaluate('getAcademicRemark(null)') === 'No Grades Yet', 'null remark is No Grades Yet');

// 4. Grade Extremes
const extremes = evaluate('getGradeExtremes([58, 62, 54, 60, 95])');
assert(extremes.max === 95 && extremes.min === 54, `Extremes should be 95 / 54, got ${extremes.max} / ${extremes.min}`);

// 5. Attendance Calculations
const attMetrics = evaluate('calculateAttendanceMetrics({ present: 18, late: 2, absent: 0 })');
assert(attMetrics.totalSessions === 20, `Total sessions should be 20, got ${attMetrics.totalSessions}`);
// (18 + 2*0.5) / 20 * 100 = 19 / 20 * 100 = 95.0%
assert(attMetrics.attendanceRate === 95.0, `Attendance rate should be 95.0%, got ${attMetrics.attendanceRate}`);

// 6. Zero Students Dashboard Edge Case (avoiding NaN)
const zeroMetrics = evaluate('computeDashboardMetrics([])');
assert(zeroMetrics.totalStudents === 0, 'Zero students total should be 0');
assert(zeroMetrics.classAverage === '0.0%', `Class average should be '0.0%', got ${zeroMetrics.classAverage}`);
assert(!zeroMetrics.classAverage.includes('NaN'), 'Class average must NOT contain NaN');
assert(!zeroMetrics.overallAttendanceRate.includes('NaN'), 'Overall attendance rate must NOT contain NaN');

// 7. Full Dataset Dashboard Metrics
const sampleMetrics = evaluate('computeDashboardMetrics(INITIAL_STUDENTS_DATA)');
assert(sampleMetrics.totalStudents === 6, `Total sample students should be 6, got ${sampleMetrics.totalStudents}`);
assert(sampleMetrics.passedCount === 4, `Passed count should be 4, got ${sampleMetrics.passedCount}`);
assert(sampleMetrics.failedCount === 2, `Failed count should be 2, got ${sampleMetrics.failedCount}`);
assert(parseFloat(sampleMetrics.classAverage) > 70, `Class average should be > 70%, got ${sampleMetrics.classAverage}`);

// 8. Unique ID Generation
const nextId = evaluate('generateNextStudentId(INITIAL_STUDENTS_DATA)');
assert(nextId === 'STU-1007', `Next unique ID should be STU-1007, got ${nextId}`);

// 9. Sorting Comparator
const sorted = evaluate('[...INITIAL_STUDENTS_DATA].sort(createStudentComparator("name_asc"))');
assert(sorted[0].name === 'Aiden Cross', `First student in A-Z should be Aiden Cross, got ${sorted[0].name}`);

const sortedGpa = evaluate('[...INITIAL_STUDENTS_DATA].sort(createStudentComparator("gpa_desc"))');
assert(sortedGpa[0].name === 'Sophia Vance', `Top student by GPA should be Sophia Vance, got ${sortedGpa[0].name}`);

// 10. Check All 12 Concepts Registry
const regLength = evaluate('JAVASCRIPT_MASTERY_REGISTRY.length');
assert(regLength === 12, `Registry should have 12 concepts, got ${regLength}`);

console.log(`\nTEST SUMMARY: ${testsPassed}/${testsTotal} assertions passed successfully!`);
