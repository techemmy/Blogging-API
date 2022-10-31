module.exports = {
    valid: {
        firstName: "Jane",
        lastName: "Doe",
        email: "valid@gmaisl.com",
        password: "JaneDoe"
    },
    noFirstname: {
        firstName: "",
        lastName: "Doe",
        email: "valid@gmail.com",
        password: "JaneDoe"
    },
    noLastname: {
        firstName: "Jane",
        lastName: "",
        email: "valid@gmail.com",
        password: "JaneDoe"
    },
    noEmail: {
        firstName: "Jane",
        lastName: "Doe",
        email: "",
        password: "JaneDoe"
    },
    invalidEmail: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jones.com",
        password: "JaneDoe"
    },
    noPassword: {
        firstName: "Jane",
        lastName: "Doe",
        email: "valid@gmail.com",
        password: ""
    },
    validLogin: {
        email: "valid@gmaisl.com",
        password: "JaneDoe"
    },
    invalidEmailLogin: {
        email: "wrong@gmail.com",
        password: "JaneDoe"
    },
    invalidPasswordLogin: {
        email: "valid@gmaisl.com",
        password: "wrong"
    }
}