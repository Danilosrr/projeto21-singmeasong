import { jest } from '@jest/globals';

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationFactory } from "../factories/recommendationFactory.js";

jest.mock("../../src/repositories/recommendationRepository");

describe("get", () => {
    it("expect to call findAll function", async () => {        
        const findAll = jest.spyOn(recommendationRepository,"findAll").mockImplementationOnce(():any=>{})

        await recommendationService.get();
        expect(findAll).toHaveBeenCalled();
    });
});

describe("getTop", () => {
    it("expect to call getAmountByScore function", async () => {    
        const amount = 9    
        const getAmountByScore = jest.spyOn(recommendationRepository,"getAmountByScore").mockImplementationOnce(():any=>{})

        await recommendationService.getTop(amount);
        expect(getAmountByScore).toHaveBeenCalled();
    });
});

describe("insert", () => {
    const create = jest.spyOn(recommendationRepository, "create").mockImplementationOnce(():any=>{});
    const recommendation = recommendationFactory.recommendationBody();

    it("expect to call create function", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any=> false );

        await recommendationService.insert(recommendation);
        expect(create).toHaveBeenCalled();
    });
  
    it("expect to throw error", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any=> recommendation );

        expect(recommendationService.insert(recommendation)).rejects.toEqual({message: "Recommendations names must be unique", type: "conflict"});
    });
});

describe("upvote/downvote", () => {
    const id=1;
    const recommendation = recommendationFactory.recommendationBody();

    it("expect to call updateScore function", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any=> false );
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any=> true );
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any=> {});

        await recommendationService.upvote(id);
        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    });

    it("expect to call remove function", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any=> false );
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any=> true );
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce(():any=> {} );
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any=> {
            return {
                id, 
                ...recommendation,
                score:-6
            }
        });

        await recommendationService.downvote(id);
        expect(recommendationRepository.updateScore).toHaveBeenCalled();
        expect(recommendationRepository.remove).toHaveBeenCalled();
    });

    it("expect to throw error", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any=> false );
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any=> false );
       

        expect(recommendationService.downvote(id)).rejects.toEqual({message: "", type: "not_found"});
    });
});

describe("getRandom", () => {   
    const recommendation1 = recommendationFactory.recommendationBody();
    const recommendation2 = recommendationFactory.recommendationBody();
     
    it("expect a list of recommendations", async () => {
        jest.spyOn(Math, "random").mockReturnValueOnce(0.9);

        const findAll = jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any=> [recommendation1,recommendation2]);
  
        const response = await recommendationService.getRandom();
        expect(response).toBe(recommendation1);
    });

    it("expect a list of recommendations", async () => {
        jest.spyOn(Math, "random").mockReturnValueOnce(0.2);

        const findAll = jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any=> [recommendation1,recommendation2]);
  
        const response = await recommendationService.getRandom();
        expect(response).toBe(recommendation2);
    });

    it("expect to throw error", () => {
        jest.spyOn(Math, "random").mockReturnValueOnce(0.9);
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);
  
        expect(recommendationService.getRandom()).rejects.toEqual(
            {message: "", type: "not_found"}
        );
    })

    it("expect to throw error", () => {
        jest.spyOn(Math, "random").mockReturnValueOnce(0.2);
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);
  
        expect(recommendationService.getRandom()).rejects.toEqual(
            {message: "", type: "not_found"}
        );
    })
});