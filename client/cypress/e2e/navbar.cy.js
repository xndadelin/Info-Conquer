describe('Navigation bar tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should render the navigation bar', () => {
        cy.get('nav').should('exist');
        cy.get('header').should('exist');
        cy.get('ul').should('exist');
    });

    it('should render the menu button on mobile view', () => {
        cy.viewport('iphone-6');
        cy.get('button[aria-pressed]').should('be.visible');
    });

    it('should render the site title', () => {
        cy.get('a[href="/"]').should('contain.text', '<InfoConquer/>');
    });

    it('should render menu items for Contests, Problems, Leaderboard', () => {
        cy.get('a[href="/contests"]').should('contain.text', 'Contests');
        cy.get('a[href="/problems"]').should('contain.text', 'Problems');
        cy.get('a[href="/leaderboard"]').should('contain.text', 'Leaderboard');
    });

    it('should render the Login button', () => {
        cy.get('a[href="/login"]').should('contain.text', 'Login');
    });
});
describe('Menu button tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should toggle the menu when the button is clicked', () => {
        cy.viewport('iphone-6');

        cy.get('nav').should('not.have.attr', 'data-menu-open', 'true');

        cy.get('button[aria-pressed]').click();
        cy.get('nav').should('have.attr', 'data-menu-open', 'true');

        cy.get('button[aria-pressed]').click();
        cy.get('nav').should('not.have.attr', 'data-menu-open', 'true');
    });
});

describe('Navigation links tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should navigate to Contests page', () => {
        cy.get('li > a[href="/contests"]').click();
        cy.url().should('include', '/contests');
    });

    it('should navigate to Problems page', () => {
        cy.get('a[href="/problems"]').click();
        cy.url().should('include', '/problems');
    });

    it('should navigate to Leaderboard page', () => {
        cy.get('a[href="/leaderboard"]').click();
        cy.url().should('include', '/leaderboard');
    });

    it('should navigate to Login page', () => {
        cy.get('a[href="/login"]').click();
        cy.url().should('include', '/login');
    });
});
describe('Responsive navigation bar tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should render mobile view correctly', () => {
        cy.viewport('iphone-6');
        cy.get('span[class="sr-only"]').should('contain.text', 'open navigation menu');
        cy.get('button[aria-pressed]').should('be.visible');
    });

    it('should render desktop view correctly', () => {
        cy.viewport('macbook-15');
        cy.get('button[aria-pressed]').should('not.exist');
        cy.get('nav').should('not.have.attr', 'data-menu-open', 'true');
    });
});
describe('Search bar tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should open the search modal when the search button is clicked', () => {
        cy.get('input[aria-label="Search for problems, articles, contests, etc."]').should('not.exist');
        cy.get('button[data-cy="search-button"]').click();
        cy.get('input[aria-label="Search for problems, articles, contests, etc."]').should('be.visible');
    })

    it('should redirect to search page on pressing Enter', () => {
        cy.get('button[data-cy="search-button"]').click();
        cy.get('input[aria-label="Search for problems, articles, contests, etc."]').type('test').type('{enter}');
        cy.url().should('include', '/search/test');
    })
})
describe('Dropdown menu tests', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('/');
    });

    it('should open the dropdown menu on click', () => {
        cy.get('img[alt="avatar"]').click();

        cy.get('div[data-cy="auth-dropdown"]')
            .find('div[data-slot="content"]')
            .should('be.visible');
    });

    it('should display the user name correctly', () => {
        cy.get('img[alt="avatar"]').click();

        cy.get('li')
            .contains('Signed in as: xnd.adelin')
            .should('exist');
    });

    it('should have the correct links in the dropdown menu', () => {
        cy.get('img[alt="avatar"]').click();
        cy.get('a[href="/profile/xnd.adelin"]').should('exist');
    });

    it('should trigger logout on clicking Logout button', () => {
        cy.get('img[alt="avatar"]').click();
        cy.get('li').contains('Logout').click();
        cy.get('a[href="/login"]').should('exist');
    });
});