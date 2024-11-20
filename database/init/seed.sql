# Populating table
INSERT INTO tags (name)
    VALUES ('Sports'), ('Video Games'), ('Music'), ('Reading'), ('Hikes');

INSERT INTO gender (name)
    VALUES ('Hetero'), ('Homosexual'), ('Bisexual');

INSERT INTO `status`(name)
    VALUES ('Pending'), ('Sent'), ('Delivered'), ('Read'), ('Error'), ('Edited');

# Creating tests users
INSERT INTO users (email, password, salt, username, birth_date)
    VALUES ('jean.bono@gmail.com', '1234', 'salt', 'jojo42', '1993-10-02');

INSERT INTO users (email, password, salt, username, birth_date, first_name, last_name)
    VALUES ('abcd.mail@gmail.com', 'abcd', 'salt', 'nono42', '1985-11-12', 'Jojo', 'Nono');

INSERT INTO users_tags (user_id, tag_id)
    VALUES (2, 1);

INSERT INTO users_tags (user_id, tag_id)
    VALUES (2, 2);

INSERT INTO users_tags (user_id, tag_id)
    VALUES (2, 3);

INSERT INTO users_tags (user_id, tag_id)
    VALUES (2, 4);

INSERT INTO users_tags (user_id, tag_id)
    VALUES (2, 5);