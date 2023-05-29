CREATE DATABASE coolfroggyclub;

USE coolfroggyclub;

CREATE TABLE ADMINS (
    admin_id SMALLINT NOT NULL AUTO_INCREMENT,
    first_name CHAR(255) NOT NULL,
    last_name CHAR(255) NOT NULL,
    date_of_birth DATE,
    admin_password VARCHAR(60) NOT NULL,
    email VARCHAR(255),
    mobile VARCHAR(20),
    PRIMARY KEY (admin_id)
);

CREATE TABLE USERS (
    user_id SMALLINT NOT NULL AUTO_INCREMENT,
    first_name CHAR(255) NOT NULL,
    last_name CHAR(255) NOT NULL,
    date_of_birth DATE,
    user_password VARCHAR(60) NOT NULL,
    email VARCHAR(255),
    mobile VARCHAR(20),
    PRIMARY KEY (user_id)
);

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE CLUB_MANAGERS (
    manager_id SMALLINT NOT NULL,
    club_id SMALLINT,
    FOREIGN KEY (manager_id) REFERENCES USERS(user_id) ON DELETE CASCADE
    /*FOREIGN KEY (club_id) REFERENCES CLUBS(club_id) ON DELETE SET NULL*/
);

CREATE TABLE CLUBS (
    club_id SMALLINT NOT NULL AUTO_INCREMENT,
    club_name CHAR(255) NOT NULL,
    club_description VARCHAR(1000),
    club_manager_id SMALLINT,
    PRIMARY KEY (club_id),
    FOREIGN KEY (club_manager_id) REFERENCES CLUB_MANAGERS(manager_id) ON DELETE SET NULL
);

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE CLUB_MEMBERS (
    club_id SMALLINT NOT NULL,
    user_id SMALLINT NOT NULL,
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

INSERT INTO CLUBS
(club_name, club_description, club_manager_id)
VALUES
('OCF', 'AAAA', '1');
