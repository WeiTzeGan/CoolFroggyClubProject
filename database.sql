CREATE DATABASE coolfroggyclub;

USE coolfroggyclub;

CREATE TABLE ADMINS (
    admin_id SMALLINT NOT NULL AUTO_INCREMENT,
    first_name CHAR(255) NOT NULL,
    last_name CHAR(255) NOT NULL,
    date_of_birth DATE,
    admin_password VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(20),
    PRIMARY KEY (admin_id)
);

CREATE TABLE USERS (
    user_id SMALLINT NOT NULL AUTO_INCREMENT,
    first_name CHAR(255) NOT NULL,
    last_name CHAR(255) NOT NULL,
    date_of_birth DATE,
    user_password VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    PRIMARY KEY (user_id, email)
);

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE CLUB_MANAGERS (
    manager_id SMALLINT NOT NULL,
    club_id SMALLINT,
    PRIMARY KEY(manager_id, club_id),
    FOREIGN KEY (manager_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE CLUBS (
    club_id SMALLINT NOT NULL AUTO_INCREMENT,
    club_name CHAR(255) NOT NULL,
    club_description VARCHAR(1000),
    club_manager_id SMALLINT,
    phone VARCHAR(20),
    email VARCHAR(255),
    PRIMARY KEY (club_id),
    FOREIGN KEY (club_manager_id) REFERENCES CLUB_MANAGERS(manager_id) ON DELETE SET NULL,
);

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE CLUB_MEMBERS (
    club_id SMALLINT NOT NULL,
    user_id SMALLINT NOT NULL,
    PRIMARY KEY (club_id, user_id),
    FOREIGN KEY (club_id) REFERENCES CLUBS(club_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE EVENTS (
    event_id SMALLINT NOT NULL AUTO_INCREMENT,
    event_name CHAR(255) NOT NULL,
    event_message VARCHAR(1000),
    event_date DATE NOT NULL,
    event_location CHAR(255) NOT NULL,
    club_id SMALLINT NOT NULL,
    PRIMARY KEY (event_id),
    FOREIGN KEY (club_id) REFERENCES CLUBS(club_id) ON DELETE CASCADE
);

CREATE TABLE EVENTGOERS (
    event_id SMALLINT NOT NULL,
    participant_id SMALLINT NOT NULL,
    PRIMARY KEY (event_id, participant_id),
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE ANNOUNCEMENTS (
    post_id SMALLINT NOT NULL AUTO_INCREMENT,
    title CHAR(255) NOT NULL,
    post_message CHAR(255),
    private_message TINYINT(1) NOT NULL,
    club_id SMALLINT NOT NULL,
    PRIMARY KEY (post_id),
    FOREIGN KEY (club_id) REFERENCES CLUBS(club_id) ON DELETE CASCADE
);

CREATE TABLE PENDING_CLUBS (
    pending_club_id SMALLINT NOT NULL AUTO_INCREMENT,
    club_name CHAR(255) NOT NULL,
    club_description VARCHAR(1000),
    club_manager_id SMALLINT,
    phone VARCHAR(20),
    email VARCHAR(255),
    PRIMARY KEY (pending_club_id),
    FOREIGN KEY (club_manager_id) REFERENCES CLUB_MANAGERS(manager_id) ON DELETE SET NULL
)

INSERT INTO ADMINS
(first_name, last_name, date_of_birth, admin_password, email, mobile)
VALUES
('admin1', 'shinyi', '2003-01-14', 'password123', 'sygoh2014@gmail.com', '0405851384');

INSERT INTO ADMINS
(first_name, last_name, date_of_birth, admin_password, email, mobile)
VALUES
('janson', 'vu', '2003-04-23', 'password123', 'thosvu2@gmail.com', '9999999999');

INSERT INTO USERS
(first_name, last_name, date_of_birth, user_password, email, mobile)
VALUES
('ShinYi', 'G', '2003-01-14', 'password123', 'sygoh2014@gmail.com', '0405851384');

INSERT INTO USERS
(first_name, last_name, date_of_birth, user_password, email, mobile)
VALUES
('janson', 'vu', '2003-04-23', 'password123', 'thosvu2@gmail.com', '9999999999');


INSERT INTO CLUB_MANAGERS
(manager_id, club_id)
VALUES
('1', '1');

INSERT INTO CLUB_MANAGERS
(manager_id, club_id)
VALUES
('2', '2');

INSERT INTO CLUBS
(club_name, club_description, club_manager_id)
VALUES
('OCF', 'AAAA', '1');

INSERT INTO CLUBS
(club_name, club_description, club_manager_id)
VALUES
('AVA', 'BBBB', '2');

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id)
VALUES
('Karaoke', 'Time to sing!', '2023-05-29', 'Lecture Hall', '1');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('1', '1');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('1', '2');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('1', '1');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('1', '2');

INSERT INTO ANNOUNCEMENTS
(title, post_message, private_message, club_id)
VALUES
('Study Session', 'We are having a study session on 16th June, Friday!', '1', '1');

INSERT INTO ANNOUNCEMENTS
(title, post_message, private_message, club_id)
VALUES
('Welcome Night', 'We are having a games night for newcomers on 4th August, Friday!', '0', '1');