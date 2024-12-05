CREATE PROCEDURE CheckUserNameTaken(
    IN username VARCHAR(255)
)
BEGIN
    SELECT COUNT(*) 
    FROM users 
    WHERE users.username = username;
END;

CREATE PROCEDURE CheckMailTaken(
    IN userMail VARCHAR(255)
)
BEGIN
    SELECT COUNT(*) 
    FROM users 
    WHERE email = userMail;
END;
