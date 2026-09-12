/* =========================================================
   LIFE SKILLS RWANDA V5
   SUPABASE + STUDENT AUTH + PROFILE
   QUIZ QUESTIONS FROM SUPABASE
   LEGACY QUESTION MIGRATION
   PROGRESS + PAYMENT + LEADERBOARD + CERTIFICATE
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://wplqgmakucweidurbbjz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_0m6-8xm4hIl8nxAdcj44UQ_XOkZk10m";


/* =========================================================
   GLOBAL SUPABASE CLIENT
========================================================= */

let db = null;
let supabaseLoadingPromise = null;


/* =========================================================
   QUIZ CACHE
========================================================= */

let quizQuestionsCache = [];


/* =========================================================
   LOAD SUPABASE
========================================================= */

function loadSupabase() {

    if (db) {
        return Promise.resolve(db);
    }

    if (supabaseLoadingPromise) {
        return supabaseLoadingPromise;
    }

    supabaseLoadingPromise = new Promise(
        (resolve, reject) => {

            if (window.supabase) {

                try {

                    db =
                        window.supabase.createClient(
                            SUPABASE_URL,
                            SUPABASE_KEY,
                            {
                                auth: {
                                    persistSession: true,
                                    autoRefreshToken: true,
                                    detectSessionInUrl: true
                                }
                            }
                        );

                    resolve(db);

                } catch (error) {

                    reject(error);
                }

                return;
            }


            const script =
                document.createElement("script");

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

            script.async = true;


            script.onload = () => {

                try {

                    if (!window.supabase) {

                        reject(
                            new Error(
                                "Supabase library could not load."
                            )
                        );

                        return;
                    }


                    db =
                        window.supabase.createClient(
                            SUPABASE_URL,
                            SUPABASE_KEY,
                            {
                                auth: {
                                    persistSession: true,
                                    autoRefreshToken: true,
                                    detectSessionInUrl: true
                                }
                            }
                        );


                    resolve(db);

                } catch (error) {

                    reject(error);
                }
            };


            script.onerror = () => {

                reject(
                    new Error(
                        "Could not load Supabase."
                    )
                );
            };


            document.head.appendChild(script);
        }
    );

    return supabaseLoadingPromise;
}


/* =========================================================
   INITIALIZATION
========================================================= */

async function initV3() {

    try {

        await loadSupabase();

        return true;

    } catch (error) {

        console.error(
            "Supabase initialization error:",
            error
        );

        return false;
    }
}


/* =========================================================
   DEFAULT LESSONS
========================================================= */

const defaultLessons = [

    {
        id: 1,
        title: "How to Save Money",
        icon: "💰",
        category: "Money",
        description:
            "Learn the basics of saving and budgeting.",
        content:
            "Saving means keeping part of the money you receive for future needs. A simple budget helps you decide how much to spend and how much to save."
    },

    {
        id: 2,
        title: "Digital Safety Basics",
        icon: "💻",
        category: "Digital",
        description:
            "Protect yourself when using the internet.",
        content:
            "Use strong passwords, avoid suspicious links, never share private passwords and verify messages before trusting them."
    },

    {
        id: 3,
        title: "Communication & Teamwork",
        icon: "🤝",
        category: "Communication",
        description:
            "Learn how to communicate and work with others.",
        content:
            "Good teamwork requires listening, respect, clear communication and contributing positively to a shared goal."
    },

    {
        id: 4,
        title: "Understanding Profit",
        icon: "📈",
        category: "Business",
        description:
            "Understand revenue, costs and profit.",
        content:
            "Profit is the money left after business costs are removed from revenue. Profit = Revenue - Costs."
    },

    {
        id: 5,
        title: "Planning Your Career",
        icon: "🎯",
        category: "Career",
        description:
            "Start thinking about your future.",
        content:
            "Career planning involves understanding your interests, strengths, skills and the opportunities you want to explore."
    },

    {
        id: 6,
        title: "Everyday Problem Solving",
        icon: "🧠",
        category: "Life",
        description:
            "Build practical problem-solving skills.",
        content:
            "Start by clearly defining the problem, collecting useful information, considering options and choosing a responsible solution."
    },

    {
        id: 7,
        title: "Personal Responsibility",
        icon: "✅",
        category: "Life",
        description:
            "Understand responsibility and accountability.",
        content:
            "Being responsible means understanding your duties, making careful choices and accepting the results of your actions."
    },

    {
        id: 8,
        title: "Entrepreneurship Basics",
        icon: "🚀",
        category: "Business",
        description:
            "Understand how small businesses create value.",
        content:
            "Entrepreneurs identify useful problems to solve, create products or services and learn how to manage resources."
    },

    {
        id: 9,
        title: "Healthy Study Habits",
        icon: "📚",
        category: "Education",
        description:
            "Learn practical ways to organize learning.",
        content:
            "Good study habits include planning your time, reducing distractions, reviewing lessons and asking for help when needed."
    },

    {
        id: 10,
        title: "Goal Setting",
        icon: "🏁",
        category: "Future",
        description:
            "Turn ideas into achievable goals.",
        content:
            "A useful goal is clear, realistic and measurable. Break a large goal into smaller actions that you can complete."
    }

];


