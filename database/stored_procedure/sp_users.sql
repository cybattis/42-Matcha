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

# UpdateUserProfile
CREATE PROCEDURE UpdateUserProfile(
    IN _user_id INT,
    IN _first_name VARCHAR(50),
    IN _last_name VARCHAR(50),
    IN _gender_id INT,
    IN _sexual_orientation INT,
    IN _localisation VARCHAR(100),
    IN _biography VARCHAR(250)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;
    
    SELECT 
        COUNT(first_name != '') +
        COUNT(last_name != '') +
        COUNT(biography != '') AS before_count
        FROM users WHERE id = _user_id;
    
    UPDATE users SET first_name = _first_name 
                 WHERE id = _user_id AND first_name != _first_name;
    
    UPDATE users SET last_name = _last_name 
                 WHERE id = _user_id AND last_name != _last_name;
    
#     IF (SELECT COUNT(users.gender_id) FROM users WHERE id = _user_id) = 0 THEN
#         UPDATE users SET gender_id = _gender_id 
#                      WHERE id = _user_id AND gender_id != _gender_id;
#     ELSE
#         INSERT INTO users (_user_id, gender_id)
#             VALUES (_userID, _gender_id);
    
    UPDATE users SET sexual_orientation = _sexual_orientation 
                 WHERE id = _user_id AND sexual_orientation != _sexual_orientation;
    
    UPDATE users SET localisation = _localisation 
                 WHERE id = _user_id AND localisation != _localisation;
    
    UPDATE users SET biography = _biography 
                 WHERE id = _user_id AND biography != _biography;

    SELECT
        COUNT(first_name != '') +
        COUNT(last_name != '') +
        COUNT(biography != '') AS after_count
        FROM users WHERE id = _user_id;
    
    UPDATE users SET profile_completion_percentage = profile_completion_percentage + (@after_count - @before_count) * 5
                 WHERE id = _user_id;
    
    COMMIT;
    
END //

#  InsertTags
CREATE PROCEDURE UpdateTag(
    IN _userID INT,
    IN _tagID INT
)
BEGIN
    SELECT COUNT(*) INTO @count
    FROM users_tags
    WHERE user_id = _userID AND tag_id = _tagID;
    
    IF @count = 0 THEN
        INSERT INTO users_tags (user_id, tag_id)
            VALUES (_userID, _tagID);
        UPDATE users
            SET profile_completion_percentage = profile_completion_percentage + 5
            WHERE id = _userID;
    ELSE
        DELETE FROM users_tags
        WHERE user_id = _userID AND tag_id = _tagID;
        UPDATE users
            SET profile_completion_percentage = profile_completion_percentage - 5
            WHERE id = _userID;
    END IF;
END //
    
# IMAGE PROCEDURES
# =================================================================================================

# Upload image
CREATE PROCEDURE UploadImage(
    IN _userID INT,
    IN _position INT,
    IN _image_url TEXT
)
BEGIN
    IF _position < 1 OR _position > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Position must be between 1 and 5';
    END IF;
    
    INSERT INTO pictures (user_id, position, image_url)
        VALUES (_userID, _position, _image_url);

    UPDATE users
        SET profile_completion_percentage = profile_completion_percentage + 10
        WHERE id = _userID;
END //

# DeleteImage
CREATE PROCEDURE DeleteImage(
    IN _userID INT,
    IN _position INT
)
BEGIN
    IF _position < 1 OR _position > 5
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Position must be between 1 and 5';
    END IF;
    DELETE FROM pictures WHERE user_id = _userID AND position = _position;
    
    UPDATE users
        SET profile_completion_percentage = profile_completion_percentage - 10
        WHERE id = _userID;
END //

# SwapImages
CREATE PROCEDURE SwapImages(
    IN _userID INT,
    IN _position1 INT,
    IN _position2 INT
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
    IN _userID INT,
    IN _position INT
)
BEGIN
    SELECT 1
    FROM pictures
    WHERE user_id = _userID AND position = _position;
END //

DELIMITER ;