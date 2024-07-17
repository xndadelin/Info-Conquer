import mockSubmissions from '../fixtures/submissions/submissions.json';

const submissionsData = JSON.parse(JSON.stringify(mockSubmissions));

describe('Submissions tab (logged in)', () => {
    beforeEach(() => {
        cy.login()
        cy.intercept('POST', 'http://localhost:8080/graphql', (req) => {
            if (req.body.operationName === 'GetSubmissions') {
                req.reply(submissionsData);
            }
        })
        cy.visit('/problems/Sum00');
    });

    it('should display the submissions tab', () => {
        cy.get('button[data-key="solutions"]').click();
        cy.get('span').should('contain', 'All submissions');
        cy.get('span').should('contain', 'Your submissions');
    })

    it("should properly render the pagination component on all submissions", () => {
        cy.get('button[data-key="solutions"]').click();
        cy.get("nav[aria-label='pagination navigation']").should('be.visible');
        cy.get('li[aria-label="pagination item 1 active"]').should('be.visible');
        cy.get('li[aria-label="pagination item 2"]').should('be.visible');
        cy.get('li[aria-label="pagination item 3"]').should('not.exist');
    })

    it('should properly render the pagination component on user submissions', () => {
        cy.get('button[data-key="solutions"]').click();
        cy.get('button[data-key="user"]').click();
        cy.get("nav[aria-label='pagination navigation']").should('be.visible');
        cy.get('li[aria-label="pagination item 1 active"]').should('be.visible');
        cy.get('li[aria-label="pagination item 2"]').should('be.visible');
        cy.get('li[aria-label="pagination item 3"]').should('be.visible');
        cy.get('li[aria-label="pagination item 5"]').should('not.exist');
    })
    it('should properly render the table of all submissions and the pagination component should properly work', () => {
        cy.get('button[data-key="solutions"]').click();
        cy.get('table').should('be.visible');
        cy.get('th').should('contain', 'Username');
        cy.get('th').should('contain', 'Language');
        cy.get('th').should('contain', 'Status');
        cy.get('th').should('contain', 'Date');
        cy.get('th').should('contain', 'Score');

        submissionsData.data.getSubmissions.allSolutions.slice(0, 19).forEach((submission, index) => {
            cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(1)`).should('contain', submission.username);
            cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(2)`).should('contain', submission.language);
            cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(3)`).should('contain', submission.score);
            cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(4)`).should('contain', new Date(+submission.date).toLocaleString());
            cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(5)`).should('contain', submission.status);
        });

        cy.get('li[aria-label="pagination item 2"]').click();

        submissionsData.data.getSubmissions.allSolutions
            .slice(20, 39)
            .forEach((submission, index) => {
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(1)`).should('contain', submission.username);
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(2)`).should('contain', submission.language);
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(3)`).should('contain', submission.score);
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(4)`).should('contain', new Date(+submission.date).toLocaleString());
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(5)`).should('contain', submission.status);
            })

    })
    it("should properly render user's table of submissions and the pagination component should properly work", () => {
        cy.get('button[data-key="solutions"]').click();
        cy.get('button[data-key="user"]').click();
        cy.get('table').should('be.visible');
        cy.get('th').should('contain', 'See solution');
        cy.get('th').should('contain', 'Language');
        cy.get('th').should('contain', 'Status');
        cy.get('th').should('contain', 'Date');
        cy.get('th').should('contain', 'Score');

        submissionsData.data.getSubmissions.userSolutions
            .slice(0, 20)
            .forEach((submission, index) => {
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(1)`).should('contain', 'See solution');
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(2)`).should('contain', submission.language);
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(3)`).should('contain', submission.score);
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(4)`).should('contain', new Date(+submission.date).toLocaleString());
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(5)`).should('contain', submission.status);
            });
        
        cy.get('li[aria-label="pagination item 2"]').click();

        submissionsData.data.getSubmissions.userSolutions
            .slice(20, 39)
            .forEach((submission, index) => {
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(1)`).should('contain', 'See solution');
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(2)`).should('contain', submission.language);
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(3)`).should('contain', submission.score);
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(4)`).should('contain', new Date(+submission.date).toLocaleString());
                cy.get(`tbody tr:nth-child(${index + 1}) td:nth-child(5)`).should('contain', submission.status);
            })

    })
})