/* =========================================================
   OLD QUIZ QUESTIONS
   THESE ARE PRESERVED FOR MIGRATION/FALLBACK
========================================================= */

const legacyQuestions = [

    {
        q:
            "If you receive 10,000 RWF and save 2,500 RWF, how much can you spend?",

        options: [
            "5,000 RWF",
            "7,500 RWF",
            "8,500 RWF",
            "10,000 RWF"
        ],

        answer: 1
    },

    {
        q:
            "What should you do with a suspicious link?",

        options: [
            "Open it immediately",
            "Send it to everyone",
            "Avoid opening it and verify the sender",
            "Enter your password"
        ],

        answer: 2
    },

    {
        q:
            "Which behavior helps good teamwork?",

        options: [
            "Ignoring everyone",
            "Listening and contributing respectfully",
            "Always refusing ideas",
            "Blaming teammates"
        ],

        answer: 1
    },

    {
        q:
            "A business earns 50,000 RWF and has costs of 35,000 RWF. What is the profit?",

        options: [
            "15,000 RWF",
            "20,000 RWF",
            "35,000 RWF",
            "85,000 RWF"
        ],

        answer: 0
    },

    {
        q:
            "What is normally the first step in solving a problem?",

        options: [
            "Ignore it",
            "Define the problem clearly",
            "Blame someone",
            "Spend money"
        ],

        answer: 1
    },

    {
        q:
            "Which is a strong password practice?",

        options: [
            "Use your name only",
            "Use 123456",
            "Use a long unique password",
            "Share your password with friends"
        ],

        answer: 2
    },

    {
        q:
            "Why is a budget useful?",

        options: [
            "It helps plan income and spending",
            "It guarantees you will become rich",
            "It removes every expense",
            "It means you cannot spend anything"
        ],

        answer: 0
    },

    {
        q:
            "Which is useful when planning a career?",

        options: [
            "Ignoring your interests",
            "Understanding your skills and interests",
            "Choosing randomly",
            "Never learning new skills"
        ],

        answer: 1
    },

    {
        q:
            "What does revenue mean in a simple business example?",

        options: [
            "Money earned from sales",
            "Money lost",
            "Only business debt",
            "Personal savings"
        ],

        answer: 0
    },

    {
        q:
            "Which habit can improve learning?",

        options: [
            "Never reviewing",
            "Planning study time",
            "Always waiting until the last minute",
            "Avoiding questions"
        ],

        answer: 1
    },

    {
        q:
            "What should you do before making an important decision?",

        options: [
            "Consider relevant information and options",
            "Always copy someone",
            "Ignore consequences",
            "Rush immediately"
        ],

        answer: 0
    },

    {
        q:
            "What is entrepreneurship mainly about?",

        options: [
            "Creating value by solving problems",
            "Avoiding all responsibility",
            "Spending money without planning",
            "Copying every business"
        ],

        answer: 0
    }

];


