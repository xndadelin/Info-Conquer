import { Card, CardHeader, Button, Input, Spinner } from '@nextui-org/react';
import { useState } from 'react';

export const DropFile = ({ tests, setTests }) => {

  const [loading, setLoading] = useState(false);

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleDrop = async (e) => {
    setLoading(true);
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const newTestCases = [...tests];

    const filePromises = droppedFiles.map(async (file) => {
      const match = file.name.match(/^(\d+)\.(in|out)$/);
      if (match) {
        const [_, number, type] = match;
        const content = await readFileContent(file);
        let existingCase = newTestCases.find((tc) => tc.number === number);
        if (!existingCase) {
          existingCase = { number, input: '', output: '', score: '' };
          newTestCases.push(existingCase);
        }
        existingCase[type === 'in' ? 'input' : 'output'] = content;
      }
    });

    await Promise.all(filePromises);
    setTests(newTestCases);
    setLoading(false);
  };

  const handleDelete = (number) => {
    setTests((prev) => prev.filter((tc) => tc.number !== number));
  };

  const handleScoreChange = (newScore) => {
    const parsedScore = parseFloat(newScore);

    if (isNaN(parsedScore)) return;

    const updatedTests = tests.map((tc) => ({
      ...tc,
      score: (parsedScore / tests.length).toFixed(2)
    }));

    setTests(updatedTests);
  };

  const handleEqualizeScores = () => {
    if (tests.length === 0) return;

    const equalScore = (100 / tests.length).toFixed(2);

    const updatedTests = tests.map((tc) => ({
      ...tc,
      score: Number(equalScore)
    }));

    setTests(updatedTests);
  };

  const renderDropZone = () => (
    <section
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-300 mb-4"
    >
      <p className="text-2xl font-bold mb-2">
        Drop input/output files here
      </p>
      <p className="text-sm text-gray-500">
        Files should be named as "1.in", "1.out", etc.
      </p>
    </section>
  );

  const renderTestCases = () => (
    <section className="space-y-4 mb-8">
      {tests.length === 0 ? (
        <p className="text-center text-gray-500">
          No test cases added yet. Drop input/output files above.
        </p>
      ) : (
        <p className="text-center text-gray-500">
          Edit scores for each test case below.
          <Button
            className='ml-5'
            color="success"
            onClick={handleEqualizeScores}
          >
            Equalize Scores
        </Button>
        </p>
      )}

      {tests.map(({ number, score, input, output }, index) => (
        <Card key={number} className="shadow-md bg-gray-800">
          <CardHeader className="flex justify-between max-md:flex-col gap-5">
            <section>
              <h3 className="text-md font-semibold">Test Case {index + 1}</h3>
              <h4 className="text-sm text-gray-500">
                Score: {score || 'Not set'}
              </h4>
              <div className="flex gap-2 flex-col mt-1">
                <div className="flex flex-col">
                  <h4 className="text-sm text-gray-500">Input:</h4>
                  <div className="p-2 bg-gray-600 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap">{input}</pre>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm text-gray-500">Output:</h4>
                  <div className="p-2 bg-gray-600 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap">{output}</pre>
                  </div>
                </div>
              </div>
            </section>
            <div className="flex gap-2 mb-auto">
              <Input
                type="number"
                placeholder="Score"
                onChange={(e) => handleScoreChange(number, e.target.value)}
                className="w-20"
                value={tests[index].score}
              />
              <Button
                color="danger"
                variant="solid"
                onClick={() => handleDelete(number)}
              >
                Delete Test Case
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </section>
  );

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p className="text-2xl font-bold">
          <Spinner title='Loading' />
        </p>
      </main>
    );
  }

  return (
    <main className='mt-5'>
      {renderDropZone()}
      {renderTestCases()}
    </main>
  );
};
