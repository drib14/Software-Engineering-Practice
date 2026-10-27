/**
 * ==============================================================================
 * EDUPULSE STUDENT MANAGEMENT SYSTEM
 * Complete Vanilla JavaScript Capstone: Fundamentals to DOM Manipulation
 * 
 * Demonstrates all 12 core JavaScript concepts:
 * 1. Variables & Data Types      7. Objects
 * 2. Operators                   8. Modern JavaScript
 * 3. Control Flow                9. Error Handling
 * 4. Loops                      10. Asynchronous JavaScript (Promises / async/await)
 * 5. Functions                  11. DOM Manipulation
 * 6. Arrays                     12. Events & Browser APIs
 * ==============================================================================
 */

'use strict';

// ==============================================================================
// SECTION 1: CONSTANTS, SYMBOLS & IMMUTABLE DATA STRUCTURES
// [Concept 1: Variables & Data Types - const, let, primitives, Symbol, BigInt]
// ==============================================================================

/** Passing GPA benchmark out of 100.0 */
const PASSING_THRESHOLD = 75.0;

/** LocalStorage persistence key */
const STORAGE_KEY = 'eduPulse_sms_records_v1';

/** Permitted Degree Programs */
const ALLOWED_COURSES = Object.freeze([
    'BS Computer Science',
    'BS Information Technology',
    'BS Data Science',
    'BS Software Engineering'
]);

/** Permitted Academic Year Levels */
const ALLOWED_YEARS = Object.freeze([
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year'
]);

/** Unique internal identifier tag demonstrating Symbol data type */
const INTERNAL_RECORD_TAG = Symbol('sms_record_internal_tag');

/** System epoch timestamp demonstration of BigInt data type */
const SYSTEM_GEN_EPOCH = BigInt(1704067200000);

/**
 * Initial Default Dataset (used on first launch or reset)
 * Diverse student records spanning various courses, grade ranges, and attendance.
 */
const INITIAL_STUDENTS_DATA = [
    {
        id: 'STU-1001',
        name: 'Sophia Vance',
        age: 20,
        course: 'BS Computer Science',
        yearLevel: '3rd Year',
        grades: [96, 94, 98, 92],
        attendance: { present: 18, late: 2, absent: 0 },
        enrollmentDate: '2024-08-15'
    },
    {
        id: 'STU-1002',
        name: 'Marcus Thorne',
        age: 21,
        course: 'BS Software Engineering',
        yearLevel: '4th Year',
        grades: [88, 85, 90, 84],
        attendance: { present: 16, late: 2, absent: 2 },
        enrollmentDate: '2023-08-20'
    },
    {
        id: 'STU-1003',
        name: 'Elena Rostova',
        age: 19,
        course: 'BS Data Science',
        yearLevel: '2nd Year',
        grades: [92, 91, 89, 95],
        attendance: { present: 19, late: 0, absent: 1 },
        enrollmentDate: '2025-01-10'
    },
    {
        id: 'STU-1004',
        name: 'Devon Miller',
        age: 22,
        course: 'BS Information Technology',
        yearLevel: '3rd Year',
        grades: [72, 70, 74, 68],
        attendance: { present: 12, late: 2, absent: 6 },
        enrollmentDate: '2024-08-15'
    },
    {
        id: 'STU-1005',
        name: 'Chloe Bennett',
        age: 18,
        course: 'BS Computer Science',
        yearLevel: '1st Year',
        grades: [78, 76, 82, 80],
        attendance: { present: 17, late: 2, absent: 1 },
        enrollmentDate: '2026-08-12'
    },
    {
        id: 'STU-1006',
        name: 'Aiden Cross',
        age: 20,
        course: 'BS Software Engineering',
        yearLevel: '2nd Year',
        grades: [58, 62, 54, 60],
        attendance: { present: 10, late: 2, absent: 8 },
        enrollmentDate: '2025-01-10'
    }
];

// ==============================================================================
// SECTION 2: APPLICATION STATE
// [Concept 1: Variables & Data Types - let for mutable reactive state]
// ==============================================================================
let appState = {
    students: [],
    searchQuery: '',
    courseFilter: 'ALL',
    yearFilter: 'ALL',
    statusFilter: 'ALL',
    sortBy: 'name_asc',
    isLoading: false,
    isSimulatingError: false,
    activeEditStudentId: null,
    activeGradeStudentId: null,
    activeAttendanceStudentId: null,
    confirmActionCallback: null
};

// ==============================================================================
// SECTION 3: BUSINESS LOGIC - GRADES, ATTENDANCE & ANALYTICS
// [Concepts 2, 3, 4, 5, 6, 7, 8: Operators, Control Flow, Loops, Functions, Arrays, Objects, Modern JS]
// ==============================================================================

/**
 * Calculates the arithmetic average of a student's grades.
 * [Concept 5: Function Declaration]
 * [Concept 6: Array reduce() method]
 * [Concept 2: Arithmetic Operators + / and Ternary ? :]
 * 
 * @param {number[]} gradesArray - Array of numeric grades (0-100)
 * @returns {number|null} Calculated average rounded to 1 decimal place, or null if no grades.
 */
function calculateStudentAverage(gradesArray) {
    if (!Array.isArray(gradesArray) || gradesArray.length === 0) {
        return null;
    }

    const totalSum = gradesArray.reduce((accumulator, currentGrade) => {
        return accumulator + currentGrade;
    }, 0);

    const average = totalSum / gradesArray.length;
    return Math.round(average * 10) / 10;
}

/**
 * Determines whether a given average meets the passing threshold.
 * [Concept 5: Arrow Function]
 * [Concept 2: Comparison Operator >=]
 * 
 * @param {number|null} average - Calculated grade average
 * @returns {boolean} True if average >= PASSING_THRESHOLD (75.0)
 */
const isStudentPassing = (average) => {
    return typeof average === 'number' && average >= PASSING_THRESHOLD;
};

/**
 * Returns the descriptive academic remark based on grade score.
 * [Concept 3: Control Flow - switch statement with expressions]
 * [Concept 5: Function Expression]
 * 
 * @param {number|null} average - Calculated grade average
 * @returns {string} Formal academic achievement label
 */
const getAcademicRemark = function(average) {
    if (average === null || average === undefined) {
        return 'No Grades Yet';
    }

    switch (true) {
        case (average >= 95.0):
            return "President's Lister (Highest Honors)";
        case (average >= 90.0):
            return "Dean's Lister (High Honors)";
        case (average >= 85.0):
            return 'Very Satisfactory';
        case (average >= 80.0):
            return 'Satisfactory';
        case (average >= 75.0):
            return 'Fair / Passed';
        case (average >= 60.0):
            return 'Remedial / Conditional';
        default:
            return 'Failing Standing';
    }
};

/**
 * Finds the highest and lowest scores in an array of grades.
 * [Concept 2: Spread Operator ...]
 * [Concept 7: Object Literal & Destructuring]
 * 
 * @param {number[]} grades - Array of numbers
 * @returns {{ max: number|null, min: number|null }}
 */
function getGradeExtremes(grades) {
    if (!Array.isArray(grades) || grades.length === 0) {
        return { max: null, min: null };
    }

    return {
        max: Math.max(...grades),
        min: Math.min(...grades)
    };
}

/**
 * Calculates total academic sessions and weighted attendance percentage.
 * Formula: ((present + 0.5 * late) / totalSessions) * 100
 * [Concept 7: Object Destructuring]
 * [Concept 8: Nullish Coalescing ??]
 * 
 * @param {{ present: number, late: number, absent: number }} attendanceObj
 * @returns {{ totalSessions: number, attendanceRate: number, formatted: string }}
 */
function calculateAttendanceMetrics(attendanceObj) {
    const present = attendanceObj?.present ?? 0;
    const late = attendanceObj?.late ?? 0;
    const absent = attendanceObj?.absent ?? 0;

    const totalSessions = present + late + absent;

    if (totalSessions === 0) {
        return {
            totalSessions: 0,
            attendanceRate: 100.0,
            formatted: '100.0%'
        };
    }

    // Weighted attendance calculation
    const weightedPoints = present + (late * 0.5);
    const rate = (weightedPoints / totalSessions) * 100;
    const roundedRate = Math.round(rate * 10) / 10;

    return {
        totalSessions,
        attendanceRate: roundedRate,
        formatted: `${roundedRate.toFixed(1)}%`
    };
}

/**
 * Computes all class-wide statistics for the executive dashboard.
 * [Concept 4: Loops - for...of loop demonstration]
 * [Concept 6: Array methods filter(), map(), reduce()]
 * [Concept 7: Object Literal return]
 * 
 * @param {Array<Object>} studentsList
 * @returns {Object} Comprehensive class summary
 */
