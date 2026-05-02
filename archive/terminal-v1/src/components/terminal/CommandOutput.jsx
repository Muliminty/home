
const CommandOutput = ({ type, content }) => {
  return (
    <div className={`output-line ${type}`}>
      {type === 'input' ? <span className="prompt">user@muliminty:~$</span> : null}
      <div style={{ display: 'inline-block', width: '100%' }}>
        {content}
      </div>
    </div>
  );
};

export default CommandOutput;
