import { useEffect, useRef } from 'react';

const TraceTable = ({ traceSteps, currentStepIndex, columns }) => {
  const currentRowRef = useRef(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentStepIndex triggers the scroll when the active row changes
  useEffect(() => {
    if (currentRowRef.current) {
      currentRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentStepIndex]);

  return (
    <div className="trace-table-container paper-shadow">
      <div className="table-header">Trace Table</div>
      <table className="handwritten-table">
        <thead>
          <tr>
            <th>Step</th>
            <th>Line</th>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Note</th>
            <th>Output/Return</th>
          </tr>
        </thead>
        <tbody>
          {traceSteps.map((step, index) => {
            if (index > currentStepIndex) return null;

            return (
              <tr
                key={step.id}
                className={index === currentStepIndex ? 'current-row' : ''}
                ref={index === currentStepIndex ? currentRowRef : null}
              >
                <td>{index + 1}</td>
                <td>{step.line}</td>
                {columns.map((col) => (
                  <td key={col.key}>{step.vars[col.key] !== undefined ? step.vars[col.key] : '-'}</td>
                ))}
                <td>{step.note}</td>
                <td>{step.output}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TraceTable;