function computeDashboardMetrics(studentsList) {
    const totalStudents = studentsList.length;

    if (totalStudents === 0) {
        return {
            totalStudents: 0,
            passedCount: 0,
            failedCount: 0,
            passedRate: '0.0%',
            failedRate: '0.0%',
            classAverage: '0.0%',
            classAverageNumeric: 0,
            classAverageRemark: 'No enrolled students',
            overallAttendanceRate: '0.0%',
            attendanceBreakdown: '0P / 0L / 0A',
            topPerformerName: 'None',
            topPerformerGpa: 'N/A',
            highestGrade: 'N/A',
            lowestGrade: 'N/A'
        };
    }

    let gradedStudentsCount = 0;
    let sumOfAverages = 0;
    let passedCount = 0;
    let failedCount = 0;
    let totalPresent = 0;
    let totalLate = 0;
    let totalAbsent = 0;

    let allIndividualGrades = [];
    let topStudent = null;
    let highestStudentGpa = -1;

    // Iterate using for...of loop
    for (const student of studentsList) {
        const studentAvg = calculateStudentAverage(student.grades);

        if (studentAvg !== null) {
            gradedStudentsCount++;
            sumOfAverages += studentAvg;

            if (studentAvg >= PASSING_THRESHOLD) {
                passedCount++;
            } else {
                failedCount++;
            }

            if (studentAvg > highestStudentGpa) {
                highestStudentGpa = studentAvg;
                topStudent = student;
            }

            // Gather all individual grades for class extremes
            for (const g of student.grades) {
                allIndividualGrades.push(g);
            }
        }

        // Attendance tally using nullish coalescing
        totalPresent += student.attendance?.present ?? 0;
        totalLate += student.attendance?.late ?? 0;
        totalAbsent += student.attendance?.absent ?? 0;
    }

    // Class average
    const classAvgNumeric = gradedStudentsCount > 0 
        ? Math.round((sumOfAverages / gradedStudentsCount) * 10) / 10 
        : 0;

    // Passing & failure rates relative to graded students (or total enrolled)
    const evaluatedBase = gradedStudentsCount > 0 ? gradedStudentsCount : totalStudents;
    const passedRate = ((passedCount / evaluatedBase) * 100).toFixed(1) + '%';
    const failedRate = ((failedCount / evaluatedBase) * 100).toFixed(1) + '%';

    // Overall attendance calculation
    const totalClassSessions = totalPresent + totalLate + totalAbsent;
    const overallAttRate = totalClassSessions > 0
        ? (((totalPresent + (totalLate * 0.5)) / totalClassSessions) * 100).toFixed(1) + '%'
        : '100.0%';

    // Highest and lowest individual grades across entire class
    const extremes = getGradeExtremes(allIndividualGrades);

    return {
        totalStudents,
        passedCount,
        failedCount,
        passedRate,
        failedRate,
        classAverage: classAvgNumeric.toFixed(1) + '%',
        classAverageNumeric: classAvgNumeric,
        classAverageRemark: getAcademicRemark(gradedStudentsCount > 0 ? classAvgNumeric : null),
        overallAttendanceRate: overallAttRate,
        attendanceBreakdown: `${totalPresent}P / ${totalLate}L / ${totalAbsent}A`,
        topPerformerName: topStudent ? `${topStudent.name} (${topStudent.id})` : 'None yet',
        topPerformerGpa: topStudent ? `${highestStudentGpa.toFixed(1)}%` : 'N/A',
        highestGrade: extremes.max !== null ? `${extremes.max.toFixed(1)}%` : 'N/A',
        lowestGrade: extremes.min !== null ? `${extremes.min.toFixed(1)}%` : 'N/A'
    };
}

/**
 * Higher-Order Function: Generates a comparator function for sorting students.
 * [Concept 5: Higher-Order Function returning a function]
 * [Concept 3: Control Flow switch]
 * [Concept 6: Array sort()]
 * 
 * @param {string} criteria - e.g. 'name_asc', 'gpa_desc', etc.
 * @returns {Function} Sorting callback function (a, b) => number
 */
function createStudentComparator(criteria) {
    return function(studentA, studentB) {
        switch (criteria) {
            case 'name_asc':
                return studentA.name.localeCompare(studentB.name);

            case 'name_desc':
                return studentB.name.localeCompare(studentA.name);

            case 'id_asc':
                return studentA.id.localeCompare(studentB.id, undefined, { numeric: true });

            case 'gpa_desc': {
                const avgA = calculateStudentAverage(studentA.grades) ?? -1;
                const avgB = calculateStudentAverage(studentB.grades) ?? -1;
                return avgB - avgA;
            }

            case 'gpa_asc': {
                const avgA = calculateStudentAverage(studentA.grades) ?? 999;
                const avgB = calculateStudentAverage(studentB.grades) ?? 999;
                return avgA - avgB;
            }

            case 'attendance_desc': {
                const rateA = calculateAttendanceMetrics(studentA.attendance).attendanceRate;
                const rateB = calculateAttendanceMetrics(studentB.attendance).attendanceRate;
                return rateB - rateA;
            }

            default:
                return 0;
        }
    };
}

/**
 * Generates the next recommended unique Student ID using a while loop.
 * [Concept 4: Loops - while loop]
 * 
 * @param {Array<Object>} existingStudents
 * @returns {string} Unique student ID, e.g. "STU-1007"
 */
function generateNextStudentId(existingStudents) {
    let nextNum = existingStudents.length + 1001;
    let candidateId = `STU-${nextNum}`;

    // Loop until an unused ID is found
    while (existingStudents.some(s => s.id.toUpperCase() === candidateId.toUpperCase())) {
        nextNum++;
        candidateId = `STU-${nextNum}`;
    }

    return candidateId;
}

// ==============================================================================
// SECTION 4: LOCAL DATA PERSISTENCE SERVICE
// [Concept 5: Object with methods]
// [Concept 9: Error Handling - try...catch...finally, JSON validation]
// ==============================================================================
const persistenceService = {
    /**
     * Retrieves saved student records from localStorage safely.
     * Recovers gracefully with initial dataset if stored data is corrupted.
     * @returns {Array<Object>} Array of student objects
     */
    loadRecords() {
        try {
            const rawData = localStorage.getItem(STORAGE_KEY);
            if (!rawData) {
                return null; // Signals initial run
            }

            const parsed = JSON.parse(rawData);

            // Validate that parsed data is an array
            if (!Array.isArray(parsed)) {
                console.warn('Stored data was not an array. Resetting to fallback dataset.');
                return null;
            }

            // Verify integrity of required fields
            const validRecords = parsed.filter(item => {
                return item && typeof item.id === 'string' && typeof item.name === 'string';
            });

            return validRecords;
        } catch (error) {
            console.error('Persistence read error:', error);
            return null; // Gracefully signal recovery
        }
    },

    /**
     * Saves student records to localStorage.
     * @param {Array<Object>} records - Student array to serialize
     * @returns {boolean} True if successfully saved
     */
    saveRecords(records) {
        try {
            if (!Array.isArray(records)) {
                throw new TypeError('Cannot save non-array data to persistence store.');
            }
            const serialized = JSON.stringify(records);
            localStorage.setItem(STORAGE_KEY, serialized);
            return true;
        } catch (error) {
            console.error('Persistence save error:', error);
            showToast('Storage Error', 'Unable to save records to browser storage.', 'error');
            return false;
        }
    },

    /**
     * Clears stored records from localStorage.
     */
    clearRecords() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Persistence clear error:', error);
            return false;
        }
    }
};

// ==============================================================================
// SECTION 5: ASYNCHRONOUS OPERATIONS & PROMISE SIMULATION (MODULE 6)
// [Concept 10: Asynchronous JavaScript - new Promise, async/await, try/catch, setTimeout]
// Strict Zero API Fetching Rule Enforced.
// ==============================================================================

/**
 * Creates a timer-based Promise delay.
 * [Concept 10: Asynchronous JavaScript - Promise constructor]
 * 
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
function simulateAsyncDelay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Simulates asynchronous database loading on startup with realistic stages.
 * Demonstrates async/await, try/catch, progress updates, and simulated failure recovery.
 */
async function initializeApplicationAsync() {
    const overlay = document.getElementById('loadingOverlay');
    const statusText = document.getElementById('loaderStatusText');
    const progressBar = document.getElementById('loaderProgressBar');
    const errorBanner = document.getElementById('errorRecoveryBanner');

    // Set loading state and disable relevant action buttons
    setGlobalLoadingState(true);
    errorBanner.classList.add('hidden');
    overlay.classList.remove('hidden');

    try {
        // Stage 1: Initializing local storage
        statusText.textContent = 'Verifying storage configuration and schemas...';
        progressBar.style.width = '25%';
        await simulateAsyncDelay(350);

        // Stage 2: Simulating network or async retrieval failure check
        statusText.textContent = 'Connecting to local datastore...';
        progressBar.style.width = '60%';
        await simulateAsyncDelay(400);

        // Check if user toggled simulated error
        if (appState.isSimulatingError) {
            throw new Error('Simulated Connection Timeout: Failed to retrieve student database.');
        }

        // Stage 3: Loading records from persistence or falling back to sample dataset
        statusText.textContent = 'Parsing student records and calculating GPA metrics...';
        progressBar.style.width = '85%';
        await simulateAsyncDelay(350);

        let loadedStudents = persistenceService.loadRecords();

        if (loadedStudents === null || loadedStudents.length === 0) {
            // Initial seed
            loadedStudents = structuredClone(INITIAL_STUDENTS_DATA);
            persistenceService.saveRecords(loadedStudents);
            showToast('System Initialized', 'Loaded default starter dataset into local storage.', 'info');
        } else {
            showToast('Records Loaded', `Restored ${loadedStudents.length} student records from storage.`, 'success');
        }

        // Complete loading
        progressBar.style.width = '100%';
        statusText.textContent = 'Ready!';
        await simulateAsyncDelay(200);

        appState.students = loadedStudents;
        renderAll();

        // Hide overlay smoothly
        overlay.classList.add('hidden');
    } catch (error) {
        console.error('Async initialization error:', error);

        // Display error in UI and banner (Module 6 requirement)
        overlay.classList.add('hidden');
        document.getElementById('errorBannerTitle').textContent = 'Async Operation Encountered an Error';
        document.getElementById('errorBannerMessage').textContent = error.message;
        errorBanner.classList.remove('hidden');

        showToast('Initialization Error', error.message, 'error');
    } finally {
        setGlobalLoadingState(false);
    }
}

