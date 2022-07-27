import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

function recommendationBody(){

    const recommendation:CreateRecommendationData = {
        name: faker.random.word(),
        youtubeLink: `https://www.youtube.com/watch?v=`+faker.random.alphaNumeric(6)
    };

    return recommendation;
};

function recommendationBodyWrong(){

    const recommendation:CreateRecommendationData = {
        name: faker.random.word(),
        youtubeLink: `https://www.google.com/`+faker.random.alphaNumeric(6)
    };

    return recommendation;
};

async function getRecommendation(name:string){
    return await prisma.recommendation.findUnique({
        where: { name }
    })
}

async function createRecommendation(){
    const body = recommendationBody(); 

    return await prisma.recommendation.create({
        data: body,
      });
};

async function setRecommendationScore(id:number,score:number) {
    return await prisma.recommendation.update({
        where: { id },
        data: {
          score:  score ,
        }
    });
}

export const recommendationFactory = {
    recommendationBody,
    recommendationBodyWrong,
    getRecommendation,
    createRecommendation,
    setRecommendationScore
}