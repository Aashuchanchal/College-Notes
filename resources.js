// Example resource data for notes, syllabus, and other resources
const resources = {
    notes: [
        {
            id: 1,
            title: "Data Structures & Algorithms",
            subject: "Computer Science",
            semester: 3,
            description: "Complete notes on arrays, linked lists, trees, graphs, sorting and searching algorithms.",
            tags: ["Programming", "DSA", "Networks"],
            updated: "2 days ago",
            fileUrl: "/resources/notes/dsa.pdf"
        },
        {
            id: 2,
            title: "Database Management Systems",
            subject: "Computer Science",
            semester: 4,
            description: "Detailed notes on ER models, normalization, SQL queries, transactions and concurrency.",
            tags: ["Databases", "SQL", "Transactions"],
            updated: "1 week ago",
            fileUrl: "/resources/notes/dbms.pdf"
        }
    ],
    syllabus: [
        {
            id: 1,
            subject: "Computer Science",
            semester: 3,
            fileUrl: "/resources/syllabus/cse_sem3.pdf"
        }
    ],
    projects: [
        {
            id: 1,
            title: "E-Learning Platform",
            description: "Build a comprehensive e-learning platform with course management, quizzes, and progress tracking.",
            tags: ["Web Development", "Education"],
            fileUrl: "/resources/projects/e-learning.zip"
        }
    ]
};

module.exports = resources;
