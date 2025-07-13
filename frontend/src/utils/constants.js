const currentYear = new Date().getFullYear();

export const years = Array.from({ length: 7 }, (_, i) => currentYear - i);

export const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export const criteriaMapping = {
  courseContent: 'Course Content',
  teachingQuality: 'Teaching Quality',
  managementAndTAs: 'TAs & Management',
  academicWorkload: 'Workload Manageability',
  gradingDifficulty: 'Grading Leniency',
};

export const criteriaDescriptions = {
  courseContent: "Evaluates how interesting the course material is, its alignment with industry trends, skill applicability in professional contexts, and whether the syllabus is up to date.",
  teachingQuality: "Evaluates the instructor’s oration skills, class engagement, ability to clarify doubts, depth of concept coverage, and overall class atmosphere.",
  managementAndTAs: "Reviews the effectiveness of tutorials, teaching assistants’ punctuality and expertise, timely handling of quizzes, and overall course management.",
  academicWorkload: "Examines the intensity of deadlines, time commitment for assignments, course difficulty, surprise quizzes, and attendance requirements.",
  gradingDifficulty: "Analyzes grading strictness, fairness of marks distribution, class average grades, and difficulty of achieving high grades.",
}

export const criteriaInstructions = {
  courseContent: "How good is the course material?",
  teachingQuality: "How well does the instructor teach?",
  managementAndTAs: "How well are tutorials and TAs managed?",
  academicWorkload: "How light is the workload?",
  gradingDifficulty: "How easy is the grading?",
};

export const searchPlaceHolders = [
  "Is attendance mandatory?",
  "Does the professor teach well?",
  "Were there surprise quizzes last year?",
  "Is the syllabus up to date?",
  "What were the grading slabs?",
];

export const CourseStatus = [
  "Completed",
  "Repeated",
  "Dropped"
];

export const branches =[
  {name: 'B.Tech Computer Science and Applied Mathematics', code: 'CSAM'},
  {name: 'B.Tech Computer Science and Artificial Intelligence', code: 'CSAI'},
  {name: 'B.Tech Computer Science and Biosciences', code: 'CSB'},
  {name: 'B.Tech Computer Science and Design', code: 'CSD'},
  {name: 'B.Tech Computer Science and Engineering', code: 'CSE'},
  {name: 'B.Tech Computer Science and Social Sciences', code: 'CSSS'},
  {name: 'B.Tech Electronics and Communications Engineering', code: 'ECE'},
  {name: 'B.Tech Electronics and VLSI Engineering', code: 'EVE'},
];

export const guidelines = [
  {
    title: "Content Standards",
    content: [
      "Criticism is welcome; however, hate speech, personal attacks, discriminatory language, curses, or unverified defamatory statements are prohibited.",
      "Focus on honest, firsthand experiences backed by facts. Avoid false information, spam, gibberish, plagiarism, or intellectual property violations.",
      "Promotional content, referral links, or commercial advertising is not allowed.",
    ],
  },
  {
    title: "Privacy & Security",
    content: [
      "Do not share your personal or sensitive information such as passwords, government IDs, contact details, or any other confidential data in public posts.",
      "Never disclose another individual’s personal, identifying, or sensitive information—such as names, photos, academic or contact details—without their explicit consent.",
    ],
  },
  {
    title: "Moderation & Penalties",
    content: [
      "Violations may result in temporary suspensions, or permanent bans, with escalating consequences for repeat offenses.",
      "Whether posted anonymously or under a registered account, all users are subject to the same rules and penalties; anonymity does not exempt users from these obligations.",
      "Users are encouraged to report any violations of community guidelines by flagging content for moderator review.",
    ],
  },
  {
    title: "Disclaimers & Updates",
    content: [
      "Reviews reflect individual opinions; the platform is not liable for outcomes based on them. Use reviews as informational tools and form your own judgments.",
      "Submitted content may be used to develop and enhance platform features and services. Content remains subject to these guidelines.",
      "Guidelines may be updated periodically. Users are responsible for staying informed of any changes.",
    ],
  },
];