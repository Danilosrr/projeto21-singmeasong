beforeEach(() => {
	cy.cleardb();
});

describe("create recommendation", () => {
	it("new recommendation should appear", () => {
		cy.visit("http://localhost:3000/");

		cy.get('input[placeholder="Name"]').type("Recommendation");
		cy.get('input[placeholder="https://youtu.be/..."]').type("https://www.youtube.com/watch?v=pjX3J9EpAr0");
		cy.get("button").click();
		cy.get('[data-cy="recommendation-video"]').should('be.visible');
	});
});