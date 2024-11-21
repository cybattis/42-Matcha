DELIMITER //

# GetUser
CREATE PROCEDURE GetUser(IN userID INT)
BEGIN
    SELECT *  FROM users WHERE id = userID;
END //

# GetUserAuthData
CREATE PROCEDURE GetUserAuthData(IN userID INT)
BEGIN
    SELECT username, password, email, birth_date  FROM users WHERE id = userID;
END //

# GetUserProfile
CREATE PROCEDURE GetUserProfile(IN userID INT)
BEGIN
    SELECT first_name, last_name, gender_id, sexual_orientation, biography, profile_completion_percentage, localisation FROM users WHERE id = userID;
    SELECT * FROM users_tags WHERE user_id = userID;
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
    
    IF _tag1 IS NOT NULL THEN
        INSERT INTO users_tags (user_id, tag_id)
        VALUES (userID, _tag1)
        ON DUPLICATE KEY UPDATE
            tag_id = VALUES(tag_id);
    END IF;
    
    IF _tag2 IS NOT NULL THEN
        INSERT INTO users_tags (user_id, tag_id)
        VALUES (userID, _tag2)
        ON DUPLICATE KEY UPDATE
            tag_id = VALUES(tag_id);
    END IF;
    
    IF _tag3 IS NOT NULL THEN
        INSERT INTO users_tags (user_id, tag_id)
        VALUES (userID, _tag3)
        ON DUPLICATE KEY UPDATE
            tag_id = VALUES(tag_id);
    END IF;
    
    IF _tag4 IS NOT NULL THEN
        INSERT INTO users_tags (user_id, tag_id)
        VALUES (userID, _tag4)
        ON DUPLICATE KEY UPDATE
            tag_id = VALUES(tag_id);
    END IF;
    
    IF _tag5 IS NOT NULL THEN
        INSERT INTO users_tags (user_id, tag_id)
        VALUES (userID, _tag5)
        ON DUPLICATE KEY UPDATE
            tag_id = VALUES(tag_id);
    END IF;
        
END //

DELIMITER ;