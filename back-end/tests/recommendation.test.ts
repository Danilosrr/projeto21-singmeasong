import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import { recommendationFactory } from "./factories/recommendationFactory.js";

beforeEach( async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations";`;
});

describe("POST /recommendations", () => {  
    const requestBody = recommendationFactory.recommendationBody();
    const badrequestBody = recommendationFactory.recommendationBodyWrong();

    it("should return a status 201", async () => {
        const response = await supertest(app).post("/recommendations").send(
            requestBody
        )
        expect(response.status).toBe(201);
    });

    it("should return a status 422", async () => {
        const response = await supertest(app).post("/recommendations").send(
            badrequestBody
        )
        expect(response.status).toBe(422);
    });
});