/*
   Compatibility alias.

   Older code may still refer to `questions`.
*/

const questions = legacyQuestions;


/* =========================================================
   AUTH HELPERS
========================================================= */

async function getCurrentUser() {

    if (!db) {
        await initV3();
    }

    if (!db) {
        return null;
    }

    try {

        const {
            data,
            error
        } = await db.auth.getUser();


        if (error) {

            console.warn(
                "getCurrentUser:",
                error.message
            );

            return null;
        }


        return data?.user || null;

    } catch (error) {

        console.error(error);

        return null;
    }
}


/* =========================================================
   CURRENT SESSION
========================================================= */

async function getCurrentSession() {

    if (!db) {
        await initV3();
    }

    if (!db) {
        return null;
    }


    const {
        data,
        error
    } = await db.auth.getSession();


    if (error) {

        console.error(
            "Session error:",
            error
        );

        return null;
    }


    return data?.session || null;
}


/* =========================================================
   STUDENT REGISTRATION
========================================================= */

async function signUpStudent(
    email,
    password,
    fullName
) {

    if (!db) {
        await initV3();
    }


    if (!email || !password || !fullName) {

        throw new Error(
            "Name, email and password are required."
        );
    }


    email =
        String(email)
            .trim()
            .toLowerCase();


    fullName =
        String(fullName)
            .trim();


    const {
        data,
        error
    } =
        await db.auth.signUp({

            email,

            password,

            options: {

                data: {
                    full_name: fullName
                }

            }

        });


    if (error) {
        throw error;
    }


    if (!data?.user) {

        throw new Error(
            "Account could not be created."
        );
    }


    if (data.session) {

        await createStudentProfile(
            data.user.id,
            email,
            fullName
        );

    } else {

        console.log(
            "User created. Profile will be ensured after login."
        );
    }


    return {

        user: data.user,

        session:
            data.session || null,

        needsEmailConfirmation:
            !data.session

    };
}


/* =========================================================
   CREATE / ENSURE STUDENT PROFILE
========================================================= */

async function createStudentProfile(
    userId,
    email,
    fullName
) {

    if (!db) {
        await initV3();
    }


    const {
        data: existing,
        error: existingError
    } =
        await db
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();


    if (existingError) {

        console.warn(
            "Profile lookup:",
            existingError.message
        );
    }


    if (existing) {

        if (
            existing.role === "admin" ||
            existing.role === "owner"
        ) {

            return existing;
        }


        const {
            data,
            error
        } =
            await db
                .from("profiles")
                .update({

                    full_name:
                        fullName ||
                        existing.full_name,

                    email:
                        email ||
                        existing.email,

                    updated_at:
                        new Date().toISOString()

                })
                .eq("id", userId)
                .select()
                .single();


        if (error) {
            throw error;
        }


        return data;
    }


    const {
        data,
        error
    } =
        await db
            .from("profiles")
            .insert({

                id: userId,

                full_name:
                    fullName,

                email:
                    email,

                role:
                    "student"

            })
            .select()
            .single();


    if (error) {
        throw error;
    }


    return data;
}


/* =========================================================
   STUDENT LOGIN
========================================================= */

async function signInStudent(
    email,
    password
) {

    if (!db) {
        await initV3();
    }


    email =
        String(email)
            .trim()
            .toLowerCase();


    const {
        data,
        error
    } =
        await db.auth.signInWithPassword({

            email,

            password

        });


    if (error) {
        throw error;
    }


    if (!data?.user) {

        throw new Error(
            "Login failed. User was not returned."
        );
    }


    try {

        await createStudentProfile(

            data.user.id,

            data.user.email || email,

            data.user.user_metadata?.full_name || ""

        );

    } catch (profileError) {

        console.error(
            "Profile creation after login failed:",
            profileError
        );
    }


    return data.user;
}


