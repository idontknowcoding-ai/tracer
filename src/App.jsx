
import React, { useState } from 'react';
import CodeDisplay from './components/CodeDisplay';
import TraceTable from './components/TraceTable';
import CallStackVisualizer from './components/CallStackVisualizer';
import './App.css';

const SCENARIOS = {
  LOOP: 'LOOP',
  RECURSION: 'RECURSION'
};

const DATA = {
  [SCENARIOS.LOOP]: {
    name: 'For Loop',
    code: `let sum = 0;
for (let i = 0; i < 3; i++) {
  sum = sum + i;
}
console.log(sum);`,
    columns: [
      { key: 'i', label: 'i' },
      { key: 'sum', label: 'sum' }
    ],
    // For loop doesn't really have a call stack in the same way, but we can just pass empty or main
    traceSteps: [
      { line: 1, vars: { sum: 0, i: undefined }, stack: ['main'], note: 'Initialize sum', output: '' },
      { line: 2, vars: { sum: 0, i: 0 }, stack: ['main'], note: 'Initialize i=0. Check 0 < 3 (True)', output: '' },
      { line: 3, vars: { sum: 0, i: 0 }, stack: ['main'], note: 'sum = 0 + 0', output: '' },
      { line: 2, vars: { sum: 0, i: 1 }, stack: ['main'], note: 'i++ (i becomes 1). Check 1 < 3 (True)', output: '' },
      { line: 3, vars: { sum: 1, i: 1 }, stack: ['main'], note: 'sum = 0 + 1', output: '' },
      { line: 2, vars: { sum: 1, i: 2 }, stack: ['main'], note: 'i++ (i becomes 2). Check 2 < 3 (True)', output: '' },
      { line: 3, vars: { sum: 3, i: 2 }, stack: ['main'], note: 'sum = 1 + 2', output: '' },
      { line: 2, vars: { sum: 3, i: 3 }, stack: ['main'], note: 'i++ (i becomes 3). Check 3 < 3 (False)', output: '' },
      { line: 5, vars: { sum: 3, i: 3 }, stack: ['main'], note: 'Log sum', output: '3' },
    ]
  },
  [SCENARIOS.RECURSION]: {
    name: 'Recursion (Factorial)',
    code: `function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(3));`,
    columns: [
      { key: 'n', label: 'n' },
    ],
    traceSteps: [
      // Initial Call
      { line: 5, vars: { n: undefined }, stack: [], note: 'Start: console.log(factorial(3))', output: '' },

      // factorial(3)
      { line: 1, vars: { n: 3 }, stack: ['factorial(3)'], note: 'Called factorial(3)', output: '' },
      { line: 2, vars: { n: 3 }, stack: ['factorial(3)'], note: 'Check 3 === 1 (False)', output: '' },
      { line: 3, vars: { n: 3 }, stack: ['factorial(3)'], note: 'Returns 3 * factorial(2). Need factorial(2)', output: '' },

      // factorial(2)
      { line: 1, vars: { n: 2 }, stack: ['factorial(3)', 'factorial(2)'], note: 'Called factorial(2)', output: '' },
      { line: 2, vars: { n: 2 }, stack: ['factorial(3)', 'factorial(2)'], note: 'Check 2 === 1 (False)', output: '' },
      { line: 3, vars: { n: 2 }, stack: ['factorial(3)', 'factorial(2)'], note: 'Returns 2 * factorial(1). Need factorial(1)', output: '' },

      // factorial(1)
      { line: 1, vars: { n: 1 }, stack: ['factorial(3)', 'factorial(2)', 'factorial(1)'], note: 'Called factorial(1)', output: '' },
      { line: 2, vars: { n: 1 }, stack: ['factorial(3)', 'factorial(2)', 'factorial(1)'], note: 'Check 1 === 1 (True)', output: '' },
      { line: 2, vars: { n: 1 }, stack: ['factorial(3)', 'factorial(2)', 'factorial(1)'], note: 'Return 1', output: 'result: 1' },

      // Unwind to factorial(2)
      { line: 3, vars: { n: 2 }, stack: ['factorial(3)', 'factorial(2)'], note: 'Resume factorial(2). Got 1. Return 2 * 1 = 2', output: 'result: 2' },

      // Unwind to factorial(3)
      { line: 3, vars: { n: 3 }, stack: ['factorial(3)'], note: 'Resume factorial(3). Got 2. Return 3 * 2 = 6', output: 'result: 6' },

      // Back to main
      { line: 5, vars: { n: undefined }, stack: [], note: 'Log result', output: '6' },
    ]
  }
}

function App() {
  const [scenarioKey, setScenarioKey] = useState(SCENARIOS.LOOP);
  const [currentStep, setCurrentStep] = useState(0);

  const scenario = DATA[scenarioKey];
  const currentStack = scenario.traceSteps[currentStep].stack;

  const handleNext = () => {
    if (currentStep < scenario.traceSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
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
      <header>
        <h1>Pen & Paper Trace</h1>
        <div className="scenario-selector">
          <label>Choose Trace: </label>
          <select value={scenarioKey} onChange={handleScenarioChange} className="paper-select">
            {Object.entries(DATA).map(([key, data]) => (
              <option key={key} value={key}>{data.name}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="main-content">
        <div className="left-panel">
          <CodeDisplay
            code={scenario.code}
            currentLine={scenario.traceSteps[currentStep].line}
          />

          <div className="controls">
            <button onClick={handleReset} disabled={currentStep === 0}>Reset</button>
            <button onClick={handlePrev} disabled={currentStep === 0}>Previous</button>
            <button onClick={handleNext} disabled={currentStep === scenario.traceSteps.length - 1}>Next Step</button>
          </div>

          <div className="status-text">
            {scenario.traceSteps[currentStep].note}
          </div>
        </div>

        <div className="right-panel">
          <CallStackVisualizer stack={currentStack} />
          <TraceTable
            traceSteps={scenario.traceSteps}
            currentStepIndex={currentStep}
            columns={scenario.columns}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
