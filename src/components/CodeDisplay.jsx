import React from 'react';

const CodeDisplay = ({ code, currentLine }) => {
  const lines = code.split('\n');

  return (
    <div className="code-display paper-shadow">
      <div className="code-header">Code</div>
      <pre>
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === currentLine;
          return (
            <div key={lineNumber} className={`code-line ${isActive ? 'active-line' : ''}`}>
              <span className="line-number">{lineNumber}</span>
              <span className="line-content">{line}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
};

export default CodeDisplay;
