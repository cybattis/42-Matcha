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
    IF EXISTS (SELECT 1 FROM accounts WHERE username = userName) THEN
        SET resultMessage = 'Error: UserName already exists';
    ELSE
        -- Insère un nouvel utilisateur
        INSERT INTO accounts (username, password, mail, birthdate)
        VALUES (userName, userPassword, userMail, userBirthDate);
        SET resultMessage = 'Success: Account created';
    END IF;
END //

CREATE PROCEDURE GetUserByUsername(IN inputUsername VARCHAR(50))
BEGIN
    SELECT password, salt
    FROM users
    WHERE username = inputUsername;
END //

DELIMITER ;