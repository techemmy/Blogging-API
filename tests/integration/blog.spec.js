const supertest = require("supertest");
const app = require("../..");
const fixtures = require("../fixtures");
const database = require("../database");
const { Blog, blogStates } = require("../../models/blog");
const User = require("../../models/user");

beforeAll(async () => {
    await database.connect();
})

afterAll(async () => {
    await database.disconnect();
})

describe("Test for Blog GET '/blogs' requests", () => {
    let user, user2;

    beforeEach(async () => {
        user = await User.create(fixtures.userTestData.valid);
        user2 = await User.create(fixtures.userTestData.valid2);
    })

    afterEach(async () => {
        await database.cleanup();
    })

    it("should get all blogs successfully with an empty blog", async () => {
        const request = await supertest(app).get('/blogs/');
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(0);
        expect(request.body.blogs).toEqual([])
        expect(request.body.status).toBeTruthy()
    })

    it("should get no published blog", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id})

        const request = await supertest(app).get('/blogs');
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.blogs).toEqual([])
        expect(request.body.count).toBe(0)
        expect(request.body.status).toBeTruthy()
    })

    it("should get one published blog", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published})

        const request = await supertest(app).get('/blogs');
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(1);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs[0].title).toBe(fixtures.blogTestData.valid.title)
        expect(request.body.blogs[0].description).toBe(fixtures.blogTestData.valid.description)
        expect(request.body.blogs[0].body).toBe(fixtures.blogTestData.valid.body)
        expect(request.body.blogs[0].tags).toEqual(fixtures.blogTestData.valid.tags)
        expect(request.body.blogs[0].author.firstName).toBe(fixtures.userTestData.valid.firstName)
        expect(request.body.blogs[0].author.lastName).toBe(fixtures.userTestData.valid.lastName)
    })

    it("should get all published blog", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid3, author: user._id, state:blogStates.draft})

        const request = await supertest(app).get('/blogs');
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(2);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs.every(blog => blog.state === blogStates.published)).toBeTruthy()
    })

    it("should get published blogs sorted by read_count in ascending order", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published, read_count:0})
        await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.published, read_count:1})
        await Blog.create({...fixtures.blogTestData.valid3, author: user._id, state:blogStates.published, read_count:2})

        const request = await supertest(app).get('/blogs?orderBy=read_count');
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(3);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs[0].title).toBe(fixtures.blogTestData.valid.title);
        expect(request.body.blogs[1].title).toBe(fixtures.blogTestData.valid2.title);
        expect(request.body.blogs[2].title).toBe(fixtures.blogTestData.valid3.title);
    })

    it("should get published blogs sorted by read_count in descending order", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published, read_count:0})
        await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.published, read_count:1})
        await Blog.create({...fixtures.blogTestData.valid3, author: user._id, state:blogStates.published, read_count:2})

        const request = await supertest(app).get('/blogs?orderBy=-read_count');
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(3);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs[0].title).toBe(fixtures.blogTestData.valid3.title);
        expect(request.body.blogs[1].title).toBe(fixtures.blogTestData.valid2.title);
        expect(request.body.blogs[2].title).toBe(fixtures.blogTestData.valid.title);
    })

    it("should get published blogs sorted by reading_time in ascending order", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid3, author: user._id, state:blogStates.published})

        const request = await supertest(app).get('/blogs?orderBy=reading_time');
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(3);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs[0].reading_time.inNumber).toBeLessThanOrEqual(request.body.blogs[1].reading_time.inNumber);
        expect(request.body.blogs[1].reading_time.inNumber).toBeLessThanOrEqual(request.body.blogs[2].reading_time.inNumber);
    })

    it("should get published blogs sorted by reading_time in descending order", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid3, author: user._id, state:blogStates.published})

        const request = await supertest(app).get('/blogs?orderBy=-reading_time');
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(3);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs[0].reading_time.inNumber).toBeGreaterThanOrEqual(request.body.blogs[1].reading_time.inNumber);
        expect(request.body.blogs[1].reading_time.inNumber).toBeGreaterThanOrEqual(request.body.blogs[2].reading_time.inNumber);
    })

    it("should get published blogs sorted by createdAt in ascending order", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid3, author: user._id, state:blogStates.published})

        const request = await supertest(app).get('/blogs?orderBy=createdAt');
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(3);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs[0].title).toBe(fixtures.blogTestData.valid.title);
        expect(request.body.blogs[1].title).toBe(fixtures.blogTestData.valid2.title);
        expect(request.body.blogs[2].title).toBe(fixtures.blogTestData.valid3.title);
    })

    it("should get published blogs sorted by createdAt in descending order", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid3, author: user._id, state:blogStates.published})

        const request = await supertest(app).get('/blogs?orderBy=-createdAt');
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(3);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs[0].title).toBe(fixtures.blogTestData.valid3.title);
        expect(request.body.blogs[1].title).toBe(fixtures.blogTestData.valid2.title);
        expect(request.body.blogs[2].title).toBe(fixtures.blogTestData.valid.title);
    })

    it("should get published blogs by title search", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid3, author: user._id, state:blogStates.published})

        const request = await supertest(app).get(`/blogs?title=${fixtures.blogTestData.valid.title}`);
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(1);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs[0].title).toBe(fixtures.blogTestData.valid.title);
    })

    it("should get published blogs by author search", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid3, author: user2._id, state:blogStates.published})

        const request = await supertest(app).get(`/blogs?author=${user2.firstName}`);
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(1);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs[0].title).toBe(fixtures.blogTestData.valid3.title);
    })

    it("should get published blogs by tags search", async () => {
        await Blog.create({...fixtures.blogTestData.valid, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid2, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid3, author: user._id, state:blogStates.published})

        const request = await supertest(app).get(`/blogs?tags=${fixtures.blogTestData.valid.tags.join(",")}`);
        expect(request.status).toBe(200);
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.count).toBe(1);
        expect(request.body.status).toBeTruthy()
        expect(request.body.blogs[0].tags).toEqual(fixtures.blogTestData.valid.tags);
    })

})

