import { faker } from "@faker-js/faker";

before(() => {
  cy.cleardb();
});

describe('upvote video', () => {
  it("create recommendation", () => {
    cy.cleardb();
    cy.visit("http://localhost:3000/");
  
    cy.get('input[placeholder="Name"]').type(`${faker.random.word()}`);
    cy.get('input[placeholder="https://youtu.be/..."]').type(`https://www.youtube.com/watch?v=QFaFIcGhPoM`);
    cy.get("button").click();    
    cy.get('article').should('be.visible');
  });

  it("upvote video",() => {
    const amount = 3
    cy.contains("0").as("counter");

    for (let i = 0; i < amount; i++) {      
      cy.get("[data-cy=arrowUp]").click();
    }

    cy.get("@counter").should("have.text", amount);
  });
});

describe('downvote video', () => {
  it("create recommendation", () => {
    cy.cleardb();
    cy.visit("http://localhost:3000/");
  
    cy.get('input[placeholder="Name"]').type(`${faker.random.word()}`);
    cy.get('input[placeholder="https://youtu.be/..."]').type(`https://www.youtube.com/watch?v=QFaFIcGhPoM`);
    cy.get("button").click();    
    cy.get('article').should('be.visible');
  });

  it("downvote video",() => {
    const amount = 5
    cy.contains("0").as("counter");

    for (let i = 0; i < amount; i++) {      
      cy.get("[data-cy=arrowDown]").click();
    }

    cy.get("@counter").should("have.text", amount*-1);
  });

  it("delete video",() => {
    cy.get("[data-cy=arrowDown]").click();

    cy.get("article").should('not.exist');
  });
});