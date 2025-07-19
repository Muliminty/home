import React, { useState } from 'react';
import CommandInput from './CommandInput';
import CommandOutput from './CommandOutput';
import './terminal.scss'


import { about } from './commands/about';
import { projects } from './commands/projects';
import { blogs } from './commands/blogs';
import { Link } from './commands/link';

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
    case 'link':
      return Link();
    default:
      return `未知命令: ${cmd}`;
  }
};

const asciiArt = `
▗▖  ▗▖▗▖ ▗▖▗▖   ▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▖  ▗▖
▐▛▚▞▜▌▐▌ ▐▌▐▌     █  ▐▛▚▞▜▌  █  ▐▛▚▖▐▌  █   ▝▚▞▘ 
▐▌  ▐▌▐▌ ▐▌▐▌     █  ▐▌  ▐▌  █  ▐▌ ▝▜▌  █    ▐▌  
▐▌  ▐▌▝▚▄▞▘▐▙▄▄▖▗▄█▄▖▐▌  ▐▌▗▄█▄▖▐▌  ▐▌  █    ▐▌  


欢迎来到我的个人网站

你可以输入 help 查看可用命令

`;

const Terminal = () => {
  const [history, setHistory] = useState([
    {
      type: 'input', content: <div
        style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'Courier New, monospace',
          color: '#00FF00',
        }}
      >
        {asciiArt}
      </div>

    },
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
