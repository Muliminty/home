import React from 'react';
import styled from 'styled-components';

const CardHover = () => {
  return (
    <StyledWrapper>
      <div className="card" style={{ width: '100%', height: '100%' }}>
        <div className="content">
          <div className="front">
            <h3 className="title">你好,  I'm Muliminty</h3>

            <br />
            <p className="subtitle">Hover me :)</p>
          </div>
          <div className="back">
            <p className="description">
              希望我们都能保持清醒和有意义的生活😁
            </p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width:100%;
  height:100%;

  .card {
  height:100%;
  cursor: pointer;
  }

  .content {
    text-align: center;
    position: relative;
    transition: all 1.25s;
    //背景色 
        background: linear-gradient(135deg, #6078ea, #17ead9);
    color: #000;
    padding: 5em;
    transform-style: preserve-3d;
        width: 100%;
    height: 100%;
  }

  .card:hover .content {
    transform: rotateY(0.5turn);
  }

  .front,
  .back {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 2em;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  .title {
    transform: translateZ(5rem);
    font-size: 2rem;
  }

  .subtitle {
    transform: translateZ(2rem);
  }

  .back {
    transform: rotateY(0.5turn);
    background: linear-gradient(135deg, #17ead9, #6078ea);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .description {
    transform: translateZ(3rem);
    text-align: justify;
    
  }`;

export default CardHover;
