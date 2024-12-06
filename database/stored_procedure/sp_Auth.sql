DELIMITER //

CREATE PROCEDURE InsertNewAccount(
    IN userName VARCHAR(50),
    IN userPassword VARCHAR(255),
    IN userMail VARCHAR(100),
    IN userBirthDate DATE,
    OUT resultMessage VARCHAR(255)
)
BEGIN
    -- Vérifie si le UserName existe déjà
    IF EXISTS (SELECT 1 FROM db.users WHERE users.username = userName) THEN
        SET resultMessage = 'Error: UserName already exists';
    ELSE
        -- Insère un nouvel utilisateur
        INSERT INTO db.users (username, password, email, birth_date)
        VALUES (userName, userPassword, userMail, userBirthDate);
        SET resultMessage = 'Success: Account created';
    END IF;
END //

CREATE PROCEDURE GetUserPasswordByUsername(IN inputUsername VARCHAR(50))
BEGIN
    SELECT password, salt
    FROM users
    WHERE username = inputUsername;
END //

CREATE PROCEDURE GetUserMailByUsername(IN inputUsername VARCHAR(50))
BEGIN
    SELECT email
    FROM users
    WHERE username = inputUsername;
END //

CREATE PROCEDURE VerifyAccount(IN inputVerifyLink VARCHAR(250))
BEGIN
    SELECT user_id, is_verified, email_verification_link, profile_completed
    FROM users
    WHERE email_verification_link = inputVerifyLink
END //

CREATE PROCEDURE forgotenPasswordLink(IN inputForgotenPasswordLink VARCHAR(250), IN inputUsername)
BEGIN
    UPDATE users
    SET forgoten_password_link = inputForgotenPasswordLink,
        forgoten_password_expiration = NOW() + INTERVAL 1 HOUR
    WHERE email = inputUsername;
END //

DELIMITER ;