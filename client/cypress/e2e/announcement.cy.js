describe('Announcement Page', () => {
    const title = 'ANNOUNCEMENT TEST';

    beforeEach(() => {
        cy.visit(`/announcement/${title}`);
    });

    it('should display the announcement content when loaded', () => {
        cy.intercept('POST', '**/graphql', {
            body: {
                data: {
                    getAnnouncement: {
                        title,
                        content: `<article>
  <h1>Announcement</h1>
  <p>We are excited to announce that our company is expanding! We have been working hard behind the scenes to bring you a broader range of products and services.</p>
  <p>We wish to extend our heartfelt thanks to every one of you for your vital support and commitment. We look forward to sharing this exciting journey with you.</p>
  </article>`,
                        createdBy: 'xndadelin'
                    }
                }
            }
        }).as('getAnnouncement');

        cy.wait('@getAnnouncement');

        cy.get('h1').contains('ANNOUNCEMENT TEST').should('exist');

        cy.get('article')
            .contains('We are excited to announce that our company is expanding!')
            .should('exist');

        cy.get('article')
            .contains('We wish to extend our heartfelt thanks to every one of you for your vital support and commitment.')
            .should('exist');

        cy.get('section > a').should('have.attr', 'href', '/profile/xndadelin');
    });

    it('should display a 404 component when the announcement is not found', () => {
        cy.intercept('POST', '**/graphql', {
            body: {
                data: {
                    getAnnouncement: null
                }
            }
        }).as('getAnnouncement');

        cy.wait('@getAnnouncement');

        cy.get('h1').contains('404').should('exist');
    })
});
