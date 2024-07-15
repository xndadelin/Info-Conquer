const password = '';

// to do, environment variables for cypress

describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login');
    });

    it('displays the login form', () => {
        cy.get('main .text-2xl').should('contain', 'Login');
        cy.get('input[aria-label="Username or email"]').should('be.visible');
        cy.get('input[aria-label="Password"]').should('be.visible');
        cy.get('button[type="submit"]').should('contain', 'Login');
    });

    it('shows recaptcha', () => {
        cy.get('.cf-turnstile').should('be.visible');
    })

    it('shows error message without doing recaptha', () => {
        cy.get('input[aria-label="Username or email"]').type('invalid_user');
        cy.get('input[aria-label="Password"]').type('invalid_password');
        cy.get('button[type="submit"]').click();

        cy.get('span').should('contain', 'Invalid captcha');
    });

    it('shows error message with invalid credentials and doing recaptha', () => {
        cy.wait(3000)
        cy.get('input[aria-label="Username or email"]').type('invalid_user');
        cy.get('input[aria-label="Password"]').type('invalid_password');
        cy.get('button[type="submit"]').click();
    })

    it('displays forgot password link', () => {
        cy.get('a').contains('Forgot password').should('be.visible').and('have.attr', 'href', '/forgot-password');
    });

    it('displays register link', () => {
        cy.get('a').contains('Register').should('be.visible').and('have.attr', 'href', '/register');
    });

    it('disables login button when inputs are empty', () => {
        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('input[aria-label="Username or email"]').type('valid_user');
        cy.get('input[aria-label="Password"]').type('valid_password');
        cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should render Discord login button', () => {
        cy.get('a').contains('Continue with Discord').should('be.visible').and('have.attr', 'href').and('include', 'https://discord.com/oauth2/authorize?client_id=1251926623729488014&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&scope=identify')
    });

    it('redirects to home page on successful login', () => {
        cy.login("xnd.adelin", password);
    });

});