/* =========================================================
   LOGOUT
========================================================= */

async function signOutStudent() {

    if (!db) {
        await initV3();
    }


    const {
        error
    } = await db.auth.signOut();


    if (error) {
        throw error;
    }


    location.href = "index.html";
}


/* =========================================================
   PROFILE
========================================================= */

async function getStudent() {

    const user =
        await getCurrentUser();


    if (!user) {
        return null;
    }


    const {
        data,
        error
    } =
        await db
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

        return null;
    }


    if (!data) {

        try {

            return await createStudentProfile(

                user.id,

                user.email || "",

                user.user_metadata?.full_name ||
                "Student"

            );

        } catch (error) {

            console.error(
                "Could not create profile:",
                error
            );

            return null;
        }
    }


    return data;
}


/* =========================================================
   SAVE STUDENT PROFILE
========================================================= */

async function saveStudentProfile(
    fullName
) {

    const user =
        await getCurrentUser();


    if (!user) {

        throw new Error(
            "Please login first."
        );
    }


    fullName =
        String(fullName || "")
            .trim();


    if (!fullName) {

        throw new Error(
            "Please enter your full name."
        );
    }


    const {
        data,
        error
    } =
        await db
            .from("profiles")
            .update({

                full_name:
                    fullName,

                updated_at:
                    new Date().toISOString()

            })
            .eq("id", user.id)
            .select()
            .single();


    if (error) {
        throw error;
    }


    return data;
}


/* =========================================================
   SETTINGS
========================================================= */

async function getSettings() {

    if (!db) {
        await initV3();
    }


    const {
        data,
        error
    } =
        await db
            .from("app_settings")
            .select("*")
            .eq("id", 1)
            .maybeSingle();


    if (error) {

        console.error(
            "Settings error:",
            error
        );
    }


    if (!data) {

        return {

            id: 1,

            quiz_enabled: true,

            payment_required: true,

            quiz_fee: 500,

            competition_enabled: true,

            competition_start:
                new Date()
                    .toISOString()
                    .slice(0, 10),

            competition_end:
                new Date()
                    .toISOString()
                    .slice(0, 10),

            first_prize: 20000,

            second_prize: 10000,

            third_prize: 5000

        };
    }


    return data;
}


/* =========================================================
   PAYMENT
========================================================= */

async function createPayment(
    amount,
    method = "MTN MoMo Demo",
    reference = null
) {

    const user =
        await getCurrentUser();


    if (!user) {

        throw new Error(
            "Please login first."
        );
    }


    amount =
        Number(amount);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        throw new Error(
            "Invalid payment amount."
        );
    }


    const {
        data,
        error
    } =
        await db
            .from("payments")
            .insert({

                student_id:
                    user.id,

                amount:
                    amount,

                method:
                    method,

                status:
                    "demo_paid",

                reference:
                    reference ||
                    (
                        "DEMO-" +
                        Date.now()
                    )

            })
            .select()
            .single();


    if (error) {
        throw error;
    }


    return data;
}


/* =========================================================
   CHECK QUIZ PAYMENT
========================================================= */

async function hasPaidForQuiz() {

    const user =
        await getCurrentUser();


    if (!user) {
        return false;
    }


    const {
        data,
        error
    } =
        await db
            .from("payments")
            .select(
                "id,status,amount,created_at"
            )
            .eq(
                "student_id",
                user.id
            )
            .in(
                "status",
                [
                    "paid",
                    "demo_paid"
                ]
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            )
            .limit(1);


    if (error) {

        console.error(
            "Payment check:",
            error
        );

        return false;
    }


    return Boolean(
        data &&
        data.length > 0
    );
}


/* =========================================================
   QUIZ QUESTION CONVERTER
========================================================= */

/*
   Converts Supabase question format:

   option_a
   option_b
   option_c
   option_d
   correct_answer = A/B/C/D

   into the old Quiz format:

   options: [...]
   answer: 0/1/2/3
*/

