CREATE DATABASE coolfroggyclub;

USE coolfroggyclub;

CREATE TABLE Admins (
    admin_id SMALLINT NOT NULL AUTO_INCREMENT,
    first_name CHAR(255) NOT NULL,
    last_name CHAR(255) NOT NULL,
    date_of_birth DATE,
    admin_password VARCHAR(60) NOT NULL,
    email VARCHAR(255),
    mobile VARCHAR(20),
    PRIMARY KEY (admin_id)
);

CREATE TABLE Clubs (
    club_id SMALLINT NOT NULL AUTO_INCREMENT,
    club_name CHAR(255) NOT NULL,
    club_description VARCHAR(1000),
    club_manager_id SMALLINT,
    PRIMARY KEY (club_id),
    FOREIGN KEY (club_manager_id) REFERENCES Club_Managers(manager_id) ON DELETE SET NULL
);

CREATE TABLE Club_Managers (
    manager_id SMALLINT NOT NULL,
    club_id SMALLINT NOT NULL,
    FOREIGN KEY (manager_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id) ON DELETE SET NULL
);

CREATE TABLE Club_Members (
    club_id SMALLINT NOT NULL,
    user_id SMALLINT NOT NULL,
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Events (
    event_id SMALLINT NOT NULL AUTO_INCREMENT,
    event_name CHAR(255) NOT NULL,
    event_message VARCHAR(1000),
    event_date DATE NOT NULL,
    event_location CHAR(255) NOT NULL,
    club_id SMALLINT NOT NULL,
    PRIMARY KEY (event_id),
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id) ON DELETE CASCADE
);

CREATE TABLE Event_Participants (
    event_id SMALLINT NOT NULL,
    participant_id SMALLINT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Member_Announcements (
    post_id SMALLINT NOT NULL AUTO_INCREMENT,
    title CHAR(255) NOT NULL,
    post_message CHAR(1000),
    private_message TINYINT(1) NOT NULL,
    club_id SMALLINT NOT NULL,
    PRIMARY KEY (post_id),
    FOREIGN KEY (club_id) REFERENCES Clubs(club_id) ON DELETE CASCADE
);

CREATE TABLE Users (
    user_id SMALLINT NOT NULL AUTO_INCREMENT,
    first_name CHAR(255) NOT NULL,
    last_name CHAR(255) NOT NULL,
    date_of_birth DATE,
    user_password VARCHAR(60) NOT NULL,
    email VARCHAR(255),
    mobile VARCHAR(20),
    PRIMARY KEY (user_id)
);