/**
 * Toggles disabled state on interactive buttons while async operations are running.
 * [Concept 11: DOM Manipulation]
 * 
 * @param {boolean} isLoading
 */
function setGlobalLoadingState(isLoading) {
    appState.isLoading = isLoading;
    const actionButtons = document.querySelectorAll(
        '#openAddStudentModalBtn, #resetDataBtn, #exportDataBtn, #retryAsyncBtn'
    );

    actionButtons.forEach(button => {
        button.disabled = isLoading;
    });
}

// ==============================================================================
// SECTION 6: DOM MANIPULATION & RENDERING ENGINE
// [Concepts 11 & 12: DOM Selection, Creation, Mutation, Events]
// ==============================================================================

/**
 * Cached DOM Element References for high performance.
 */
const DOM = {
    // Dashboard Stats
    totalStudentsStat: document.getElementById('totalStudentsStat'),
    totalStudentsSub: document.getElementById('totalStudentsSub'),
    passedStudentsStat: document.getElementById('passedStudentsStat'),
    passedStudentsRate: document.getElementById('passedStudentsRate'),
    failedStudentsStat: document.getElementById('failedStudentsStat'),
    failedStudentsRate: document.getElementById('failedStudentsRate'),
    classAverageStat: document.getElementById('classAverageStat'),
    classAverageRemark: document.getElementById('classAverageRemark'),
    classAverageBar: document.getElementById('classAverageBar'),
    overallAttendanceStat: document.getElementById('overallAttendanceStat'),
    attendanceBreakdownStat: document.getElementById('attendanceBreakdownStat'),
    topPerformerText: document.getElementById('topPerformerText'),
    highestGradeText: document.getElementById('highestGradeText'),
    lowestGradeText: document.getElementById('lowestGradeText'),

    // Records Section
    recordCountBadge: document.getElementById('recordCountBadge'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    courseFilter: document.getElementById('courseFilter'),
    yearFilter: document.getElementById('yearFilter'),
    statusFilter: document.getElementById('statusFilter'),
    sortBySelect: document.getElementById('sortBySelect'),
    studentsTable: document.getElementById('studentsTable'),
    studentsTableBody: document.getElementById('studentsTableBody'),
    emptyState: document.getElementById('emptyState'),
    emptyStateTitle: document.getElementById('emptyStateTitle'),
    emptyStateMsg: document.getElementById('emptyStateMsg'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    emptyStateAddBtn: document.getElementById('emptyStateAddBtn'),
    openAddStudentModalBtn: document.getElementById('openAddStudentModalBtn'),

    // Global Action Controls
    inspectConceptsBtn: document.getElementById('inspectConceptsBtn'),
    simulateErrorToggleBtn: document.getElementById('simulateErrorToggleBtn'),
    simulateErrorLabel: document.getElementById('simulateErrorLabel'),
    exportDataBtn: document.getElementById('exportDataBtn'),
    importDataInput: document.getElementById('importDataInput'),
    resetDataBtn: document.getElementById('resetDataBtn'),
    retryAsyncBtn: document.getElementById('retryAsyncBtn'),
    dismissErrorBannerBtn: document.getElementById('dismissErrorBannerBtn'),
    errorRecoveryBanner: document.getElementById('errorRecoveryBanner'),
    toastContainer: document.getElementById('toastContainer'),

    // Modals
    studentModal: document.getElementById('studentModal'),
    studentForm: document.getElementById('studentForm'),
    studentFormMode: document.getElementById('studentFormMode'),
    originalStudentId: document.getElementById('originalStudentId'),
    studentModalTitle: document.getElementById('studentModalTitle'),
    studentModalIcon: document.getElementById('studentModalIcon'),
    studentIdInput: document.getElementById('studentIdInput'),
    generateIdBtn: document.getElementById('generateIdBtn'),
    studentAgeInput: document.getElementById('studentAgeInput'),
    studentNameInput: document.getElementById('studentNameInput'),
    studentCourseInput: document.getElementById('studentCourseInput'),
    studentYearInput: document.getElementById('studentYearInput'),
    studentInitialGradesInput: document.getElementById('studentInitialGradesInput'),
    initialGradesField: document.getElementById('initialGradesField'),
    saveStudentBtnText: document.getElementById('saveStudentBtnText'),
    closeStudentModalBtn: document.getElementById('closeStudentModalBtn'),
    cancelStudentModalBtn: document.getElementById('cancelStudentModalBtn'),

    // Grade Modal
    gradeModal: document.getElementById('gradeModal'),
    gradeStudentId: document.getElementById('gradeStudentId'),
    gradeModalSubtitle: document.getElementById('gradeModalSubtitle'),
    modalGpaValue: document.getElementById('modalGpaValue'),
    modalStandingBadge: document.getElementById('modalStandingBadge'),
    modalHighLowScore: document.getElementById('modalHighLowScore'),
    addGradeForm: document.getElementById('addGradeForm'),
    newGradeInput: document.getElementById('newGradeInput'),
    newGradeError: document.getElementById('newGradeError'),
    gradesCountLabel: document.getElementById('gradesCountLabel'),
    gradesChipsContainer: document.getElementById('gradesChipsContainer'),
    noGradesNotice: document.getElementById('noGradesNotice'),
    closeGradeModalBtn: document.getElementById('closeGradeModalBtn'),
    doneGradeModalBtn: document.getElementById('doneGradeModalBtn'),

    // Attendance Modal
    attendanceModal: document.getElementById('attendanceModal'),
    attendanceStudentId: document.getElementById('attendanceStudentId'),
    attendanceModalSubtitle: document.getElementById('attendanceModalSubtitle'),
    modalAttendanceRate: document.getElementById('modalAttendanceRate'),
    modalAttendanceProgressRing: document.getElementById('modalAttendanceProgressRing'),
    modalPresentCount: document.getElementById('modalPresentCount'),
    modalLateCount: document.getElementById('modalLateCount'),
    modalAbsentCount: document.getElementById('modalAbsentCount'),
    modalTotalSessions: document.getElementById('modalTotalSessions'),
    incPresentBtn: document.getElementById('incPresentBtn'),
    decPresentBtn: document.getElementById('decPresentBtn'),
    incLateBtn: document.getElementById('incLateBtn'),
    decLateBtn: document.getElementById('decLateBtn'),
    incAbsentBtn: document.getElementById('incAbsentBtn'),
    decAbsentBtn: document.getElementById('decAbsentBtn'),
    resetStudentAttendanceBtn: document.getElementById('resetStudentAttendanceBtn'),
    closeAttendanceModalBtn: document.getElementById('closeAttendanceModalBtn'),
    doneAttendanceModalBtn: document.getElementById('doneAttendanceModalBtn'),

    // Confirmation Modal
    confirmModal: document.getElementById('confirmModal'),
    confirmModalTitle: document.getElementById('confirmModalTitle'),
    confirmModalMessage: document.getElementById('confirmModalMessage'),
    confirmModalSubtext: document.getElementById('confirmModalSubtext'),
    closeConfirmModalBtn: document.getElementById('closeConfirmModalBtn'),
    cancelConfirmModalBtn: document.getElementById('cancelConfirmModalBtn'),
    executeConfirmModalBtn: document.getElementById('executeConfirmModalBtn'),

    // Concepts Inspector Modal
    conceptsModal: document.getElementById('conceptsModal'),
    conceptsGrid: document.getElementById('conceptsGrid'),
    closeConceptsModalBtn: document.getElementById('closeConceptsModalBtn'),
    closeConceptsFooterBtn: document.getElementById('closeConceptsFooterBtn')
};

/**
 * Renders the entire dashboard metrics.
 * [Concept 11: Updating text and content dynamically]
 */
function renderDashboard() {
    const metrics = computeDashboardMetrics(appState.students);

    DOM.totalStudentsStat.textContent = metrics.totalStudents;
    DOM.totalStudentsSub.textContent = metrics.totalStudents === 1 ? '1 active student' : `${metrics.totalStudents} active student records`;

    DOM.passedStudentsStat.textContent = metrics.passedCount;
    DOM.passedStudentsRate.textContent = `${metrics.passedRate} of class passing`;

    DOM.failedStudentsStat.textContent = metrics.failedCount;
    DOM.failedStudentsRate.textContent = `${metrics.failedRate} at-risk / remedial`;

    DOM.classAverageStat.textContent = metrics.classAverage;
    DOM.classAverageRemark.textContent = metrics.classAverageRemark;
    DOM.classAverageBar.style.width = `${Math.min(metrics.classAverageNumeric, 100)}%`;

    DOM.overallAttendanceStat.textContent = metrics.overallAttendanceRate;
    DOM.attendanceBreakdownStat.textContent = `${metrics.attendanceBreakdown} total sessions`;

    DOM.topPerformerText.textContent = `${metrics.topPerformerName} — ${metrics.topPerformerGpa}`;
    DOM.highestGradeText.textContent = metrics.highestGrade;
    DOM.lowestGradeText.textContent = metrics.lowestGrade;
}

/**
 * Filters and sorts students according to active query and dropdown selections.
 * [Concept 6: Array methods filter(), sort()]
 * [Concept 8: Modern JavaScript - Optional Chaining]
 * 
 * @returns {Array<Object>} Filtered and sorted student records
 */
function getProcessedStudents() {
    const { students, searchQuery, courseFilter, yearFilter, statusFilter, sortBy } = appState;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    // Filter students
    const filtered = students.filter(student => {
        // Search query matching Name or ID
        if (normalizedQuery) {
            const matchesId = student.id.toLowerCase().includes(normalizedQuery);
            const matchesName = student.name.toLowerCase().includes(normalizedQuery);
            if (!matchesId && !matchesName) {
                return false;
            }
        }

        // Course filter
        if (courseFilter !== 'ALL' && student.course !== courseFilter) {
            return false;
        }

        // Year level filter
        if (yearFilter !== 'ALL' && student.yearLevel !== yearFilter) {
            return false;
        }

        // Status filter
        if (statusFilter !== 'ALL') {
            const avg = calculateStudentAverage(student.grades);
            if (statusFilter === 'PASSED') {
                if (avg === null || avg < PASSING_THRESHOLD) return false;
            } else if (statusFilter === 'FAILED') {
                if (avg === null || avg >= PASSING_THRESHOLD) return false;
            } else if (statusFilter === 'NO_GRADES') {
                if (avg !== null) return false;
            }
        }

        return true;
    });

    // Sort students using comparator function
    const comparator = createStudentComparator(sortBy);
    return filtered.sort(comparator);
}

/**
 * Renders the student table rows and empty state.
 * [Concept 11: DOM Creation, ClassList toggling, Event Delegation compatibility]
 */
function renderStudentsTable() {
    const processedStudents = getProcessedStudents();
    const tbody = DOM.studentsTableBody;

    // Clear existing table rows
    tbody.innerHTML = '';

    // Update count badge
    const totalCount = appState.students.length;
    const matchCount = processedStudents.length;

    if (totalCount === matchCount) {
        DOM.recordCountBadge.textContent = `${totalCount} ${totalCount === 1 ? 'Student' : 'Students'}`;
    } else {
        DOM.recordCountBadge.textContent = `Showing ${matchCount} of ${totalCount}`;
    }

    // Toggle Empty State
    if (processedStudents.length === 0) {
        DOM.studentsTable.classList.add('hidden');
        DOM.emptyState.classList.remove('hidden');

        if (totalCount === 0) {
            DOM.emptyStateTitle.textContent = 'No Students Enrolled';
            DOM.emptyStateMsg.textContent = 'Your directory is currently empty. Click the button below to enroll your first student.';
            DOM.resetFiltersBtn.classList.add('hidden');
            DOM.emptyStateAddBtn.classList.remove('hidden');
        } else {
            DOM.emptyStateTitle.textContent = 'No Students Matched';
            DOM.emptyStateMsg.textContent = 'No records matched your search criteria or active filters. Try adjusting your search query.';
            DOM.resetFiltersBtn.classList.remove('hidden');
            DOM.emptyStateAddBtn.classList.add('hidden');
        }
        return;
    }

    DOM.studentsTable.classList.remove('hidden');
    DOM.emptyState.classList.add('hidden');

    // Build table rows programmatically
    processedStudents.forEach(student => {
        const row = createStudentTableRow(student);
        tbody.appendChild(row);
    });
}

/**
 * Creates a single table row element for a student record.
 * [Concept 11: document.createElement, append, textContent]
 * 
 * @param {Object} student - Student record object
 * @returns {HTMLTableRowElement} Constructed row element
 */
function createStudentTableRow(student) {
    const tr = document.createElement('tr');
    tr.dataset.id = student.id;

    // 1. Student ID Cell
    const tdId = document.createElement('td');
    const idBadge = document.createElement('span');
    idBadge.className = 'id-badge';
    idBadge.textContent = student.id;
    tdId.appendChild(idBadge);
    tr.appendChild(tdId);

    // 2. Student Details Cell
    const tdStudent = document.createElement('td');
    const studentCell = document.createElement('div');
    studentCell.className = 'student-cell';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'student-name';
    nameSpan.textContent = student.name;

    const metaSpan = document.createElement('span');
    metaSpan.className = 'student-meta';
    metaSpan.textContent = `Age: ${student.age} yrs • Enrolled ${student.enrollmentDate || 'Recent'}`;

    studentCell.append(nameSpan, metaSpan);
    tdStudent.appendChild(studentCell);
    tr.appendChild(tdStudent);

    // 3. Course & Year Level Cell
    const tdCourse = document.createElement('td');
    const courseBadge = document.createElement('span');
    courseBadge.className = 'program-badge';
    courseBadge.textContent = student.course;

    const yearText = document.createElement('span');
    yearText.className = 'year-text';
    yearText.textContent = student.yearLevel;

    tdCourse.append(courseBadge, yearText);
    tr.appendChild(tdCourse);

    // 4. Grades & GPA Cell
    const tdGrades = document.createElement('td');
    const gradesCell = document.createElement('div');
    gradesCell.className = 'grades-cell';

    const avg = calculateStudentAverage(student.grades);
    const gpaRow = document.createElement('div');
    gpaRow.className = 'gpa-row';

    const gpaValue = document.createElement('span');
    gpaValue.className = 'gpa-value';

    const statusBadge = document.createElement('span');
    statusBadge.className = 'status-badge';

    if (avg === null) {
        gpaValue.classList.add('gpa-none');
        gpaValue.textContent = '--';
        statusBadge.classList.add('badge-neutral');
        statusBadge.innerHTML = '<i class="fa-solid fa-clock"></i> No Grades';
    } else if (avg >= PASSING_THRESHOLD) {
        gpaValue.classList.add('gpa-passing');
        gpaValue.textContent = `${avg.toFixed(1)}%`;
        statusBadge.classList.add('badge-passed');
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Passed';
    } else {
        gpaValue.classList.add('gpa-failing');
        gpaValue.textContent = `${avg.toFixed(1)}%`;
        statusBadge.classList.add('badge-failed');
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Failed';
    }

    gpaRow.append(gpaValue, statusBadge);

    const remarkSpan = document.createElement('span');
    remarkSpan.className = 'academic-remark';
    remarkSpan.textContent = getAcademicRemark(avg);

    const manageGradesBtn = document.createElement('button');
    manageGradesBtn.type = 'button';
    manageGradesBtn.className = 'btn-manage-grades';
    manageGradesBtn.dataset.action = 'manage-grades';
    manageGradesBtn.dataset.id = student.id;
    const gradesCount = student.grades ? student.grades.length : 0;
    manageGradesBtn.innerHTML = `<i class="fa-solid fa-sliders"></i> Manage (${gradesCount} ${gradesCount === 1 ? 'score' : 'scores'})`;

    gradesCell.append(gpaRow, remarkSpan, manageGradesBtn);
    tdGrades.appendChild(gradesCell);
    tr.appendChild(tdGrades);

    // 5. Attendance Cell
    const tdAttendance = document.createElement('td');
    const attCell = document.createElement('div');
    attCell.className = 'attendance-cell';

    const attMetrics = calculateAttendanceMetrics(student.attendance);

    const attRow = document.createElement('div');
    attRow.className = 'attendance-rate-row';

    const rateSpan = document.createElement('span');
    rateSpan.className = 'attendance-rate-pct';
    if (attMetrics.attendanceRate >= 85) {
        rateSpan.classList.add('attendance-rate-high');
    } else if (attMetrics.attendanceRate >= 70) {
        rateSpan.classList.add('attendance-rate-mid');
    } else {
        rateSpan.classList.add('attendance-rate-low');
    }
    rateSpan.textContent = attMetrics.formatted;

    const countsSpan = document.createElement('span');
    countsSpan.className = 'attendance-counts';
    const p = student.attendance?.present ?? 0;
    const l = student.attendance?.late ?? 0;
    const a = student.attendance?.absent ?? 0;
    countsSpan.textContent = `(${p}P / ${l}L / ${a}A)`;

    attRow.append(rateSpan, countsSpan);

    // Quick Attendance Action Buttons (Present / Late / Absent)
    const quickBar = document.createElement('div');
    quickBar.className = 'attendance-quick-actions';

    const qPresentBtn = document.createElement('button');
    qPresentBtn.type = 'button';
    qPresentBtn.className = 'btn-quick-att quick-present';
    qPresentBtn.dataset.action = 'quick-present';
    qPresentBtn.dataset.id = student.id;
    qPresentBtn.title = 'Quick Mark Present (+1)';
    qPresentBtn.innerHTML = '<i class="fa-solid fa-check"></i> +P';

    const qLateBtn = document.createElement('button');
    qLateBtn.type = 'button';
    qLateBtn.className = 'btn-quick-att quick-late';
    qLateBtn.dataset.action = 'quick-late';
    qLateBtn.dataset.id = student.id;
    qLateBtn.title = 'Quick Mark Late (+0.5)';
    qLateBtn.innerHTML = '<i class="fa-solid fa-clock"></i> +L';

    const qAbsentBtn = document.createElement('button');
    qAbsentBtn.type = 'button';
    qAbsentBtn.className = 'btn-quick-att quick-absent';
    qAbsentBtn.dataset.action = 'quick-absent';
    qAbsentBtn.dataset.id = student.id;
    qAbsentBtn.title = 'Quick Mark Absent (+0)';
    qAbsentBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> +A';

    quickBar.append(qPresentBtn, qLateBtn, qAbsentBtn);

    attCell.append(attRow, quickBar);
    tdAttendance.appendChild(attCell);
    tr.appendChild(tdAttendance);

    // 6. Action Controls Cell (Edit, Delete, Open Attendance Modal)
    const tdActions = document.createElement('td');
    tdActions.className = 'text-center';

    const actionsWrapper = document.createElement('div');
    actionsWrapper.className = 'actions-cell';

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn-icon-action btn-action-edit';
    editBtn.dataset.action = 'edit';
    editBtn.dataset.id = student.id;
    editBtn.title = `Edit details for ${student.name}`;
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    // Attendance Details Button
    const attDetailBtn = document.createElement('button');
    attDetailBtn.type = 'button';
    attDetailBtn.className = 'btn-icon-action';
    attDetailBtn.dataset.action = 'manage-attendance';
    attDetailBtn.dataset.id = student.id;
    attDetailBtn.title = `Detailed attendance for ${student.name}`;
    attDetailBtn.innerHTML = '<i class="fa-solid fa-calendar-check"></i>';

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-icon-action btn-action-delete';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.dataset.id = student.id;
    deleteBtn.title = `Delete ${student.name}`;
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    actionsWrapper.append(editBtn, attDetailBtn, deleteBtn);
    tdActions.appendChild(actionsWrapper);
    tr.appendChild(tdActions);

    return tr;
}

/**
 * Synchronizes both Dashboard and Student Table with underlying data.
 */
function renderAll() {
    renderDashboard();
    renderStudentsTable();
}

// ==============================================================================
// SECTION 7: TOAST NOTIFICATION SYSTEM
// [Concept 11: Dynamic DOM creation & removal with timer]
// ==============================================================================

/**
 * Dispatches an animated floating toast message.
 * 
 * @param {string} title - Heading
 * @param {string} message - Detail
 * @param {'success'|'error'|'warning'|'info'} [type='info']
 */
function showToast(title, message, type = 'info') {
    const container = DOM.toastContainer;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.role = 'alert';

    const iconClass = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-exclamation',
        warning: 'fa-solid fa-triangle-exclamation',
        info: 'fa-solid fa-circle-info'
    }[type] || 'fa-solid fa-circle-info';

    toast.innerHTML = `
        <i class="${iconClass} toast-icon"></i>
        <div class="toast-body">
            <span class="toast-title">${title}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button type="button" class="toast-close-btn" aria-label="Close notification">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    // Close button click listener
    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn.addEventListener('click', () => {
        dismissToast(toast);
    });

    container.appendChild(toast);

    // Auto-dismiss after 3.8s
    setTimeout(() => {
        dismissToast(toast);
    }, 3800);
}

/**
 * Smoothly dismisses and unmounts a toast element.
 * @param {HTMLElement} toast
 */
function dismissToast(toast) {
    if (!toast || toast.classList.contains('toast-hiding')) return;
    toast.classList.add('toast-hiding');
    setTimeout(() => {
        toast.remove();
    }, 250);
}

// ==============================================================================
// SECTION 8: FORM VALIDATION & MODAL CONTROLLERS (MODULE 1, 2, 3, 7)
// [Concept 9: Error Handling, Validations, Regular Expressions, Field Error UI]
// ==============================================================================

/**
 * Clears any active field validation error messages in student form.
 */
function clearStudentFormErrors() {
    const errorSpans = [
        'studentIdError',
        'studentAgeError',
        'studentNameError',
        'studentCourseError',
        'studentYearError',
        'studentInitialGradesError'
    ];
    errorSpans.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
}

/**
 * Opens Add Student Modal.
 */
function openAddStudentModal() {
    clearStudentFormErrors();
    DOM.studentForm.reset();
    DOM.studentFormMode.value = 'add';
    DOM.originalStudentId.value = '';
    DOM.studentModalTitle.textContent = 'Enroll New Student';
    DOM.studentModalIcon.className = 'fa-solid fa-user-plus modal-title-icon text-indigo';
    DOM.saveStudentBtnText.textContent = 'Save Student';
    DOM.studentIdInput.disabled = false;
    DOM.generateIdBtn.style.display = 'inline-flex';
    DOM.initialGradesField.style.display = 'flex';

    // Auto-populate recommended unique ID
    DOM.studentIdInput.value = generateNextStudentId(appState.students);

    DOM.studentModal.classList.remove('hidden');
    DOM.studentNameInput.focus();
}

/**
 * Opens Edit Student Modal with existing record loaded.
 * @param {string} studentId
 */
function openEditStudentModal(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (!student) {
        showToast('Error', 'Student record could not be found.', 'error');
        return;
    }

    clearStudentFormErrors();
    DOM.studentFormMode.value = 'edit';
    DOM.originalStudentId.value = student.id;
    DOM.studentModalTitle.textContent = `Edit Student: ${student.name}`;
    DOM.studentModalIcon.className = 'fa-solid fa-user-pen modal-title-icon text-indigo';
    DOM.saveStudentBtnText.textContent = 'Update Student';

    DOM.studentIdInput.value = student.id;
    DOM.studentIdInput.disabled = true; // Lock ID during edit to preserve identity
    DOM.generateIdBtn.style.display = 'none';
    DOM.initialGradesField.style.display = 'none'; // Managed via dedicated grade modal

    DOM.studentNameInput.value = student.name;
    DOM.studentAgeInput.value = student.age;
    DOM.studentCourseInput.value = student.course;
    DOM.studentYearInput.value = student.yearLevel;

    DOM.studentModal.classList.remove('hidden');
    DOM.studentNameInput.focus();
}

/**
 * Closes Student Add/Edit Modal.
 */
function closeStudentModal() {
    DOM.studentModal.classList.add('hidden');
    DOM.studentForm.reset();
}

/**
 * Validates and handles student form submission (Add or Edit).
 * [Concept 9: Error Handling]
 * [Concept 6: Array methods some(), findIndex()]
 * 
 * @param {SubmitEvent} event
 */
function handleStudentFormSubmit(event) {
    event.preventDefault();
    clearStudentFormErrors();

    const mode = DOM.studentFormMode.value;
    const idInput = DOM.studentIdInput.value.trim().toUpperCase();
    const nameInput = DOM.studentNameInput.value.trim();
    const ageInput = parseInt(DOM.studentAgeInput.value, 10);
    const courseInput = DOM.studentCourseInput.value;
    const yearInput = DOM.studentYearInput.value;
    const initialGradesRaw = DOM.studentInitialGradesInput.value.trim();

    let hasErrors = false;

    // Validate Student ID
    if (!idInput) {
        document.getElementById('studentIdError').textContent = 'Student ID is required.';
        hasErrors = true;
    } else if (!/^[A-Z0-9\-_]{3,15}$/i.test(idInput)) {
        document.getElementById('studentIdError').textContent = 'ID must be 3-15 alphanumeric characters (e.g. STU-1001).';
        hasErrors = true;
    } else if (mode === 'add') {
        const isDuplicate = appState.students.some(s => s.id.toUpperCase() === idInput);
        if (isDuplicate) {
            document.getElementById('studentIdError').textContent = `ID "${idInput}" is already assigned to another student.`;
            hasErrors = true;
        }
    }

    // Validate Name
    if (!nameInput) {
        document.getElementById('studentNameError').textContent = 'Student full name is required.';
        hasErrors = true;
    } else if (nameInput.length < 3) {
        document.getElementById('studentNameError').textContent = 'Full name must be at least 3 characters.';
        hasErrors = true;
    } else if (!/^[a-zA-Z\s.'-]+$/.test(nameInput)) {
        document.getElementById('studentNameError').textContent = 'Name contains invalid characters.';
        hasErrors = true;
    }

    // Validate Age (Reasonable range: 15 - 99)
    if (isNaN(ageInput)) {
        document.getElementById('studentAgeError').textContent = 'Age is required and must be a valid number.';
        hasErrors = true;
    } else if (ageInput < 15 || ageInput > 99) {
        document.getElementById('studentAgeError').textContent = 'Age must be between 15 and 99 years old.';
        hasErrors = true;
    }

    // Validate Course
    if (!courseInput || !ALLOWED_COURSES.includes(courseInput)) {
        document.getElementById('studentCourseError').textContent = 'Please select a valid degree program.';
        hasErrors = true;
    }

    // Validate Year Level
    if (!yearInput || !ALLOWED_YEARS.includes(yearInput)) {
        document.getElementById('studentYearError').textContent = 'Please select a valid year level.';
        hasErrors = true;
    }

    // Validate Initial Grades if provided (Add mode)
    let parsedGrades = [];
    if (mode === 'add' && initialGradesRaw) {
        const tokens = initialGradesRaw.split(',').map(t => t.trim()).filter(Boolean);
        for (const token of tokens) {
            const num = parseFloat(token);
            if (isNaN(num) || num < 0 || num > 100) {
                document.getElementById('studentInitialGradesError').textContent = `Invalid score "${token}". All grades must be numbers between 0 and 100.`;
                hasErrors = true;
                break;
            }
            parsedGrades.push(Math.round(num * 10) / 10);
        }
    }

    if (hasErrors) {
        return;
    }

    // Process Add vs Edit
    if (mode === 'add') {
        const newStudent = {
            id: idInput,
            name: nameInput,
            age: ageInput,
            course: courseInput,
            yearLevel: yearInput,
            grades: parsedGrades,
            attendance: { present: 0, late: 0, absent: 0 },
            enrollmentDate: new Date().toISOString().slice(0, 10)
        };

        // Add to state and save
        appState.students.unshift(newStudent);
        persistenceService.saveRecords(appState.students);
        renderAll();
        closeStudentModal();
        showToast('Student Enrolled', `Successfully added ${newStudent.name} (${newStudent.id}).`, 'success');
    } else {
        // Edit Mode
        const targetId = DOM.originalStudentId.value;
        const studentIndex = appState.students.findIndex(s => s.id === targetId);

        if (studentIndex === -1) {
            showToast('Error', 'Record could not be located for update.', 'error');
            return;
        }

        // Immutable update using spread operator [Concept 2 & 7]
        appState.students[studentIndex] = {
            ...appState.students[studentIndex],
            name: nameInput,
            age: ageInput,
            course: courseInput,
            yearLevel: yearInput
        };

        persistenceService.saveRecords(appState.students);
        renderAll();
        closeStudentModal();
        showToast('Record Updated', `Updated details for ${nameInput}.`, 'success');
    }
}

/**
 * Initiates student deletion with custom confirmation modal.
 * @param {string} studentId
 */
function requestDeleteStudent(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;

    openConfirmModal({
        title: 'Delete Student Record',
        message: `Are you sure you want to permanently delete ${student.name} (${student.id})?`,
        subtext: 'This will remove all academic grades, GPA history, and attendance records permanently.',
        onConfirm: () => {
            appState.students = appState.students.filter(s => s.id !== studentId);
            persistenceService.saveRecords(appState.students);
            renderAll();
            showToast('Student Deleted', `Removed record for ${student.name}.`, 'warning');
        }
    });
}

// ==============================================================================
// SECTION 9: GRADE MANAGEMENT MODAL CONTROLLER (MODULE 2)
// [Concept 6: Array methods push, splice, map]
// [Concept 9: Out-of-bounds rejection 0-100]
// ==============================================================================

/**
 * Opens Grade Management Modal for a specific student.
 * @param {string} studentId
 */
function openGradeModal(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;

    appState.activeGradeStudentId = student.id;
    DOM.gradeStudentId.value = student.id;
    DOM.gradeModalSubtitle.textContent = `Managing assessments for ${student.name} (${student.id})`;
    DOM.newGradeError.textContent = '';
    DOM.newGradeInput.value = '';

    renderGradeModalView(student);
    DOM.gradeModal.classList.remove('hidden');
    DOM.newGradeInput.focus();
}

/**
 * Updates the Grade Modal's live statistics and assessment chips.
 * @param {Object} student
 */
function renderGradeModalView(student) {
    const grades = student.grades || [];
    const avg = calculateStudentAverage(grades);
    const extremes = getGradeExtremes(grades);

    // Update Live Summary Card
    if (avg === null) {
        DOM.modalGpaValue.textContent = '--';
        DOM.modalStandingBadge.className = 'status-badge badge-neutral';
        DOM.modalStandingBadge.textContent = 'No Grades';
        DOM.modalHighLowScore.textContent = '-- / --';
    } else {
        DOM.modalGpaValue.textContent = `${avg.toFixed(1)}%`;
        if (avg >= PASSING_THRESHOLD) {
            DOM.modalStandingBadge.className = 'status-badge badge-passed';
            DOM.modalStandingBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${getAcademicRemark(avg)}`;
        } else {
            DOM.modalStandingBadge.className = 'status-badge badge-failed';
            DOM.modalStandingBadge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${getAcademicRemark(avg)}`;
        }
        DOM.modalHighLowScore.textContent = `High: ${extremes.max}% / Low: ${extremes.min}%`;
    }

    DOM.gradesCountLabel.textContent = `${grades.length} ${grades.length === 1 ? 'assessment' : 'assessments'}`;

    // Render chips
    DOM.gradesChipsContainer.innerHTML = '';
    if (grades.length === 0) {
        DOM.noGradesNotice.classList.remove('hidden');
    } else {
        DOM.noGradesNotice.classList.add('hidden');
        grades.forEach((grade, index) => {
            const chip = document.createElement('div');
            chip.className = `grade-chip ${grade >= PASSING_THRESHOLD ? 'grade-chip-pass' : 'grade-chip-fail'}`;
            chip.innerHTML = `
                <span>Score #${index + 1}: <strong>${grade}%</strong></span>
                <button type="button" class="grade-chip-remove" data-index="${index}" title="Remove score">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            DOM.gradesChipsContainer.appendChild(chip);
        });
    }
}

