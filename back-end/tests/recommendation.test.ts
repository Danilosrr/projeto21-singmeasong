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

describe("POST /recommendations/:id/upvote", () => {  

    it("should return a status 200", async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        const response = await supertest(app).post(`/recommendations/${+recommendation.id}/upvote`);
        expect(response.status).toBe(200);
    });

    it("should return a status 200", async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        const upvote = await supertest(app).post(`/recommendations/${+recommendation.id}/upvote`);
        const response = await recommendationFactory.getRecommendation(recommendation.name);
        console.log(response)
        expect(response.score).toBe(1);
    });
});

describe("POST /recommendations/:id/downvote", () => {  
    
    it("should return a status 200", async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        const response = await supertest(app).post(`/recommendations/${+recommendation.id}/downvote`);
        expect(response.status).toBe(200);
    });

    it("should return a status 200", async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        const downvote = await supertest(app).post(`/recommendations/${+recommendation.id}/downvote`);
        const response = await recommendationFactory.getRecommendation(recommendation.name);
        expect(response.score).toBe(-1);
    });

    it("should delete recommendation when score < -5", async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        const setDownVotes = await recommendationFactory.setRecommendationScore(recommendation.id,-5);
        const downvote = await supertest(app).post(`/recommendations/${+recommendation.id}/downvote`);

        const checkDatabase = await recommendationFactory.getRecommendation(recommendation.name);
        console.log(checkDatabase)
        expect(checkDatabase).toBe(null);
    });
});