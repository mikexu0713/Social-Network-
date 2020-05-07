const mysql = require('mysql');
const prompt = require('prompt-sync')({sigint: true});

//Connect to the database "socialnetwork"
let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "socialnetwork"
});

con.connect(function(err) {if (err) throw err;});

//Program Starts
console.log("Welcome to The Social Network.");
(async () => {
	//Ask the user for username
	let usernameCorrect = false;
	let userData = null;
	while(!usernameCorrect){
		let username = prompt('Username: ');
		await new Promise(resolve => {
			con.query(`SELECT * FROM person WHERE username='${username}'`, function (error, r, fields) {
				if(r!=''){
					usernameCorrect=true;
					userData=r[0];
				}else{
					console.log("Entered username cannot be found, please re-enter your username.")
				}
				resolve(r);
			});
			
		});
	}
	
	//Ask the user for password
	let passwordCorrect = false;
	while(!passwordCorrect){
		let password = prompt('Password: ');
		if(password===userData.password)passwordCorrect = true;
	}
	
	MainMenuFunction(userData);
	
})();

async function MainMenuFunction(userData){
	console.log(`\nWelcome, ${userData.fullname} :)`);
	console.log("Please enter number to choose from following options:");
	console.log("1.Personal Information Menu");
	console.log("2.Group Menu");
	console.log("3.Topic Menu");
	console.log("4.Post Menu");

	let menuChoice = prompt('Enter Value: ');
	if(menuChoice == 1){
		PersonalInfoFunction(userData);
	}
	else if(menuChoice == 2){
		GroupMenuFunction(userData);
	}
	else if(menuChoice == 3){
		TopicMenuFunction(userData);
	}
	else if(menuChoice == 4){
		PostMenuFunction(userData);
	}
	else{
		console.log("Input Invalid, please re-enter");
		MainMenuFunction(userData);
	}
}

async function PersonalInfoFunction(userData){
	console.log("  \nYou are now in Personal Infomation Menu")
	console.log("  Please enter number to choose from following options:");
	console.log("  1.Check Personal Info");
	console.log("  2.Check People who I followed");
	console.log("  3.Check People who are following me");
	console.log("  4.Follow Person");
	console.log("  5.Unfollow Person");
	console.log("  6.Return to the previous menu");
	
	let subMenuChoice = prompt('  Enter Value: ');
	if(subMenuChoice == 1){
		console.log('  ------------------------------------');
		console.log(`  Username: ${userData.username}`);
		console.log(`  Full Name: ${userData.fullname}`);
		console.log(`  Sex: ${userData.sex}`);
		console.log(`  Birthdate: ${userData.birthdate}`);
		console.log(`  Vocation: ${userData.vocation}`);
		console.log(`  Religion: ${userData.religion}`);
		console.log('  ------------------------------------');
		PersonalInfoFunction(userData);
	}
	else if(subMenuChoice == 2){
		await new Promise(resolve => {
			con.query(`SELECT personFollowing FROM following WHERE username='${userData.username}'`, function (error, r, fields) {
			console.log('\n  People who I followed:');
			for(let i=0;i<r.length;i++){
				console.log('  '+ r[i].personFollowing);
			}
			resolve(r);
			});
		});
		PersonalInfoFunction(userData);
	}
	else if(subMenuChoice == 3){
		await new Promise(resolve => {
			con.query(`SELECT username FROM following WHERE personFollowing='${userData.username}'`, function (error, r, fields) {
			console.log('\n  People who are following me:');
			for(let i=0;i<r.length;i++){
				console.log('  '+ r[i].username);
			}
			resolve(r);
			});
		});
		PersonalInfoFunction(userData);
	}
	else if(subMenuChoice == 4){
		let username = prompt('    Enter the username of the person you want to follow: ');
		let couldFollow = true;
		
		//Make sure the username exists
		await new Promise(resolve => {
			con.query(`SELECT * FROM person WHERE username='${username}'`, function (error, r, fields) {
			if(r==''){
				couldFollow = false;
				console.log("\nResult: The username does not exist!")
			}
			resolve(r);
			});
		});
		
		//Make sure the username is not already followed
		await new Promise(resolve => {
			con.query(`SELECT * FROM following WHERE username='${userData.username}' AND personfollowing='${username}'`, function (error, r, fields) {
			if(r!=''){
				couldFollow = false;
				console.log("\nResult: You already followed this person!")
			}
			resolve(r);
			});
		});
		
		//Follow the person if the previous constriants are met
		if(couldFollow){
			await new Promise(resolve => {
				con.query(`insert into following values ('${userData.username}','${username}');`, function (error, r, fields) {
				console.log("\nResult: Successfully Followed this person!");
				resolve(r);
				});
			});
		}
		PersonalInfoFunction(userData);
	}
	else if(subMenuChoice == 5){
		let username = prompt('    Enter the username of the person you want to unfollow: ');
		let couldUnfollow = true;
		
		//Make sure the username exists
		await new Promise(resolve => {
			con.query(`SELECT * FROM person WHERE username='${username}'`, function (error, r, fields) {
			if(r==''){
				couldUnfollow = false;
				console.log("\nResult: The username does not exist!")
			}
			resolve(r);
			});
		});
		
		//Make sure the username is followed so it could be unfollowed
		if(couldUnfollow){
			await new Promise(resolve => {
				con.query(`SELECT * FROM following WHERE username='${userData.username}' AND personfollowing='${username}'`, function (error, r, fields) {
				if(r==''){
					couldUnfollow = false;
					console.log("\nResult: You did not follow this person!")
				}
				resolve(r);
				});
			});
		}
		
		//Unfollow the person if the previous constriants are met
		if(couldUnfollow){
			await new Promise(resolve => {
				con.query(`DELETE FROM following WHERE username='${userData.username}' AND personfollowing='${username}';`, function (error, r, fields) {
				console.log("\nResult: Successfully Unfollowed this person!");
				resolve(r);
				});
			});
		}
		
		PersonalInfoFunction(userData);
	}
	else if(subMenuChoice == 6){
		console.log("Returning to main menu");
		MainMenuFunction(userData);
	}
	else{
		console.log("Input Invalid, please re-enter");
		PersonalInfoFunction(userData);
	}
}