/**
 * Handles adding a new grade in the Grade Modal.
 * [Concept 2: Comparison operators]
 * [Concept 9: Input Validation]
 * 
 * @param {SubmitEvent} event
 */
function handleAddGradeSubmit(event) {
    event.preventDefault();
    DOM.newGradeError.textContent = '';

    const studentId = appState.activeGradeStudentId;
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;

    const rawValue = DOM.newGradeInput.value.trim();
    const score = parseFloat(rawValue);

    // Validate score 0 - 100
    if (rawValue === '' || isNaN(score)) {
        DOM.newGradeError.textContent = 'Please enter a valid numeric score.';
        return;
    }

    if (score < 0 || score > 100) {
        DOM.newGradeError.textContent = 'Grade rejected: Score must be strictly within 0 to 100.';
        return;
    }

    const roundedScore = Math.round(score * 10) / 10;
    if (!Array.isArray(student.grades)) {
        student.grades = [];
    }

    student.grades.push(roundedScore);
    persistenceService.saveRecords(appState.students);

    DOM.newGradeInput.value = '';
    renderGradeModalView(student);
    renderAll();
    showToast('Grade Added', `Assigned ${roundedScore}% to ${student.name}.`, 'success');
}

/**
 * Removes an individual assessment score by index using array splice.
 * [Concept 6: Array splice()]
 * 
 * @param {number} index
 */
