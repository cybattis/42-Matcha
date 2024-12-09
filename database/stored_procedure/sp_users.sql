DELIMITER //

# GetUser
CREATE PROCEDURE GetUserByID(IN userID INT)
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
    IN userID INT,
    IN firstName VARCHAR(50),
    IN lastName VARCHAR(50),
    IN genderID INT,
    IN sexualOrientation INT,
    IN localisation VARCHAR(100),
    IN biography VARCHAR(250)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;
    
    START TRANSACTION;

    UPDATE users SET first_name = firstName 
                 WHERE id = userID AND first_name != firstName;
    
    UPDATE users SET last_name = lastName 
                 WHERE id = userID AND last_name != lastName;
    
    UPDATE users SET gender_id = genderID 
                 WHERE id = userID;

    UPDATE users SET users.sexual_orientation = sexualOrientation 
                 WHERE id = userID;
    
    UPDATE users SET users.localisation = localisation 
                 WHERE id = userID AND users.localisation != localisation;
    
    UPDATE users SET biography = biography 
                 WHERE id = userID AND users.biography != biography;
    
    COMMIT;

    CALL UpdateProfileCompletionPercentage(userID);
END //

# UpdateProfileCompletionPercentage
CREATE PROCEDURE UpdateProfileCompletionPercentage(IN userID INT)
BEGIN
    SELECT COUNT(*) INTO @tags_count FROM users_tags WHERE user_id = userID;
    SELECT COUNT(*) INTO @images_count FROM pictures WHERE user_id = userID;

    SELECT
        COUNT(CASE WHEN first_name IS NOT NULL AND first_name != '' THEN 1 END) AS first_name_non_empty,
        COUNT(CASE WHEN last_name IS NOT NULL AND last_name != '' THEN 1 END) AS last_name_non_empty,
        COUNT(CASE WHEN biography IS NOT NULL AND biography != '' THEN 1 END) AS biography_non_empty
    FROM users WHERE id = userID INTO @first_name, @last_name, @biography;

    SET @percentage = @tags_count * 4 + @images_count * 10 + (@first_name + @last_name + @biography) * 10;
    SELECT @percentage;
    
    UPDATE users SET profile_completion_percentage = @percentage WHERE id = userID;
END //

#  InsertTags
CREATE PROCEDURE UpdateTag(
    IN userID INT,
    IN tagID INT
)
BEGIN
    SELECT COUNT(*) INTO @count
    FROM users_tags
    WHERE user_id = userID AND tag_id = tagID;
    
    IF @count = 0 THEN
        INSERT INTO users_tags (user_id, tag_id)
            VALUES (userID, tagID);
    ELSE
        DELETE FROM users_tags
        WHERE user_id = userID AND tag_id = tagID;
    END IF;
    CALL UpdateProfileCompletionPercentage(userID);
END //
    
# IMAGE PROCEDURES
# =================================================================================================

# Upload image
CREATE PROCEDURE UploadImage(
    IN userID INT,
    IN position INT,
    IN imageUrl TEXT
)
BEGIN
    IF position < 1 OR position > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Position must be between 1 and 5';
    END IF;
    
    INSERT INTO pictures (user_id, pictures.position, image_url)
        VALUES (userID, position, imageUrl);
    CALL UpdateProfileCompletionPercentage(userID);
END //

# DeleteImage
CREATE PROCEDURE DeleteImage(
    IN userID INT,
    IN position INT
)
BEGIN
    IF position < 1 OR position > 5
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Position must be between 1 and 5';
    END IF;
    
    DELETE FROM pictures WHERE user_id = userID AND pictures.position = position;
    CALL UpdateProfileCompletionPercentage(userID);
END //

# SwapImages
CREATE PROCEDURE SwapImages(
    IN userID INT,
    IN position1 INT,
    IN position2 INT
)
BEGIN
    IF position1 < 1 OR position2 < 1 OR position1 > 5 OR position2 > 5
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Position must be between 1 and 5';
    END IF;
    
    UPDATE pictures
    SET position = CASE position
        WHEN position1 THEN position2
        WHEN position2 THEN position1
        ELSE position
    END
    WHERE user_id = userID AND position IN (position1, position2);
END //

# Get user Images
CREATE PROCEDURE GetUserImage(
    IN userID INT,
    IN position INT
)
BEGIN
    SELECT image_url
    FROM pictures
    WHERE user_id = userID AND pictures.position = position;
END //

DELIMITER ;