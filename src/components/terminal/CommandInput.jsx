import { useState, useEffect, useRef } from 'react';

const CommandInput = ({ onExecute, commandHistory = [] }) => {
  const [command, setCommand] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempCommand, setTempCommand] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim() !== '') {
      onExecute(command);
      setCommand('');
      setHistoryIndex(-1);
      setTempCommand('');
      // 提交后重新聚焦
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl+L 清屏
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      onExecute('clear');
      return;
    }
    
    // ESC 清空当前输入
    if (e.key === 'Escape') {
      setCommand('');
      setHistoryIndex(-1);
      setTempCommand('');
      return;
    }
    
    // 向上键 - 浏览历史
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        // 如果还没开始浏览历史，保存当前输入
        if (historyIndex === -1) {
          setTempCommand(command);
        }
        
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
      return;
    }
    
    // 向下键 - 浏览历史
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          // 到达历史底部，恢复临时保存的命令
          setHistoryIndex(-1);
          setCommand(tempCommand);
          setTempCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        }
      }
      return;
    }
  };

  // 组件挂载后聚焦
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 点击terminal区域时聚焦到输入框
  useEffect(() => {
    const handleTerminalClick = (e) => {
      // 如果点击的是terminal区域但不是交互元素
      const terminal = e.target.closest('.terminal');
      const isInteractive = e.target.closest('button, a, input, select, textarea') ||
                            e.target.closest('[onclick]') ||
                            e.target.closest('[role="button"]');
      
      if (terminal && !isInteractive && !e.target.closest('.terminal-header')) {
        // 延迟一下再聚焦，避免与其他点击事件冲突
        setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
      }
    };

    document.addEventListener('click', handleTerminalClick);
    return () => document.removeEventListener('click', handleTerminalClick);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="command-input">
      <span className="prompt">user@muliminty:~$</span>
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        placeholder="请输入命令"
      />
    </form>
  );
};

export default CommandInput;
