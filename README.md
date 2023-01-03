# Social Network Project

## Getting Started

This project is written in JavaScript, and the runtime environment is Node.JS.

### Prerequisites and Installing

To run the project, download Node.JS and NPM (Node Package Manager). 
Go to Google and search for download Node.jS, follow the procedure for the setup and finish installation.

Next run the following commands on Command Prompt in the folder where "socialnetwork.sql" exist
```
npm i mysql
```
and
```
npm i prompt-sync
```
to install the only two librarys/modules required for this project.

### Database Setup

The next thing is to set up the database, simply import "socialnetwork.sql" to MySQL and execute the script

## Start the program

Now with enviroment and database being set up, run
```
node project.js
```
on command line to start the program (project.js is the code/file needs to be executed)

### Test Menu and its Functions
The following is the interface and menu for the program:

Menu option: 
	1. Personal Information
	2. Group Menu
	3. Topic Menu 
	4. Post Menu
	
1. Personal Information
	1. Check Personal Info
	2. Check People who I Followed
	3. Check People who are Following me
	4. Follow Person
	5. Unfollow Person
	6. Return to the previous menu

2. Group Menu
	1. Check Joined Group
	2. Join Group
	3. Create Group
	4. Return to the previous menu

3. Topic Menu
	1. Check All Topics
	2. Check All Followed Topic
	3. Follow Topic	
	4. Unfollow Topic
	5. Return to the previous menu

4. Post Menu
	1. Check All Posts of Topics Followed
	2. Check New Posts of Topics Followed
	3. Create Post on Topic
	4. Comment on Post
	5. Like/Dislike a Post
	6. Return to the previous menu