function removeGradeByIndex(index) {
    const student = appState.students.find(s => s.id === appState.activeGradeStudentId);
    if (!student || !Array.isArray(student.grades)) return;

    const removedScore = student.grades.splice(index, 1)[0];
    persistenceService.saveRecords(appState.students);

    renderGradeModalView(student);
    renderAll();
    showToast('Grade Removed', `Removed score of ${removedScore}%.`, 'info');
}

/**
 * Closes Grade Management Modal.
 */
function closeGradeModal() {
    DOM.gradeModal.classList.add('hidden');
    appState.activeGradeStudentId = null;
}

// ==============================================================================
// SECTION 10: ATTENDANCE TRACKING CONTROLLER (MODULE 3)
// [Concept 5: Default Parameters]
// [Concept 9: Negative boundary guards]
// ==============================================================================

/**
 * Quick increment of attendance count directly from table.
 * [Concept 5: Default Parameters]
 * 
 * @param {string} studentId
 * @param {'present'|'late'|'absent'} type
 * @param {number} [incrementAmount=1]
 */
function quickIncrementAttendance(studentId, type = 'present', incrementAmount = 1) {
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;

    if (!student.attendance) {
        student.attendance = { present: 0, late: 0, absent: 0 };
    }

    student.attendance[type] = (student.attendance[type] ?? 0) + incrementAmount;
    persistenceService.saveRecords(appState.students);
    renderAll();

    const label = type.charAt(0).toUpperCase() + type.slice(1);
    showToast('Attendance Logged', `Marked ${student.name} as ${label} (+${incrementAmount}).`, 'info');
}

