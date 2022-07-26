import { Request, Response, Router } from "express";
import { prisma } from "../database.js";

const testsRouter = Router();

testsRouter.post("/cleardb", async (req:Request,res:Response) => {
    const clear = await prisma.recommendation.deleteMany({});
    res.send(clear);
});

export default testsRouter;