function convertSupabaseQuestion(row) {

    if (!row) {
        return null;
    }


    const answerMap = {
        A: 0,
        B: 1,
        C: 2,
        D: 3
    };


    const correct =
        String(
            row.correct_answer || "A"
        ).toUpperCase();


    return {

        id:
            row.id,

        q:
            row.question,

        question:
            row.question,

        options: [

            row.option_a,

            row.option_b,

            row.option_c,

            row.option_d

        ],

        answer:
            answerMap[correct] ?? 0,

        correct_answer:
            correct,

        lesson_id:
            row.lesson_id || null

    };
}


/* =========================================================
   LOAD QUESTIONS FROM SUPABASE
========================================================= */

async function loadQuizQuestions() {

    if (!db) {
        await initV3();
    }


    if (!db) {
        return [...legacyQuestions];
    }


    try {

        const {
            data,
            error
        } =
            await db
                .from("quiz_questions")
                .select(`
                    id,
                    question,
                    option_a,
                    option_b,
                    option_c,
                    option_d,
                    correct_answer,
                    lesson_id,
                    active
                `)
                .eq(
                    "active",
                    true
                )
                .order(
                    "created_at",
                    {
                        ascending: true
                    }
                );


        if (error) {

            console.error(
                "Quiz question loading error:",
                error
            );

            quizQuestionsCache =
                [...legacyQuestions];

            return quizQuestionsCache;
        }


        if (!data || data.length === 0) {

            console.warn(
                "No active Supabase questions found. Using legacy questions."
            );

            quizQuestionsCache =
                [...legacyQuestions];

            return quizQuestionsCache;
        }


        quizQuestionsCache =
            data
                .map(convertSupabaseQuestion)
                .filter(Boolean);


        return quizQuestionsCache;

    } catch (error) {

        console.error(
            "Quiz question error:",
            error
        );

        quizQuestionsCache =
            [...legacyQuestions];

        return quizQuestionsCache;
    }
}


/* =========================================================
   GET QUIZ QUESTIONS
========================================================= */

async function getQuizQuestions() {

    if (
        quizQuestionsCache &&
        quizQuestionsCache.length
    ) {

        return [
            ...quizQuestionsCache
        ];
    }


    return await loadQuizQuestions();
}


/* =========================================================
   RANDOM QUESTIONS
========================================================= */

/*
   IMPORTANT:

   This function is now ASYNC because questions
   come from Supabase.

   Use:

   const quiz = await randomQuestions(5);
*/

async function randomQuestions(
    count = 5
) {

    const available =
        await getQuizQuestions();


    if (!available.length) {
        return [];
    }


    const safeCount =
        Math.max(
            1,
            Math.min(
                Number(count) || 5,
                available.length
            )
        );


    return [...available]

        .sort(
            () =>
                Math.random() -
                0.5
        )

        .slice(
            0,
            safeCount
        );
}


/* =========================================================
   LEGACY QUESTION MIGRATION
========================================================= */

/*
   Converts old questions into the new
   Supabase quiz_questions format.
*/

function convertLegacyQuestion(
    question,
    index
) {

    const answerLetters = [
        "A",
        "B",
        "C",
        "D"
    ];


    return {

        question:
            question.q,

        option_a:
            question.options[0],

        option_b:
            question.options[1],

        option_c:
            question.options[2],

        option_d:
            question.options[3],

        correct_answer:
            answerLetters[
                question.answer
            ] || "A",

        lesson_id:
            null,

        active:
            true

    };
}


/* =========================================================
   CHECK ADMIN / OWNER
========================================================= */

async function getCurrentUserRole() {

    const student =
        await getStudent();


    return (
        student?.role ||
        null
    );
}


async function isAdminOrOwner() {

    const role =
        await getCurrentUserRole();


    return (
        role === "admin" ||
        role === "owner"
    );
}


async function isOwner() {

    const role =
        await getCurrentUserRole();


    return role === "owner";
}


