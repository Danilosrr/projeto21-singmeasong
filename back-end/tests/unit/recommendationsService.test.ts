import { jest } from '@jest/globals';

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";


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