async function GroupMenuFunction(userData){
	console.log("  \nYou are now in Group Menu")
	console.log("  Please enter number to choose from following options:");
	console.log("  1.Check Joined Group");
	console.log("  2.Join Group");
	console.log("  3.Create Group");
	console.log("  4.Return to the previous menu");
		
	let subMenuChoice = prompt('  Enter Value: ');
	if(subMenuChoice == 1){
		await new Promise(resolve => {
			con.query(`SELECT groupID,groupname FROM \`group\` WHERE username='${userData.username}'`, function (error, r, fields) {
			console.log('\n  Groups that I joined:');
			for(let i=0;i<r.length;i++){
				console.log(`  Group ID: ${r[i].groupID}, Group Name: ${r[i].groupname}`);
			}
			resolve(r);
			});
		});
		GroupMenuFunction(userData);
	}
	else if(subMenuChoice == 2){
		let groupID = prompt('    Enter the groupID of the group you want to join: ');
		let couldJoin = true;
		let groupInfo = null;
		//Make sure group entered exist
		await new Promise(resolve => {
			con.query(`SELECT * FROM \`group\` WHERE groupID='${groupID}'`, function (error, r, fields) {
			if(r==''){
				couldJoin = false;
				console.log("\nResult: The groupID does not exist!")
			}else{
				groupInfo = r[0];
			}
			resolve(r);
			});
		});
		
		//Make sure the user is not already in the group
		await new Promise(resolve => {
			con.query(`SELECT * FROM \`group\` WHERE username='${userData.username}' AND groupID='${groupID}'`, function (error, r, fields) {
			if(r!=''){
				couldJoin = false;
				console.log("\nResult: You already joined this group!")
			}
			resolve(r);
			});
		});
		
		//Join Group if the previous constriants are met
		if(couldJoin){
			await new Promise(resolve => {
				con.query(`insert into \`Group\` values (${groupInfo.groupID},'${userData.username}','${groupInfo.groupname}');`, function (error, r, fields) {
				console.log("\nResult: Successfully Joined!");
				resolve(r);
				});
			});
		}
		
		GroupMenuFunction(userData);
	}
	else if(subMenuChoice == 3){
		let groupID = prompt('    Please give groupID for the newly created group: ');
		let groupName = prompt('    Please give name for the newly created group: ');
		let couldCreate = true;
		
		//Make sure groupID is not already used by other groups
		await new Promise(resolve => {
			con.query(`SELECT * FROM \`group\` WHERE groupID='${groupID}'`, function (error, r, fields) {
			if(r!=''){
				couldCreate = false;
				console.log("\nResult: this groupID is already used by other groups!")
			}
			resolve(r);
			});
		});
		
		//Create group if constriants are met
		if(couldCreate){
			await new Promise(resolve => {
				con.query(`insert into \`Group\` values (${groupID},'${userData.username}','${groupName}');`, function (error, r, fields) {
				console.log("\nResult: Successfully Created group!");
				resolve(r);
				});
			});
		}
		
		GroupMenuFunction(userData);
	}
	else if(subMenuChoice == 4){
		console.log("Returning to main menu");
		MainMenuFunction(userData);
	}
	else{
		console.log("Input Invalid, please re-enter");
		GroupMenuFunction(userData);
	}
}

