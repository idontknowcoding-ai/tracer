import { useState } from 'react';

import CallStackVisualizer from './components/CallStackVisualizer';
import CodeDisplay from './components/CodeDisplay';
import Sidebar from './components/Sidebar';
import TraceTable from './components/TraceTable';

const SCENARIOS = {
  LOOP: 'LOOP',
  RECURSION: 'RECURSION',
  IF_ELSE: 'IF_ELSE',
  SWITCH: 'SWITCH',
  WHILE: 'WHILE',
  DO_WHILE: 'DO_WHILE',
};

const DATA = {
  [SCENARIOS.IF_ELSE]: {
    name: 'If-Else Statement',
    code: `let num = 10;
if (num > 5) {
  console.log('Greater');
} else {
  console.log('Smaller');
}`,
    columns: [{ key: 'num', label: 'num' }],
    traceSteps: [
      {
        line: 1,
        vars: { num: 10 },
        stack: ['main'],
        note: 'Initialize num = 10',
        output: '',
      },
      {
        line: 2,
        vars: { num: 10 },
        stack: ['main'],
        note: 'Check num > 5 (10 > 5 is True)',
        output: '',
      },
      {
        line: 3,
        vars: { num: 10 },
        stack: ['main'],
        note: 'Execute if block. Log "Greater"',
        output: 'Greater',
      },
    ],
  },
  [SCENARIOS.LOOP]: {
    name: 'For Loop',
    code: `let sum = 0;
for (let i = 0; i < 3; i++) {
  sum = sum + i;
}
console.log(sum);`,
    columns: [
      { key: 'i', label: 'i' },
      { key: 'sum', label: 'sum' },
    ],
    // For loop doesn't really have a call stack in the same way, but we can just pass empty or main
    traceSteps: [
      {
        line: 1,
        vars: { sum: 0, i: undefined },
        stack: ['main'],
        note: 'Initialize sum',
        output: '',
      },
      {
        line: 2,
        vars: { sum: 0, i: 0 },
        stack: ['main'],
        note: 'Initialize i=0. Check 0 < 3 (True)',
        output: '',
      },
      {
        line: 3,
        vars: { sum: 0, i: 0 },
        stack: ['main'],
        note: 'sum = 0 + 0',
        output: '',
      },
      {
        line: 2,
        vars: { sum: 0, i: 1 },
        stack: ['main'],
        note: 'i++ (i becomes 1). Check 1 < 3 (True)',
        output: '',
      },
      {
        line: 3,
        vars: { sum: 1, i: 1 },
        stack: ['main'],
        note: 'sum = 0 + 1',
        output: '',
      },
      {
        line: 2,
        vars: { sum: 1, i: 2 },
        stack: ['main'],
        note: 'i++ (i becomes 2). Check 2 < 3 (True)',
        output: '',
      },
      {
        line: 3,
        vars: { sum: 3, i: 2 },
        stack: ['main'],
        note: 'sum = 1 + 2',
        output: '',
      },
      {
        line: 2,
        vars: { sum: 3, i: 3 },
        stack: ['main'],
        note: 'i++ (i becomes 3). Check 3 < 3 (False)',
        output: '',
      },
      {
        line: 5,
        vars: { sum: 3, i: 3 },
        stack: ['main'],
        note: 'Log sum',
        output: '3',
      },
    ],
  },
  [SCENARIOS.WHILE]: {
    name: 'While Loop',
    code: `let count = 0;
while (count < 2) {
  console.log(count);
  count++;
}`,
    columns: [{ key: 'count', label: 'count' }],
    traceSteps: [
      {
        line: 1,
        vars: { count: 0 },
        stack: ['main'],
        note: 'Initialize count = 0',
        output: '',
      },
      {
        line: 2,
        vars: { count: 0 },
        stack: ['main'],
        note: 'Check count < 2 (0 < 2 is True)',
        output: '',
      },
      {
        line: 3,
        vars: { count: 0 },
        stack: ['main'],
        note: 'Log count',
        output: '0',
      },
      {
        line: 4,
        vars: { count: 1 },
        stack: ['main'],
        note: 'Increment count to 1',
        output: '',
      },
      {
        line: 2,
        vars: { count: 1 },
        stack: ['main'],
        note: 'Check count < 2 (1 < 2 is True)',
        output: '',
      },
      {
        line: 3,
        vars: { count: 1 },
        stack: ['main'],
        note: 'Log count',
        output: '1',
      },
      {
        line: 4,
        vars: { count: 2 },
        stack: ['main'],
        note: 'Increment count to 2',
        output: '',
      },
      {
        line: 2,
        vars: { count: 2 },
        stack: ['main'],
        note: 'Check count < 2 (2 < 2 is False)',
        output: '',
      },
    ],
  },
  [SCENARIOS.DO_WHILE]: {
    name: 'Do-While Loop',
    code: `let i = 0;
do {
  console.log(i);
  i++;
} while (i < 1);`,
    columns: [{ key: 'i', label: 'i' }],
    traceSteps: [
      {
        line: 1,
        vars: { i: 0 },
        stack: ['main'],
        note: 'Initialize i = 0',
        output: '',
      },
      {
        line: 3,
        vars: { i: 0 },
        stack: ['main'],
        note: 'Enter loop. Log i',
        output: '0',
      },
      {
        line: 4,
        vars: { i: 1 },
        stack: ['main'],
        note: 'Increment i to 1',
        output: '',
      },
      {
        line: 5,
        vars: { i: 1 },
        stack: ['main'],
        note: 'Check i < 1 (1 < 1 is False)',
        output: '',
      },
    ],
  },
  [SCENARIOS.SWITCH]: {
    name: 'Switch Statement',
    code: `let day = 2;
let dayName;
switch (day) {
  case 1:
    dayName = 'Mon';
    break;
  case 2:
    dayName = 'Tue';
    break;
  default:
    dayName = 'Unknown';
}
console.log(dayName);`,
    columns: [
      { key: 'day', label: 'day' },
      { key: 'dayName', label: 'dayName' },
    ],
    traceSteps: [
      {
        line: 1,
        vars: { day: 2, dayName: undefined },
        stack: ['main'],
        note: 'Initialize day = 2',
        output: '',
      },
      {
        line: 2,
        vars: { day: 2, dayName: undefined },
        stack: ['main'],
        note: 'Initialize dayName',
        output: '',
      },
      {
        line: 3,
        vars: { day: 2, dayName: undefined },
        stack: ['main'],
        note: 'Switch on day (2)',
        output: '',
      },
      {
        line: 4,
        vars: { day: 2, dayName: undefined },
        stack: ['main'],
        note: 'Check case 1: 2 === 1 (False)',
        output: '',
      },
      {
        line: 7,
        vars: { day: 2, dayName: undefined },
        stack: ['main'],
        note: 'Check case 2: 2 === 2 (True)',
        output: '',
      },
      {
        line: 8,
        vars: { day: 2, dayName: 'Tue' },
        stack: ['main'],
        note: 'Assign dayName = "Tue"',
        output: '',
      },
      {
        line: 9,
        vars: { day: 2, dayName: 'Tue' },
        stack: ['main'],
        note: 'Break out of switch',
        output: '',
      },
      {
        line: 13,
        vars: { day: 2, dayName: 'Tue' },
        stack: ['main'],
        note: 'Log dayName',
        output: 'Tue',
      },
    ],
  },
  [SCENARIOS.RECURSION]: {
    name: 'Recursion (Factorial)',
    code: `function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(3));`,
    columns: [{ key: 'n', label: 'n' }],
    traceSteps: [
      // Initial Call
      {
        line: 5,
        vars: { n: undefined },
        stack: [],
        note: 'Start: console.log(factorial(3))',
        output: '',
      },

      // factorial(3)
      {
        line: 1,
        vars: { n: 3 },
        stack: ['factorial(3)'],
        note: 'Called factorial(3)',
        output: '',
      },
      {
        line: 2,
        vars: { n: 3 },
        stack: ['factorial(3)'],
        note: 'Check 3 === 1 (False)',
        output: '',
      },
      {
        line: 3,
        vars: { n: 3 },
        stack: ['factorial(3)'],
        note: 'Returns 3 * factorial(2). Need factorial(2)',
        output: '',
      },

      // factorial(2)
      {
        line: 1,
        vars: { n: 2 },
        stack: ['factorial(3)', 'factorial(2)'],
        note: 'Called factorial(2)',
        output: '',
      },
      {
        line: 2,
        vars: { n: 2 },
        stack: ['factorial(3)', 'factorial(2)'],
        note: 'Check 2 === 1 (False)',
        output: '',
      },
      {
        line: 3,
        vars: { n: 2 },
        stack: ['factorial(3)', 'factorial(2)'],
        note: 'Returns 2 * factorial(1). Need factorial(1)',
        output: '',
      },

      // factorial(1)
      {
        line: 1,
        vars: { n: 1 },
        stack: ['factorial(3)', 'factorial(2)', 'factorial(1)'],
        note: 'Called factorial(1)',
        output: '',
      },
      {
        line: 2,
        vars: { n: 1 },
        stack: ['factorial(3)', 'factorial(2)', 'factorial(1)'],
        note: 'Check 1 === 1 (True)',
        output: '',
      },
      {
        line: 2,
        vars: { n: 1 },
        stack: ['factorial(3)', 'factorial(2)', 'factorial(1)'],
        note: 'Return 1',
        output: 'result: 1',
      },

      // Unwind to factorial(2)
      {
        line: 3,
        vars: { n: 2 },
        stack: ['factorial(3)', 'factorial(2)'],
        note: 'Resume factorial(2). Got 1. Return 2 * 1 = 2',
        output: 'result: 2',
      },

      // Unwind to factorial(3)
      {
        line: 3,
        vars: { n: 3 },
        stack: ['factorial(3)'],
        note: 'Resume factorial(3). Got 2. Return 3 * 2 = 6',
        output: 'result: 6',
      },

      // Back to main
      {
        line: 5,
        vars: { n: undefined },
        stack: [],
        note: 'Log result',
        output: '6',
      },
    ],
  },
};

