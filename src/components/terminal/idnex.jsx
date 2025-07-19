import React, { useState } from 'react';
import CommandInput from './CommandInput';
import CommandOutput from './CommandOutput';
import './terminal.scss'


import { about } from './commands/about';
import { projects } from './commands/projects';
import { blogs } from './commands/blogs';

const processCommand = (command) => {
  const [cmd, ...args] = command.trim().split(' ');

  switch (cmd.toLowerCase()) {
    case 'about':
      return about();
    case 'projects':
      return projects();
    case 'blogs':
      return blogs();
    case 'help':
      return '可用命令: about, projects, blogs, help';
    default:
      return `未知命令: ${cmd}`;
  }
};

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'input', content: 'muliminty' },
  ]);

  const executeCommand = (command) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      { type: 'input', content: command },
      { type: 'output', content: processCommand(command) },
    ]);
  };

  return (
    <div className="terminal">
      <div className="output">
        {history.map((entry, index) => (
          <CommandOutput key={index} type={entry.type} content={entry.content} />
        ))}
      </div>
      <CommandInput onExecute={executeCommand} />
    </div>
  );
};

export default Terminal;
