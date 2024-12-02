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
    SELECT image_url FROM pictures WHERE user_id = userID ORDER BY position;
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
    WHERE id = _user_id;
    CALL InsertTags(_user_id, _tag1, _tag2, _tag3, _tag4, _tag5);
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

# IMAGE PROCEDURES
# =================================================================================================

# Upload image
CREATE PROCEDURE AddImage(
    _userID INT,
    _position INT,
    _image_url TEXT
)
BEGIN
    IF _position < 1 OR _position > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Position must be between 1 and 5';
    END IF;
    
    INSERT INTO pictures (user_id, position, image_url)
        VALUES (_userID, _position, _image_url);
END //

# DeleteImage
CREATE PROCEDURE DeleteImage(
    _userID INT,
    _position INT
)
BEGIN
    IF _position < 1 OR _position > 5
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Position must be between 1 and 5';
    END IF;
    DELETE FROM pictures WHERE user_id = _userID AND position = _position;
END //

# SwapImages
CREATE PROCEDURE SwapImages(
    _userID INT,
    _position1 INT,
    _position2 INT
)
BEGIN
    IF _position1 < 1 OR _position2 < 1 OR _position1 > 5 OR _position2 > 5
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Position must be between 1 and 5';
    END IF;
    
    UPDATE pictures
    SET position = CASE position
        WHEN _position1 THEN _position2
        WHEN _position2 THEN _position1
        ELSE position
    END
    WHERE user_id = _userID AND position IN (_position1, _position2);
END //

# Get user Images
CREATE PROCEDURE GetUserImage(
    _userID INT,
    _position INT
)
BEGIN
    SELECT image_url FROM pictures WHERE user_id = _userID AND position = _position;
END //

DELIMITER ;