describe("Test for Blog GET '/blogs/mine' request", () => {
    let userToken;

    beforeAll(async () => {
        const user = await User.create(fixtures.userTestData.valid);
        const user2 = await User.create(fixtures.userTestData.valid2);
        const request = await supertest(app).post("/auth/login").send(fixtures.userTestData.valid);

        userToken = request.body.token;
        await Blog.create({...fixtures.blogTestData.valid, author: user2._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid2, author: user2._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid3, author: user._id, state:blogStates.draft})
        await Blog.create({...fixtures.blogTestData.valid4, author: user._id, state:blogStates.draft})
        await Blog.create({...fixtures.blogTestData.valid5, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid6, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid7, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid8, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid9, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid10, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid11, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid12, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid13, author: user._id, state:blogStates.published})
        await Blog.create({...fixtures.blogTestData.valid14, author: user._id, state:blogStates.published})
    })

    afterAll(async () => {
        await database.cleanup();
    })

    it("should get user blogs", async () => {
        const request = await supertest(app).get("/blogs/mine")
            .set("Authorization", `Bearer ${userToken}`)
        expect(request.status).toBe(200);

        expect(request.body.count).toBe(10) // 10 due to default pagination of 10 for users
        expect(request.body.blogs.length).toBe(10)
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.status).toBeTruthy()
    })

    it("should fail to get user blogs due to empty Authorization header", async () => {
        const request = await supertest(app).get("/blogs/mine")
        expect(request.status).toBe(401)
    })

    it("should get user blogs by pagination", async () => {
        const request = await supertest(app).get("/blogs/mine?page=2")
            .set("Authorization", `Bearer ${userToken}`)
        expect(request.status).toBe(200);

        expect(request.body.count).toBe(2) // 2 because 10/14 of the blog belongs to this user and page is paginated by 10 blog per page
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.status).toBeTruthy()
    })

    it("should get user blogs with state of draft", async () => {
        const request = await supertest(app).get(`/blogs/mine?state=${blogStates.draft}`)
            .set("Authorization", `Bearer ${userToken}`)
        expect(request.status).toBe(200);

        expect(request.body.count).toBe(2)
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.status).toBeTruthy()
    })

    it("should get user blogs with state of published", async () => {
        const request = await supertest(app).get(`/blogs/mine?state=${blogStates.published}`)
            .set("Authorization", `Bearer ${userToken}`)
        expect(request.status).toBe(200);

        expect(request.body.count).toBe(10)
        expect(request.headers['content-type']).toContain("application/json");
        expect(request.body.status).toBeTruthy()
    })
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