/* =========================================================
   MIGRATE OLD QUESTIONS
========================================================= */

/*
   This function is safe to run more than once.

   It first checks whether the old question text
   already exists in Supabase.

   Existing questions are not duplicated.
*/

async function migrateLegacyQuestionsToSupabase() {

    if (!db) {
        await initV3();
    }


    if (!db) {
        return {
            success: false,
            migrated: 0,
            message:
                "Supabase is not available."
        };
    }


    const allowed =
        await isAdminOrOwner();


    if (!allowed) {

        return {
            success: false,
            migrated: 0,
            message:
                "Only Admin or Owner can migrate questions."
        };
    }


    try {

        const {
            data: existing,
            error: existingError
        } =
            await db
                .from("quiz_questions")
                .select(
                    "id,question"
                );


        if (existingError) {

            console.error(
                "Migration lookup error:",
                existingError
            );

            return {
                success: false,
                migrated: 0,
                message:
                    existingError.message
            };
        }


        const existingQuestions =
            new Set(
                (existing || [])
                    .map(
                        item =>
                            String(
                                item.question || ""
                            )
                            .trim()
                    )
            );


        const newQuestions =
            legacyQuestions

                .filter(
                    item =>
                        !existingQuestions.has(
                            String(
                                item.q
                            ).trim()
                        )
                )

                .map(
                    convertLegacyQuestion
                );


        if (!newQuestions.length) {

            console.log(
                "Legacy questions are already in Supabase."
            );

            return {
                success: true,
                migrated: 0,
                message:
                    "All old questions already exist."
            };
        }


        const {
            data,
            error
        } =
            await db
                .from("quiz_questions")
                .insert(
                    newQuestions
                )
                .select();


        if (error) {

            console.error(
                "Migration insert error:",
                error
            );

            return {
                success: false,
                migrated: 0,
                message:
                    error.message
            };
        }


        console.log(
            `Migrated ${data?.length || 0} old questions.`
        );


        quizQuestionsCache = [];


        return {

            success: true,

            migrated:
                data?.length || 0,

            message:
                "Old questions migrated successfully."

        };

    } catch (error) {

        console.error(
            "Migration error:",
            error
        );

        return {

            success: false,

            migrated: 0,

            message:
                error.message

        };
    }
}


/* =========================================================
   SAVE QUIZ RESULT
========================================================= */

async function saveQuizResult(
    score,
    correct,
    total,
    timeSeconds
) {

    const user =
        await getCurrentUser();


    if (!user) {

        throw new Error(
            "Please login before saving your result."
        );
    }


    const safeScore =
        Math.max(
            0,
            Math.min(
                100,
                Number(score) || 0
            )
        );


    const safeCorrect =
        Math.max(
            0,
            Number(correct) || 0
        );


    const safeTotal =
        Math.max(
            0,
            Number(total) || 0
        );


    const safeTime =
        Math.max(
            0,
            Number(timeSeconds) || 0
        );


    const {
        data,
        error
    } =
        await db
            .from("quiz_attempts")
            .insert({

                student_id:
                    user.id,

                score:
                    safeScore,

                correct:
                    safeCorrect,

                total:
                    safeTotal,

                time_seconds:
                    safeTime

            })
            .select()
            .single();


    if (error) {
        throw error;
    }


    return data;
}


/* =========================================================
   QUIZ HISTORY
========================================================= */

async function getMyQuizAttempts() {

    const user =
        await getCurrentUser();


    if (!user) {
        return [];
    }


    const {
        data,
        error
    } =
        await db
            .from("quiz_attempts")
            .select("*")
            .eq(
                "student_id",
                user.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Quiz history:",
            error
        );

        return [];
    }


    return data || [];
}


/* =========================================================
   BEST SCORE
========================================================= */

async function getBestScore() {

    const attempts =
        await getMyQuizAttempts();


    if (!attempts.length) {
        return 0;
    }


    return Math.max(

        ...attempts.map(

            item =>
                Number(
                    item.score
                ) || 0

        )

    );
}


