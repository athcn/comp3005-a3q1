const sql = require('./db.js');
const prompt = require('prompt-sync')();

/* Returns all the students in the table */
const getAllStudents = async () => {
  const students = await sql`
    SELECT * FROM students;
  `
  
  console.log("");
  console.log("\x1b[36m%s\x1b[0m", "Getting all students");
  console.table(students);
  console.log("");
}

/* Adds a new student into the table */
const addStudent = async (first_name, last_name, email, enrollment_date) => {
  let newStudent = ''
  try {
    /* Dynamically inserting to avoid SQL injection */
    newStudent = await sql`
      INSERT INTO students ${
        sql({ first_name, last_name, email, enrollment_date })
      }

      RETURNING *
    `
  } catch(err) {
    /* Catching Postgres SQL errors using error codes from https://www.postgresql.org/docs/current/errcodes-appendix.html */
    if (err.code === "23505" && err.constraint_name === "students_email_key") {
      console.log("\n\x1b[31m%s \x1b[0m%s", "ERROR:", `Email ${email} already exists (must be unique)`);
    } else if (err.code === "23502" && err.column_name === "first_name") {
      console.log("\n\x1b[31m%s \x1b[0m%s", "ERROR:", `First name can not be null / blank`);
    } else if (err.code === "23502" && err.column_name === "last_name") {
      console.log("\n\x1b[31m%s \x1b[0m%s", "ERROR:", `Last name can not be null / blank`);
    } else if (err.code === "23502" && err.column_name === "email") {
      console.log("\n\x1b[31m%s \x1b[0m%s", "ERROR:", `Email can not be null / blank`);
    } else {
      console.log("\n\x1b[31m%s \x1b[0m", "Unexpected error has occured");
      console.log(err);
    }
  }

  return newStudent;
}

/* Prompts the user for information and formats it to add a new student in */
const promptNewStudent = async () => {
  /* Getting required data to create a new student */
  console.log("\n\x1b[36m%s\x1b[0m", "Adding new student");
  let first_name = prompt("Student First Name (req): ");
  let last_name = prompt("Student Last Name (req): ");
  let email = prompt("Student Email (req): ");
  let enrollment_date = prompt("Enrolled Date (default today): ");

  /* If no date was entered, then just use today's date */
  if (enrollment_date === '') {
    enrollment_date = sql`now()`
  }

  /* Setting blank lines to NULL values for catching errors */ 
  first_name = first_name ? first_name : null;
  last_name = last_name ? last_name : null;
  email = email ? email : null;
  
  /* Attempting to add the new student to table */
  const student = await addStudent(first_name, last_name, email, enrollment_date);
  
  /* Displaying the new student if added */
  if (student) {
    console.log("\n\x1b[36m%s\x1b[0m", "New student added");
    console.table(student);
  }
  console.log();
}

/* Updating a student's email in the table */
const updateStudentEmail = async (student_id, new_email) => {
  let updatedStudent;
  try {
    updatedStudent = await sql`
      UPDATE students SET ${
        sql({ email: new_email }, "email")
      }
      WHERE student_id = ${ student_id }

      RETURNING *
    `
  } catch (err) {
    /* Catching Postgres SQL errors using error codes from https://www.postgresql.org/docs/current/errcodes-appendix.html */
    if (err.code === "23505" && err.constraint_name === "students_email_key") {
      console.log("\n\x1b[31m%s \x1b[0m%s", "ERROR:", `Email ${ new_email } already exists (must be unique)`);
    } else if (err.code === "23502" && err.column_name === "email") {
      console.log("\n\x1b[31m%s \x1b[0m%s", "ERROR:", `Email name can not be null / blank`);
    } else if (err.code === "22P02") {
      console.log("\n\x1b[31m%s \x1b[0m%s", "ERROR:", `Invalid input ${ student_id } for student id`);
    } else {
      console.log("\n\x1b[31m%s \x1b[0m", "Unexpected error has occured");
      console.log(err);
    }
  }

  return updatedStudent;
}

/* Prompts the user for the new email and student id and formats it to request to update it */
const promptUpdateStudentEmail = async () => {
  /* Getting required information in order to update the email */
  console.log("\n\x1b[36m%s\x1b[0m", "Updating student email");
  let student_id = prompt("Student ID (req): ");
  let email = prompt("Student Email (req): ");

  /* Adjusting blank lines to NULL values for error catching */
  student_id = student_id ? student_id : null;
  email = email ? email : null;

  const updatedStudent = await updateStudentEmail(student_id, email);

  /* Displaying the updated student */
  if (updatedStudent) {
    console.log("\n\x1b[36m%s\x1b[0m", "Updated student email");
    console.table(updatedStudent);
  }
  console.log("");
}

/* Deletes an entry in the table with the passed in student ID */
const deleteStudent = async (student_id) => {
  let deletedStudent;
  try {
    deletedStudent = await sql`
      DELETE FROM students
        WHERE student_id = ${ student_id }

      RETURNING *
    `
  } catch (err) {
    if (err.code === "22P02") {
      console.log("\n\x1b[31m%s \x1b[0m%s", "ERROR:", `Invalid input ${ student_id } for student id`);
    } else {
      console.log("\n\x1b[31m%s \x1b[0m", "Unexpected error has occured");
      console.log(err);
    }
  }

  return deletedStudent;
}

/* Prompts the user for the student id that they desire to delete */
const promptDeleteStudent = async () => {
  console.log("\n\x1b[36m%s\x1b[0m", "Deleting student");
  let studentId = prompt("Student ID (req): ")

  /* Adjusting blank line to NULL values for error catching */
  studentId = studentId ? studentId : null;

  const deletedStudent = await deleteStudent(studentId);

  /* Displaying the deleted student */
  if (deletedStudent) {
    console.log("\n\x1b[36m%s\x1b[0m", "Deleted student");
    console.table(deletedStudent);
  }
  console.log("");
}

/* Main UI for the user to control the database */
const mainUi = async () => {
  while (true) {
    console.log("\x1b[4m\x1b[34m%s\x1b[0m","Student Database Management System");
    console.log("1. Get all students");
    console.log("2. Add a student");
    console.log("3. Update student email");
    console.log("4. Delete a student");
    console.log("5. Exit");
    
    userChoice = prompt("Choice: ");

    if (userChoice == '1') {
      await getAllStudents();
    } else if (userChoice === '2') {
      await promptNewStudent();
    } else if (userChoice === '3') {
      await promptUpdateStudentEmail();
    } else if (userChoice === '4') {
      await promptDeleteStudent();
    } else {
      process.exit();
    }
  }
}

mainUi();