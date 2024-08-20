import './style.scss';

const Cube = ({ className }) => (
    <div className={`cube ${className}`}>
        <div className="face top"></div>
        <div className="face left"></div>
        <div className="face right"></div>
    </div>
);

const CubeContainer = ({ heightClass }) => (
    <div className={`${heightClass}Container`}>
        {['w1', 'w2', 'w3'].map(widthClass =>
            [1, 2, 3].map(depthClass => (
                <Cube key={`${heightClass}-${widthClass}-${depthClass}`} className={`${heightClass} ${widthClass} l${depthClass}`} />
            ))
        )}
    </div>
);

const Loading = () => (
    <div className='loading'>
        <div className="container">
            <CubeContainer heightClass="h1" />
            <CubeContainer heightClass="h2" />
            <CubeContainer heightClass="h3" />
        </div>
    </div>
);

export default Loading;
