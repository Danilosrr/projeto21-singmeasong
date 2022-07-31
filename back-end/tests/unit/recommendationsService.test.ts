import { jest } from '@jest/globals';

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationFactory } from "../factories/recommendationFactory.js";

jest.mock("../../src/repositories/recommendationRepository");

describe("get", () => {
    it("expect to call function", async () => {        
        const findAll = jest.spyOn(recommendationRepository,"findAll").mockImplementationOnce(():any=>{})

        await recommendationService.get();
        expect(findAll).toHaveBeenCalled();
    });
});

describe("getTop", () => {
    it("expect to call function", async () => {    
        const amount = 9    
        const getAmountByScore = jest.spyOn(recommendationRepository,"getAmountByScore").mockImplementationOnce(():any=>{})

        await recommendationService.getTop(amount);
        expect(getAmountByScore).toHaveBeenCalled();
    });
});

describe("Insert Recommendations", () => {
    const create = jest.spyOn(recommendationRepository, "create").mockImplementationOnce(():any=>{});
    const recommendation = recommendationFactory.recommendationBody();

    it("expect to call function", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any=> false );

        await recommendationService.insert(recommendation);
        expect(create).toHaveBeenCalled();
    });
  
    it("expect to call function", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any=> recommendation );

        expect(recommendationService.insert(recommendation)).rejects.toEqual({message: "Recommendations names must be unique", type: "conflict"});
    });
});