// src/home/page/about/index.jsx
import React from 'react';
import Loading from '../../components/Loading/index';
const About = () => {

    return <div onClick={() => { throw new Error('Oops! Something went wrong.') }}>
        About Page
        {/* <Loading /> */}
    </div>;
};

export default About;
