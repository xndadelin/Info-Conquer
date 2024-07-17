import mockInsigths from '../fixtures/insights/insights.json'

const insightsData = JSON.parse(JSON.stringify(mockInsigths));

describe('Insights tab', () => {
    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:8080/graphql', (req) => {
            if (req.body.operationName === 'GetProblemStats') {
                req.reply(insightsData);
            }
        })
        cy.visit('/problems/Sum00');
        cy.get('button[data-key="insights"]').click();
    });

    it('should display the insights tab', () => {
        cy.get('span').should('contain', 'Insights');
    })

    it('should render the solves over time chart ', () => {
        cy.get('canvas').should('be.visible');
    })

    it('should properly render the first solvers', () => {
        cy.get('a[class="font-extrabold"]').eq(0).should('have.attr', 'href', `/profile/${insightsData.data.getProblemStats.firstSubmissions[0]._id}`);
        cy.get('a[class="font-extrabold"]').eq(1).should('have.attr', 'href', `/profile/${insightsData.data.getProblemStats.firstSubmissions[1]._id}`);
    })

    it('should display best memory submissions correctly', () => {
        cy.get('table').eq(0).find('tbody tr').should('have.length', insightsData.data.getProblemStats.bestMemory.length);
        
        insightsData.data.getProblemStats.bestMemory.forEach((submission, index) => {
            cy.get('table').eq(0).find('tbody tr').eq(index).within(() => {
                cy.get('td').eq(0).should('contain.text', index + 1);
                cy.get('td').eq(1).find('a').should('have.attr', 'href', `/profile/${submission.username}`);
                cy.get('td').eq(1).find('a').should('contain.text', submission.username);
                cy.get('td').eq(2).should('contain.text', new Date(+submission.date).toDateString());
                cy.get('td').eq(3).should('contain.text', submission.language);
                cy.get('td').eq(4).should('contain.text', `${submission.memory} KB`);
            });
        });
    });

    it('should display time execution submissions correctly', () => {
        cy.get('table').eq(1).find('tbody tr').should('have.length', insightsData.data.getProblemStats.timeExecution.length);
        
        insightsData.data.getProblemStats.timeExecution.forEach((submission, index) => {
            cy.get('table').eq(1).find('tbody tr').eq(index).within(() => {
                cy.get('td').eq(0).should('contain.text', index + 1);
                cy.get('td').eq(1).find('a').should('have.attr', 'href', `/profile/${submission.username}`);
                cy.get('td').eq(1).find('a').should('contain.text', submission.username);
                cy.get('td').eq(2).should('contain.text', new Date(+submission.date).toDateString());
                cy.get('td').eq(3).should('contain.text', submission.language);
                cy.get('td').eq(4).should('contain.text', `${parseFloat(submission.timeExecutions).toFixed(4)} ms`);
            });
        });
    });

})