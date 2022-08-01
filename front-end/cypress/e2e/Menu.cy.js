before(() => {
    cy.cleardb();
});

describe('Navigate', () => {
	it("home",() => {
        cy.visit("http://localhost:3000/top");
		cy.contains("Home").click();
		cy.url().should("equal", "http://localhost:3000/");
	});

    it("random",() => {
		cy.contains("Random").click();
		cy.url().should("equal", "http://localhost:3000/random");
	});

    it("top",() => {
		cy.contains("Top").click();
		cy.url().should("equal", "http://localhost:3000/top");
	});
});