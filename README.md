## Information
**Student Name:** Young-hoon Kim

**Student ID:** 101286836

This is my submission for Question 1 in Assignment 3 for **COMP 3005**

#### Demonstration Video
https://youtu.be/SEF9eTNcQuk

## Setup
#### Downloading Required Libraries / Files
This project requires you to have Javascript / Node.js which can be acquired [here](https://nodejs.org/en/download/current)

Clone this repository and while in the directory run the following command which should install the required libraries for the application to run
```
npm install
```

#### Creating the Database & Table with default data
Afterwards, you can create the databases in pg4Admin with the following queries

Creating the table on pg4admin inside a **students** database with the following query,
```sql
CREATE TABLE IF NOT EXISTS students (
	student_id			SERIAL	PRIMARY KEY,
	first_name			TEXT	NOT NULL,
	last_name			TEXT	NOT NULL,
	email				TEXT	UNIQUE NOT NULL,
	enrollment_date		DATE
);
```

Inserting the following data (initial data provided by assignment instructions),
```sql
INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES
  ('John', 'Doe', 'john.doe@example.com', '2023-09-01'),
  ('Jane', 'Smith', 'jane.smith@example.com', '2023-09-01'),
  ('Jim', 'Beam', 'jim.beam@example.com', '2023-09-02');
```

After you set up the database and table with relevant data you need to modify the **db.js** file in order for the application to properly link to your database.
```
/* Change these contents to reroute the postgres connection*/
const postgresUrl = {
  host                 : 'localhost',             // Postgres ip address[es] or domain name[s]
  port                 : 5432,                    // Postgres server port[s]
  database             : '',                      // Name of database to connect to
  username             : 'postgres',              // Username of database user
  password             : '',                      // Password of database user 
}
```

#### Running the Program
To run the program just run the following command in the directory of the files, (may need to correct the path depending if you are on mac/windows/linux)
```
node .\application.js
```
A text menu should appear in the console that will allow you to navigate through the needed functions.
