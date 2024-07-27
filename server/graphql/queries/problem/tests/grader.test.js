const { grader } = require('../../../../utils/graders/grader');

// (testCases, code, problem, username, language, max_time, max_memory)

const code = `
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}
`;
const testCases = [
    {
        input: '1 2',
        output: '3',
        score: 33
    },
    {
        input: '2 3',
        output: '5',
        score: 33
    },
    {
        input: '3 4',
        output: '7',
        score: 34
    }
];
const problem = 'Sum of two numbers';
const username = 'xndadelin';
const language = 'C++';
const max_time = 1;
const max_memory = 256 * 1024;

it('should get accepted solution on good code', () => {
    const results = grader(testCases, code, problem, username, language, max_time, max_memory);

    const expectedResults = {
        username: 'xndadelin',
        problem: 'Sum of two numbers',
        language: 'C++',
        score: 100,
        tests: [
            {
                status: 'AC',
                success: true,
                executionTime: expect.any(Number),
                memoryUsed: expect.any(Number),
                score: 33,
                input: '1 2',
                output: '3',
                expectedOutput: '3',
                exitcode: 0,
                exitsig: null,
                message: 'OK',
                cerr: ''
            },
            {
                status: 'AC',
                success: true,
                executionTime: expect.any(Number),
                memoryUsed: expect.any(Number),
                score: 33,
                input: '2 3',
                output: '5',
                expectedOutput: '5',
                exitcode: 0,
                exitsig: null,
                message: 'OK',
                cerr: ''
            },
            {
                status: 'AC',
                success: true,
                executionTime: expect.any(Number),
                memoryUsed: expect.any(Number),
                score: 34,
                input: '3 4',
                output: '7',
                expectedOutput: '7',
                exitcode: 0,
                exitsig: null,
                message: 'OK',
                cerr: ''
            }
        ],
        fileMemory: expect.any(Number),
        compilationError: null,
        success: true,
        id_solution: expect.any(String),
        status: 'Accepted'
    };

    expect(results).toMatchObject(expectedResults);
});
it('should get compilation error on bad code', () => {
    const badCode = `
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b
    return 0;
}
`;

    const results = grader(testCases, badCode, problem, username, language, max_time, max_memory);

    expect(results).toMatchObject({
        compilationError: expect.any(String),
        success: false,
        status: 'CE'
    });
})
it('should get wrong answer on wrong code', () => {
    const wrongCode = `
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a - b;
    return 0;
}
`;

    const results = grader(testCases, wrongCode, problem, username, language, max_time, max_memory);

    const expectedResults = {
        username: 'xndadelin',
        problem: 'Sum of two numbers',
        language: 'C++',
        score: 0,
        tests: [
            {
                status: 'WA',
                success: false,
                executionTime: expect.any(Number),
                memoryUsed: expect.any(Number),
                score: 0,
                input: '1 2',
                output: '-1',
                expectedOutput: '3',
                exitcode: 0,
                exitsig: null,
                message: 'Wrong Answer',
                cerr: ''
            },
            {
                status: 'WA',
                success: false,
                executionTime: expect.any(Number),
                memoryUsed: expect.any(Number),
                score: 0,
                input: '2 3',
                output: '-1',
                expectedOutput: '5',
                exitcode: 0,
                exitsig: null,
                message: 'Wrong Answer',
                cerr: ''
            },
            {
                status: 'WA',
                success: false,
                executionTime: expect.any(Number),
                memoryUsed: expect.any(Number),
                score: 0,
                input: '3 4',
                output: '-1',
                expectedOutput: '7',
                exitcode: 0,
                exitsig: null,
                message: 'Wrong Answer',
                cerr: ''
            }
        ],
        fileMemory: expect.any(Number),
        compilationError: null,
        success: false,
        id_solution: expect.any(String),
        status: 'WA on test 1'
    };

    expect(results).toMatchObject(expectedResults);
})
it('should get tle on slow code', () => {
    const slowCode = `
#include <iostream>

int main(){
    for(int i = 0; i < 10000000000; ++i);
    return 0;
}
    `
    const results = grader(testCases, slowCode, problem, username, language, max_time, max_memory);
    const expectedResults =     {
        username: 'xndadelin',
        code: '\n' +
          '#include <iostream>\n' +
          '\n' +
          'int main(){\n' +
          '    for(int i = 0; i < 10000000000; ++i);\n' +
          '    return 0;\n' +
          '}\n' +
          '    ',
        problem: 'Sum of two numbers',
        language: 'C++',
        score: 0,
        tests: [
          {
            status: 'TO',
            success: false,
            score: 0,
            input: '1 2',
            output: '',
            expectedOutput: '3',
            message: 'Time Limit Exceeded',
            exitcode: null,
            exitsig: null,
            cerr: ''
          },
          {
            status: 'TO',
            success: false,
            score: 0,
            input: '2 3',
            output: '',
            expectedOutput: '5',
            message: 'Time Limit Exceeded',
            exitcode: null,
            exitsig: null,
            cerr: ''
          },
          {
            status: 'TO',
            success: false,
            score: 0,
            input: '3 4',
            output: '',
            expectedOutput: '7',
            message: 'Time Limit Exceeded',
            exitcode: null,
            exitsig: null,
            cerr: ''
          }
        ],
        compilationError: null,
        success: false,
        status: 'TLE on test 1'
      }
    expect(results).toMatchObject(expectedResults);
    expect(results.tests.every(test => test.executionTime > 1)).toBe(true);
})