/**
 * Opens detailed Attendance Tracking Modal.
 * @param {string} studentId
 */
function openAttendanceModal(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;

    appState.activeAttendanceStudentId = student.id;
    DOM.attendanceStudentId.value = student.id;
    DOM.attendanceModalSubtitle.textContent = `Managing attendance records for ${student.name} (${student.id})`;

    renderAttendanceModalView(student);
    DOM.attendanceModal.classList.remove('hidden');
}

/**
 * Updates attendance modal display.
 * @param {Object} student
 */
function renderAttendanceModalView(student) {
    const att = student.attendance || { present: 0, late: 0, absent: 0 };
    const metrics = calculateAttendanceMetrics(att);

    DOM.modalAttendanceRate.textContent = metrics.formatted;
    DOM.modalAttendanceProgressRing.style.width = `${metrics.attendanceRate}%`;
    DOM.modalPresentCount.textContent = att.present ?? 0;
    DOM.modalLateCount.textContent = att.late ?? 0;
    DOM.modalAbsentCount.textContent = att.absent ?? 0;
    DOM.modalTotalSessions.textContent = metrics.totalSessions;
}

/**
 * Modifies an attendance count in the modal, preventing negative values.
 * [Concept 9: Validation against negative integers]
 * 
 * @param {'present'|'late'|'absent'} type
 * @param {number} delta - e.g. +1 or -1
 */
