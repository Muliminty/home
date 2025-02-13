import React from 'react'

const Loading = () => {
  return (
    <div className="loading" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

    }}>
      <div style={{
        fontSize: '24px',
        color: '#646cff'
      }}>
        加载中...
      </div>
    </div>
  )
}

export default Loading
