import { Card, CardHeader, Button, Input } from '@nextui-org/react';

export const DropFile = ({ tests, setTests }) => {

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleDrop = async (e) => {
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
      score: equalScore
    }));

    setTests(updatedTests);
  };

  const renderDropZone = () => (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-300 mb-4"
    >
      <p className="text-2xl font-bold text-gray-700 mb-2">
        Drop input/output files here
      </p>
      <p className="text-sm text-gray-500">
        Files should be named as "1.in", "1.out", etc.
      </p>
    </div>
  );

  const renderTestCases = () => (
    <div className="space-y-4 mb-8">
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
        <Card key={number} className="shadow-md">
          <CardHeader className="flex justify-between max-md:flex-col gap-5">
            <div>
              <p className="text-md font-semibold">Test Case {index + 1}</p>
              <p className="text-sm text-gray-500">
                Score: {score || 'Not set'}
              </p>
              <div className="flex gap-2 flex-col mt-1">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">Input:</p>
                  <div className="p-2 bg-neutral-800 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap">{input}</pre>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">Output:</p>
                  <div className="p-2 bg-neutral-800 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap">{output}</pre>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mb-auto">
              <Input
                type="number"
                placeholder="Score"
                onChange={(e) => handleScoreChange(number, e.target.value)}
                className="w-20"
              />
              <Button
                color="danger"
                variant="flat"
                onClick={() => handleDelete(number)}
              >
                Delete Test Case
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}

    </div>
  );

  return (
    <div className='mt-5'>
      {renderDropZone()}
      {renderTestCases()}
    </div>
  );
};