/* =========================================================
   LESSON PROGRESS
========================================================= */

async function getCompletedLessons() {

    const user =
        await getCurrentUser();


    if (!user) {
        return [];
    }


    const {
        data,
        error
    } =
        await db
            .from("lesson_progress")
            .select("*")
            .eq(
                "student_id",
                user.id
            )
            .order(
                "completed_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Lesson progress:",
            error
        );

        return [];
    }


    return data || [];
}


/* =========================================================
   MARK LESSON COMPLETED
========================================================= */

async function markLessonCompleted(
    lessonId
) {

    const user =
        await getCurrentUser();


    if (!user) {

        throw new Error(
            "Please login first."
        );
    }


    const {
        data,
        error
    } =
        await db
            .from("lesson_progress")
            .upsert(

                {

                    student_id:
                        user.id,

                    lesson_id:
                        lessonId

                },

                {

                    onConflict:
                        "student_id,lesson_id"

                }

            )
            .select()
            .single();


    if (error) {
        throw error;
    }


    return data;
}


/* =========================================================
   LEADERBOARD
========================================================= */

async function getLeaderboard() {

    if (!db) {
        await initV3();
    }


    const {
        data,
        error
    } =
        await db
            .from("quiz_attempts")
            .select(`
                student_id,
                score,
                created_at,
                profiles (
                    full_name
                )
            `)
            .order(
                "score",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Leaderboard error:",
            error
        );

        return [];
    }


    const students = {};


    (data || []).forEach(
        item => {

            const studentId =
                item.student_id;


            const score =
                Number(
                    item.score
                ) || 0;


            const name =
                item.profiles?.full_name ||
                "Student";


            if (
                !students[studentId]
            ) {

                students[studentId] = {

                    student_id:
                        studentId,

                    name:
                        name,

                    best:
                        score

                };

            } else if (
                score >
                students[studentId].best
            ) {

                students[studentId].best =
                    score;
            }

        }
    );


    return Object.values(
        students
    )

    .sort(
        (a, b) => {

            if (
                b.best !==
                a.best
            ) {

                return (
                    b.best -
                    a.best
                );
            }


            return String(
                a.name
            ).localeCompare(
                String(
                    b.name
                )
            );

        }
    );
}


/* =========================================================
   STUDENT RANK
========================================================= */

async function getMyRank() {

    const user =
        await getCurrentUser();


    if (!user) {
        return null;
    }


    const leaderboard =
        await getLeaderboard();


    const index =
        leaderboard.findIndex(

            item =>
                item.student_id ===
                user.id

        );


    return index >= 0
        ? index + 1
        : null;
}


/* =========================================================
   CERTIFICATE NUMBER
========================================================= */

function makeCertificateNumber(
    userId
) {

    const clean =
        String(
            userId || ""
        )
        .replace(
            /[^a-zA-Z0-9]/g,
            ""
        );


    return (

        "LSR-" +

        clean
            .slice(-6)
            .toUpperCase()

    );
}


/* =========================================================
   CERTIFICATE
========================================================= */

async function createCertificateIfEligible() {

    const user =
        await getCurrentUser();


    if (!user) {
        return null;
    }


    const bestScore =
        await getBestScore();


    const completed =
        await getCompletedLessons();


    if (
        bestScore < 70
    ) {

        return null;
    }


    const certificateNumber =
        makeCertificateNumber(
            user.id
        );


    const {
        data: existing,
        error: existingError
    } =
        await db
            .from("certificates")
            .select("*")
            .eq(
                "student_id",
                user.id
            )
            .maybeSingle();


    if (existingError) {

        console.warn(
            "Certificate lookup:",
            existingError
        );
    }


    if (existing) {
        return existing;
    }


    const {
        data,
        error
    } =
        await db
            .from("certificates")
            .insert({

                student_id:
                    user.id,

                certificate_number:
                    certificateNumber,

                score:
                    bestScore,

                lessons_completed:
                    completed.length,

                issue_date:
                    new Date()
                        .toISOString()
                        .slice(
                            0,
                            10
                        ),

                director_name:
                    "TUYISENGE Patrick"

            })
            .select()
            .single();


    if (error) {

        console.error(
            "Certificate creation:",
            error
        );


        const {
            data: retry
        } =
            await db
                .from("certificates")
                .select("*")
                .eq(
                    "student_id",
                    user.id
                )
                .maybeSingle();


        return retry || null;
    }


    return data;
}


