DELIMITER //

-- InsertNewAccount
CREATE PROCEDURE InsertNewAccount(
    IN userName VARCHAR(50),
    IN userPassword VARCHAR(255),
    IN userMail VARCHAR(100),
    IN userBirthDate DATE,
    IN verificationLink VARCHAR(255),
    IN verificationLinkExpiration DATETIME,
    IN inputSalt VARCHAR(255),
    OUT resultMessage VARCHAR(255)
)
BEGIN
        INSERT INTO users (username, password, email, birth_date, email_verification_link, email_verification_link_expiration)
        VALUES (userName, userPassword, userMail, userBirthDate, verificationID, verificationIDExpiration);
END //

-- GetUserPasswordByUsername
CREATE PROCEDURE GetUserPasswordByUsername(IN inputUsername VARCHAR(50))
BEGIN
    SELECT id, password, salt
    FROM users
    WHERE username = inputUsername;
END //

-- GetUserMailByUsername
CREATE PROCEDURE GetUserMailByUsername(IN inputUsername VARCHAR(50))
BEGIN
    SELECT email
    FROM users
    WHERE username = inputUsername;
END //

-- getVerificationAccountInfo
CREATE PROCEDURE getVerificationAccountInfo(IN inputVerifyLink VARCHAR(250))
BEGIN
    SELECT id, is_verified, email_verification_link, forgotten_password_link_expiration, email
        FROM users
        WHERE email_verification_link = inputVerifyLink;
END //

-- assertAccountVerification
CREATE PROCEDURE assertAccountVerification (IN user_id INT)
BEGIN
    UPDATE users
        SET is_verified = TRUE WHERE user_id = @userId;
END //

-- forgotenPasswordLink
CREATE PROCEDURE forgotenPasswordLink(
    IN inputForgotenPasswordLink VARCHAR(250), 
    IN inputUsername VARCHAR(100)
)
BEGIN
    UPDATE users
        SET forgotten_password_link = inputForgottenPasswordLink,
            forgotten_password_link_expiration = NOW() + INTERVAL 1 HOUR
        WHERE email = inputUsername;
END //

-- getuserid
CREATE PROCEDURE getuserid (IN inputUsername VARCHAR(255))
BEGIN
    DECLARE userId INT DEFAULT 0;

    SELECT id INTO userId
    FROM users
    WHERE username = inputUsername
    LIMIT 1;

    SELECT userId;
END //

DELIMITER ;
