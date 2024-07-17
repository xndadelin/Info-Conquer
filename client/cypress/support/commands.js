// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const password = '';

Cypress.Commands.add('login', () => {
    cy.session('login', () => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[aria-label="Username or email"]').type("xnd.adelin");
        cy.get('input[aria-label=Password]').type(password);
        cy.wait(3000);
        cy.get('button[type="submit"]').click();
        cy.get('p').should('contain', 'Welcome to <InfoConquer/>!')
    })
})