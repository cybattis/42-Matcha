DELIMITER //

# GetUserProfile
CREATE PROCEDURE GetUserProfile(IN username VARCHAR(50))
BEGIN   
    SELECT id INTO @userID FROM users WHERE users.username = username;
    
    SELECT first_name, last_name, birth_date, gender_id, sexual_orientation, biography,
           profile_completion_percentage, ST_AsText(coordinates) AS coordinates, fame, is_verified, profile_completion_percentage, 
           profile_status, users.address, users.username
    FROM users WHERE users.id = @userID;

    SELECT name, id FROM tags WHERE id IN (SELECT tag_id FROM users_tags WHERE user_id = @userID);
    SELECT image_url FROM pictures WHERE user_id = @userID ORDER BY position;
END //

CREATE PROCEDURE GetUserProfileStatus(IN userID INT)
BEGIN
    SELECT profile_status
        FROM users WHERE id = userID;
END //

# UpdateUserProfile
CREATE PROCEDURE UpdateUserProfile(
    IN userID INT,
    IN firstName VARCHAR(50),
    IN lastName VARCHAR(50),
    IN genderID INT,
    IN sexualOrientation INT,
    IN coordinates VARCHAR(50),
    IN biography VARCHAR(250),
    IN address VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;
    
    START TRANSACTION;

    UPDATE users SET users.first_name = firstName 
                 WHERE id = userID AND first_name != firstName;
    
    UPDATE users SET users.last_name = lastName 
                 WHERE id = userID AND last_name != lastName;
    
    UPDATE users SET users.gender_id = genderID 
                 WHERE id = userID;

    UPDATE users SET users.sexual_orientation = sexualOrientation 
                 WHERE id = userID;
     
    UPDATE users SET users.coordinates = POINT(
            CAST(SUBSTRING_INDEX(coordinates, ',', 1) AS DECIMAL(10,6)),
            CAST(SUBSTRING_INDEX(coordinates, ',', -1) AS DECIMAL(10,6))
         )
         WHERE id = userID;
    
    UPDATE users SET users.biography = biography 
                 WHERE id = userID AND users.biography != biography;
    
    UPDATE users SET users.address = address 
                 WHERE id = userID AND users.address != address;
    
    COMMIT;

    SELECT users.profile_status INTO @profile_status FROM users WHERE id = userID;
    IF @profile_status = 0 THEN
        UPDATE users SET profile_status = 1 WHERE id = userID;
    END IF;

    CALL UpdateProfileCompletionPercentage(userID);
END //

CREATE PROCEDURE UpdateProfileStatus(
    IN userID INT,
    IN status INT
)
BEGIN
    UPDATE users SET profile_status = status WHERE id = userID;
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

# TAGS PROCEDURES
# =================================================================================================

CREATE PROCEDURE GetAllTags()
BEGIN
    SELECT * FROM tags;
END //

CREATE PROCEDURE UpdateTags(
    IN userID INT,
    IN tag1 INT,
    IN tag2 INT,
    IN tag3 INT,
    IN tag4 INT,
    IN tag5 INT
)
BEGIN
    
    IF tag1 IS NOT NULL THEN
        IF EXISTS (SELECT * FROM users_tags WHERE user_id = userID AND id = 1) THEN
            UPDATE users_tags
                SET tag_id = tag1
                WHERE user_id = userID AND id = 1;
        ELSE
            INSERT INTO users_tags (user_id, tag_id, id)
                VALUES (userID, tag1, 1);
        END IF;
    END IF;

    IF tag2 IS NOT NULL THEN
        IF EXISTS (SELECT * FROM users_tags WHERE user_id = userID AND id = 2) THEN
            UPDATE users_tags
                SET tag_id = tag2
                WHERE user_id = userID AND id = 2;
        ELSE
            INSERT INTO users_tags (user_id, tag_id, id)
                VALUES (userID, tag2, 2);
        END IF;
    ELSE
        DELETE FROM users_tags WHERE user_id = userID AND id = 2;
    END IF;
    
    IF tag3 IS NOT NULL THEN
        IF EXISTS (SELECT * FROM users_tags WHERE user_id = userID AND id = 3) THEN
            UPDATE users_tags
                SET tag_id = tag3
                WHERE user_id = userID AND id = 3;
        ELSE
            INSERT INTO users_tags (user_id, tag_id, id)
                VALUES (userID, tag3, 3);
        END IF;
    ELSE
        DELETE FROM users_tags WHERE user_id = userID AND id = 3;
    END IF;
    
    IF tag4 IS NOT NULL THEN
        IF EXISTS (SELECT * FROM users_tags WHERE user_id = userID AND id = 4) THEN
            UPDATE users_tags
                SET tag_id = tag4
                WHERE user_id = userID AND id = 4;
        ELSE
            INSERT INTO users_tags (user_id, tag_id, id)
                VALUES (userID, tag4, 4);
        END IF;
    ELSE
        DELETE FROM users_tags WHERE user_id = userID AND id = 4;
    END IF;
    
    IF tag5 IS NOT NULL THEN
        IF EXISTS (SELECT * FROM users_tags WHERE user_id = userID AND id = 5) THEN
            UPDATE users_tags
                SET tag_id = tag5
                WHERE user_id = userID AND id = 5;
        ELSE
            INSERT INTO users_tags (user_id, tag_id, id)
                VALUES (userID, tag5, 5);
        END IF;
    ELSE
        DELETE FROM users_tags WHERE user_id = userID AND id = 5;
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
    
    SELECT COUNT(@count) FROM pictures WHERE user_id = userID AND pictures.position = position;
    
    IF @count > 0 THEN
        UPDATE pictures SET image_url = imageUrl WHERE user_id = userID AND pictures.position = position;
    ELSE
        INSERT INTO pictures (user_id, pictures.position, image_url)
            VALUES (userID, position, imageUrl);
    END IF;
    
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

# Insert generated user
CREATE PROCEDURE AddGeneratedUser(
    IN _username VARCHAR(50),
    IN _password BINARY(32),
    IN _email VARCHAR(50),
    IN _salt VARCHAR(16),
    IN birthDate DATE,
    IN firstName VARCHAR(50),
    IN lastName VARCHAR(50),
    IN genderID INT,
    IN sexualOrientation INT,
    IN _coordinates VARCHAR(100),
    IN _biography VARCHAR(280),
    IN tag1 INT,
    IN tag2 INT,
    IN tag3 INT,
    IN tag4 INT,
    IN tag5 INT,
    IN image1 TEXT,
    IN image2 TEXT,
    IN image3 TEXT,
    IN image4 TEXT,
    IN image5 TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;
    
    START TRANSACTION;

    INSERT INTO users (username, password, email, birth_date, first_name, last_name, 
                       gender_id, sexual_orientation, coordinates, users.biography, salt, db.users.is_verified)
        VALUES (_username, _password, _email, birthDate, firstName, lastName, 
                genderID, sexualOrientation, _coordinates, _biography, _salt, 1);
    
    COMMIT ;
    
    SELECT LAST_INSERT_ID() INTO @userID;
    
    START TRANSACTION;
    
    CALL UpdateTags(@userID, tag1, tag2, tag3, tag4, tag5);
    
    COMMIT;
    
    START TRANSACTION;
    
    IF image1 IS NOT NULL THEN
        CALL UploadImage(@userID, 1, image1);
    END IF;
    
    IF image2 IS NOT NULL THEN
        CALL UploadImage(@userID, 2, image2);
    END IF;
    
    IF image3 IS NOT NULL THEN
        CALL UploadImage(@userID, 3, image3);
    END IF;
    
    IF image4 IS NOT NULL THEN
        CALL UploadImage(@userID, 4, image4);
    END IF;
    
    IF image5 IS NOT NULL THEN
        CALL UploadImage(@userID, 5, image5);
    END IF;
    
    COMMIT;
    
    CALL UpdateProfileCompletionPercentage(@userID);
END //

CREATE PROCEDURE GetUserMatches(IN userID INT)
BEGIN
    SELECT
        u.first_name,
        u.last_name,
        p.image_url
    FROM users u
             LEFT JOIN pictures p ON u.id = p.user_id AND p.position = 1
    WHERE u.id IN (
        SELECT first_userid FROM `match` WHERE second_userid = userID
        UNION
        SELECT second_userid FROM `match` WHERE first_userid = userID);
END //

DELIMITER ;