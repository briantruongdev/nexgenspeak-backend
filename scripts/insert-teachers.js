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
    fullName: "Nguyễn Thị Thùy",
    position: "Senior English Teacher",
    award1: "TESOL Certified",
    award2: "Cambridge CELTA",
    award3: "IELTS 8.5",
    avatar: "teacher1.png",
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
        time: "2015 - 2018",
        value: "English Lecturer at Ho Chi Minh Language University",
      },
      {
        time: "2018 - 2020",
        value: "Senior IELTS Instructor at British Language Center",
      },
      {
        time: "2020 - 2022",
        value: "Online English Teacher for global learners",
      },
      { time: "2022 - 2023", value: "Senior Teacher at NexGen English Center" },
      {
        time: "2023 - Now",
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
    avatar: "teacher2.png",
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
      { time: "2014 - 2017", value: "BA English Linguistics - HCM University" },
      {
        time: "2017 - 2019",
        value: "English Trainer at Global Communication Center",
      },
      { time: "2019 - 2021", value: "Corporate English Trainer for companies" },
      { time: "2021 - 2024", value: "Online English Communication Coach" },
      {
        time: "2024 - Now",
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
    fullName: "Lê Hoàng Hường",
    position: "IELTS Expert",
    award1: "IELTS 9.0",
    award2: "British Council Certified",
    award3: "Author of IELTS Success",
    avatar: "teacher3.png",
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
        time: "2013 - 2017",
        value: "BA English Teaching - University of Education",
      },
      { time: "2017 - 2019", value: "IELTS Instructor at ACET Vietnam" },
      { time: "2019 - 2022", value: "Senior IELTS Trainer" },
      { time: "2022 - 2024", value: "IELTS Course Designer & Teacher" },
      { time: "2024 - Now", value: "Published IELTS training materials" },
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
    avatar: "teacher4.png",
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
      { time: "2012 - 2016", value: "MBA in International Business - UK" },
      {
        time: "2016 - 2018",
        value: "Business English Trainer at Language Link",
      },
      {
        time: "2018 - 2021",
        value: "Corporate Trainer for multinational companies",
      },
      { time: "2021 - 2024", value: "Freelance Business English Coach" },
      {
        time: "2024 - Now",
        value: "Conducted corporate communication workshops",
      },
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
    fullName: "Lê Ngọc Anh",
    position: "Pronunciation & Accent Coach",
    award1: "Native-like Pronunciation",
    award2: "Phonetics Specialist",
    award3: "Speech Therapy Background",
    avatar: "teacher5.png",
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
        time: "2013 - 2016",
        value: "BA English Phonetics - University of Education",
      },
      {
        time: "2016 - 2019",
        value: "Pronunciation Trainer at International Language Center",
      },
      { time: "2019 - 2022", value: "Accent Coach for professionals" },
      { time: "2022 - 2024", value: "Online Pronunciation Specialist" },
      { time: "2024 - Now", value: "Speech and phonetics workshop trainer" },
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
    avatar: "teacher6.png",
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
      { time: "2010 - 2014", value: "BA Early Childhood Education" },
      { time: "2014 - 2017", value: "Kids English Teacher at VUS" },
      { time: "2017 - 2020", value: "Cambridge YLE Instructor" },
      {
        time: "2020 - 2024",
        value: "Senior Kids Teacher at International School",
      },
      { time: "2024 - Now", value: "Designed English curriculum for kids" },
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
    fullName: "Trần Minh Anh",
    position: "TOEFL Specialist",
    award1: "TOEFL iBT 120",
    award2: "ETS Certified",
    award3: "University Lecturer",
    avatar: "teacher7.png",
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
      { time: "2012 - 2016", value: "BA English - University of Education" },
      { time: "2016 - 2018", value: "TOEFL Instructor at ILA" },
      { time: "2018 - 2021", value: "Academic English Lecturer" },
      { time: "2021 - 2022", value: "TOEFL Specialist" },
      { time: "2022 - Now", value: "Study abroad consultant & trainer" },
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
    avatar: "teacher8.png",
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
      { time: "2013 - 2016", value: "BA English Translation" },
      { time: "2016 - 2019", value: "English Teacher in USA" },
      { time: "2019 - 2021", value: "Online Conversation Coach" },
      { time: "2021 - 2023", value: "Senior Speaking Teacher" },
      { time: "2023 - Now", value: "Hosted English speaking clubs" },
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
  {
    teacherId: "9",
    fullName: "Nguyễn An Nhiên",
    position: "Academic Writing Specialist",
    award1: "Master in Applied Linguistics",
    award2: "IELTS 8.5 (Writing 8.5)",
    award3: "University Lecturer",
    avatar: "teacher9.png",
    rating: 4.9,
    totalReviews: 112,
    students: 195,
    lessons: 1350,
    pricePerHour: 16,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "I am a specialist in Academic Writing with over 7 years of experience in higher education. I have helped hundreds of students master complex essays and achieve high scores in the IELTS Writing component. My approach focuses on logical thinking, sentence variety, and academic vocabulary. I believe that writing is a skill that can be perfected with the right guidance. Together, we will turn your complex ideas into sharp, persuasive English prose.",
    strengths:
      "Expert in essay structure and critical thinking. Extremely detailed and meticulous feedback. Provides a rich bank of academic vocabulary. Helps students improve advanced grammar quickly. Stays updated with the latest exam trends.",
    teachingStyle:
      "My teaching style is formal yet accessible. I emphasize error analysis so that students do not repeat the same mistakes. Each session is a mix of theory and immediate writing practice. I encourage students to brainstorm and debate ideas freely before putting pen to paper.",
    resume: [
      {
        time: "2014 - 2017",
        value: "English Lecturer at University of Education",
      },
      { time: "2017 - 2019", value: "MA in Applied Linguistics (Australia)" },
      { time: "2019 - 2022", value: "Head of Academic Dept at IELTS Workshop" },
      { time: "2022 - 2024", value: "Author of Academic Writing guides" },
      {
        time: "2024 - Now",
        value: "Academic Consultant for International Programs",
      },
    ],
    specialties: [
      {
        title: "Academic Writing",
        description:
          "Intensive essay writing practice for university and grad school.",
      },
      {
        title: "IELTS Writing",
        description:
          "Master strategies for Task 1 and Task 2 with model answers.",
      },
      {
        title: "Critical Thinking",
        description:
          "Develop strong logic to make your arguments more persuasive.",
      },
      {
        title: "Grammar for Writing",
        description: "Master complex structures and precise punctuation.",
      },
      {
        title: "Research Paper Prep",
        description: "Guidance for writing research reports and dissertations.",
      },
      {
        title: "Essay Correction",
        description: "Detailed marking services with estimated band scores.",
      },
    ],
  },
  {
    teacherId: "10",
    fullName: "Nguyễn Mai Chi",
    position: "English for Hospitality & Tourism",
    award1: "Ex-Flight Attendant Trainer",
    award2: "Advanced Diploma in Tourism",
    award3: "TOEIC 950",
    avatar: "teacher10.png",
    rating: 4.8,
    totalReviews: 65,
    students: 120,
    lessons: 800,
    pricePerHour: 14,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "With years of experience in aviation and 5-star hospitality, I understand the vital importance of professional English. I specialize in training hotel staff, tour guides, and aspiring cabin crew members. My lessons are deeply rooted in real-world workplace scenarios. I will help you handle any customer situation with confidence and grace. My goal is to equip you with the language skills needed to excel in the global service industry.",
    strengths:
      "Deep knowledge of service industry terminology. Professional and polished communication skills. Focus on practical situational reflex. Correction of body language and vocal tone. Highly energetic and motivating personality.",
    teachingStyle:
      "Role-playing is my primary teaching method. You will act out scenarios like hotel check-ins, restaurant service, or handling complaints. I focus on a confident attitude and using polite, standard English that meets international service standards.",
    resume: [
      { time: "2015 - 2018", value: "Flight Attendant at Emirates Airline" },
      {
        time: "2018 - 2020",
        value: "Service Manager at InterContinental Hotel",
      },
      { time: "2020 - 2022", value: "Soft Skills Trainer for Corporations" },
      { time: "2022 - 2024", value: "Lecturer in Tourism English" },
      {
        time: "2024 - Now",
        value: "Founder of 'English for Cabin Crew' Course",
      },
    ],
    specialties: [
      {
        title: "Hospitality English",
        description: "Learn language for front desk, F&B, and concierge roles.",
      },
      {
        title: "Cabin Crew Prep",
        description: "Specific English training for airline interview success.",
      },
      {
        title: "Customer Service",
        description:
          "Master the art of polite requests and complaint handling.",
      },
      {
        title: "Tour Guiding",
        description:
          "Practice explaining history and culture to international guests.",
      },
      {
        title: "Professional Etiquette",
        description:
          "Body language and tone for high-end service environments.",
      },
      {
        title: "TOEIC Preparation",
        description:
          "Focus on the Listening and Reading skills required by employers.",
      },
    ],
  },
  {
    teacherId: "11",
    fullName: "Trần Minh Tâm",
    position: "Foundation & General English",
    award1: "Bachelor in English Pedagogy",
    award2: "Best Teacher Award 2021",
    award3: "8+ Years of Experience",
    avatar: "teacher11.png",
    rating: 4.88,
    totalReviews: 156,
    students: 280,
    lessons: 1900,
    pricePerHour: 12,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "I specialize in helping beginners and intermediate learners build a rock-solid foundation in English. If you feel lost with grammar or struggle to form basic sentences, I am here to help. I simplify complex rules into easy-to-remember concepts. My mission is to remove your fear of English and make the learning process fun and logical. We will work on your vocabulary, grammar, and basic speaking until you feel ready for any conversation.",
    strengths:
      "Patient and encouraging with beginners. Expert at simplifying difficult grammar. Strong focus on sentence construction. Builds a supportive, pressure-free environment. Uses visual aids to enhance memory.",
    teachingStyle:
      "My teaching style is interactive and repetitive in a good way. I ensure you truly understand a concept before moving forward. We use a lot of visual tools and real-life examples. I encourage 'learning by doing' through simple games and daily life discussions.",
    resume: [
      { time: "2014 - 2017", value: "English Teacher at High School level" },
      {
        time: "2017 - 2020",
        value: "General English Trainer at Language Centers",
      },
      {
        time: "2020 - 2022",
        value: "Content Creator for English learning apps",
      },
      { time: "2022 - 2024", value: "Senior Foundation Course Instructor" },
      { time: "2024 - Now", value: "Private Tutor for Adult Beginners" },
    ],
    specialties: [
      {
        title: "English Foundations",
        description: "Master basic grammar and the 1,000 most common words.",
      },
      {
        title: "Sentence Building",
        description: "Learn to speak and write complete, correct sentences.",
      },
      {
        title: "Vocabulary Growth",
        description: "Expand your word bank through themed, practical topics.",
      },
      {
        title: "Daily Communication",
        description:
          "Basic English for shopping, greetings, and introductions.",
      },
      {
        title: "Grammar Simplified",
        description:
          "Understand tenses and parts of speech without the headache.",
      },
      {
        title: "Confidence Booster",
        description: "Overcome the initial fear of making mistakes in English.",
      },
    ],
  },
  {
    teacherId: "12",
    fullName: "Bùi Quỳnh Anh",
    position: "IELTS & SAT Verbal Specialist",
    award1: "IELTS 9.0 Overall",
    award2: "SAT Verbal 780/800",
    award3: "Fulbright Alumna",
    avatar: "teacher12.png",
    rating: 5.0,
    totalReviews: 215,
    students: 450,
    lessons: 3500,
    pricePerHour: 22,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "I am a high-performance coach for students aiming for top-tier scores in IELTS and SAT. Having studied and worked in the US as a Fulbright scholar, I bring a native-level academic perspective to my classes. I don't just teach English; I teach the logic behind the tests. My students regularly achieve band 8.0+ and 1500+ SAT scores. If you are serious about applying to Ivy League or top global universities, I have the roadmap for your success.",
    strengths:
      "Unrivaled expertise in test-taking strategies. High-level academic vocabulary specialist. Personalized study plans for high achievers. Expert at identifying subtle logic traps in SAT/IELTS. Extremely result-oriented.",
    teachingStyle:
      "Intensive, analytical, and fast-paced. I expect a high level of commitment from my students. We dive deep into the 'why' behind every answer. My lessons are designed to push your limits and refine your critical reading and writing skills to a professional standard.",
    resume: [
      {
        time: "2015 - 2017",
        value: "Fulbright Scholar - MA in Education (USA)",
      },
      { time: "2017 - 2020", value: "SAT/GRE Verbal Instructor in Boston" },
      { time: "2020 - 2022", value: "Senior IELTS Expert at IvyPrep" },
      { time: "2022 - 2024", value: "Educational Consultant for Study Abroad" },
      { time: "2024 - Now", value: "Founder of Elite Test Prep Academy" },
    ],
    specialties: [
      {
        title: "SAT Reading & Writing",
        description: "Master the logic and evidence-based reading of the SAT.",
      },
      {
        title: "IELTS 8.0+ Coaching",
        description:
          "Refine your skills to hit the highest possible band scores.",
      },
      {
        title: "Academic Logic",
        description:
          "Learn to analyze complex texts and detect bias or intent.",
      },
      {
        title: "Advanced Vocabulary",
        description:
          "Build a lexicon suitable for high-level academic discourse.",
      },
      {
        title: "College Essay Mentoring",
        description: "Write compelling personal statements for US colleges.",
      },
      {
        title: "GRE Verbal Prep",
        description:
          "Strategic preparation for graduate-level admissions tests.",
      },
    ],
  },
  {
    teacherId: "13",
    fullName: "Đặng Hà My",
    position: "Tech & IT English Coach",
    award1: "Bachelor in Computer Science",
    award2: "TESOL Certified",
    award3: "Ex-Software Engineer",
    avatar: "teacher13.png",
    rating: 4.93,
    totalReviews: 92,
    students: 160,
    lessons: 1100,
    pricePerHour: 18,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "I bridge the gap between technical expertise and English fluency. As a former software engineer, I understand the specific language needs of developers, PMs, and designers. I specialize in helping tech professionals communicate effectively in stand-ups, technical documentation, and international meetings. My lessons cover everything from explaining architecture to negotiating features with stakeholders. Let's make your English as clean as your code.",
    strengths:
      "Understand technical context and IT workflows. Focus on precision and clarity in communication. Expert in technical presentation skills. Practical advice for working in global tech teams. Patient with logical/analytical thinkers.",
    teachingStyle:
      "My style is direct, structured, and practical. We use real technical scenarios like code reviews, scrum meetings, and documentation writing. I focus on 'useful' English that you can apply at work immediately after the lesson.",
    resume: [
      { time: "2014 - 2018", value: "Software Engineer at FPT Software" },
      { time: "2018 - 2020", value: "Team Lead in an Outsourcing Firm" },
      { time: "2020 - 2022", value: "English Trainer for IT Corporations" },
      { time: "2022 - 2024", value: "Freelance IT Communication Coach" },
      {
        time: "2024 - Now",
        value: "Creator of 'English for Developers' Program",
      },
    ],
    specialties: [
      {
        title: "IT English",
        description:
          "Specific vocabulary for coding, infrastructure, and UX/UI.",
      },
      {
        title: "Technical Presentations",
        description:
          "Learn to explain complex systems to non-tech stakeholders.",
      },
      {
        title: "Stand-up & Meetings",
        description:
          "Practice giving clear, concise updates in Agile environments.",
      },
      {
        title: "Tech Interview Prep",
        description:
          "Master the behavioral and technical portions of IT interviews.",
      },
      {
        title: "Emailing for Tech",
        description:
          "Write clear tickets, documentation, and professional emails.",
      },
      {
        title: "Negotiation Skills",
        description:
          "Discussing deadlines and features with clients in English.",
      },
    ],
  },
  {
    teacherId: "14",
    fullName: "Hoàng Thu Thủy",
    position: "Literature & Creative Writing",
    award1: "Bachelor in English Literature",
    award2: "Published Poet & Writer",
    award3: "Creative Arts Educator",
    avatar: "teacher14.png",
    rating: 4.97,
    totalReviews: 48,
    students: 85,
    lessons: 600,
    pricePerHour: 15,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "English is more than just a tool for communication; it is a medium for art. I am a writer and educator dedicated to the beauty of the English language. I help advanced students explore literature, poetry, and creative storytelling. If you want to develop a unique voice, master the nuances of metaphors, or simply enjoy reading the classics, my classes are for you. Let's explore the soul of the language together.",
    strengths:
      "Deep passion for storytelling and arts. Expert in nuance, tone, and figurative language. Encourages creative expression and risk-taking. Strong background in classic and modern literature. Empathetic and inspiring mentor.",
    teachingStyle:
      "My lessons are conversational and exploratory. We read, analyze, and create. I don't believe in 'wrong' answers in art; I believe in perspectives. You will do a lot of journaling, creative exercises, and deep-dive discussions on literary themes.",
    resume: [
      { time: "2016 - 2019", value: "Editor for an English Arts Magazine" },
      {
        time: "2019 - 2021",
        value: "Literature Teacher at International School",
      },
      { time: "2021 - 2023", value: "Writing Workshop Facilitator" },
      { time: "2023 - 2024", value: "Published a collection of short stories" },
      { time: "2024 - Now", value: "Independent Creative Writing Coach" },
    ],
    specialties: [
      {
        title: "Creative Writing",
        description: "Write stories, poems, and essays with your own voice.",
      },
      {
        title: "Literature Analysis",
        description: "Deep dive into works by Shakespeare, Orwell, and more.",
      },
      {
        title: "Advanced Stylistics",
        description:
          "Learn to manipulate tone, mood, and style in your writing.",
      },
      {
        title: "Vocabulary & Nuance",
        description: "Explore the subtle differences between similar words.",
      },
      {
        title: "Reading Clubs",
        description: "Group discussions on contemporary and classic novels.",
      },
      {
        title: "Screenwriting Basics",
        description: "Learn the fundamentals of writing for film and media.",
      },
    ],
  },
  {
    teacherId: "15",
    fullName: "Đỗ Thanh Trúc",
    position: "Accent Reduction & Public Speaking",
    award1: "Vocal Coach Certification",
    award2: "Toastmasters Gold Member",
    award3: "TEDx Speaking Coach",
    avatar: "teacher15.png",
    rating: 4.98,
    totalReviews: 130,
    students: 210,
    lessons: 1750,
    pricePerHour: 20,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "Do you feel that your accent holds you back in your career? I specialize in accent reduction and high-stakes public speaking. I have coached CEOs, politicians, and TEDx speakers to deliver their messages with power and clarity. My background in vocal mechanics allows me to pinpoint exactly how you need to adjust your speech to sound more natural. I will help you master the rhythm, melody, and confidence of a native speaker.",
    strengths:
      "Scientific approach to phonetics and mechanics. Expert in stage presence and non-verbal cues. Ability to build massive confidence in students. Highly specialized in the 'American Sound'. Results-driven coaching for high-profile events.",
    teachingStyle:
      "My sessions are like a gym for your mouth and mind. We do intensive vocal drills, record and analyze your speech, and practice delivering speeches under 'pressure'. I provide direct, honest feedback to ensure rapid improvement in your delivery.",
    resume: [
      { time: "2013 - 2017", value: "Vocal Performer and Coach (USA)" },
      { time: "2017 - 2019", value: "Public Speaking Trainer for Executives" },
      { time: "2019 - 2022", value: "TEDx Hanoi Speech Consultant" },
      { time: "2022 - 2024", value: "Accent Reduction Specialist for Actors" },
      { time: "2024 - Now", value: "Keynote Speaker and Master Trainer" },
    ],
    specialties: [
      {
        title: "Public Speaking",
        description: "Master the art of delivering powerful, moving speeches.",
      },
      {
        title: "Accent Reduction",
        description:
          "Minimize your native accent for better international clarity.",
      },
      {
        title: "Intonation & Rhythm",
        description: "Learn the 'music' of English to sound more natural.",
      },
      {
        title: "Executive Presence",
        description: "Project authority and confidence through your voice.",
      },
      {
        title: "Presentation Design",
        description: "Structure your talks for maximum audience impact.",
      },
      {
        title: "Pitch Coaching",
        description: "Deliver winning pitches for startups and projects.",
      },
    ],
  },
  {
    teacherId: "16",
    fullName: "Vũ Bảo Ngọc",
    position: "TOEIC & Workplace Essentials",
    award1: "TOEIC 990/990",
    award2: "Corporate Communications Expert",
    award3: "7+ Years Corporate Experience",
    avatar: "teacher16.png",
    rating: 4.85,
    totalReviews: 104,
    students: 240,
    lessons: 1500,
    pricePerHour: 13,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "I specialize in 'English for the real office'. Many students get a high TOEIC score but still struggle with office politics or writing a simple report. My classes combine TOEIC test-taking strategies with practical workplace skills. I spent 7 years working for multinational corporations, so I know exactly what language skills managers are looking for. I will help you get that certificate and, more importantly, the promotion you deserve.",
    strengths:
      "Perfect TOEIC score holder. Real-world corporate experience. Practical, no-nonsense teaching style. Expert in professional email etiquette. Helps students balance test prep with real skills.",
    teachingStyle:
      "Efficient and goal-oriented. I use a 'hack the test' approach for TOEIC to save time, then spend the rest of the lesson on communication scenarios you will actually face at work. My lessons are fast-paced and high-energy.",
    resume: [
      { time: "2015 - 2018", value: "HR Specialist at Multinational Corp" },
      { time: "2018 - 2020", value: "Internal Communications Manager" },
      { time: "2020 - 2022", value: "TOEIC Instructor at Leading Centers" },
      { time: "2022 - 2024", value: "Corporate English Consultant" },
      { time: "2024 - Now", value: "Professional Development Coach" },
    ],
    specialties: [
      {
        title: "TOEIC Listening & Reading",
        description: "Strategies to hit 900+ in the shortest time possible.",
      },
      {
        title: "Business Emailing",
        description: "Write professional, clear, and persuasive emails.",
      },
      {
        title: "Office Communication",
        description: "Small talk, meeting etiquette, and reporting to bosses.",
      },
      {
        title: "CV & Resume Writing",
        description: "Optimize your resume for international ATS systems.",
      },
      {
        title: "Career Coaching",
        description: "English skills specifically for career advancement.",
      },
      {
        title: "Networking English",
        description: "Learn how to introduce yourself and build connections.",
      },
    ],
  },
  {
    teacherId: "17",
    fullName: "Hoàng Thảo Vy",
    position: "Medical English Consultant",
    award1: "MD from HMU",
    award2: "USMLE Step 1 & 2 Passer",
    award3: "OET Grade A Specialist",
    avatar: "teacher17.png",
    rating: 4.95,
    totalReviews: 54,
    students: 80,
    lessons: 450,
    pricePerHour: 25,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "I am a medical doctor and an English educator specializing in Medical English and OET preparation. My unique background allows me to help healthcare professionals bridge the language gap in clinical settings. Whether you are a doctor preparing for the USMLE, a nurse aiming for the OET, or a medical student wanting to read international journals, I provide the precise terminology and communication skills you need. I focus on patient-centered communication and accurate clinical reporting.",
    strengths:
      "Deep understanding of medical terminology and pathology. Expert in OET (Occupational English Test) strategies. Focus on professional bedside manner in English. Practical experience with US medical systems. Highly specialized feedback for healthcare workers.",
    teachingStyle:
      "My style is clinical and case-based. We analyze real medical cases and practice patient consultations through role-play. I emphasize the 'plain English' needed for patients and the 'academic English' needed for colleagues and research. Lessons are highly structured around clinical scenarios.",
    resume: [
      {
        time: "2015 - 2021",
        value: "Doctor of Medicine - Hanoi Medical University",
      },
      {
        time: "2021 - 2023",
        value: "Medical English Instructor for Hospitals",
      },
      { time: "2023 - 2024", value: "Consultant for OET Preparation Centers" },
      { time: "2024 - Now", value: "Founder of 'English for Medics' Platform" },
    ],
    specialties: [
      {
        title: "Medical English",
        description: "Terminology for anatomy, physiology, and pharmacology.",
      },
      {
        title: "OET Preparation",
        description:
          "Targeted training for Doctors and Nurses to pass the OET.",
      },
      {
        title: "Patient Consultations",
        description: "Learn to take history and explain diagnoses clearly.",
      },
      {
        title: "Medical Research",
        description: "Guidance on reading and writing medical papers.",
      },
      {
        title: "USMLE Step 2 CS Prep",
        description: "Communication skills for the clinical skills exam.",
      },
      {
        title: "Hospital Communication",
        description: "English for interacting with multi-disciplinary teams.",
      },
    ],
  },
  {
    teacherId: "18",
    fullName: "Phạm Khánh Linh",
    position: "General & Immigration English",
    award1: "Lived in Canada 10 years",
    award2: "CELPIP Expert Trainer",
    award3: "Immigration Support Consultant",
    avatar: "teacher18.png",
    rating: 4.87,
    totalReviews: 128,
    students: 310,
    lessons: 2200,
    pricePerHour: 15,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "Moving to a new country is a huge challenge, and I am here to make the transition easier through language. Having lived in Canada for a decade, I specialize in teaching General English and preparing students for immigration tests like CELPIP and IELTS General. My lessons go beyond grammar; I teach you the culture, the idioms, and the daily life skills you need to survive and thrive in North America. I'll help you pass your PR exams and talk to your new neighbors with confidence.",
    strengths:
      "Expert in CELPIP and IELTS General training. Deep knowledge of North American culture and slang. Empathetic approach to adult learners. Focus on survival English (banking, health, school). Practical tips for life abroad.",
    teachingStyle:
      "My lessons are friendly, practical, and highly interactive. I use 'realia' like Canadian utility bills, lease agreements, and job postings in our lessons. I create a safe space where you can make mistakes and gain the confidence to speak in any social situation.",
    resume: [
      {
        time: "2012 - 2022",
        value: "Resident and Community Volunteer in Toronto, Canada",
      },
      { time: "2022 - 2023", value: "English Coach for Newcomers to Canada" },
      {
        time: "2023 - 2024",
        value: "CELPIP Specialist at International Centers",
      },
      {
        time: "2024 - Now",
        value: "Online Instructor for Immigration Candidates",
      },
    ],
    specialties: [
      {
        title: "CELPIP Preparation",
        description: "Specific training for the Canadian immigration test.",
      },
      {
        title: "IELTS General",
        description:
          "Master the test format for PR and work permit applications.",
      },
      {
        title: "Survival English",
        description: "Learn English for grocery shopping, doctors, and banks.",
      },
      {
        title: "Cultural Integration",
        description: "Understand North American social norms and small talk.",
      },
      {
        title: "Job Hunting Abroad",
        description:
          "Resume writing and interview practice for foreign markets.",
      },
      {
        title: "Slang & Idioms",
        description: "Speak like a local using common daily expressions.",
      },
    ],
  },
  {
    teacherId: "19",
    fullName: "Phan Gia Hân",
    position: "Test-Prep (GMAT & GRE) Verbal Coach",
    award1: "GMAT 760 (Verbal 42)",
    award2: "MBA Candidate",
    award3: "Logical Reasoning Specialist",
    avatar: "teacher19.png",
    rating: 4.99,
    totalReviews: 72,
    students: 110,
    lessons: 900,
    pricePerHour: 25,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "I specialize in the 'Elite' tests: GMAT and GRE Verbal. These tests aren't just about English; they are about logic and data analysis. I help MBA and PhD candidates break down complex arguments and master the art of Critical Reasoning and Sentence Correction. My goal is to help you achieve a 700+ GMAT score by teaching you how the test-makers think. If you want a high-scoring shortcut based on logic rather than memorization, let's get to work.",
    strengths:
      "Master of logical fallacies and argument structures. Highly efficient strategies for reading comprehension. Systematic approach to GMAT Sentence Correction. Personalized coaching for top-tier MBA applicants. Intense focus on timing and accuracy.",
    teachingStyle:
      "Analytical, rigorous, and result-oriented. I treat every question like a puzzle. We focus on the 'why' and the 'how' rather than just the 'what'. I provide high-pressure practice sessions to mimic real test conditions and refine your decision-making under stress.",
    resume: [
      {
        time: "2016 - 2018",
        value: "Verbal Instructor at a Top Test Prep Boutique",
      },
      { time: "2018 - 2020", value: "GMAT/GRE Curriculum Developer" },
      { time: "2020 - 2023", value: "Private Coach for MBA Applicants" },
      { time: "2023 - Now", value: "Lead Verbal Strategist at PrepElite" },
    ],
    specialties: [
      {
        title: "GMAT Verbal",
        description: "Deep dive into Sentence Correction, CR, and RC.",
      },
      {
        title: "GRE Verbal",
        description: "Focus on Text Completion and Reading Comprehension.",
      },
      {
        title: "Critical Reasoning",
        description:
          "Learn to identify assumptions, strengthen/weaken arguments.",
      },
      {
        title: "Analytical Writing",
        description: "Master the 'Issue' and 'Argument' tasks for the GRE.",
      },
      {
        title: "Vocabulary for GRE",
        description: "Master high-frequency, sophisticated academic words.",
      },
      {
        title: "Advanced Logic",
        description: "Applying formal logic to solve complex verbal problems.",
      },
    ],
  },
  {
    teacherId: "20",
    fullName: "Trần Phương Anh",
    position: "English for Legal Professionals",
    award1: "LLB (Law) Graduate",
    award2: "ILEC (Legal English) Certified",
    award3: "Consultant for International Law Firms",
    avatar: "teacher20.png",
    rating: 4.92,
    totalReviews: 45,
    students: 65,
    lessons: 500,
    pricePerHour: 22,
    languages: ["English", "Vietnamese"],
    aboutMe:
      "In the world of law, one wrong word can change everything. I help lawyers and law students master the precision required for Legal English. My lessons cover contract drafting, legal research, and the language used in international arbitration. Having a background in law, I can help you translate complex legal concepts into clear English. We focus on 'Legalese' vs. 'Plain English' to ensure you can communicate effectively with both clients and courts.",
    strengths:
      "Precise understanding of legal terminology and syntax. Expert in contract drafting and review in English. Focused on accuracy and risk mitigation through language. Deep knowledge of common law vs. civil law terminology. Professional and ethical teaching approach.",
    teachingStyle:
      "Highly detailed and analytical. We work through real contracts, statutes, and case briefs. I emphasize the use of modal verbs and precise definitions. My goal is to ensure you never use an ambiguous phrase in a legal document again.",
    resume: [
      {
        time: "2015 - 2019",
        value: "Bachelor of Laws (LLB) - International Law",
      },
      {
        time: "2019 - 2021",
        value: "Legal Assistant at an International Law Firm",
      },
      { time: "2021 - 2023", value: "Corporate Trainer for Legal Departments" },
      { time: "2023 - Now", value: "Specialist Legal English Tutor" },
    ],
    specialties: [
      {
        title: "Legal English",
        description:
          "Master the specialized vocabulary of the legal profession.",
      },
      {
        title: "Contract Drafting",
        description: "Learn to write clear, enforceable contracts in English.",
      },
      {
        title: "International Arbitration",
        description: "English skills for disputes and international hearings.",
      },
      {
        title: "Legal Writing",
        description: "Write persuasive briefs and professional legal opinions.",
      },
      {
        title: "Negotiation for Lawyers",
        description: "Advanced language for deal-making and settlements.",
      },
      {
        title: "Client Consultations",
        description: "Practice explaining complex legal issues to laypeople.",
      },
    ],
  },
  // {
  //   teacherId: "21",
  //   fullName: "Lam Nguyen",
  //   position: "Phonics & Early Literacy Coach",
  //   award1: "Jolly Phonics Certified",
  //   award2: "TESOL for Young Learners",
  //   award3: "Primary Education Specialist",
  //   avatar: "https://randomuser.me/api/portraits/men/60.jpg",
  //   rating: 4.9,
  //   totalReviews: 115,
  //   students: 200,
  //   lessons: 2100,
  //   pricePerHour: 14,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "I specialize in the very first steps of the English journey: Phonics. I help young children (ages 4-8) learn to read and write from scratch using the Jolly Phonics method. My lessons are filled with songs, actions, and games that make learning the 42 sounds of English an adventure. I believe that a strong foundation in phonics is the key to lifetime confidence in speaking and spelling. Let's help your child discover the magic of reading!",
  //   strengths:
  //     "Expert in synthetic phonics methodology. Highly patient and engaging with young children. Creative at turning lessons into games. Strong focus on correct mouth positioning for sounds. Skilled in parent-teacher communication.",
  //   teachingStyle:
  //     "High energy, visual, and kinesthetic. We use 'actions' for every sound to help memory. My lessons move quickly to keep short attention spans engaged. I use a lot of colorful props, puppets, and interactive digital tools to keep the fun alive.",
  //   resume: [
  //     { time: "2014 - 2017", value: "Primary School English Teacher" },
  //     {
  //       time: "2017 - 2020",
  //       value: "Phonics Coordinator at International Kindergarten",
  //     },
  //     { time: "2020 - 2023", value: "Founder of 'Phonics Fun' Workshops" },
  //     { time: "2023 - Now", value: "Online Early Literacy Specialist" },
  //   ],
  //   specialties: [
  //     {
  //       title: "Synthetic Phonics",
  //       description: "Learn the 42 sounds and how to blend them into words.",
  //     },
  //     {
  //       title: "Early Reading",
  //       description:
  //         "Moving from sounds to reading simple sentences and stories.",
  //     },
  //     {
  //       title: "Spelling Basics",
  //       description:
  //         "Building the foundation for accurate spelling through sound.",
  //     },
  //     {
  //       title: "Pronunciation for Kids",
  //       description: "Correcting early speech habits for clear English.",
  //     },
  //     {
  //       title: "Creative Storytelling",
  //       description: "Engaging kids with books to build a love for literature.",
  //     },
  //     {
  //       title: "Handwriting Prep",
  //       description: "Basic fine motor skills for letter formation.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "22",
  //   fullName: "Sophie Tran",
  //   position: "English for Marketing & Media",
  //   award1: "Bachelor in Communications (Australia)",
  //   award2: "Ex-Copywriter for Global Brands",
  //   award3: "Digital Marketing Certified",
  //   avatar: "https://randomuser.me/api/portraits/women/24.jpg",
  //   rating: 4.94,
  //   totalReviews: 68,
  //   students: 130,
  //   lessons: 950,
  //   pricePerHour: 17,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "Marketing is the art of persuasion, and I teach you how to do it in English. I am a communications specialist with experience working in Australian ad agencies. I help marketers, content creators, and social media managers find the right words to capture attention. We focus on copywriting, brand voice, and presentation skills. If you want your English content to sound punchy, professional, and native, I can help you get there.",
  //   strengths:
  //     "Expert in copywriting and storytelling. Deep understanding of digital marketing trends. Focus on 'voice' and 'tone' in communication. Practical experience with global brand guidelines. Skilled in creative brainstorming.",
  //   teachingStyle:
  //     "Collaborative, creative, and fast-paced. We analyze successful global campaigns and write our own. I provide 'critique' sessions like a real creative director would. My lessons are about the psychology of language as much as the grammar.",
  //   resume: [
  //     { time: "2015 - 2018", value: "Copywriter at an Agency in Melbourne" },
  //     { time: "2018 - 2020", value: "Content Manager for Tech Startups" },
  //     { time: "2020 - 2022", value: "English Coach for Creative Teams" },
  //     { time: "2022 - 2024", value: "Freelance Branding Consultant" },
  //     { time: "2024 - Now", value: "Founder of 'Words for Brands' Course" },
  //   ],
  //   specialties: [
  //     {
  //       title: "Copywriting",
  //       description: "Write headlines, social posts, and ads that convert.",
  //     },
  //     {
  //       title: "Brand Storytelling",
  //       description: "Learn to communicate a brand's mission effectively.",
  //     },
  //     {
  //       title: "Creative Presentations",
  //       description: "Pitch your ideas to clients with confidence and flair.",
  //     },
  //     {
  //       title: "Social Media English",
  //       description: "Master the informal, engaging language of the web.",
  //     },
  //     {
  //       title: "Public Relations",
  //       description: "Learn to write press releases and handle media queries.",
  //     },
  //     {
  //       title: "Marketing Vocabulary",
  //       description: "Industry-specific terms for SEO, PPC, and Analytics.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "23",
  //   fullName: "Alex Vo",
  //   position: "IELTS Speaking & Fluency Specialist",
  //   award1: "IELTS Speaking 9.0",
  //   award2: "Linguistics Enthusiast",
  //   award3: "Over 5,000 Lessons Taught",
  //   avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  //   rating: 4.96,
  //   totalReviews: 310,
  //   students: 520,
  //   lessons: 5200,
  //   pricePerHour: 16,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "I have one goal: to get you to stop 'translating' in your head and start 'speaking' from your heart. I am an IELTS Speaking specialist known for my high-energy sessions and extreme focus on fluency. I have a massive bank of real exam questions and I know exactly what the examiners are looking for in the 15 minutes of the interview. Whether you are stuck at 6.0 or aiming for an 8.5, I provide the targeted drills and feedback you need.",
  //   strengths:
  //     "Record-breaking student success rate in Speaking. Ability to identify and fix fluency bottlenecks. Expert in 'Lexical Resource' and 'Coherence'. High-energy and incredibly motivating. Provides native-level idiomatic expressions.",
  //   teachingStyle:
  //     "Intensive and conversational. I talk 30%, you talk 70%. We do 'mock tests' under real exam pressure in every single lesson. I record our sessions so we can analyze your filler words, pronunciation, and flow together.",
  //   resume: [
  //     {
  //       time: "2013 - 2017",
  //       value: "Speaking Instructor at Major IELTS Centers",
  //     },
  //     { time: "2017 - 2020", value: "Senior Evaluator for Mock Exams" },
  //     { time: "2020 - 2023", value: "Full-time Online IELTS Coach" },
  //     {
  //       time: "2023 - Now",
  //       value: "Creator of the 'Fluency Fast-Track' Method",
  //     },
  //   ],
  //   specialties: [
  //     {
  //       title: "IELTS Speaking Part 1, 2, 3",
  //       description: "Master all parts of the speaking interview.",
  //     },
  //     {
  //       title: "Fluency Drills",
  //       description: "Exercises to eliminate hesitations and fillers.",
  //     },
  //     {
  //       title: "Idiomatic Language",
  //       description: "Use natural English phrases to boost your score.",
  //     },
  //     {
  //       title: "Pronunciation Correction",
  //       description: "Fix common sounds that lower your band score.",
  //     },
  //     {
  //       title: "Mock Interviews",
  //       description: "Real-time practice with instant band score feedback.",
  //     },
  //     {
  //       title: "Confidence Training",
  //       description: "Overcome exam anxiety and speak comfortably.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "24",
  //   fullName: "Bich Ngoc Pham",
  //   position: "English for HR & Recruitment",
  //   award1: "Senior HR Manager Background",
  //   award2: "SHRM-CP Certified",
  //   award3: "Career Transition Coach",
  //   avatar: "https://randomuser.me/api/portraits/women/17.jpg",
  //   rating: 4.89,
  //   totalReviews: 82,
  //   students: 150,
  //   lessons: 1100,
  //   pricePerHour: 16,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "I help HR professionals and job seekers navigate the international recruitment landscape. As a former Senior HR Manager for a US-based firm, I know the 'hidden' language of hiring. I teach HR specialists how to conduct interviews and write policies in English. For job seekers, I provide high-end coaching for interviews with multinational companies. I'll show you how to 'sell' your experience using the powerful action verbs that recruiters love to see.",
  //   strengths:
  //     "Real-world experience in international recruitment. Expert in Behavioral Interviewing techniques. Strong focus on professional branding. Skilled in conflict resolution language. Deep understanding of corporate culture.",
  //   teachingStyle:
  //     "Practical, strategic, and career-focused. Every lesson is a step toward a better job or a better team. We focus on STAR technique for interviews and professional etiquette for HR. I give feedback from a 'recruiter's perspective' rather than just a 'teacher's'.",
  //   resume: [
  //     { time: "2012 - 2017", value: "HR Coordinator at Tech Multinational" },
  //     { time: "2017 - 2021", value: "Regional HR Manager (Asia-Pacific)" },
  //     { time: "2021 - 2023", value: "Career Consultant and Interview Coach" },
  //     { time: "2023 - Now", value: "English Trainer for HR Professionals" },
  //   ],
  //   specialties: [
  //     {
  //       title: "HR English",
  //       description:
  //         "Vocabulary for recruitment, payroll, and performance reviews.",
  //     },
  //     {
  //       title: "Interview Coaching",
  //       description: "Master the STAR method and behavioral questions.",
  //     },
  //     {
  //       title: "CV & LinkedIn Optimization",
  //       description: "Make your profile stand out to global recruiters.",
  //     },
  //     {
  //       title: "Conflict Resolution",
  //       description:
  //         "Learn the language of mediation and professional feedback.",
  //     },
  //     {
  //       title: "Onboarding & Training",
  //       description: "English skills for welcoming and training new hires.",
  //     },
  //     {
  //       title: "Corporate Etiquette",
  //       description: "Master the unspoken rules of international workplaces.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "25",
  //   fullName: "Dương Minh Hoàng",
  //   position: "English for Finance & Accounting",
  //   award1: "ACCA Member",
  //   award2: "CFA Level 2 Candidate",
  //   award3: "Ex-Big 4 Auditor",
  //   avatar: "https://randomuser.me/api/portraits/men/36.jpg",
  //   rating: 4.91,
  //   totalReviews: 58,
  //   students: 95,
  //   lessons: 720,
  //   pricePerHour: 20,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "I specialize in bridging the gap between financial expertise and English fluency. Having worked as an auditor at a Big 4 firm, I understand the language of balance sheets, cash flows, and tax regulations. I help finance professionals communicate complex data to international stakeholders and prepare for global certifications like ACCA or CFA. My goal is to help you discuss financial strategies as confidently as you handle numbers.",
  //   strengths:
  //     "Expert in financial and accounting terminology. Strong analytical approach to language learning. Focus on professional reporting and data commentary. Practical experience in international audit environments. Patient with technical detail.",
  //   teachingStyle:
  //     "My style is logical and case-study driven. We use real annual reports and financial news (like Bloomberg or Reuters) as our textbooks. I focus on precision—ensuring you use the exact terms needed for compliance and professional clarity.",
  //   resume: [
  //     { time: "2015 - 2018", value: "Senior Auditor at Deloitte Vietnam" },
  //     {
  //       time: "2018 - 2021",
  //       value: "Financial Analyst for a Multi-national Corp",
  //     },
  //     { time: "2021 - 2024", value: "Corporate Trainer for Finance Teams" },
  //     { time: "2024 - Now", value: "Private Consultant for Business English" },
  //   ],
  //   specialties: [
  //     {
  //       title: "Financial English",
  //       description: "Master vocabulary for auditing, banking, and investment.",
  //     },
  //     {
  //       title: "Reporting Skills",
  //       description: "Learn to write clear and concise financial summaries.",
  //     },
  //     {
  //       title: "Presentation of Data",
  //       description: "Describe trends, charts, and forecasts effectively.",
  //     },
  //     {
  //       title: "CFA/ACCA Support",
  //       description: "English skills to help you pass global finance exams.",
  //     },
  //     {
  //       title: "Investor Relations",
  //       description: "Communication strategies for talking to shareholders.",
  //     },
  //     {
  //       title: "Tax & Compliance",
  //       description: "Language for navigating international regulations.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "26",
  //   fullName: "Nguyễn Thu Hà",
  //   position: "English for Engineering & Manufacturing",
  //   award1: "B.Eng in Mechanical Engineering",
  //   award2: "Technical Writing Specialist",
  //   award3: "10+ years in Industrial Sales",
  //   avatar: "https://randomuser.me/api/portraits/women/55.jpg",
  //   rating: 4.88,
  //   totalReviews: 42,
  //   students: 75,
  //   lessons: 550,
  //   pricePerHour: 18,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "I am a bridge between technical people and the English language. With a background in mechanical engineering and a decade in industrial sales, I know how to explain technical specifications, safety protocols, and manufacturing processes in English. I help engineers at multinational factories communicate with foreign experts and write clear technical reports. If you need to talk about blueprints, machinery, or quality control, I am the coach for you.",
  //   strengths:
  //     "Deep knowledge of engineering and technical jargon. Focus on clarity and safety instructions. Expert in technical manual interpretation. Practical experience with global manufacturing standards. Direct and efficient teaching style.",
  //   teachingStyle:
  //     "Practical and visual. We use technical drawings, flowcharts, and safety manuals in our lessons. I focus on 'unambiguous' English—making sure your instructions cannot be misunderstood on the factory floor.",
  //   resume: [
  //     {
  //       time: "2012 - 2016",
  //       value: "Production Engineer at an Automotive Firm",
  //     },
  //     {
  //       time: "2016 - 2021",
  //       value: "Technical Sales Engineer for Industrial Equipment",
  //     },
  //     {
  //       time: "2021 - 2023",
  //       value: "English Trainer for Engineering Departments",
  //     },
  //     { time: "2023 - Now", value: "Independent Technical English Consultant" },
  //   ],
  //   specialties: [
  //     {
  //       title: "Technical English",
  //       description:
  //         "Terminology for mechanics, electronics, and civil engineering.",
  //     },
  //     {
  //       title: "Technical Writing",
  //       description: "Learn to write reports, SOPs, and manuals.",
  //     },
  //     {
  //       title: "Health & Safety",
  //       description: "English for safety briefings and accident reporting.",
  //     },
  //     {
  //       title: "Project Management",
  //       description: "Communication for managing engineering timelines.",
  //     },
  //     {
  //       title: "Blueprint Discussion",
  //       description: "Practice explaining designs and specifications.",
  //     },
  //     {
  //       title: "Supplier Liaison",
  //       description:
  //         "English for negotiating with international part suppliers.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "27",
  //   fullName: "James Le",
  //   position: "SAT & ACT Prep Specialist",
  //   award1: "Perfect Score in SAT Math",
  //   award2: "Top 1% SAT Reading",
  //   award3: "Ivy League Admissions Mentor",
  //   avatar: "https://randomuser.me/api/portraits/men/28.jpg",
  //   rating: 5.0,
  //   totalReviews: 185,
  //   students: 320,
  //   lessons: 2800,
  //   pricePerHour: 22,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "I specialize in high-stakes standardized testing for US college admissions. My approach to the SAT and ACT is purely strategic; I teach you how to spot the patterns and traps set by the College Board. Having helped hundreds of students get into top-tier universities, I know that success is 40% knowledge and 60% strategy. I provide the tools to master the Reading, Writing, and Math sections with speed and precision.",
  //   strengths:
  //     "Master of test-taking psychology and time management. Expert at simplifying complex reading passages. Strong focus on evidence-based writing. Provides a massive library of authentic practice tests. Proven track record of 200+ point score increases.",
  //   teachingStyle:
  //     "Intensive, disciplined, and evidence-based. I use a 'Socratic' method to help students discover their own logic errors. We analyze every wrong answer until the logic of the test becomes second nature. Expect a significant amount of homework and weekly mock tests.",
  //   resume: [
  //     {
  //       time: "2016 - 2019",
  //       value: "Lead SAT Instructor at a Premier Prep Center",
  //     },
  //     {
  //       time: "2019 - 2022",
  //       value: "Admissions Consultant for Ivy League applicants",
  //     },
  //     { time: "2022 - 2024", value: "Founder of 'Strategic Test Prep' Online" },
  //     { time: "2024 - Now", value: "Senior Mentor for Scholarship Candidates" },
  //   ],
  //   specialties: [
  //     {
  //       title: "SAT Reading",
  //       description:
  //         "Strategies for historical, scientific, and literary texts.",
  //     },
  //     {
  //       title: "SAT Writing & Language",
  //       description: "Master the grammar rules and rhetorical skills.",
  //     },
  //     {
  //       title: "Digital SAT Prep",
  //       description: "Adapted strategies for the new digital adaptive format.",
  //     },
  //     {
  //       title: "ACT English & Reading",
  //       description: "Speed-focused strategies for the ACT format.",
  //     },
  //     {
  //       title: "Math for SAT/ACT",
  //       description: "Simplifying complex algebra and geometry problems.",
  //     },
  //     {
  //       title: "College Essays",
  //       description: "Crafting the Common App and supplemental essays.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "28",
  //   fullName: "Trương Thảo My",
  //   position: "English for Busy Professionals",
  //   award1: "Flex-Learning Pioneer",
  //   award2: "Business Communication Expert",
  //   award3: "5+ Years Online Coaching",
  //   avatar: "https://randomuser.me/api/portraits/women/19.jpg",
  //   rating: 4.94,
  //   totalReviews: 145,
  //   students: 410,
  //   lessons: 3100,
  //   pricePerHour: 14,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "I know you don't have time for long, boring grammar lessons. My specialty is high-impact, short-form English coaching for executives and managers who need to improve while on the go. My '15-minute daily immersion' method is designed for the busiest schedules. We focus on the high-frequency language you actually need for your next meeting, email, or business trip. Let's make English a habit, not a chore.",
  //   strengths:
  //     "Expert at designing micro-learning curricula. Focus on immediate practical application. Skilled at identifying 'high-ROI' vocabulary. Incredibly flexible and supportive. High use of mobile-friendly learning tools.",
  //   teachingStyle:
  //     "Dynamic, focused, and efficient. We don't waste time on things you won't use. Each lesson is a 'sprint' targeting a specific workplace problem. I use WhatsApp and voice notes for feedback to keep you engaged between our formal sessions.",
  //   resume: [
  //     { time: "2017 - 2019", value: "English Trainer for Startup Founders" },
  //     { time: "2019 - 2021", value: "Corporate Coach at a Tech Unicorn" },
  //     { time: "2021 - 2024", value: "Online 'Micro-Learning' Specialist" },
  //     { time: "2024 - Now", value: "Author of 'The 15-Minute English' Method" },
  //   ],
  //   specialties: [
  //     {
  //       title: "Executive English",
  //       description: "Language for leadership and high-level decision making.",
  //     },
  //     {
  //       title: "Meeting Survival",
  //       description: "Phrases for interrupting, agreeing, and summarizing.",
  //     },
  //     {
  //       title: "Business Trip Prep",
  //       description: "English for airports, hotels, and networking dinners.",
  //     },
  //     {
  //       title: "Quick Emailing",
  //       description:
  //         "Templates and tips for fast, professional correspondence.",
  //     },
  //     {
  //       title: "Listening on the Go",
  //       description: "Improving comprehension through podcasts and news.",
  //     },
  //     {
  //       title: "Confidence Sprints",
  //       description: "Short, intensive speaking sessions to build fluency.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "29",
  //   fullName: "Phạm Quốc Bảo",
  //   position: "Gia sư Tiếng Anh cho học sinh Chuyên",
  //   award1: "Giải Nhất HSG Quốc Gia",
  //   award2: "Cựu học sinh Chuyên Trần Đại Nghĩa",
  //   award3: "IELTS 8.5",
  //   avatar: "https://randomuser.me/api/portraits/men/12.jpg",
  //   rating: 4.98,
  //   totalReviews: 88,
  //   students: 120,
  //   lessons: 1400,
  //   pricePerHour: 18,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "Tôi chuyên bồi dưỡng học sinh giỏi và luyện thi vào các trường THPT Chuyên (Lê Hồng Phong, Trần Đại Nghĩa, PTNK...). Là một người từng đi qua lộ trình này với giải Quốc gia, tôi hiểu rõ cấu trúc đề thi 'đặc sản' của các trường chuyên: từ các bài biến đổi từ (Word Form) hóc búa đến các bài đọc hiểu chuyên sâu. Tôi không chỉ dạy kiến thức mà còn truyền bí kíp làm bài và tư duy ngôn ngữ để các em tự tin chinh phục những kỳ thi khó nhất.",
  //   strengths:
  //     "Nắm vững cấu trúc đề thi Chuyên và HSG các cấp. Chuyên gia về mảng Word Form và Rewrite chuyên sâu. Cung cấp tài liệu luyện thi độc quyền. Khả năng truyền cảm hứng cho học sinh giỏi. Phương pháp tư duy logic cho ngữ pháp nâng cao.",
  //   teachingStyle:
  //     "Học thuật, kỷ luật nhưng cực kỳ lôi cuốn. Tôi tập trung vào việc giải quyết các 'bẫy' trong đề thi và mở rộng vốn từ vựng ở mức độ C1/C2. Mỗi buổi học là một cuộc 'hack não' với những dạng bài tập nâng cao giúp học sinh đột phá tư duy.",
  //   resume: [
  //     { time: "2016 - 2020", value: "Cựu học sinh Chuyên Anh & Giải Quốc Gia" },
  //     { time: "2020 - 2022", value: "Trợ giảng bồi dưỡng đội tuyển HSG" },
  //     {
  //       time: "2022 - 2024",
  //       value: "Gia sư chuyên luyện thi vào lớp 10 Chuyên",
  //     },
  //     {
  //       time: "2024 - Now",
  //       value: "Tác giả chuỗi chuyên đề 'Chinh phục đề thi Chuyên'",
  //     },
  //   ],
  //   specialties: [
  //     {
  //       title: "Luyện thi vào 10 Chuyên",
  //       description: "Luyện đề Chuyên Anh của các trường Top đầu.",
  //     },
  //     {
  //       title: "Bồi dưỡng HSG",
  //       description: "Ôn luyện cho kỳ thi HSG cấp Thành phố và Quốc gia.",
  //     },
  //     {
  //       title: "Word Form nâng cao",
  //       description: "Làm chủ các gốc từ và biến thể từ vựng phức tạp.",
  //     },
  //     {
  //       title: "Rewrite chuyên sâu",
  //       description: "Viết lại câu với các cấu trúc idiom và phrasal verb.",
  //     },
  //     {
  //       title: "Reading C1/C2",
  //       description: "Rèn luyện kỹ năng đọc hiểu các văn bản học thuật khó.",
  //     },
  //     {
  //       title: "Ngữ pháp chuyên sâu",
  //       description: "Hệ thống hóa các chủ điểm ngữ pháp ngoại lệ và nâng cao.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "30",
  //   fullName: "Anna Vo",
  //   position: "English for Fashion & Design",
  //   award1: "Fashion Marketing Degree (London)",
  //   award2: "Ex-Designer for High-street Brands",
  //   award3: "Creative Arts Mentor",
  //   avatar: "https://randomuser.me/api/portraits/women/33.jpg",
  //   rating: 4.96,
  //   totalReviews: 35,
  //   students: 55,
  //   lessons: 400,
  //   pricePerHour: 19,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "Fashion is a global language, and I help you speak it fluently. Whether you are a designer, a stylist, or a fashion entrepreneur, I provide the English skills you need for the international runway. From discussing textiles and garment construction to pitching your collection to global buyers, my lessons are tailored to the aesthetic and commercial side of fashion. I'll help you describe your vision with the precision and flair it deserves.",
  //   strengths:
  //     "Deep knowledge of fashion terminology and trends. Expert in creative portfolio presentation. Focus on the vocabulary of textiles, silhouettes, and marketing. Practical experience in the London fashion scene. Passionate about visual storytelling.",
  //   teachingStyle:
  //     "Visual, trendy, and conversational. We use fashion magazines, runway videos, and mood boards as our primary materials. I focus on help you develop a 'creative voice' that matches your design aesthetic.",
  //   resume: [
  //     {
  //       time: "2014 - 2018",
  //       value: "BA in Fashion Marketing - University of the Arts London",
  //     },
  //     {
  //       time: "2018 - 2021",
  //       value: "Junior Designer at a UK-based Fashion House",
  //     },
  //     { time: "2021 - 2023", value: "English Coach for Creative Agencies" },
  //     { time: "2023 - Now", value: "Independent Fashion English Consultant" },
  //   ],
  //   specialties: [
  //     {
  //       title: "Fashion English",
  //       description: "Vocabulary for garments, fabrics, and styling.",
  //     },
  //     {
  //       title: "Portfolio Pitching",
  //       description:
  //         "Learn to present your design work to international schools or clients.",
  //     },
  //     {
  //       title: "Fashion Marketing",
  //       description: "English for branding, social media, and retail.",
  //     },
  //     {
  //       title: "Textile Discussion",
  //       description: "Describing materials, sustainability, and production.",
  //     },
  //     {
  //       title: "Trend Forecasting",
  //       description: "Communicating future styles and consumer behavior.",
  //     },
  //     {
  //       title: "Runway & Backstage",
  //       description: "English for fashion shows and photoshoot coordination.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "31",
  //   fullName: "Mark Pham",
  //   position: "English for Sales & Negotiation",
  //   award1: "Top Sales Producer Award",
  //   award2: "Expert in Persuasive Speaking",
  //   award3: "Certified NLP Practitioner",
  //   avatar: "https://randomuser.me/api/portraits/men/50.jpg",
  //   rating: 4.92,
  //   totalReviews: 95,
  //   students: 180,
  //   lessons: 1300,
  //   pricePerHour: 17,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "In sales, it's not just what you say, but how you say it. I coach sales professionals to lead, persuade, and close deals in English. Using techniques from NLP (Neuro-Linguistic Programming) and psychology, I help you build rapport with international clients and handle objections with ease. My goal is to transform your English from a communication barrier into a powerful tool for closing bigger contracts and building lasting business relationships.",
  //   strengths:
  //     "Master of persuasive language and psychological framing. Expert in objection handling and closing techniques. Focus on tonality, rapport, and active listening. Practical experience in B2B and BC sales. Highly motivating and results-driven.",
  //   teachingStyle:
  //     "Intense, practical, and role-play heavy. We spend 80% of our time practicing real sales calls, pitches, and negotiations. I provide instant feedback on your word choice, confidence, and ability to influence the conversation.",
  //   resume: [
  //     {
  //       time: "2013 - 2017",
  //       value: "Account Executive for a Global Tech Firm",
  //     },
  //     {
  //       time: "2017 - 2020",
  //       value: "Sales Manager for Southeast Asia Operations",
  //     },
  //     {
  //       time: "2020 - 2023",
  //       value: "Sales Communication Coach for Multi-nationals",
  //     },
  //     {
  //       time: "2023 - Now",
  //       value: "Creator of 'The Persuasive Closer' Program",
  //     },
  //   ],
  //   specialties: [
  //     {
  //       title: "Sales English",
  //       description: "Phrases for prospecting, qualifying, and closing.",
  //     },
  //     {
  //       title: "Negotiation Tactics",
  //       description: "Learn to handle price objections and contract terms.",
  //     },
  //     {
  //       title: "Persuasive Speaking",
  //       description: "Using 'power words' to influence client decisions.",
  //     },
  //     {
  //       title: "Cold Calling Practice",
  //       description: "Mastering the first 30 seconds of a sales call.",
  //     },
  //     {
  //       title: "Building Rapport",
  //       description: "Small talk and psychological mirroring in English.",
  //     },
  //     {
  //       title: "Pitch Deck Mastery",
  //       description: "Presenting your product's value proposition effectively.",
  //     },
  //   ],
  // },
  // {
  //   teacherId: "32",
  //   fullName: "Lê Minh Tâm",
  //   position: "English for Seniors & Travelers",
  //   award1: "Compassionate Educator Award",
  //   award2: "Cultural Tour Guide Experience",
  //   award3: "Patience & Empathy Specialist",
  //   avatar: "https://randomuser.me/api/portraits/women/62.jpg",
  //   rating: 4.9,
  //   totalReviews: 75,
  //   students: 110,
  //   lessons: 900,
  //   pricePerHour: 12,
  //   languages: ["English", "Vietnamese"],
  //   aboutMe:
  //     "It's never too late to learn English! I specialize in teaching seniors and adults who want to learn English for traveling, visiting family abroad, or simply keeping their minds active. I understand that learning a new language later in life requires more patience, repetition, and a stress-free environment. My lessons are slow-paced, fun, and focused on practical situations like airports, hotels, and daily conversations with grandkids abroad.",
  //   strengths:
  //     "Extremely patient and gentle teaching approach. Focus on practical 'survival' phrases for travel. Uses slow, clear speech and repetition. Creates a warm and supportive social environment. Skilled at making technology easy for seniors.",
  //   teachingStyle:
  //     "Relaxed, conversational, and fun. I use a lot of pictures, stories, and real-life objects. We don't worry about perfect grammar; we focus on being understood and enjoying the journey of learning. Each lesson is a social experience.",
  //   resume: [
  //     { time: "2010 - 2015", value: "International Tour Guide across Europe" },
  //     { time: "2015 - 2020", value: "Community English Teacher for Seniors" },
  //     {
  //       time: "2020 - 2023",
  //       value: "Online Tutor for Vietnamese Diaspora Families",
  //     },
  //     { time: "2023 - Now", value: "Founder of 'Silver Age English' Club" },
  //   ],
  //   specialties: [
  //     {
  //       title: "Travel English",
  //       description:
  //         "Booking hotels, ordering food, and asking for directions.",
  //     },
  //     {
  //       title: "Social English",
  //       description: "Basic greetings and talking about family and hobbies.",
  //     },
  //     {
  //       title: "Grandkids Connection",
  //       description:
  //         "English to talk with family living in the US, UK, or Australia.",
  //     },
  //     {
  //       title: "Listening for Travel",
  //       description:
  //         "Understanding airport announcements and basic instructions.",
  //     },
  //     {
  //       title: "Health & Emergency",
  //       description:
  //         "Essential phrases for doctors or pharmacies while abroad.",
  //     },
  //     {
  //       title: "Memory Training",
  //       description: "Fun language games to keep the brain sharp.",
  //     },
  //   ],
  // },
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