function adjustModalAttendance(type, delta) {
    const student = appState.students.find(s => s.id === appState.activeAttendanceStudentId);
    if (!student) return;

    if (!student.attendance) {
        student.attendance = { present: 0, late: 0, absent: 0 };
    }

    const current = student.attendance[type] ?? 0;
    const updated = current + delta;

    if (updated < 0) {
        showToast('Invalid Operation', `Cannot decrease ${type} below zero.`, 'warning');
        return;
    }

    student.attendance[type] = updated;
    persistenceService.saveRecords(appState.students);

    renderAttendanceModalView(student);
    renderAll();
}

/**
 * Resets student's attendance to 0 across all categories.
 */
function resetCurrentStudentAttendance() {
    const student = appState.students.find(s => s.id === appState.activeAttendanceStudentId);
    if (!student) return;

    student.attendance = { present: 0, late: 0, absent: 0 };
    persistenceService.saveRecords(appState.students);

    renderAttendanceModalView(student);
    renderAll();
    showToast('Attendance Reset', `Reset attendance sessions for ${student.name}.`, 'info');
}

/**
 * Closes Attendance Modal.
 */
function closeAttendanceModal() {
    DOM.attendanceModal.classList.add('hidden');
    appState.activeAttendanceStudentId = null;
}

// ==============================================================================
// SECTION 11: CONFIRMATION MODAL CONTROLLER (MODULE 5 & 7)
// Replaces window.confirm with an accessible, customizable DOM modal.
// ==============================================================================

/**
 * Displays custom confirmation dialog.
 * 
 * @param {{ title: string, message: string, subtext?: string, onConfirm: Function }} config
 */
function openConfirmModal(config) {
    DOM.confirmModalTitle.textContent = config.title || 'Confirm Action';
    DOM.confirmModalMessage.textContent = config.message;
    DOM.confirmModalSubtext.textContent = config.subtext || 'This action cannot be undone.';
    appState.confirmActionCallback = config.onConfirm;

    DOM.confirmModal.classList.remove('hidden');
}

/**
 * Closes Confirmation Dialog.
 */
function closeConfirmModal() {
    DOM.confirmModal.classList.add('hidden');
    appState.confirmActionCallback = null;
}

// ==============================================================================
// SECTION 12: JAVASCRIPT CONCEPTS REGISTRY & INSPECTOR (12/12 CONCEPTS)
// Interactive modal providing verification and code references for every requirement.
// ==============================================================================

const JAVASCRIPT_MASTERY_REGISTRY = [
    {
        num: '01',
        name: 'Variables and Data Types',
        desc: 'Const by default, let for mutable state, primitive types (string, number, boolean, null, undefined), Symbol (internal tag), BigInt (system epoch).',
        snippet: 'const PASSING_THRESHOLD = 75.0;\nlet appState = { students: [] };\nconst INTERNAL_TAG = Symbol("sms");'
    },
    {
        num: '02',
        name: 'Operators',
        desc: 'Arithmetic (+, -, *, /, %), comparison (===, !==, >=, <), logical (&&, ||, ??), ternary (? :), spread (...), and rest parameters (...args).',
        snippet: 'const rate = ((present + (late * 0.5)) / total) * 100;\nconst extremes = { max: Math.max(...grades) };\nconst val = obj?.prop ?? defaultVal;'
    },
    {
        num: '03',
        name: 'Control Flow',
        desc: 'if / else if / else conditional validation branches and switch statement evaluating grade ranges for academic honors.',
        snippet: 'switch (true) {\n  case (average >= 95.0): return "President\'s Lister";\n  case (average >= 75.0): return "Fair / Passed";\n  default: return "Failing Standing";\n}'
    },
    {
        num: '04',
        name: 'Loops',
        desc: 'for loop (grade extraction), for...of (student metrics tally), while (unique ID collision resolution), and forEach (DOM iteration).',
        snippet: 'while (students.some(s => s.id === candidateId)) {\n  nextNum++; candidateId = `STU-${nextNum}`;\n}\nfor (const student of studentsList) { ... }'
    },
    {
        num: '05',
        name: 'Functions',
        desc: 'Function declarations, expressions, arrow functions, higher-order functions (createStudentComparator), callbacks, and default parameters.',
        snippet: 'function calculateStudentAverage(arr) { ... }\nconst isPassing = (grade) => grade >= 75;\nfunction createStudentComparator(criteria) { return (a, b) => ...; }'
    },
    {
        num: '06',
        name: 'Arrays',
        desc: 'map() for transforms, filter() for query/status, reduce() for GPA/totals, find() for ID, findIndex() for edits, some(), every(), sort(), splice().',
        snippet: 'const sum = grades.reduce((acc, g) => acc + g, 0);\nconst match = students.find(s => s.id === id);\nstudents.splice(index, 1);'
    },
    {
        num: '07',
        name: 'Objects',
        desc: 'Object literals, nested objects, object destructuring, methods, computed properties, Object.freeze, Object.keys/values.',
        snippet: 'const { present = 0, late = 0 } = student.attendance;\nconst student = { id, name, grades: [], attendance: { present: 0 } };'
    },
    {
        num: '08',
        name: 'Modern JavaScript',
        desc: 'Optional chaining (?.), nullish coalescing (??), template literals (${}), structuredClone for deep copies, object spread {...obj}.',
        snippet: 'const p = student?.attendance?.present ?? 0;\nconst updated = { ...student, name: newName };\nconst copy = structuredClone(INITIAL_DATA);'
    },
    {
        num: '09',
        name: 'Error Handling',
        desc: 'try...catch...finally blocks, throw new Error(), corrupt localStorage recovery, range validation (0-100), duplicate ID prevention.',
        snippet: 'try {\n  if (score < 0 || score > 100) throw new RangeError("Out of bounds");\n} catch (error) {\n  showToast("Error", error.message, "error");\n}'
    },
    {
        num: '10',
        name: 'Asynchronous JavaScript',
        desc: 'Simulated loading overlay, new Promise() with setTimeout delay, async/await, error state simulation toggle, zero external API requests.',
        snippet: 'function delay(ms) { return new Promise(res => setTimeout(res, ms)); }\nasync function init() {\n  await delay(1200);\n  renderAll();\n}'
    },
    {
        num: '11',
        name: 'DOM Manipulation',
        desc: 'document.createElement, append, textContent, classList (add, remove, toggle), dataset attributes, custom empty state generation.',
        snippet: 'const tr = document.createElement("tr");\ntr.dataset.id = student.id;\ntr.appendChild(tdId);\ntbody.appendChild(tr);'
    },
    {
        num: '12',
        name: 'Events & Browser APIs',
        desc: 'addEventListener for click, submit, input, change. Event delegation on table body. localStorage persistence, e.preventDefault().',
        snippet: 'form.addEventListener("submit", (e) => { e.preventDefault(); ... });\ntableBody.addEventListener("click", (e) => {\n  const btn = e.target.closest("[data-action]");\n});'
    }
];

/**
 * Opens Concept Inspector Modal.
 */
function openConceptsModal() {
    const grid = DOM.conceptsGrid;
    grid.innerHTML = '';

    JAVASCRIPT_MASTERY_REGISTRY.forEach(concept => {
        const card = document.createElement('article');
        card.className = 'concept-card';
        card.innerHTML = `
            <div class="concept-card-header">
                <span class="concept-num">Concept #${concept.num}</span>
                <span class="concept-status-badge">
                    <i class="fa-solid fa-circle-check"></i> Implemented &amp; Tested
                </span>
            </div>
            <h4 class="concept-name">${concept.name}</h4>
            <p class="concept-desc">${concept.desc}</p>
            <pre class="concept-snippet"><code>${concept.snippet}</code></pre>
        `;
        grid.appendChild(card);
    });

    DOM.conceptsModal.classList.remove('hidden');
}

/**
 * Closes Concept Inspector Modal.
 */
function closeConceptsModal() {
    DOM.conceptsModal.classList.add('hidden');
}

// ==============================================================================
// SECTION 13: IMPORT / EXPORT & RESET ACTIONS (MODULE 5)
// ==============================================================================

/**
 * Exports current student database as a downloadable JSON file.
 */
