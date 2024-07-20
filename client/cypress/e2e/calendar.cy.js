describe('Calendar Page', () => {
    const testData = {
        data: {
            getDailies: [
                { problem: "Sum00", date: "2024-06-22T00:00:00.000Z", solved: true, __typename: "Daily" },
                { problem: "CaesarCipher", date: "2024-06-21T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "Sort1", date: "2024-06-23T00:00:00.000Z", solved: true, __typename: "Daily" },
                { problem: "CaesarCipher", date: "2024-06-30T00:00:00.000Z", solved: true, __typename: "Daily" },
                { problem: "Sum00", date: "2024-07-01T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "CaesarCipher", date: "2024-07-02T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "Sort1", date: "2024-07-02T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "Sum00", date: "2024-07-03T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "Sum00", date: "2024-07-03T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "Sort1", date: "2024-07-04T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "TEST", date: "2024-07-04T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "SumSquares", date: "2024-07-05T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "TEST", date: "2024-07-06T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "Sum00", date: "2024-07-07T00:00:00.000Z", solved: true, __typename: "Daily" },
                { problem: "TEST", date: "2024-07-08T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "TEST", date: "2024-07-09T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "BinarySearch", date: "2024-07-10T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "SumSquares", date: "2024-07-11T00:00:00.000Z", solved: true, __typename: "Daily" },
                { problem: "TEST", date: "2024-07-12T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "BinarySearch", date: "2024-07-13T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "CaesarCipher", date: "2024-07-14T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "TEST", date: "2024-07-15T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "SumSquares", date: "2024-07-16T00:00:00.000Z", solved: true, __typename: "Daily" },
                { problem: "Sort1", date: "2024-07-17T00:00:00.000Z", solved: true, __typename: "Daily" },
                { problem: "CaesarCipher", date: "2024-07-18T00:00:00.000Z", solved: false, __typename: "Daily" },
                { problem: "BinarySearch", date: "2024-07-19T00:00:00.000Z", solved: false, __typename: "Daily" }
            ]
        }
    };
    const userData = {
        data: {
            getUser: {
                username: "xndadelin",
                createdAt: "1720288577438",
                email: null,
                admin: true,
                __typename: "User"
            }
        }
    };

    beforeEach(() => {
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === 'GetDailies') {
                req.reply({ body: testData });
            }
        })

        cy.visit('/calendar');
    });

    it('should display the calendar with correct month and year', () => {
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === 'GetUser') {
                req.reply({ body: userData });
            }
        })
        cy.get('h1').contains('July 2024').should('exist');
    })

    it('should display the calendar with correct daily problems', () => {
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === 'GetUser') {
                req.reply({ body: userData });
            }
        })

        cy.get('h1').contains('July 2024').should('exist');

        it('should display the calendar with correct daily problems', () => {
            cy.get('h1').contains('July 2024').should('exist');
    
            testData.data.getDailies.forEach(({ problem, date }) => {
                const formattedDate = new Date(date);
                const year = formattedDate.getUTCFullYear();
                const month = formattedDate.getUTCMonth() + 1;
                const day = formattedDate.getUTCDate();
    
                cy.get(`a[href="/daily/${problem}/${year}/${month}/${day}"]`).should('exist');
            });
        });
    });

    it('should render login required message when user is not logged in', () => {
        cy.get('h2').should('contain', 'Login Required');
    })

});
