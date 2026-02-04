const AWS = require("aws-sdk");

// Configure AWS
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "ap-southeast-1",
});

const TEACHERS_TABLE = "nexgenspeak-teachers-vn";

// Sample teachers data
const teachers = [
  {
    teacherId: "1",
    fullName: "Nguyễn Văn An",
    position: "Senior English Teacher",
    award1: "TESOL Certified",
    award2: "Cambridge CELTA",
    award3: "IELTS 8.5",
    createdAt: new Date().toISOString(),
  },
  {
    teacherId: "2",
    fullName: "Trần Thị Bình",
    position: "English Communication Specialist",
    award1: "Master in English Linguistics",
    award2: "TOEIC 990",
    award3: "10+ years experience",
    createdAt: new Date().toISOString(),
  },
  {
    teacherId: "3",
    fullName: "Lê Hoàng Cường",
    position: "IELTS Expert",
    award1: "IELTS 9.0",
    award2: "British Council Certified",
    award3: "Author of IELTS Success",
    createdAt: new Date().toISOString(),
  },
  {
    teacherId: "4",
    fullName: "Phạm Thị Dung",
    position: "Business English Coach",
    award1: "MBA from UK",
    award2: "Corporate Training Expert",
    award3: "BEC Higher Certified",
    createdAt: new Date().toISOString(),
  },
  {
    teacherId: "5",
    fullName: "Hoàng Minh Đức",
    position: "Pronunciation & Accent Coach",
    award1: "Native-like Pronunciation",
    award2: "Phonetics Specialist",
    award3: "Speech Therapy Background",
    createdAt: new Date().toISOString(),
  },
  {
    teacherId: "6",
    fullName: "Vũ Thị Hương",
    position: "Kids English Teacher",
    award1: "Child Psychology Certified",
    award2: "Cambridge YLE Expert",
    award3: "15+ years with children",
    createdAt: new Date().toISOString(),
  },
  {
    teacherId: "7",
    fullName: "Đỗ Văn Khoa",
    position: "TOEFL Specialist",
    award1: "TOEFL iBT 120",
    award2: "ETS Certified",
    award3: "University Lecturer",
    createdAt: new Date().toISOString(),
  },
  {
    teacherId: "8",
    fullName: "Bùi Thị Lan",
    position: "Conversational English Expert",
    award1: "Native Speaker Level",
    award2: "Cultural Exchange Program",
    award3: "Lived in USA 5 years",
    createdAt: new Date().toISOString(),
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