function exportDataAsJson() {
    try {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState.students, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `edupulse_students_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Export Successful', `Exported ${appState.students.length} student records as JSON.`, 'success');
    } catch (error) {
        console.error('Export error:', error);
        showToast('Export Failed', 'Unable to generate JSON export file.', 'error');
    }
}

/**
 * Imports student records from a selected JSON file.
 * @param {Event} event
 */
function handleImportJsonFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (!Array.isArray(imported)) {
                throw new Error('Imported JSON file must contain an array of student records.');
            }

            // Validate records
            const valid = imported.filter(s => s && s.id && s.name && s.course);
            if (valid.length === 0) {
                throw new Error('No valid student records found in the uploaded file.');
            }

            appState.students = valid;
            persistenceService.saveRecords(appState.students);
            renderAll();
            showToast('Import Complete', `Successfully imported ${valid.length} student records.`, 'success');
        } catch (error) {
            console.error('Import error:', error);
            showToast('Import Failed', error.message, 'error');
        } finally {
            event.target.value = ''; // Reset input
        }
    };
    reader.readAsText(file);
}

/**
 * Resets application data to the default starter dataset after confirmation.
 */
function handleResetDataRequest() {
    openConfirmModal({
        title: 'Reset to Sample Data',
        message: 'Are you sure you want to restore the default sample dataset?',
        subtext: 'This will replace any current changes in local storage with the original starter records.',
        onConfirm: () => {
            appState.students = structuredClone(INITIAL_STUDENTS_DATA);
            persistenceService.saveRecords(appState.students);
            renderAll();
            showToast('System Reset', 'Restored default starter student records.', 'info');
        }
    });
}

// ==============================================================================
// SECTION 14: EVENT LISTENERS & EVENT DELEGATION SETUP
// [Concept 12: Events - addEventListener, preventDefault, Event Delegation]
// Strict zero inline onclick in HTML.
// ==============================================================================

function setupEventListeners() {
    // 1. Search Input & Clear
    DOM.searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value;
        if (e.target.value) {
            DOM.clearSearchBtn.classList.remove('hidden');
        } else {
            DOM.clearSearchBtn.classList.add('hidden');
        }
        renderStudentsTable();
    });

    DOM.clearSearchBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        appState.searchQuery = '';
        DOM.clearSearchBtn.classList.add('hidden');
        DOM.searchInput.focus();
        renderStudentsTable();
    });

    // 2. Filter & Sort Dropdown Changes
    DOM.courseFilter.addEventListener('change', (e) => {
        appState.courseFilter = e.target.value;
        renderStudentsTable();
    });

    DOM.yearFilter.addEventListener('change', (e) => {
        appState.yearFilter = e.target.value;
        renderStudentsTable();
    });

    DOM.statusFilter.addEventListener('change', (e) => {
        appState.statusFilter = e.target.value;
        renderStudentsTable();
    });

    DOM.sortBySelect.addEventListener('change', (e) => {
        appState.sortBy = e.target.value;
        renderStudentsTable();
    });

    // 3. Reset Filters Button (Empty State)
    DOM.resetFiltersBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        DOM.courseFilter.value = 'ALL';
        DOM.yearFilter.value = 'ALL';
        DOM.statusFilter.value = 'ALL';
        DOM.sortBySelect.value = 'name_asc';

        appState.searchQuery = '';
        appState.courseFilter = 'ALL';
        appState.yearFilter = 'ALL';
        appState.statusFilter = 'ALL';
        appState.sortBy = 'name_asc';

        DOM.clearSearchBtn.classList.add('hidden');
        renderStudentsTable();
        showToast('Filters Cleared', 'Displaying all enrolled students.', 'info');
    });

    DOM.emptyStateAddBtn.addEventListener('click', openAddStudentModal);

    // 4. Modal Open & Close Buttons
    DOM.openAddStudentModalBtn.addEventListener('click', openAddStudentModal);
    DOM.closeStudentModalBtn.addEventListener('click', closeStudentModal);
    DOM.cancelStudentModalBtn.addEventListener('click', closeStudentModal);
    DOM.generateIdBtn.addEventListener('click', () => {
        DOM.studentIdInput.value = generateNextStudentId(appState.students);
    });

    // 5. Student Form Submit
    DOM.studentForm.addEventListener('submit', handleStudentFormSubmit);

    // 6. Grade Modal Events
    DOM.addGradeForm.addEventListener('submit', handleAddGradeSubmit);
    DOM.closeGradeModalBtn.addEventListener('click', closeGradeModal);
    DOM.doneGradeModalBtn.addEventListener('click', closeGradeModal);

    // Grade chip deletion delegation
    DOM.gradesChipsContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.grade-chip-remove');
        if (removeBtn) {
            const index = parseInt(removeBtn.dataset.index, 10);
            if (!isNaN(index)) {
                removeGradeByIndex(index);
            }
        }
    });

    // 7. Attendance Modal Events
    DOM.incPresentBtn.addEventListener('click', () => adjustModalAttendance('present', 1));
    DOM.decPresentBtn.addEventListener('click', () => adjustModalAttendance('present', -1));
    DOM.incLateBtn.addEventListener('click', () => adjustModalAttendance('late', 1));
    DOM.decLateBtn.addEventListener('click', () => adjustModalAttendance('late', -1));
    DOM.incAbsentBtn.addEventListener('click', () => adjustModalAttendance('absent', 1));
    DOM.decAbsentBtn.addEventListener('click', () => adjustModalAttendance('absent', -1));
    DOM.resetStudentAttendanceBtn.addEventListener('click', resetCurrentStudentAttendance);
    DOM.closeAttendanceModalBtn.addEventListener('click', closeAttendanceModal);
    DOM.doneAttendanceModalBtn.addEventListener('click', closeAttendanceModal);

    // 8. Confirmation Dialog Events
    DOM.closeConfirmModalBtn.addEventListener('click', closeConfirmModal);
    DOM.cancelConfirmModalBtn.addEventListener('click', closeConfirmModal);
    DOM.executeConfirmModalBtn.addEventListener('click', () => {
        if (typeof appState.confirmActionCallback === 'function') {
            appState.confirmActionCallback();
        }
        closeConfirmModal();
    });

    // 9. Concepts Inspector Modal Events
    DOM.inspectConceptsBtn.addEventListener('click', openConceptsModal);
    DOM.closeConceptsModalBtn.addEventListener('click', closeConceptsModal);
    DOM.closeConceptsFooterBtn.addEventListener('click', closeConceptsModal);

    // 10. Header Actions (Reset, Export, Import, Error Simulation)
    DOM.resetDataBtn.addEventListener('click', handleResetDataRequest);
    DOM.exportDataBtn.addEventListener('click', exportDataAsJson);
    DOM.importDataInput.addEventListener('change', handleImportJsonFile);

    // Simulated Error Toggle (for Module 6 testing)
    DOM.simulateErrorToggleBtn.addEventListener('click', () => {
        appState.isSimulatingError = !appState.isSimulatingError;
        DOM.simulateErrorLabel.textContent = appState.isSimulatingError ? 'Simulate Error: ON' : 'Simulate Error: OFF';
        DOM.simulateErrorToggleBtn.classList.toggle('btn-danger', appState.isSimulatingError);

        if (appState.isSimulatingError) {
            showToast('Simulate Error Enabled', 'Next async load will trigger a simulated failure.', 'warning');
        } else {
            showToast('Simulate Error Disabled', 'Async operations will execute normally.', 'info');
        }
    });

    // Retry Async Loading Button
    DOM.retryAsyncBtn.addEventListener('click', () => {
        initializeApplicationAsync();
    });

    DOM.dismissErrorBannerBtn.addEventListener('click', () => {
        DOM.errorRecoveryBanner.classList.add('hidden');
    });

    // 11. Event Delegation on Student Table Body (Edit, Delete, Grade Modal, Quick Attendance)
    DOM.studentsTableBody.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('[data-action]');
        if (!targetBtn) return;

        const action = targetBtn.dataset.action;
        const studentId = targetBtn.dataset.id;
        if (!studentId) return;

        switch (action) {
            case 'edit':
                openEditStudentModal(studentId);
                break;

            case 'delete':
                requestDeleteStudent(studentId);
                break;

            case 'manage-grades':
                openGradeModal(studentId);
                break;

            case 'manage-attendance':
                openAttendanceModal(studentId);
                break;

            case 'quick-present':
                quickIncrementAttendance(studentId, 'present', 1);
                break;

            case 'quick-late':
                quickIncrementAttendance(studentId, 'late', 1);
                break;

            case 'quick-absent':
                quickIncrementAttendance(studentId, 'absent', 1);
                break;

            default:
                break;
        }
    });

    // 12. Modal Backdrop Click to Close
    [DOM.studentModal, DOM.gradeModal, DOM.attendanceModal, DOM.confirmModal, DOM.conceptsModal].forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.classList.add('hidden');
            }
        });
    });

    // 13. Escape Key to Close Active Modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeStudentModal();
            closeGradeModal();
            closeAttendanceModal();
            closeConfirmModal();
            closeConceptsModal();
        }
    });
}

// ==============================================================================
// SECTION 15: BOOTSTRAP INITIALIZATION
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Setup all event listeners
    setupEventListeners();

    // Launch async application startup simulation (Module 6)
    initializeApplicationAsync();
});
