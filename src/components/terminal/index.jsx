import { useState, useEffect, useRef } from 'react';
import CommandInput from './CommandInput';
import CommandOutput from './CommandOutput';
import './terminal.scss'
import { terminalConfig } from '@/config/terminal.config.js';

import { about } from './commands/about';
import { projects } from './commands/projects';
import { blogs, readBlog, showTags } from './commands/blogs';
import { Link } from './commands/link';
import { help } from './commands/help';

const Terminal = () => {
  const { terminal: terminalSettings, theme } = terminalConfig;
  const canvasRef = useRef(null);
  const [history, setHistory] = useState([
    {
      type: 'input', content: <div
        style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'Courier New, monospace',
          color: theme.primaryColor,
        }}
      >
        {terminalSettings.asciiArt}
      </div>

    },
  ]);
  const [commandHistory, setCommandHistory] = useState([]); // 命令历史数组
  const [helpActive, setHelpActive] = useState(false);
  const [showTip, setShowTip] = useState(terminalSettings.showTip);

  // 粒子背景效果
  useEffect(() => {
    if (!terminalSettings.enableParticles) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const { particles: particleConfig } = theme;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (particleConfig.maxSize - particleConfig.minSize) + particleConfig.minSize;
        this.speedY = Math.random() * (particleConfig.maxSpeed - particleConfig.minSpeed) + particleConfig.minSpeed;
        this.opacity = Math.random() * (particleConfig.maxOpacity - particleConfig.minOpacity) + particleConfig.minOpacity;
      }
      
      update() {
        this.y += this.speedY;
        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
      }
      
      draw() {
        const rgb = theme.primaryColor.match(/\d+/g);
        const r = parseInt(rgb[0], 16) || 0;
        const g = parseInt(rgb[1], 16) || 255;
        const b = parseInt(rgb[2], 16) || 0;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleConfig.count; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [terminalSettings.enableParticles, theme]);

  const executeCommand = (command) => {
    const [cmd, ...args] = command.trim().split(' ');
    
    // 特殊处理clear命令
    if (cmd.toLowerCase() === 'clear') {
      setHistory([]);
      return;
    }
    
    // 记录命令历史（跳过clear和空命令）
    if (command.trim()) {
      setCommandHistory((prev) => {
        const newHistory = [...prev, command];
        // 最多保存100条历史
        return newHistory.length > 100 ? newHistory.slice(-100) : newHistory;
      });
    }
    
    // 特殊处理history命令
    if (cmd.toLowerCase() === 'history') {
      const historyOutput = history
        .filter((entry, idx) => entry.type === 'input' && idx > 0) // 跳过初始的ASCII艺术
        .map((entry, idx) => `${idx + 1}. ${entry.content}`)
        .join('\n') || '暂无历史记录';
      
      setHistory((prevHistory) => [
        ...prevHistory,
        { type: 'input', content: command },
        { type: 'output', content: historyOutput },
      ]);
      return;
    }
    
    setHistory((prevHistory) => [
      ...prevHistory,
      { type: 'input', content: command },
      { type: 'output', content: processCommand(command, args) },
    ]);
  };
  
  const processCommand = (command, args = []) => {
    const [cmd, ...cmdArgs] = command.trim().split(' ');


    const helpList = [
      {
        name: 'about',
        fn: about,
      },
      {
        name: 'projects',
        fn: projects,
      },
      {
        name: 'blogs',
        fn: blogs,
      },
      {
        name: 'link',
        fn: Link,
      },
    ]
    switch (cmd.toLowerCase()) {
      case 'about':
        return about();
      case 'projects':
        return projects();
      case 'blogs': {
        // 检查是否有--tag参数
        const tagIndex = cmdArgs.indexOf('--tag');
        if (tagIndex !== -1 && cmdArgs[tagIndex + 1]) {
          return blogs(executeCommand, cmdArgs[tagIndex + 1]);
        }
        return blogs(executeCommand);
      }
      case 'read':
        if (args.length === 0) {
          return '请指定文章ID，例如：read 1';
        }
        return readBlog(args[0]);
      case 'tag':
      case 'tags':
        return showTags(executeCommand);
      case 'help':
        return help(helpList, executeCommand, setHelpActive);
      case 'link':
        return Link();
      case 'clear':
      case 'history':
        return null; // 这些命令已在上层处理
      default:
        return `未知命令: ${cmd}，输入 'help' 查看可用命令`;
    }
  };

  return (
    <div className="terminal">
      <canvas ref={canvasRef} className="particle-bg" />
      {showTip && (
        <div className="terminal-header">
          <div 
            onClick={() => setShowTip(false)}
            style={{ 
              color: '#00ff00', 
              fontSize: '12px', 
              marginBottom: '10px',
              padding: '5px 10px',
              background: 'rgba(0, 255, 0, 0.05)',
              border: '1px solid rgba(0, 255, 0, 0.2)',
              borderRadius: '4px',
              opacity: 0.8,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            💡 快捷键提示: Ctrl+L 清屏 | ESC 清空输入 | ↑↓ 浏览历史命令 (点击隐藏)
          </div>
        </div>
      )}
      <div className="output">
        {history.map((entry, index) => (
          <CommandOutput key={index} type={entry.type} content={entry.content} />
        ))}
      </div>
      {!helpActive && <CommandInput onExecute={executeCommand} commandHistory={commandHistory} />}
    </div>
  );
};

export default Terminal;
