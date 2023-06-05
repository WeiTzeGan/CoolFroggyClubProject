INSERT INTO
USERS(first_name, last_name, date_of_birth, user_password, email, mobile)
VALUES('one', 'new', '2005-05-04','asdas' , 'new1@gmail.com', '1234567899');

SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author
FROM ANNOUNCEMENTS
INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id

INNER JOIN CLUB_MEMBERS ON CLUB_MEMBERS.club_id = CLUBS.club_id

WHERE ANNOUNCEMENTS.private_message = 1 AND CLUB_MEMBERS.user_id = ?;

SELECT USERS.email FROM USERS
INNER JOIN CLUB_MEMBERS ON USERS.user_id = CLUB_MEMBERS.user_id
INNER JOIN EMAIL_NOTIF ON USERS.user_id = EMAIL_NOTIF.user_id
WHERE CLUB_MEMBERS.club_id = ? AND EMAIL_NOTIF.news_notif = ?;