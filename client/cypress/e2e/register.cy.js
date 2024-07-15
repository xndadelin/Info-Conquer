describe('Register Page', () => {
    beforeEach(() => {
        cy.visit('/register');
    });

    it('displays the registration form', () => {
        cy.get('main .text-2xl').should('contain', 'Register');
        cy.get('input[aria-label="Username"]').should('be.visible');
        cy.get('input[aria-label="Email"]').should('be.visible');
        cy.get('input[aria-label="Password"]').should('be.visible');
        cy.get('input[aria-label="Confirm password"]').should('be.visible');
        cy.get('button[type="submit"]').should('contain', 'Register');
    });

    it('shows recaptcha', () => {
        cy.get('.cf-turnstile').should('be.visible');
    });

    it('invalid email', () => {
        cy.get('input[aria-label="Username"]').type('new_user');
        cy.get('input[aria-label="Email"]').type('invalid_email');
        cy.get('input[aria-label="Password"]').type('password123');
        cy.get('input[aria-label="Confirm password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.get('span').should('contain', 'Invalid email');
    });

    it('shows error messages after completing recaptcha', () => {

        cy.get('.cf-turnstile').invoke('attr', 'data-sitekey', '1x00000000000000000000AA');
        cy.wait(3000);
        cy.get('input[aria-label="Username"]').type('new_user');
        cy.get('input[aria-label="Email"]').type('invalid_email');
        cy.get('input[aria-label="Password"]').type('password123');
        cy.get('input[aria-label="Confirm password"]').type('password456');
        cy.get('button[type="submit"]').click();

        cy.get('span').should('contain', 'Passwords do not match. Please submit again with matching passwords.');
    });

    it('password not strong enough', () => {
        cy.get('.cf-turnstile').invoke('attr', 'data-sitekey', '1x00000000000000000000AA');
        cy.wait(3000);
        cy.get('input[aria-label="Username"]').type('new_user');
        cy.get('input[aria-label="Email"]').type('valid_email@example.com');
        cy.get('input[aria-label="Password"]').type('password123');
        cy.get('input[aria-label="Confirm password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.get('span').should('contain', 'Password must contain at least one number, one lowercase and one uppercase letter, and at least 6 characters long.');
    });

    it('displays login link', () => {
        cy.contains('Login').should('be.visible').and('have.attr', 'href', '/login');
    });

    it('displays discord login button', () => {
        cy.contains('Continue with Discord')
            .should('be.visible')
            .and('have.attr', 'href')
            .and('include', 'https://discord.com/oauth2/authorize');
    });

    it('disables register button when inputs are empty', () => {
        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('input[aria-label="Username"]').type('valid_user');
        cy.get('input[aria-label="Email"]').type('valid_email@example.com');
        cy.get('input[aria-label="Password"]').type('valid_password');
        cy.get('input[aria-label="Confirm password"]').type('valid_password');
        cy.get('button[type="submit"]').should('not.be.disabled');
    });
});
