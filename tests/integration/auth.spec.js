const supertest = require("supertest");
const app = require("../..");
const fixtures = require("../fixtures");
const database = require("../database");
const bcrypt = require("bcrypt");


beforeAll(async () => {
    await database.connect();
})

afterAll(async () => {
    await database.disconnect();
})


describe("Signup Authentication '/auth/signup' POST request", () => {
    // afterEach(async () => {
    //     await database.cleanup();
    // })

    it("should register user successfully", async () => {
        const request = await supertest(app).post("/auth/signup").send(fixtures.userTestData.valid);
        expect(request.status).toBe(201);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.user.email).toEqual(fixtures.userTestData.valid.email);
        expect(request.body.user.firstName).toEqual(fixtures.userTestData.valid.firstName);
        expect(request.body.user.lastName).toEqual(fixtures.userTestData.valid.lastName);
        expect(await bcrypt.compare(fixtures.userTestData.valid.password, request.body.user.password)).toBeTruthy();
    })

    it("should not register user successfully due to no firstname", async () => {
        const request = await supertest(app).post("/auth/signup").send(fixtures.userTestData.noFirstname);
        expect(request.status).toBe(400);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.user).toBeUndefined();
    })

    it("should not register user successfully due to no lastname", async () => {
        const request = await supertest(app).post("/auth/signup").send(fixtures.userTestData.noLastname);
        // console.log(request.text)
        expect(request.status).toBe(400);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.user).toBeUndefined();
    })

    it("should not register user successfully due to no email", async () => {
        const request = await supertest(app).post("/auth/signup").send(fixtures.userTestData.noEmail);
        expect(request.status).toBe(400);
    })

    it("should not register user successfully due to invalid email", async () => {
        const request = await supertest(app).post("/auth/signup").send(fixtures.userTestData.invalidEmail);
        // console.log(request.text)
        expect(request.status).toBe(400);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.user).toBeUndefined();
    })

    it("should not register user successfully due to no password", async () => {
        const request = await supertest(app).post("/auth/signup").send(fixtures.userTestData.noPassword);
        expect(request.status).toBe(400);
    })
})

describe("Login Authentication '/auth/login' POST request", () => {
    // afterEach(async () => {
    //     await database.cleanup();
    // })

    it("should log user in successfully", async () => {
        const request = await supertest(app).post("/auth/login").send(fixtures.userTestData.valid)
        // console.log(request.body)
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body).toHaveProperty('token');
    })

    it("should log user in successfully due to invalid email", async () => {
        const request = await supertest(app).post("/auth/login").send(fixtures.userTestData.invalidEmailLogin)
        // console.log(request.body)
        expect(request.status).toBe(400);
        expect(request.headers['content-type']).toContain("application/json");
    })

    it("should not log user in successfully due to invalid password", async () => {
        const request = await supertest(app).post("/auth/login").send(fixtures.userTestData.invalidPasswordLogin)
        // console.log(request.body)
        expect(request.status).toBe(400);
        expect(request.headers['content-type']).toContain("application/json");
    })

})