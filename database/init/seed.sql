# Populating table
INSERT INTO gender (name)
    VALUES ('Hetero'), ('Homosexual'), ('Bisexual');

INSERT INTO `status`(name)
    VALUES ('Pending'), ('Sent'), ('Delivered'), ('Read'), ('Error'), ('Edited');

INSERT INTO tags (name)
    VALUES ('NONE');

INSERT INTO tags (name)
    VALUES ('Dessin / Peinture'), 
           ('Écriture'), 
           ('Photographie'), 
           ('DIY'), 
           ('Musique'), 
           ('Cinema'), 
           ('Théâtre');

INSERT INTO tags (name)
    VALUES ('Lecture'), 
           ('Histoire'), 
           ('Langues'), 
           ('Philosophie');

INSERT INTO tags (name)
    VALUES ('Fitness / Musculation'),
           ('Randonnée'),
           ('Yoga ou méditation'),
           ('Cyclisme'),
           ('Natation'),
           ('Sports d’équipe'),
           ('Escalade');

INSERT INTO tags (name)
    VALUES ('Programmation'),
           ('Jeux vidéo'),
           ('Électronique'),
           ('Jeux de société'),
           ('Échecs');

INSERT INTO tags (name)
    VALUES ('Cuisine'),
           ('Pâtisserie'),
           ('Végétarisme / Véganisme'),
           ('Restauration'),
           ('Vin / Bière / Alcool');

INSERT INTO tags (name)
    VALUES ('Voyages'),
           ('Camping'),
           ('Croisières'),
           ('Road trips'),
           ('Tourisme');

INSERT INTO tags (name)
    VALUES ('Animaux'),
           ('Jardinage'),
           ('Écologie'),
           ('Bricolage'),
           ('Décoration');

# # Creating tests users
# INSERT INTO users (email, password, salt, username, birth_date)
#     VALUES ('jean.bono@gmail.com', '1234', 'salt', 'jojo42', '1993-10-02');
# 
# INSERT INTO users (email, password, salt, username, birth_date)
#     VALUES ('abcd.mail@gmail.com', 'abcd', 'salt', 'nono42', '1985-11-12');