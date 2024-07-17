import mockProblem from '../fixtures/problem/problem.json';
import mockSolution from '../fixtures/problem/solution.json';
import aiResponse from '../fixtures/problem/ai.json';

const solutionData = JSON.parse(JSON.stringify(mockSolution));
const problemData = JSON.parse(JSON.stringify(mockProblem));
const aiData = JSON.parse(JSON.stringify(aiResponse));


describe('Problem page (logged in)', () => {
  beforeEach(() => {
    cy.login(); 
    cy.visit('/problems/Sum00');

    cy.intercept('POST', 'http://localhost:8080/graphql', (req) => {
      if (req.body.operationName === 'GetProblem') {
        req.reply(problemData);
      } else if (req.body.operationName === 'Submit') {
        req.reply(solutionData);
      } else if (req.body.operationName === 'GetChatbotMessage') {
        req.reply(aiData);
      }
    });

  });

  it("should display all the problem's info correctly", () => {
    cy.get('h1').should('contain', problemData.data.getProblem.title);
    cy.get('div[data-cy="problem_description"]').should('contain', problemData.data.getProblem.description);
    cy.get('div[data-cy="problem_description"]').should('contain', problemData.data.getProblem.requirements);
    cy.get('div[data-cy="problem_description"]').should('contain', problemData.data.getProblem.input);
    cy.get('div[data-cy="problem_description"]').should('contain', problemData.data.getProblem.output);
    cy.get('pre').should('contain', problemData.data.getProblem.examples[0].input);
    cy.get('pre').should('contain', problemData.data.getProblem.examples[0].output);
  })

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

  it('should get a response from the AI assistant and displayed it in the code editor', () => {
    cy.get('button').contains('Get help from AI').click();
    cy.wait(1000)
    cy.get('textarea[data-cy="problem_chatbot_prompt"]').should('be.visible').type('How to solve this problem?');
    cy.get('footer > button').contains('Send').click();
    cy.get('textarea[data-cy="problem_chatbot_prompt"]').should('not.exist');
    const htmlContent = `<div class="cm-activeLine cm-line"><span class="ͼ13">#include</span> <span class="ͼv">&lt;iostream&gt;</span></div><div class="cm-line"><br></div><div class="cm-line"><span class="ͼu">int</span> <span class="ͼr">main</span>(){</div><div class="cm-line">  <span class="ͼu">int</span> <span class="ͼq">n</span>;</div><div class="cm-line">  <span class="ͼu">std</span>::<span class="ͼq">cin</span> <span class="ͼv">&gt;&gt;</span> <span class="ͼq">n</span>; <span class="ͼw">// read the integer from standard input</span></div><div class="cm-line">  <span class="ͼw">// calculate and print the sum of the first n natural numbers</span></div><div class="cm-line">  <span class="ͼu">std</span>::<span class="ͼq">cout</span> <span class="ͼv">&lt;&lt;</span> <span class="ͼq">n</span> <span class="ͼv">*</span> (<span class="ͼq">n</span> <span class="ͼv">+</span> <span class="ͼu">1</span>) <span class="ͼv">/</span> <span class="ͼu">2</span>;</div><div class="cm-line">}</div><div class="cm-line"><br></div>`
    cy.get('.cm-content').should('have.html', htmlContent);

  })
});

describe('Problem page (not logged in)', () => {
  beforeEach(() => {
    cy.visit('/problems/Sum00');
  });

  it('should not display editor', () => {
    cy.get('div[data-cy="problem_editor_logged"]').should('not.exist');
    cy.get('div[data-cy="problem_editor_not_logged"]').should('be.visible');
  });

  it('should not display AI assistant button', () => {
    cy.get('button').contains('🤖').should('not.exist');
  });

  it('should not display submit button', () => {
    cy.get('button').contains('Submit').should('not.exist');
  });

  it('should not display the rate this problem action', () => {
    cy.get('button').contains('Rate this problem').should('not.exist');
  })

  it('should not display the report this problem action', () => {
    cy.get('button').contains('Report this problem').should('not.exist');
  })
})