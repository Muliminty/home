import React from 'react';

const CommandOutput = ({ type, content }) => {
  return (
    <div className={`output-line ${type}`}>
      {type === 'input' ? <span className="prompt">user@muliminty:~$</span> : null}
      <span>{content}</span>
    </div>
  );
};

export default CommandOutput;
