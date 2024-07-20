describe('Leaderboard Page', () => {
    beforeEach(() => {
        cy.visit('/leaderboard');
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === 'getLeaderboard') {
                req.reply({
                    data: {
                        getLeaderboard: [
                            { "username": "xndadelin", "solvedProblems": 3, "profilePicture": "https://media-otp1-1.cdn.whatsapp.net/v/t61.24694-24/323897539_810001734056767_7060389578336875307_n.jpg?ccb=11-4&oh=01_Q5AaIKh-qlV7UGV2E4iVGinBZ756aIK4zaTvbsutexlqv_JQ&oe=669CAD44&_nc_sid=e6ed6c&_nc_cat=104" },
                            { "username": "xnd.adelin", "solvedProblems": 1, "profilePicture": "https://avatars.githubusercontent.com/u/111001628?v=4https://avatars.githubusercontent.com/u/111001628?v=4" },
                            { "username": "ArdeiIutee", "solvedProblems": 0, "profilePicture": null },
                            { "username": "qwerty", "solvedProblems": 0, "profilePicture": null },
                            { "username": "tester", "solvedProblems": 0, "profilePicture": null },
                            { "username": "cosmin", "solvedProblems": 0, "profilePicture": null }
                        ]
                    }
                })
            }
        })
    });

    it('should display the leaderboard header and description', () => {
        cy.get('h1').contains('Leaderboard').should('exist');
        cy.get('p').contains('Here you can see the top users who have solved the most problems!').should('exist');
    });

    it('should display the top 3 users correctly', () => {
        cy.get('div[data-cy="top1"]').should('contain', 'xndadelin');
        cy.get('div[data-cy="top2"]').should('contain', 'xnd.adelin');
        cy.get('div[data-cy="top3"]').should('contain', 'ArdeiIutee');

    });

    it('should display the rest of the users in the table', () => {

        cy.get('table').within(() => {
            cy.get('tr').should('have.length', 4);
            cy.get('tr').eq(1).contains('qwerty').should('exist');
            cy.get('tr').eq(2).contains('tester').should('exist');
            cy.get('tr').eq(3).contains('cosmin').should('exist');
        });
    });

    it('should display the pagination component', () => {
        cy.get('nav[aria-label="pagination navigation"]').should('exist');
    });

    it('should have working profile links', () => {
        cy.get('a[href="/profile/qwerty"]').should('exist');
        cy.get('a[href="/profile/qwerty"]').click();
        cy.url().should('include', '/profile/qwerty');
    });
});