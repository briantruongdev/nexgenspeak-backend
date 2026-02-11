const AWS = require("aws-sdk");

// Configure AWS
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "ap-southeast-1",
});

const TEACHERS_TABLE = "dev-nexgenspeak-backend-services-vn-teachers-vn";

// Sample teachers data
const teachers = [
  {
    teacherId: "1",
    fullName: "Nguyễn Văn An",
    position: "Senior English Teacher",
    award1: "TESOL Certified",
    award2: "Cambridge CELTA",
    award3: "IELTS 8.5",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    rating: 4.9,
    totalReviews: 134,
    students: 320,
    lessons: 2400,
    pricePerHour: 15,
    languages: ["English", "Vietnamese"],

    aboutMe:
      "I am a passionate English teacher with over 8 years of experience teaching students from different backgrounds. I have helped learners improve their communication skills for work, study, and daily life. My lessons focus on real-life conversations and practical English usage. I believe learning should be engaging and enjoyable. I always create a friendly environment so students feel confident speaking. I customize each lesson to match your level and goals. Together, we will build your confidence and fluency step by step.",

    strengths:
      "I design structured and engaging lessons for all levels. I focus on communication and confidence building in every session. I am patient and supportive with each student. My lessons are customized based on your goals. I provide clear feedback to help you improve quickly.",

    teachingStyle:
      "My teaching style is interactive and student-centered. I focus on real conversations and practical usage. Each lesson includes speaking practice, feedback, and useful vocabulary. I encourage students to speak as much as possible. I adapt my teaching methods based on your progress and learning style.",

    resume: [
      {
        time: "2015-2018",
        value: "English Lecturer at Ho Chi Minh Language University",
      },
      {
        time: "2018-2020",
        value: "Senior IELTS Instructor at British Language Center",
      },
      {
        time: "2020-2022",
        value: "Online English Teacher for global learners",
      },
      { time: "2022-Now", value: "Senior Teacher at NexGen English Center" },
      {
        time: "2023",
        value: "Hosted IELTS speaking workshops for university students",
      },
    ],

    specialties: [
      {
        title: "Conversational English",
        description:
          "Practice real-life conversations to improve fluency and confidence naturally.",
      },
      {
        title: "IELTS Speaking",
        description:
          "Improve your speaking band with structured practice and detailed feedback.",
      },
      {
        title: "Business English",
        description:
          "Learn professional communication skills for meetings and presentations.",
      },
      {
        title: "Pronunciation",
        description:
          "Enhance clarity and accent through targeted pronunciation exercises.",
      },
      {
        title: "Interview Preparation",
        description:
          "Practice job interview questions and improve professional answers.",
      },
      {
        title: "Public Speaking",
        description: "Build confidence speaking English in front of others.",
      },
    ],
  },

  {
    teacherId: "2",
    fullName: "Trần Thị Bình",
    position: "English Communication Specialist",
    award1: "Master in English Linguistics",
    award2: "TOEIC 990",
    award3: "10+ years experience",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    rating: 4.8,
    totalReviews: 98,
    students: 210,
    lessons: 1500,
    pricePerHour: 13,
    languages: ["English", "Vietnamese"],

    aboutMe:
      "I specialize in helping students communicate confidently in English. I have worked with learners from many professional fields. My lessons focus on speaking fluency and listening skills. I create real-life scenarios to help you practice naturally. I am patient and supportive in every class. My goal is to help you express yourself clearly in English. Together we will build your confidence step by step.",

    strengths:
      "I focus strongly on speaking and communication skills. My lessons are practical and easy to follow. I help students improve confidence quickly. I create supportive and friendly classes. I provide clear corrections and suggestions.",

    teachingStyle:
      "My teaching style is friendly and interactive. I encourage students to speak a lot during lessons. We practice through discussions and role-play. Lessons are customized for each learner. I focus on real-world communication skills.",

    resume: [
      { time: "2014-2017", value: "BA English Linguistics - HCM University" },
      {
        time: "2017-2019",
        value: "English Trainer at Global Communication Center",
      },
      { time: "2019-2021", value: "Corporate English Trainer for companies" },
      { time: "2021-Now", value: "Online English Communication Coach" },
      {
        time: "2023",
        value: "Hosted English speaking workshops for professionals",
      },
    ],

    specialties: [
      {
        title: "Conversational English",
        description:
          "Improve daily speaking through natural conversations and discussions.",
      },
      {
        title: "Business Communication",
        description:
          "Develop workplace communication skills for meetings and emails.",
      },
      {
        title: "Presentation Skills",
        description:
          "Learn how to present ideas clearly and confidently in English.",
      },
      {
        title: "Workplace English",
        description: "Master English used in office environments and teamwork.",
      },
      {
        title: "Pronunciation",
        description:
          "Improve clarity and natural speaking through phonetic practice.",
      },
      {
        title: "Confidence Building",
        description:
          "Overcome fear and speak English confidently in any situation.",
      },
    ],
  },

  {
    teacherId: "3",
    fullName: "Lê Hoàng Cường",
    position: "IELTS Expert",
    award1: "IELTS 9.0",
    award2: "British Council Certified",
    award3: "Author of IELTS Success",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5.0,
    totalReviews: 201,
    students: 410,
    lessons: 3200,
    pricePerHour: 18,
    languages: ["English", "Vietnamese"],

    aboutMe:
      "I am an IELTS expert with many years of teaching experience. I have helped hundreds of students achieve their target scores. My lessons focus on strategies, confidence, and accuracy. I provide detailed feedback for each student. I create structured lessons to maximize results. I am dedicated to helping you succeed in IELTS. Together we will reach your desired band score.",

    strengths:
      "Expert in IELTS preparation for all levels. Structured lessons with clear goals. Detailed feedback for fast improvement. Strong focus on speaking and writing. High success rate with students.",

    teachingStyle:
      "My lessons are structured and goal-oriented. I focus on exam strategies and real practice. Students receive detailed corrections and guidance. I create personalized study plans. Each lesson moves you closer to your target score.",

    resume: [
      {
        time: "2013-2017",
        value: "BA English Teaching - University of Education",
      },
      { time: "2017-2019", value: "IELTS Instructor at ACET Vietnam" },
      { time: "2019-2022", value: "Senior IELTS Trainer" },
      { time: "2022-Now", value: "IELTS Course Designer & Teacher" },
      { time: "2024", value: "Published IELTS training materials" },
    ],

    specialties: [
      {
        title: "IELTS Speaking",
        description:
          "Practice with real exam questions and receive band-level feedback.",
      },
      {
        title: "IELTS Writing",
        description: "Improve task response, grammar, and coherence.",
      },
      {
        title: "IELTS Listening",
        description:
          "Learn strategies to catch answers quickly and accurately.",
      },
      {
        title: "IELTS Reading",
        description: "Master skimming and scanning techniques for high scores.",
      },
      {
        title: "Academic English",
        description: "Develop formal English for studying abroad.",
      },
      {
        title: "Exam Strategies",
        description: "Learn techniques to maximize IELTS performance.",
      },
    ],
  },

  {
    teacherId: "4",
    fullName: "Phạm Thị Dung",
    position: "Business English Coach",
    award1: "MBA from UK",
    award2: "Corporate Training Expert",
    award3: "BEC Higher Certified",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 4.9,
    totalReviews: 87,
    students: 180,
    lessons: 1200,
    pricePerHour: 16,
    languages: ["English", "Vietnamese"],

    aboutMe:
      "I am a Business English coach with an MBA background. I help professionals improve communication in the workplace. My lessons focus on meetings, presentations, and emails. I design practical scenarios for real-world usage. I believe confidence is key in business communication. I create structured and effective lessons. My goal is to help you succeed in your career using English.",

    strengths:
      "Strong background in business communication. Practical and professional lessons. Focus on real workplace situations. Clear guidance and corrections. Supportive and motivating teaching approach.",

    teachingStyle:
      "My teaching style is professional and practical. Lessons are based on real business scenarios. I focus on communication clarity and confidence. Students practice through role-play and discussions. Each lesson is tailored to career goals.",

    resume: [
      { time: "2012-2016", value: "MBA in International Business - UK" },
      { time: "2016-2018", value: "Business English Trainer at Language Link" },
      {
        time: "2018-2021",
        value: "Corporate Trainer for multinational companies",
      },
      { time: "2021-Now", value: "Freelance Business English Coach" },
      { time: "2023", value: "Conducted corporate communication workshops" },
    ],

    specialties: [
      {
        title: "Business English",
        description:
          "Improve professional communication for meetings and emails.",
      },
      {
        title: "Presentation Skills",
        description: "Deliver clear and confident presentations in English.",
      },
      {
        title: "Interview Preparation",
        description: "Prepare for job interviews in international companies.",
      },
      {
        title: "Negotiation English",
        description: "Learn language for negotiation and persuasion.",
      },
      {
        title: "Corporate Communication",
        description: "Master English for workplace collaboration.",
      },
      {
        title: "Email Writing",
        description: "Write professional and effective business emails.",
      },
    ],
  },

  {
    teacherId: "5",
    fullName: "Hoàng Minh Đức",
    position: "Pronunciation & Accent Coach",
    award1: "Native-like Pronunciation",
    award2: "Phonetics Specialist",
    award3: "Speech Therapy Background",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    rating: 4.95,
    totalReviews: 165,
    students: 260,
    lessons: 2100,
    pricePerHour: 17,
    languages: ["English", "Vietnamese"],

    aboutMe:
      "I specialize in pronunciation and accent training. I help students sound natural and confident. My lessons focus on phonetics, stress, and intonation. I have helped many learners achieve native-like pronunciation. I create detailed and personalized exercises. My classes are fun and interactive. You will see clear improvement in your speaking.",

    strengths:
      "Expert in pronunciation and accent training. Detailed feedback for every student. Structured exercises for fast improvement. Patient and supportive teaching style. Clear and easy explanations.",

    teachingStyle:
      "My teaching style is detailed and practical. I focus on correcting sounds and rhythm. Students practice speaking in every lesson. I use real-life conversations for training. Each lesson builds stronger pronunciation skills.",

    resume: [
      {
        time: "2013-2016",
        value: "BA English Phonetics - University of Education",
      },
      {
        time: "2016-2019",
        value: "Pronunciation Trainer at International Language Center",
      },
      { time: "2019-2022", value: "Accent Coach for professionals" },
      { time: "2022-Now", value: "Online Pronunciation Specialist" },
      { time: "2023", value: "Speech and phonetics workshop trainer" },
    ],

    specialties: [
      {
        title: "Pronunciation",
        description:
          "Improve clarity and natural accent with phonetic training.",
      },
      {
        title: "American Accent",
        description: "Learn to speak with a natural American accent.",
      },
      {
        title: "Fluency Training",
        description: "Speak smoothly and confidently in conversations.",
      },
      {
        title: "Public Speaking",
        description: "Improve clarity and delivery for presentations.",
      },
      {
        title: "Conversational English",
        description: "Practice real-life conversations with feedback.",
      },
      {
        title: "Listening Skills",
        description: "Understand different accents and fast speech.",
      },
    ],
  },

  {
    teacherId: "6",
    fullName: "Vũ Thị Hương",
    position: "Kids English Teacher",
    award1: "Child Psychology Certified",
    award2: "Cambridge YLE Expert",
    award3: "15+ years with children",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    totalReviews: 143,
    students: 300,
    lessons: 2800,
    pricePerHour: 12,
    languages: ["English", "Vietnamese"],

    aboutMe:
      "I am a kids English teacher with over 10 years of experience. I love working with children and making lessons fun. My classes include games, songs, and stories. I focus on building confidence and vocabulary. I create a friendly and supportive environment. Children enjoy learning and speaking in my classes. I help young learners develop strong English foundations.",

    strengths:
      "Experienced in teaching children. Fun and engaging lesson activities. Patient and caring teaching approach. Focus on confidence building. Strong classroom management skills.",

    teachingStyle:
      "My teaching style is energetic and fun. I use games and visuals to keep kids engaged. Lessons include songs and storytelling. I encourage kids to speak confidently. Learning is always enjoyable and interactive.",

    resume: [
      { time: "2010-2014", value: "BA Early Childhood Education" },
      { time: "2014-2017", value: "Kids English Teacher at VUS" },
      { time: "2017-2020", value: "Cambridge YLE Instructor" },
      {
        time: "2020-Now",
        value: "Senior Kids Teacher at International School",
      },
      { time: "2023", value: "Designed English curriculum for kids" },
    ],

    specialties: [
      {
        title: "English for Kids",
        description: "Fun and interactive English lessons for young learners.",
      },
      {
        title: "Phonics",
        description: "Help children read and pronounce words correctly.",
      },
      {
        title: "Cambridge YLE",
        description: "Prepare kids for Cambridge English exams.",
      },
      {
        title: "Speaking for Kids",
        description: "Encourage kids to speak confidently in English.",
      },
      {
        title: "Storytelling",
        description: "Learn English through fun stories and activities.",
      },
      {
        title: "Beginner English",
        description: "Build strong English foundation for children.",
      },
    ],
  },

  {
    teacherId: "7",
    fullName: "Đỗ Văn Khoa",
    position: "TOEFL Specialist",
    award1: "TOEFL iBT 120",
    award2: "ETS Certified",
    award3: "University Lecturer",
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
    rating: 4.85,
    totalReviews: 76,
    students: 140,
    lessons: 980,
    pricePerHour: 16,
    languages: ["English", "Vietnamese"],

    aboutMe:
      "I am a TOEFL specialist helping students study abroad. I focus on test strategies and academic English. My lessons are structured and goal-oriented. I help students improve all TOEFL skills. I provide detailed feedback and study plans. I am dedicated to your success. Together we will achieve your target score.",

    strengths:
      "Expert in TOEFL preparation. Structured lessons and strategies. Strong academic English background. Clear explanations and feedback. Goal-focused teaching approach.",

    teachingStyle:
      "My lessons are structured and intensive. I focus on exam strategies and practice. Students receive detailed corrections. I create personalized study plans. Each lesson improves your score step by step.",

    resume: [
      { time: "2012-2016", value: "BA English - University of Education" },
      { time: "2016-2018", value: "TOEFL Instructor at ILA" },
      { time: "2018-2021", value: "Academic English Lecturer" },
      { time: "2021-Now", value: "TOEFL Specialist" },
      { time: "2023", value: "Study abroad consultant & trainer" },
    ],

    specialties: [
      {
        title: "TOEFL Speaking",
        description: "Practice TOEFL speaking with structured feedback.",
      },
      {
        title: "TOEFL Writing",
        description: "Improve essays and integrated writing tasks.",
      },
      {
        title: "Academic English",
        description: "Develop English for university study.",
      },
      {
        title: "Listening Skills",
        description: "Understand academic lectures and conversations.",
      },
      {
        title: "Reading Skills",
        description: "Improve reading speed and comprehension.",
      },
      {
        title: "Study Abroad Prep",
        description: "Prepare English for studying overseas.",
      },
    ],
  },

  {
    teacherId: "8",
    fullName: "Bùi Thị Lan",
    position: "Conversational English Expert",
    award1: "Native Speaker Level",
    award2: "Cultural Exchange Program",
    award3: "Lived in USA 5 years",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 4.92,
    totalReviews: 188,
    students: 350,
    lessons: 2600,
    pricePerHour: 14,
    languages: ["English", "Vietnamese"],

    aboutMe:
      "I am a conversational English expert who loves helping students speak naturally. I have lived and worked abroad for many years. My lessons focus on real-life communication. I create relaxed and friendly classes. Students feel comfortable speaking with me. I help you build fluency and confidence. You will enjoy learning English in my lessons.",

    strengths:
      "Focus on natural communication. Friendly and supportive teaching style. Real-life conversation practice. Improve fluency quickly. Personalized lesson topics.",

    teachingStyle:
      "My lessons are relaxed and conversation-focused. We talk about daily life and interests. I correct mistakes gently. Students speak most of the time. Learning feels natural and enjoyable.",

    resume: [
      { time: "2013-2016", value: "BA English Translation" },
      { time: "2016-2019", value: "English Teacher in USA" },
      { time: "2019-2021", value: "Online Conversation Coach" },
      { time: "2021-Now", value: "Senior Speaking Teacher" },
      { time: "2023", value: "Hosted English speaking clubs" },
    ],

    specialties: [
      {
        title: "Conversational English",
        description: "Speak naturally through real-life discussions.",
      },
      {
        title: "Travel English",
        description: "Learn English for traveling and daily situations.",
      },
      {
        title: "Fluency Training",
        description: "Improve speaking speed and confidence.",
      },
      {
        title: "Pronunciation",
        description: "Sound more natural and clear when speaking.",
      },
      {
        title: "Daily English",
        description: "Practice English for everyday conversations.",
      },
      {
        title: "Confidence Building",
        description: "Overcome fear and speak comfortably.",
      },
    ],
  },
];

async function insertTeachers() {
  if (!TEACHERS_TABLE) {
    console.error("Error: TEACHERS_TABLE environment variable is not set");
    process.exit(1);
  }

  console.log(
    `Inserting ${teachers.length} teachers into ${TEACHERS_TABLE}...`,
  );

  for (const teacher of teachers) {
    try {
      await dynamodb
        .put({
          TableName: TEACHERS_TABLE,
          Item: teacher,
        })
        .promise();
      console.log(`✓ Inserted: ${teacher.fullName} (${teacher.teacherId})`);
    } catch (error) {
      console.error(`✗ Failed to insert ${teacher.fullName}:`, error.message);
    }
  }

  console.log("\nTeacher insertion completed!");
}

// Run the script
insertTeachers()
  .then(() => {
    console.log("Script finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });

//   AWS_PROFILE=canh node scripts/insert-teachers.js
