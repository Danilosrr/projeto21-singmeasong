import { faker } from "@faker-js/faker";

before(() => {
	cy.cleardb();
});

describe("create recommendation", () => {
	it("new recommendation should appear", () => {
		cy.visit("http://localhost:3000/");

		cy.get('input[placeholder="Name"]').type(`${faker.random.word()}`);
		cy.get('input[placeholder="https://youtu.be/..."]').type(`https://www.youtube.com/watch?v=7N63cMKosIE`);
		cy.get("button").click();
		cy.get('article').should('be.visible');
	});
});