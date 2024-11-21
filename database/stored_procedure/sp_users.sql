DELIMITER //

# GetUser
CREATE PROCEDURE GetUser(IN userID INT)
BEGIN
    SELECT *  FROM users WHERE id = userID;
END //

# GetUserAuthData
CREATE PROCEDURE GetUserAuthData(IN userID INT)
BEGIN
    SELECT username, password, email, birth_date FROM users WHERE id = userID;
END //

# GetUserProfile
CREATE PROCEDURE GetUserProfile(IN userID INT)
BEGIN
    SELECT first_name, last_name, birth_date, gender_id, sexual_orientation, biography, 
           profile_completion_percentage, localisation FROM users WHERE id = userID;
    SELECT * FROM users_tags WHERE user_id = userID;
    SELECT * FROM pictures WHERE user_id = userID;
END //

# CreateUserProfile
CREATE PROCEDURE CreateUserProfile(
    IN userID INT,
    IN _first_name VARCHAR(50),
    IN _last_name VARCHAR(50),
    IN _gender_id INT,
    IN _sexual_orientation INT,
    IN _localisation VARCHAR(100),
    IN _biography VARCHAR(250),
    IN _tag1 INT,
    IN _tag2 INT,
    IN _tag3 INT,
    IN _tag4 INT,
    IN _tag5 INT
)
BEGIN
    UPDATE users
    SET first_name = _first_name, 
        last_name = _last_name, 
        gender_id = _gender_id, 
        sexual_orientation = _sexual_orientation, 
        localisation = _localisation, 
        biography = _biography 
    WHERE id = userID;
    
    CALL InsertTag(userID, _tag1, _tag2, _tag3, _tag4, _tag5);
#   Insert pictures
#   CALL InsertPicture(userID, _image_data);
        
END //

CREATE FUNCTION InsertTag(userID INT, tag1 INT, tag2 INT, tag3 INT, tag4 INT, tag5 INT)
    RETURNS INT
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE currentTag INT;

    -- Declare a cursor to loop through the tags
    DECLARE tagCursor CURSOR FOR
        SELECT tag
            FROM (
                SELECT tag1 AS tag
                UNION ALL SELECT tag2
                UNION ALL SELECT tag3
                UNION ALL SELECT tag4
                UNION ALL SELECT tag5
            ) AS TagList;

    -- Declare a handler for the end of the cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN tagCursor;

    read_loop: LOOP
        FETCH tagCursor INTO currentTag;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Perform the insert or update logic
        IF currentTag IS NOT NULL THEN
            INSERT INTO users_tags (user_id, tag_id)
            VALUES (userID, currentTag)
            ON DUPLICATE KEY UPDATE
                tag_id = VALUES(tag_id);
        END IF;
    END LOOP;

    CLOSE tagCursor;
END //

DELIMITER ;