const supertest = require("supertest");
const app = require("../../..");
const fixtures = require("../../fixtures");
const database = require("../../database");
const { Blog, blogStates } = require("../../../models/blog");
const User = require("../../../models/user");

beforeAll(async () => {
    await database.connect();
})

afterAll(async () => {
    await database.disconnect();
})

describe("Test for Blog GET '/blogs/:id' request", () => {
    let user, blog1, blog2;
    beforeAll(async () => {
        user = await User.create(fixtures.userTestData.valid);
        blog1 = await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published})
        blog2 = await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.draft})
    })

    afterAll(async () => {
        await database.cleanup();
    })

    it("should fail to get blogs due to invalid blog id", async () => {
        const request = await supertest(app).get("/blogs/kakljfdk3kd2")
        expect(request.status).toBe(400);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.status).toBeFalsy()
    })

    it("should get blog with a state of published successfully", async () => {
        const request = await supertest(app).get(`/blogs/${blog1._id}`)
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.status).toBeTruthy()
        expect(request.body.blog.title).toBe(blog1.title)
        expect(request.body.blog.description).toBe(blog1.description)
        expect(request.body.blog.body).toBe(blog1.body)
        expect(request.body.blog.read_count).toBe(blog1.read_count + 1) // +1 because of this current request
        expect(request.body.blog.reading_time).toEqual(blog1.reading_time)
        expect(request.body.blog.tags).toEqual(blog1.tags)
    })

    it("should get no blog with a state of draft", async () => {
        const request = await supertest(app).get(`/blogs/${blog2._id}`)
        expect(request.status).toBe(404);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.status).toBeFalsy()
    })

    it("should return blog not found for user valid id", async () => {
        const request = await supertest(app).get(`/blogs/${user._id}`)
        expect(request.status).toBe(404);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.status).toBeFalsy()
    })
})
