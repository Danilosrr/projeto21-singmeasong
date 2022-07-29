import { jest } from '@jest/globals';

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";


describe("get", () => {
    it("expect to return user", async () => {        
        const findAll = jest.spyOn(recommendationRepository,"findAll").mockImplementationOnce(():any=>{})

        await recommendationService.get();
        expect(findAll).toHaveBeenCalled();
    });
});