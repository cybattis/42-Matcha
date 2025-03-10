DELIMITER //

CREATE PROCEDURE GetMatchingProfiles (
    IN ref_user_id INT,
    IN max_distance_km DOUBLE,
    IN max_age_gap INT
)
BEGIN
    DECLARE ref_lat DOUBLE;
    DECLARE ref_lon DOUBLE;
    DECLARE ref_birthdate DATE;

    -- Récupérer les coordonnées et la date de naissance
    SELECT 
        CAST(SUBSTRING_INDEX(coordinates, ',', 1) AS DECIMAL(10,6)),
        CAST(SUBSTRING_INDEX(coordinates, ',', -1) AS DECIMAL(10,6)),
        birthdate
    INTO ref_lat, ref_lon, ref_birthdate
    FROM users
    WHERE id = ref_user_id;

    -- Calcul à la volée via POINT()
    SELECT 
        u.*,
        ST_Distance_Sphere(
            POINT(CAST(SUBSTRING_INDEX(u.coordinates, ',', 1) AS DECIMAL(10,6)),
                  CAST(SUBSTRING_INDEX(u.coordinates, ',', -1) AS DECIMAL(10,6))),
            POINT(ref_lat, ref_lon)
        ) / 1000 AS distance_km,
        ABS(TIMESTAMPDIFF(YEAR, u.birthdate, ref_birthdate)) AS age_gap
    FROM users u
    WHERE u.id != ref_user_id
      AND ST_Distance_Sphere(
            POINT(CAST(SUBSTRING_INDEX(u.coordinates, ',', 1) AS DECIMAL(10,6)),
                  CAST(SUBSTRING_INDEX(u.coordinates, ',', -1) AS DECIMAL(10,6))),
            POINT(ref_lat, ref_lon)
          ) <= (max_distance_km * 1000)
      AND ABS(TIMESTAMPDIFF(YEAR, u.birthdate, ref_birthdate)) <= max_age_gap;
END //

DELIMITER ;
