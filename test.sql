INSERT INTO
USERS(first_name, last_name, date_of_birth, user_password, email, mobile)
VALUES('one', 'new', '2005-05-04','asdas' , 'new1@gmail.com', '1234567899');

SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author
FROM ANNOUNCEMENTS
INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id

INNER JOIN CLUB_MEMBERS ON CLUB_MEMBERS.club_id = CLUBS.club_id

WHERE ANNOUNCEMENTS.private_message = 1 AND CLUB_MEMBERS.user_id = ?;

SELECT USERS.email, EMAIL_NOTIF.club_id, CLUBS.club_name
FROM ((EMAIL_NOTIF
INNER JOIN USERS
ON USERS.user_id = EMAIL_NOTIF.user_id)
INNER JOIN CLUBS
ON EMAIL_NOTIF.club_id = CLUBS.club_id)
WHERE EMAIL_NOTIF.club_id = ? AND EMAIL_NOTIF.news_notif = 1;

SELECT E.event_id, E.event_name, E.event_message, E.event_date, E.event_location, E.club_id, COUNT(EG.participant_id) AS participant_count
FROM EVENTS E
LEFT JOIN EVENTGOERS EG ON E.event_id = EG.event_id
WHERE E.club_id = 1
GROUP BY E.event_id, E.event_name, E.event_message, E.event_date, E.event_location, E.club_id;


SELECT CLUBS.club_name
FROM CLUBS
INNER JOIN CLUB_MEMBERS ON CLUBS.club_id = CLUB_MEMBERS.club_id
WHERE CLUB_MEMBERS.user_id = 2;

SELECT EVENTS.event_name, EVENTS.event_date, EVENTS.event_location, CLUBS.club_name
FROM EVENTS
INNER JOIN EVENTGOERS ON EVENTS.event_id = EVENTGOERS.event_id
INNER JOIN CLUBS ON EVENTS.club_id = CLUBS.club_id
WHERE EVENTGOERS.participant_id = 2;

SELECT *
FROM EMAIL_NOTIF
where club_id = 2 AND user_id = 2;

INSERT INTO
EMAIL_NOTIF(user_id, club_id, news_notif, event_notif)
VALUES(1,1,1,1);

UPDATE EMAIL_NOTIF
SET news_notif = 1, event_notif = 0
WHERE user_id = 1 AND club_id =1;


