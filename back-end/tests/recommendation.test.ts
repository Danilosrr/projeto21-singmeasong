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

    it("successful post expect a status 201", async () => {
        const response = await supertest(app).post("/recommendations").send(
            requestBody
        )
        expect(response.status).toBe(201);
    });

    it("schema missmatch expect a status 422", async () => {
        const response = await supertest(app).post("/recommendations").send(
            badrequestBody
        )
        expect(response.status).toBe(422);
    });
});

describe("GET /recommendations", () => {  
    const requestBody = recommendationFactory.recommendationBody();
    const badrequestBody = recommendationFactory.recommendationBodyWrong();

    it("successful get expect a status 200", async () => {
        const response = await supertest(app).get("/recommendations")
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.status).toBe(200);
    });
});

describe("POST /recommendations/:id/upvote", () => {  

    it("successful upvote expect a status 200", async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        const response = await supertest(app).post(`/recommendations/${+recommendation.id}/upvote`);

        const upvote = await recommendationFactory.getRecommendation(recommendation.name);
        expect(upvote.score).toBe(1);
        expect(response.status).toBe(200);
    });

    it("id not registered expect a status 404", async () => {

        const response = await supertest(app).post(`/recommendations/99/upvote`);

        expect(response.status).toBe(404);
    });
});

describe("POST /recommendations/:id/downvote", () => {  
    
    it("successful downvote expect a status 200", async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        const response = await supertest(app).post(`/recommendations/${+recommendation.id}/downvote`);
        const downvote = await recommendationFactory.getRecommendation(recommendation.name);
        expect(downvote.score).toBe(-1)
        expect(response.status).toBe(200);
    });

    it("expect to delete recommendation when score < -5", async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        const setDownVotes = await recommendationFactory.setRecommendationScore(recommendation.id,-5);
        const downvote = await supertest(app).post(`/recommendations/${+recommendation.id}/downvote`);

        const checkDatabase = await recommendationFactory.getRecommendation(recommendation.name);
        console.log(checkDatabase)
        expect(checkDatabase).toBe(null);
    });
});

describe("GET /recommendations/:id", () => {  
    
    it("successful request expect a status 200", async () => {
        const recommendation = await recommendationFactory.createRecommendation();
        
        const response =  await supertest(app).get(`/recommendations/${+recommendation.id}`);
        expect(response.status).toBe(200);
    });

    it("id not registered expect a status 404", async () => {        
        const response =  await supertest(app).get(`/recommendations/99`);
        expect(response.status).toBe(404);
    });
});

describe("GET /recommendations/top/:amount", () => {  
    const amount = 3
    it("successful request expect a status 200", async () => {
        const recommendation = await recommendationFactory.createRecommendations(+amount);

        const response =  await supertest(app).get(`/recommendations/top/${+amount}`);
        expect(response.body.length).toBe(+amount);
        expect(response.status).toBe(200);
    });
});

describe("GET /recommendations/random", () => {  
    const amount = 10
    it("successful request expect a status 200", async () => {
        const recommendations = await recommendationFactory.createRecommendations(+amount);

        const response =  await supertest(app).get(`/recommendations/random`);
        expect(recommendations.includes(response.body.id)).toBe(true);
        expect(response.status).toBe(200);
    });

    it("no recommendation registered expect a status 404", async () => {
        const response =  await supertest(app).get(`/recommendations/random`);
        expect(response.status).toBe(404);
    });
});