function App() {
  const [scenarioKey, setScenarioKey] = useState(SCENARIOS.LOOP);
  const [currentStep, setCurrentStep] = useState(0);

  const scenario = DATA[scenarioKey];
  const currentStack = scenario.traceSteps[currentStep].stack;

  const handleNext = () => {
    if (currentStep < scenario.traceSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleScenarioChange = (e) => {
    setScenarioKey(e.target.value);
    setCurrentStep(0);
  };

  return (
    <div className="app-container">
      <Sidebar scenarios={DATA} currentScenario={scenarioKey} onSelectScenario={setScenarioKey} />

      <div className="content-wrapper">
        <header>
          <h1>Pen & Paper Trace</h1>
        </header>

        <main className="main-content">
          <div className="left-panel">
            <div className="paper-shadow">
              <div className="code-header">Code</div>
              <CodeDisplay code={scenario.code} currentLine={scenario.traceSteps[currentStep].line} />
            </div>

            <div className="controls">
              <button onClick={handleReset} disabled={currentStep === 0}>
                Reset
              </button>
              <button onClick={handlePrev} disabled={currentStep === 0}>
                Previous
              </button>
              <button onClick={handleNext} disabled={currentStep === scenario.traceSteps.length - 1}>
                Next Step
              </button>
            </div>

            <div className="status-text">{scenario.traceSteps[currentStep].note}</div>
          </div>

          <div className="right-panel">
            <div className="paper-shadow">
              <div className="code-header">Trace Table</div>
              <TraceTable traceSteps={scenario.traceSteps} currentStepIndex={currentStep} columns={scenario.columns} />
            </div>
            <div className="paper-shadow">
              <div className="code-header">Call Stack</div>
              <CallStackVisualizer stack={currentStack} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
