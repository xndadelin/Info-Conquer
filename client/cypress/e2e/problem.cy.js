import mockProblem from '../fixtures/problem/problem.json';
import mockSolution from '../fixtures/problem/solution.json';

const solutionData = JSON.parse(JSON.stringify(mockSolution));
const problemData = JSON.parse(JSON.stringify(mockProblem));

const password = ''

describe('Problem page', () => {
  beforeEach(() => {
    cy.login('xnd.adelin', password);
    cy.visit('/problems/Sum00');

    cy.intercept('POST', 'http://localhost:8080/graphql', (req) => {
      if (req.body.hasOwnProperty('operationName') && req.body.operationName === 'GetProblem') {
        req.reply(problemData);
      }
    });

    cy.intercept('POST', 'http://localhost:8080/graphql', (req) => {
      if (req.body.hasOwnProperty('operationName') && req.body.operationName === 'Submit') {
        req.reply(solutionData);
      }
    });

  });

  it('should display all details of the problem', () => {
    cy.get('h1').should('contain', problemData.data.getProblem.title);
    cy.get('span').should('contain', 'Problem');
    cy.get('span').should('contain', 'Submissions');
    cy.get('span').should('contain', 'Insights');
    cy.get('h3').should('contain', problemData.data.getProblem.creator);
    cy.get('h3').should('contain', problemData.data.getProblem.difficulty);
    cy.get('h3').should('contain', problemData.data.getProblem.category);
    cy.get('span').should('contain', problemData.data.getProblem.subcategories[0]);
    cy.get('h3').should('contain', problemData.data.getProblem.timeExecution); + ' s'
    cy.get('h3').should('contain', parseInt(problemData.data.getProblem.limitMemory) / 1024 + ' MB');

    cy.get('div').should('contain', problemData.data.getProblem.requirements);
    cy.get('div').should('contain', problemData.data.getProblem.input);
    cy.get('div').should('contain', problemData.data.getProblem.output);

    cy.get('h2').should('contain', 'Example');
    cy.get('pre').should('contain', problemData.data.getProblem.examples[0].input);
    cy.get('pre').should('contain', problemData.data.getProblem.examples[0].output);

    problemData.data.getProblem.languages.forEach(language => {
      cy.get('div > button[data-slot="trigger"]').click();
      cy.get('span').should('contain', language);
    });

    cy.get('h3').should('contain', '/ 5');

    cy.get('h3').should('contain', '%');
  });

  it('should display the code editor', () => {
    cy.get('.cm-editor').should('be.visible').should('not.be.empty');
  });

  it('should display the AI assistant button', () => {
    cy.get('button').should('contain', '🤖');
  });

  it('should display the submit button', () => {
    cy.get('button').should('contain', 'Submit');
  });

  it('should display header information correctly', () => {
    cy.get('button').contains('Submit').click();

    cy.get('section > header').within(() => {
      cy.contains('User: xndadelin');
      cy.contains('ID: d9ef1fb3-55ec-42a0-8170-517015143270');
      cy.contains('Problem: Sum00');
      cy.contains('Language: C++');
    });
  });

  it('should correctly display the test results', () => {
    cy.get('button').contains('Submit').click();
    cy.get('tbody tr').should('have.length', 5);

    cy.get('tbody tr').each(($row, index) => {
      cy.wrap($row).within(() => {
        cy.get('td').eq(0).should('contain', index + 1);
        cy.get('td').eq(1).should('contain', '0.00');
        cy.get('td').eq(2).should('contain', '3.');
        cy.get('td').eq(3).should('contain', '0');
        cy.get('td').eq(4).should('contain', 'WA');
        cy.get('td').eq(5).should('contain', '0');
        cy.get('td').eq(6).should('contain', 'Wrong Answer');
      });
    });
  });

  it('should display the score correctly and link to the solution', () => {
    cy.get('button').contains('Submit').click();
    cy.contains('Score:').parent().find('span').should('contain', '0');

    cy.get('.bg-yellow-900').should('contain', 'There are tests that failed');

    cy.contains('View Solution')
      .should('have.attr', 'href', '/solution/xndadelin/d9ef1fb3-55ec-42a0-8170-517015143270');
  });

  it('should get a response from the AI assistant', () => {
    cy.get('button').contains('🤖').click();

  })

});
