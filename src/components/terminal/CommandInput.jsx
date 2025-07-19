import React, { useState } from 'react';

const CommandInput = ({ onExecute }) => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim() !== '') {
      onExecute(command);
      setCommand('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="command-input">
      <span className="prompt">user@muliminty:~$</span>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        autoFocus
        placeholder="请输入命令"
      />
    </form>
  );
};

export default CommandInput;
