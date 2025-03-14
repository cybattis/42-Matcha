DELIMITER //

CREATE PROCEDURE GetMatchingProfiles (
    IN ref_user_id INT,
    IN max_age_gap INT,
    IN max_distance_gap INT,
    IN fame_gap INT,
    IN ref_fame INT,
    IN ref_birthdate DATE,
    IN ref_gender_id INT,
    IN ref_sexual_orientation_id INT,
    IN ref_coordinates POINT,
    IN result_offset INT,
    IN result_limit INT,
    IN sort_by VARCHAR(50)
)
BEGIN
    SELECT 
        u.id,
        u.username,
        u.first_name,
        u.last_name,
        u.birth_date,
        u.address,
        GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ",") AS tags,
        ST_Distance_Sphere(ref_coordinates, u.coordinates) AS distance_to_ref,
        (
            u.fame 
            - ((ST_Distance_Sphere(ref_coordinates, u.coordinates) / 1000) * 10) 
            + (50 * (
                SELECT COUNT(*) 
                FROM users_tags ut2 
                JOIN tags t2 ON ut2.tag_id = t2.id 
                WHERE ut2.user_id = u.id
                  AND t2.name IN (
                      SELECT t3.name FROM users_tags ut3 
                      JOIN tags t3 ON ut3.tag_id = t3.id 
                      WHERE ut3.user_id = ref_user_id
                  )
            ))
        ) AS calculatedFame,
        p.image_url,
        (
            SELECT COUNT(*) 
            FROM users_tags ut4 
            JOIN tags t4 ON ut4.tag_id = t4.id 
            WHERE ut4.user_id = u.id 
              AND t4.name IN (
                  SELECT t5.name FROM users_tags ut5 
                  JOIN tags t5 ON ut5.tag_id = t5.id 
                  WHERE ut5.user_id = ref_user_id
              )
        ) AS common_tags 
    FROM users u
    JOIN pictures AS p ON p.user_id = u.id
    JOIN users_tags AS ut ON ut.user_id = u.id
    JOIN tags t ON t.id = ut.tag_id
    LEFT JOIN blocked b 
        ON (b.from_userid = ref_user_id AND b.to_userid = u.id)
        OR (b.from_userid = u.id AND b.to_userid = ref_user_id)
    WHERE u.id != ref_user_id
    AND b.from_userid IS NULL  -- Exclut les utilisateurs bloqués dans les deux sens
    AND p.position = 1
    AND ABS(ref_fame - u.fame) <= fame_gap
    AND distance_to_ref <= max_distance_gap
    AND ABS(TIMESTAMPDIFF(YEAR, u.birth_date, ref_birthdate)) <= max_age_gap
    AND (
        -- Hétéro → cherche le genre opposé, orientation hétéro ou bi
        (ref_sexual_orientation_id = 1 AND u.gender_id != ref_gender_id AND (u.sexual_orientation_id = 1 OR u.sexual_orientation_id = 3))

        -- Gay → cherche le même genre, orientation gay ou bi
        OR (ref_sexual_orientation_id = 2 AND u.gender_id = ref_gender_id AND (u.sexual_orientation_id = 2 OR u.sexual_orientation_id = 3))

        -- Bi → accepte tout sauf les hétéros du même genre
        OR (ref_sexual_orientation_id = 3 AND NOT (u.gender_id = ref_gender_id AND u.sexual_orientation_id = 1))
    )
    GROUP BY u.id, u.username, u.first_name, u.birth_date, u.address, distance_to_ref, common_tags
    ORDER BY 
        CASE 
            WHEN sort_by = 'birth_date' THEN u.birth_date
            WHEN sort_by = 'distance' THEN distance_to_ref
        END ASC,  -- Ces deux critères sont triés en ASC
        CASE 
            WHEN sort_by = 'fame' THEN calculatedFame
            WHEN sort_by = 'common_tags' THEN common_tags
        END DESC,  -- Ces deux critères sont triés en DESC
        calculatedFame DESC  -- Si égalité, on trie par popularité
    LIMIT result_limit OFFSET result_offset;
END //

DELIMITER ;




