import React from 'react';

const CommandOutput = ({ type, content }) => {
  return (
    <div className={`output-line ${type}`}>
      {type === 'input' ? <span className="prompt">user@gemini-cli:~$</span> : null}
      <span>{content}</span>
    </div>
  );
};

export default CommandOutput;
