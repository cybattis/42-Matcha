API Documentation

# Cree un nouveau compte
login/NewAccount
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? Mail { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime BirthDate { get; set; }
# Return Values
    200 si ok
    ... si existe deja
    ... si erreur

