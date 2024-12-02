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
    SELECT image_data FROM pictures WHERE user_id = userID;
END //

#  InsertTags
CREATE PROCEDURE InsertTags(
    IN userID INT,
    IN tag1 INT,
    IN tag2 INT,
    IN tag3 INT,
    IN tag4 INT,
    IN tag5 INT
)
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

    -- Open the cursor
    OPEN tagCursor;

    -- Loop through the cursor
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

    -- Close the cursor
    CLOSE tagCursor;
END //

# Upload user picture
CREATE PROCEDURE InsertPictures(
    userID INT,
    picture1 MEDIUMBLOB,
    picture2 MEDIUMBLOB,
    picture3 MEDIUMBLOB,
    picture4 MEDIUMBLOB,
    picture5 MEDIUMBLOB
)
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE currentPicture MEDIUMBLOB;

    -- Declare a cursor to loop through the tags
    DECLARE pictureCursor CURSOR FOR
        SELECT picture
        FROM (
             SELECT picture1 AS picture
             UNION ALL SELECT picture2
             UNION ALL SELECT picture3
             UNION ALL SELECT picture4
             UNION ALL SELECT picture5
        ) AS PictureList;

    -- Declare a handler for the end of the cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    OPEN pictureCursor;
    
    read_loop: LOOP
        FETCH pictureCursor INTO currentPicture;
    
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Perform the insert or update logic
        IF currentPicture IS NOT NULL THEN
            INSERT INTO pictures (user_id, image_data)
                VALUES (userID, currentPicture)
                ON DUPLICATE KEY UPDATE
                    image_data = VALUES(image_data);
                END IF;
        END LOOP;
    
    CLOSE pictureCursor;
END //

# CreateUserProfile
CREATE PROCEDURE CreateUserProfile(
    IN _user_id INT,
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
    IN _tag5 INT,
    IN _picture1 MEDIUMBLOB,
    IN _picture2 MEDIUMBLOB,
    IN _picture3 MEDIUMBLOB,
    IN _picture4 MEDIUMBLOB,
    IN _picture5 MEDIUMBLOB
)
BEGIN
    UPDATE users
    SET first_name = _first_name,
        last_name = _last_name,
        gender_id = _gender_id,
        sexual_orientation = _sexual_orientation,
        localisation = _localisation,
        biography = _biography
    WHERE id = _user_id;
    CALL InsertTags(_user_id, _tag1, _tag2, _tag3, _tag4, _tag5);
    CALL InsertPictures(_user_id, _picture1, _picture2, _picture3, _picture4, _picture5);
END //

DELIMITER ;