CREATE PROCEDURE CheckUserNameTaken(
    IN username VARCHAR(255)
)
BEGIN
    SELECT COUNT(*) 
    FROM Users 
    WHERE UserName = username;
END;

CREATE PROCEDURE CheckMailTaken(
    IN userMail VARCHAR(255)
)
BEGIN
    SELECT COUNT(*) 
    FROM Users 
    WHERE Mail = userMail;
END;
