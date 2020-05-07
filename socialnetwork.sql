CREATE DATABASE  IF NOT EXISTS `socialnetwork`;
USE `socialnetwork`;

drop table if exists `Comment`;
drop table if exists `TopicSubscribed`;
drop table if exists `PostRead`;
drop table if exists `Group`;
drop table if exists `Following`;
drop table if exists `Person`;
drop table if exists `Topic`;
drop table if exists `Post`;

create table `Person`(
	`username` char(10),
	`fullname` char(30), 
	`sex` char(6),
	`birthdate` date,
	`vocation` char(20),
	`religion` char(20),
    `password` char(20),
	primary key(username)
);

insert into `Person` values 
	('my6xu', 'Ming Xu', 'Male', '1997-10-10', 'Student', 'None', 'password' ),
    ('a224liu' , 'Andrew Liu', 'Male', '1998-2-3', 'Software developer', 'Christianity', 'password2'),
	('e22tran' , 'Emma Tran', 'Female', '1997-4-23', 'Web developer', 'Christianity', 'password3' ),
	('k23wang', 'Kara Wang', 'Female', '1996-11-12', 'Electrical engineer', 'Buddhism', 'password4');
    
create table `Topic`(
	`topicname` char(20),
    `type` char(10),
    primary key(topicname)
);

insert into Topic values
	('Politics','Main'),
    ('Canadian Politics','Sub'),
    ('Toronto Politics','Sub-sub'),
    ('Sports','Main'),
    ('Business','Main');
    
create table `Post`(
	`postID` int NOT NULL AUTO_INCREMENT,
    `type` char(10),
    `topicname` char(20),
    `posteduser` char(10),
    `imagesource`char(100),
    `linksource` char(100),
    `dateposted` datetime,
    `likes` int,
    `dislikes` int,
    `title` char(100), 
    `content` char(250),
    primary key(postID)
);

insert into `Post` (`type`,`topicname`,`posteduser`,`imagesource`,`linksource`,`dateposted`,`likes`,`dislikes`,`title`,`content`) values
	('text','Sports','k23wang',NULL,NULL, '2017-1-13 23:12:20',1,1,'How Japan is preparing for the 2020 Olympics',
    'I am pretty sure that everybody is getting psyched about the 2020 . ...... So, are you coming to Japan?'),
    ('image','Business','e22tran','https://miro.medium.com/max/3792/1*TEQmP1n0DKk3pUq_KQDbQg@2x.jpeg',NULL, '2018-11-22 08:43:08',0,0,'Why (oh why) did Bitcoin crash just in time for Thanksgiving?',
    'It’s not hard to think there are lots of stony silences. ...... until they remember the conversations from Thanksgiving 2018.'),
    ('link','Canadian Politics','k23wang',NULL,'https://www.macleans.ca/politics/ottawa/canadian-politics-in-2018-the-year-in-12-chapters/', '2018-12-27 12:03:07',0,0,'Canadian politics in 2018',
    'Of the dozen countries Prime Minister Justin Trudeau visited. ......  would be to exploit every remaining opportunity to rest up.');
    
create table `Comment`(
	`commentID` int NOT NULL AUTO_INCREMENT,
    `postID` int,
    `dateposted` datetime,
    `posteduser` char(10),
    `content` char(250),
    primary key(commentID),
    foreign key (posteduser) references Person(username),
    foreign key (postID) references Post(postID)
);
	
insert into `Comment` (`postID`,`dateposted`,`posteduser`,`content`) values
	(1,'2017-1-14 03:27:09','a224liu','Can someone tell me which city in Japan held the Olympics?'),
    (1,'2017-1-15 16:58:33','k23wang','Tokyo, the capital of Japan.'),
    (2,'2018-11-22 18:20:13','a224liu','I am out, I think it bitcoin will crash again soon.'),
    (3,'2018-12-29 14:01:01','e22tran','Trudeau, he is fine I guess...');
    
create table `TopicSubscribed`(
	`topicname` char(20),
    `username` char (10),
    primary key(topicname,username),
	foreign key (username) references Person(username),
	foreign key (topicname) references Topic(topicname)
);

insert into `TopicSubscribed` values
	('Sports','k23wang'),
    ('Sports','a224liu'),
    ('Sports','my6xu'),
    ('Business','my6xu'),
    ('Business','e22tran'),
    ('Business','a224liu'),
    ('Canadian Politics','k23wang'),
    ('Canadian Politics','e22tran');

create table `PostRead`(
	`username` char(10),
    `postID` int,
    `read` bool,
    `status` char(10),
    primary key(username,postID),
    foreign key (username) references Person(username),
    foreign key (postID) references Post(postID)
);

insert into `PostRead` values
	('k23wang',1,true,'None'),
    ('k23wang',3,true,'None'),
    ('my6xu',1,false,'Dislike'),
    ('my6xu',2,true,'None'),
    ('e22tran',2,true,'None'),
    ('e22tran',3,true,'None'),
    ('a224liu',1,true,'Like'),
    ('a224liu',2,true,'None');
    
create table `Group`(
	`groupID` int,
    `username` char(10),
    `groupname` char(50),
    primary key(groupID,username),
	foreign key (username) references Person(username)
);

insert into `Group` values
	(1001,'e22tran','Bitcoin Discussion'),
    /*(1001,'my6xu','Bitcoin Discussion'),*/
    (1001,'a224liu','Bitcoin Discussion');
    
create table `Following`(
	`username` char(10),
    `personFollowing` char(10),
    primary key(username,personFollowing),
    foreign key (username) references Person(username)
);

insert into `Following` values
	('e22tran','a224liu'),
    ('a224liu','e22tran'),
	('a224liu','k23wang'),
    ('my6xu','k23wang'),
    ('k23wang','my6xu'),
    ('a224liu','my6xu');