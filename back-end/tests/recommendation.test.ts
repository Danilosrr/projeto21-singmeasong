import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js";

beforeEach( async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations";`;
});

describe("POST /recommendations", () => {  
    it("should return a status 201", async () => {
        const response = await supertest(app).post("/recommendations").send({
            name:'name',
            youtubeLink:'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        })
        expect(response.status).toBe(201);
    });
});