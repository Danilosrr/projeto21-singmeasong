import { faker } from "@faker-js/faker";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

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

export const recommendationFactory = {
    recommendationBody,
    recommendationBodyWrong
}