async function TopicMenuFunction(userData){
	console.log("  \nYou are now in Topic Menu")
	console.log("  Please enter number to choose from following options:");
	console.log("  1.Check All Topics");
	console.log("  2.Check All Followed Topic");
	console.log("  3.Follow Topic");
	console.log("  4.Unfollow Topic");
	console.log("  5.Return to the previous menu");
		
	let subMenuChoice = prompt('  Enter Value: ');
	if(subMenuChoice == 1){
		await new Promise(resolve => {
			con.query(`SELECT * FROM topic`, function (error, r, fields) {
			console.log('\n  All topics:');
			for(let i=0;i<r.length;i++){
				console.log(`  Topic Name: ${r[i].topicname}, Type: ${r[i].type}`);
			}
			resolve(r);
			});
		});
		TopicMenuFunction(userData);
	}
	else if(subMenuChoice == 2){
		await new Promise(resolve => {
			con.query(`SELECT distinct topic.topicname,\`type\` FROM topicsubscribed RIGHT OUTER JOIN topic 
			ON topicsubscribed.topicname=topic.topicname WHERE username='${userData.username}';`, function (error, r, fields) {
			console.log('\n  Followed topics:');
			for(let i=0;i<r.length;i++){
				console.log(`  Topic Name: ${r[i].topicname}, Type: ${r[i].type}`);
			}
			resolve(r);
			});
		});
		TopicMenuFunction(userData);
	}
	else if(subMenuChoice == 3){
		let topicName = prompt('    Please enter the topic name you want to follow: ');
		let couldFollow = true;
		
		//Make sure topic entered exist
		await new Promise(resolve => {
			con.query(`SELECT * FROM topic WHERE topicname='${topicName}'`, function (error, r, fields) {
			if(r==''){
				couldFollow = false;
				console.log("\nResult: The topic does not exist!")
			}
			resolve(r);
			});
		});
		
		//Make sure the topic is not already followed
		await new Promise(resolve => {
			con.query(`SELECT * FROM topicsubscribed WHERE username='${userData.username}' AND topicname='${topicName}'`, function (error, r, fields) {
			if(r!=''){
				couldFollow = false;
				console.log("\nResult: You already followed this topic!")
			}
			resolve(r);
			});
		});

		//Follow the topic if the previous constriants are met
		if(couldFollow){
			await new Promise(resolve => {
				con.query(`insert into topicsubscribed values ('${topicName}','${userData.username}');`, function (error, r, fields) {
				console.log("\nResult: Successfully Followed this topic!");
				resolve(r);
				});
			});
		}
		TopicMenuFunction(userData);
	}
	else if(subMenuChoice == 4){
		let topicName = prompt('    Please enter the topic name you want to unfollow: ');
		let couldUnfollow = true;
		
		//Make sure topic entered exist
		await new Promise(resolve => {
			con.query(`SELECT * FROM topic WHERE topicname='${topicName}'`, function (error, r, fields) {
			if(r==''){
				couldUnfollow = false;
				console.log("\nResult: The topic does not exist!")
			}
			resolve(r);
			});
		});
		
		//Make sure the topic is followed
		if(couldUnfollow){
			await new Promise(resolve => {
				con.query(`SELECT * FROM topicsubscribed WHERE username='${userData.username}' AND topicname='${topicName}'`, function (error, r, fields) {
				if(r==''){
					couldUnfollow = false;
					console.log("\nResult: You did not follow this topic!")
				}
				resolve(r);
				});
			});
		}
		
		//Unfollow the topic if the previous constriants are met
		if(couldUnfollow){
			await new Promise(resolve => {
				con.query(`DELETE FROM topicsubscribed WHERE username='${userData.username}' AND topicname='${topicName}';`, function (error, r, fields) {
				console.log("\nResult: Successfully Unfollowed this topic!");
				resolve(r);
				});
			});
		}
		TopicMenuFunction(userData);
	}
	else if(subMenuChoice == 5){
		console.log("Returning to main menu");
		MainMenuFunction(userData);
	}
	else{
		console.log("Input Invalid, please re-enter");
		TopicMenuFunction(userData);
	}
}

