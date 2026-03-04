const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

// Configure AWS
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "ap-southeast-1",
});

const USERS_TABLE = "dev-nexgenspeak-backend-services-vn-auth-user-vn";

/**
 * Remove Vietnamese diacritics from a string
 * E.g., "Nguyễn Thị Thùy" → "Nguyen Thi Thuy"
 */
function removeVietnameseDiacritics(str) {
  const map = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    đ: "d",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    À: "A",
    Á: "A",
    Ả: "A",
    Ã: "A",
    Ạ: "A",
    Ă: "A",
    Ằ: "A",
    Ắ: "A",
    Ẳ: "A",
    Ẵ: "A",
    Ặ: "A",
    Â: "A",
    Ầ: "A",
    Ấ: "A",
    Ẩ: "A",
    Ẫ: "A",
    Ậ: "A",
    Đ: "D",
    È: "E",
    É: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ẹ: "E",
    Ê: "E",
    Ề: "E",
    Ế: "E",
    Ể: "E",
    Ễ: "E",
    Ệ: "E",
    Ì: "I",
    Í: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ị: "I",
    Ò: "O",
    Ó: "O",
    Ỏ: "O",
    Õ: "O",
    Ọ: "O",
    Ô: "O",
    Ồ: "O",
    Ố: "O",
    Ổ: "O",
    Ỗ: "O",
    Ộ: "O",
    Ơ: "O",
    Ờ: "O",
    Ớ: "O",
    Ở: "O",
    Ỡ: "O",
    Ợ: "O",
    Ù: "U",
    Ú: "U",
    Ủ: "U",
    Ũ: "U",
    Ụ: "U",
    Ư: "U",
    Ừ: "U",
    Ứ: "U",
    Ử: "U",
    Ữ: "U",
    Ự: "U",
    Ỳ: "Y",
    Ý: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Ỵ: "Y",
  };

  return str
    .split("")
    .map((char) => map[char] || char)
    .join("");
}

/**
 * Convert fullName to username (lowercase, no spaces, no diacritics)
 * E.g., "Nguyễn Thị Thùy" → "nguyenthithuy"
 */
function fullNameToUsername(fullName) {
  return removeVietnameseDiacritics(fullName).replace(/\s+/g, "").toLowerCase();
}

// Teacher data for account creation (matching teacherId from insert-teachers.js)
const teacherAccounts = [
  { teacherId: "1", fullName: "Nguyễn Thị Thùy" },
  { teacherId: "2", fullName: "Trần Thị Bình" },
  { teacherId: "3", fullName: "Lê Hoàng Hường" },
  { teacherId: "4", fullName: "Phạm Thị Dung" },
  { teacherId: "5", fullName: "Lê Ngọc Anh" },
  { teacherId: "6", fullName: "Vũ Thị Hương" },
  { teacherId: "7", fullName: "Trần Minh Anh" },
  { teacherId: "8", fullName: "Bùi Thị Lan" },
  { teacherId: "9", fullName: "Nguyễn An Nhiên" },
  { teacherId: "10", fullName: "Nguyễn Mai Chi" },
  { teacherId: "11", fullName: "Trần Minh Tâm" },
  { teacherId: "12", fullName: "Bùi Quỳnh Anh" },
  { teacherId: "13", fullName: "Đặng Hà My" },
  { teacherId: "14", fullName: "Hoàng Thu Thủy" },
  { teacherId: "15", fullName: "Đỗ Thanh Trúc" },
  { teacherId: "16", fullName: "Vũ Bảo Ngọc" },
  { teacherId: "17", fullName: "Hoàng Thảo Vy" },
  { teacherId: "18", fullName: "Phạm Khánh Linh" },
  { teacherId: "19", fullName: "Phan Gia Hân" },
  { teacherId: "20", fullName: "Trần Phương Anh" },
];

async function insertTeacherAccounts() {
  if (!USERS_TABLE) {
    console.error("Error: USERS_TABLE is not set");
    process.exit(1);
  }

  console.log(
    `Inserting ${teacherAccounts.length} teacher accounts into ${USERS_TABLE}...\n`,
  );

  console.log("=".repeat(80));
  console.log(
    "| Teacher Name".padEnd(30) +
      "| Email".padEnd(36) +
      "| Password".padEnd(16) +
      "|",
  );
  console.log("=".repeat(80));

  for (const teacher of teacherAccounts) {
    const username = fullNameToUsername(teacher.fullName);
    const email = `${username}@gmail.com`;
    const rawPassword = `${username.charAt(0).toUpperCase() + username.slice(1)}@12345`;

    // Hash password with bcryptjs (salt rounds = 10, same as the rest of the app)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const item = {
      userId: uuidv4(),
      email,
      password: hashedPassword,
      fullName: teacher.fullName,
      role: "teacher",
      teacherId: teacher.teacherId,
      createdAt: new Date().toISOString(),
    };

    try {
      await dynamodb
        .put({
          TableName: USERS_TABLE,
          Item: item,
        })
        .promise();

      console.log(
        `| ${teacher.fullName.padEnd(28)}| ${email.padEnd(34)}| ${rawPassword.padEnd(14)}|`,
      );
    } catch (error) {
      console.error(`✗ Failed to insert ${teacher.fullName}:`, error.message);
    }
  }

  console.log("=".repeat(80));
  console.log(`\n✓ Inserted ${teacherAccounts.length} teacher accounts.`);
  console.log("\nAll teachers can now log in via CMS with:");
  console.log("  - Email:    <fullname_no_diacritics>@gmail.com");
  console.log(
    "  - Password: <Fullname_no_diacritics>@12345 (first letter capitalized)",
  );
  console.log("  - Role returned: teacher");
}

// Run the script
insertTeacherAccounts()
  .then(() => {
    console.log("\nScript finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });

//   AWS_PROFILE=canh node scripts/insert-teacher-accounts.js