/* =========================================================
   GET MY CERTIFICATE
========================================================= */

async function getMyCertificate() {

    const user =
        await getCurrentUser();


    if (!user) {
        return null;
    }


    const {
        data,
        error
    } =
        await db
            .from("certificates")
            .select(`
                *,
                profiles (
                    full_name
                )
            `)
            .eq(
                "student_id",
                user.id
            )
            .maybeSingle();


    if (error) {

        console.error(
            "Certificate:",
            error
        );

        return null;
    }


    return data;
}


/* =========================================================
   MONEY
========================================================= */

function formatMoney(
    value
) {

    return (

        Number(
            value || 0
        )
        .toLocaleString(
            "en-RW"
        ) +

        " RWF"

    );
}


/* =========================================================
   COMPETITION
========================================================= */

function competitionOpen(
    settings
) {

    if (!settings) {
        return false;
    }


    if (
        !settings.competition_enabled
    ) {

        return false;
    }


    const now =
        new Date();


    const start =
        new Date(
            String(
                settings.competition_start
            ) +
            "T00:00:00"
        );


    const end =
        new Date(
            String(
                settings.competition_end
            ) +
            "T23:59:59"
        );


    return (
        now >= start &&
        now <= end
    );
}


/* =========================================================
   LANGUAGE
========================================================= */

function toggleLanguage() {

    const current =
        localStorage.getItem(
            "lsr_language"
        ) ||
        "EN";


    const next =
        current === "EN"
            ? "RW"
            : "EN";


    localStorage.setItem(
        "lsr_language",
        next
    );


    alert(

        next === "RW"

            ? "Kinyarwanda mode selected."

            : "English mode selected."

    );
}


/* =========================================================
   AUTH STATE LISTENER
========================================================= */

async function setupAuthListener() {

    if (!db) {
        await initV3();
    }


    if (!db) {
        return;
    }


    db.auth.onAuthStateChange(
        (event, session) => {

            console.log(
                "Auth event:",
                event
            );

        }
    );
}


/* =========================================================
   AUTO MIGRATION
========================================================= */

/*
   If the logged-in user is Admin/Owner,
   automatically move the 12 old questions
   into Supabase.

   It only inserts questions that do not
   already exist.
*/

async function autoMigrateLegacyQuestions() {

    try {

        const role =
            await getCurrentUserRole();


        if (
            role === "admin" ||
            role === "owner"
        ) {

            const result =
                await migrateLegacyQuestionsToSupabase();


            if (
                result.success &&
                result.migrated > 0
            ) {

                console.log(
                    `Life Skills Rwanda: ${result.migrated} old questions migrated.`
                );
            }

        }

    } catch (error) {

        console.warn(
            "Automatic question migration skipped:",
            error
        );
    }
}


/* =========================================================
   GLOBAL INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const connected =
            await initV3();


        if (!connected) {

            console.error(
                "Life Skills Rwanda could not connect to Supabase."
            );

            return;
        }


        await setupAuthListener();


        /*
           Automatically migrate old questions
           when an Admin/Owner opens the site.
        */

        await autoMigrateLegacyQuestions();


        /*
           Preload active questions.

           This means the Quiz can start faster.
        */

        await loadQuizQuestions();


        /*
           Student name compatibility.
        */

        const studentName =
            document.getElementById(
                "studentName"
            );


        if (studentName) {

            const student =
                await getStudent();


            studentName.textContent =
                student?.full_name ||
                "Student";
        }

    }
);