async function PostMenuFunction(userData){
	console.log("  \nYou are now in Post Menu")
	console.log("  Please enter number to choose from following options:");
	console.log("  1.Check All Posts for Topics Followed");
	console.log("  2.Check New Posts for Topics Followed");
	console.log("  3.Create Post on Topic");
	console.log("  4.Comment on Post");
	console.log("  5.Like/Dislike a Post");
	console.log("  6.Return to the previous menu");
		
	let subMenuChoice = prompt('  Enter Value: ');
	if(subMenuChoice == 1){
		console.log("\n  Displaying all posts for topics followed");
		console.log("  ---------------------------------------------------");
		//NOTE that this command does not mark all unread posts as read for demenstration purposes
		//Run 'command 2: check new posts' instead\n to mark all unread posts as read
		await new Promise(resolve => {
			con.query(`
				SELECT * FROM post right outer join 
				(SELECT topicname FROM topicsubscribed WHERE username='${userData.username}') as subTable
				 on post.topicname = subTable.topicname;
			`, async function (error, r, fields) {
				for(let i=0;i<r.length;i++){
					console.log();
					console.log(r[i]);
					console.log("--Comments-- ");
					await new Promise(resolve => {
						con.query(`SELECT * FROM comment WHERE postID='${r[i].postID} ORDER BY dateposted asc'`, function (error, r2, fields) {
							//console.log(r2);
							for(let i=0;i<r2.length;i++){
								console.log(r2[i]);
							}
							resolve(r2);
						});
					});
				}
				resolve(r);
			});
		});
		PostMenuFunction(userData);
	}
	else if(subMenuChoice == 2){
		console.log("\n  Displaying Unread posts for topics followed");
		console.log("  ---------------------------------------------------");

		await new Promise(resolve => {
			con.query(`
				select * from
(SELECT postID,\`type\`,sub.topicname,posteduser,imagesource,linksource,dateposted,likes,dislikes,title,content FROM post right outer join 
(SELECT topicname FROM topicsubscribed WHERE username='${userData.username}') as sub
on post.topicname = sub.topicname) as t1 right outer join (select * from postread where username = '${userData.username}' and \`read\` = false) as t2
on t1.postID = t2.postID;
			`, async function (error, r, fields) {
				for(let i=0;i<r.length;i++){
					console.log();
					console.log(r[i]);
					console.log("--Comments-- ");
					await new Promise(resolve => {
						con.query(`SELECT * FROM comment WHERE postID='${r[i].postID} ORDER BY dateposted asc'`, function (error, r2, fields) {
							for(let i=0;i<r2.length;i++){
								console.log(r2[i]);
							}
							if(r2.length!=0){
								console.log("All posts are now marked as read.");
							}
							resolve(r2);
						});
					});
				}
				//Mark all posts subscribed as read
				await new Promise(resolve => {
					con.query(`UPDATE postread SET \`read\`=true WHERE username='${userData.username}'`, function (error, r3, fields) {
						resolve(r3);
					});
				});
				resolve(r);
			});
		});
		PostMenuFunction(userData);
	}
	else if(subMenuChoice == 3){
		let topicCorrect = true;
		let topicName = prompt('  Enter the Topic Name you want to post to: ');
		//Check if the topic actually exist
		await new Promise(resolve => {
			con.query(`SELECT * FROM topic WHERE topicname='${topicName}'`, function (error, r, fields) {
			if(r==''){
				console.log("\nResult: this topic name does not exist!");
				topicCorrect = false;
			}
			resolve(r);
			});
		});
		if(topicCorrect){
			let postName = prompt('  Enter the title of the post you want to make: ');
			let content = prompt('  Enter the content of the post: ');
			let insertSuccess = true;
			
			await new Promise(resolve => {
				con.query(`
				INSERT INTO post(\`type\`,\`topicname\`,\`posteduser\`,\`imagesource\`,\`linksource\`,\`dateposted\`,\`likes\`,\`dislikes\`,\`title\`,\`content\`) 
				VALUES ('text','${topicName}','${userData.username}',null,null,now(),0,0,'${postName}','${content}')
				`, function (error, r, fields) {
				console.log(`\nResult: New post added for topic ${topicName}`);
				insertSuccess = true;
				resolve(r);
				});
			});
			
			let insertedPostID; 
			if(insertSuccess){
				await new Promise(resolve => {
					con.query(`SELECT * FROM post ORDER BY postID desc LIMIT 1`, function (error, r, fields) {
					insertedPostID = r[0].postID;
					resolve(r);
					});
				});
				
				//Notify users who subscribed to the topic
				await new Promise(resolve => {
					con.query(`SELECT username FROM topicsubscribed where topicname='${topicName}'`, async function (error, r, fields) {
					for(let i=0;i<r.length;i++){
						let username = r[i].username;
						await new Promise(resolve => {
							con.query(`INSERT INTO postread VALUES ('${username}',${insertedPostID},false,'None')`, function (error, r2, fields){
								resolve(r2);
							});
						});
					}
					console.log(`Result: Users who subscribed to topic '${topicName}' are notified of this new post.`);
					resolve(r);
					});
				});
			}
		}
		PostMenuFunction(userData);
	}
	else if(subMenuChoice == 4){
		postIDCorrect = true;
		let postID = prompt('  Enter the PostID of the post you want to comment on: ');
		//Check if the postID actually exist
		await new Promise(resolve => {
			con.query(`SELECT * FROM post WHERE postID='${postID}'`, function (error, r, fields) {
			if(r==''){
				console.log("\nResult: this postID does not exist!");
				postIDCorrect = false;
			}
			resolve(r);
			});
		});
		if(!postIDCorrect) PostMenuFunction(userData);
		
		let insertSuccess = false;
		//Add comment to post
		let commentContent = prompt('  Enter the comment content: ');
		await new Promise(resolve => {
			con.query(`INSERT INTO comment (postID,dateposted,posteduser,content) VALUES
			(${postID},now(),'${userData.username}','${commentContent}')
			`, function (error, r, fields) {
				console.log(`\nResult: Comment added for postID ${postID}`);
				insertSuccess = true;
				resolve(r);
			});
		});
		
		//Notify users who subscribed to the topic
		let topicName; 
		if(insertSuccess){
			await new Promise(resolve => {
				con.query(`SELECT topicname FROM post WHERE postID = 1;`, function (error, r, fields) {
				topicName = r[0].topicname;
				resolve(r);
				});
			});
			
			//Notify users who subscribed to the topic
			await new Promise(resolve => {
				con.query(`SELECT username FROM topicsubscribed where topicname='${topicName}'`, async function (error, r, fields) {
				for(let i=0;i<r.length;i++){
					let username = r[i].username;
					await new Promise(resolve => {
						con.query(`UPDATE postread SET \`read\`=false WHERE username='${username}' AND postID=${postID}`, function (error, r2, fields){
							resolve(r2);
						});
					});
				}
				console.log(`Result: Users who subscribed to topic '${topicName}' are notified of this new post.`);
				resolve(r);
				});
			});
		}
		
		PostMenuFunction(userData);
	}
	else if(subMenuChoice == 5){
		postIDCorrect = true;
		let postID = prompt('  Enter the PostID of the post you like or dislike: ');
		//Check if the postID actually exist
		await new Promise(resolve => {
			con.query(`SELECT * FROM post WHERE postID='${postID}'`, function (error, r, fields) {
			if(r==''){
				console.log("\nResult: this postID does not exist!");
				postIDCorrect = false;
			}
			resolve(r);
			});
		});
		if(!postIDCorrect) PostMenuFunction(userData);
		
		//Like or Dislike
		let action = prompt('  Please Enter \'Like\',\'Dislike\' for the post you chose: ');
		
		//Get the current like/dislike status from database
		let likeRecord;
		await new Promise(resolve => {
			con.query(`SELECT status FROM postread WHERE postID=${postID} AND username='${userData.username}';`, function (error, r, fields) {
				likeRecord = r[0].status;
				resolve(r);
			});
		});
		
		if(action == 'Like'){
			if(likeRecord == 'Like'){
				console.log("\nResult: You already liked this post!");
			}
			else if(likeRecord == 'Dislike'){
				//Update PostRead Table
				await new Promise(resolve => {
					con.query(`UPDATE postread SET status='Like' WHERE postID=${postID} AND username='${userData.username}';`, function (error, r2, fields) {
						resolve(r2);
					});
					
				});
				//Update Post Table
				await new Promise(resolve => {
					con.query(`UPDATE post SET likes=likes+1, dislikes=dislikes-1 WHERE postID=${postID};`, function (error, r3, fields) {
						resolve(r3);
					});
				});
				console.log("\nResult: Success, Now you liked this post!");
			}
			else if(likeRecord == 'None'){
				//Update PostRead Table
				await new Promise(resolve => {
					con.query(`UPDATE postread SET status='Like' WHERE postID=${postID} AND username='${userData.username}';`, function (error, r2, fields) {
						resolve(r2);
					});
				});
				//Update Post Table
				await new Promise(resolve => {
					con.query(`UPDATE post SET likes=likes+1 WHERE postID=${postID};`, function (error, r3, fields) {
						resolve(r3);
					});
				});
				console.log("\nResult: Success, Now you liked this post!");
			}
		}	
		else if(action == 'Dislike'){
			console.log('dislike this post')
			if(likeRecord == 'Dislike'){
				console.log("\nResult: You already disliked this post!")
			}
			else if(likeRecord == 'Like'){
				//Update PostRead Table
				await new Promise(resolve => {
					con.query(`UPDATE postread SET status='Dislike' WHERE postID=${postID} AND username='${userData.username}';`, function (error, r2, fields) {
						resolve(r2);
					});
					
				});
				//Update Post Table
				await new Promise(resolve => {
					con.query(`UPDATE post SET likes=likes-1, dislikes=dislikes+1 WHERE postID=${postID};`, function (error, r3, fields) {
						resolve(r3);
					});
				});
				console.log("\nResult: Success, Now you disliked this post!");
			}
			else if(likeRecord == 'None'){
				//Update PostRead Table
				await new Promise(resolve => {
					con.query(`UPDATE postread SET status='Disike' WHERE postID=${postID} AND username='${userData.username}';`, function (error, r2, fields) {
						resolve(r2);
					});
				});
				//Update Post Table
				await new Promise(resolve => {
					con.query(`UPDATE post SET dilikes=dislikes+1 WHERE postID=${postID};`, function (error, r3, fields) {
						resolve(r3);
					});
				});
				console.log("\nResult: Success, Now you disliked this post!");
			}
		}
		else{
			console.log("\nResult: Input Invalid.");
		}
		PostMenuFunction(userData);
	}
	else if(subMenuChoice == 6){
		console.log("Returning to main menu");
		MainMenuFunction(userData);
	}
	else{
		console.log("Input Invalid, please re-enter");
		PostMenuFunction(userData);
	}
}