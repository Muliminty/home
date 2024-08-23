// src/home/page/about/index.jsx
import React, { useState } from 'react';
import Loading from '../../components/Loading/index';
const About = () => {
    const [flog, setFlog] = useState(false)
    const ProblematicComponent = () => {
        // 这个组件有可能会抛出错误
        throw new Error('Oops! Something went wrong.')
        return <div>This is a problematic component</div>
    }
    return <div onClick={() => { setFlog(!flog) }}>
        About Page
        {flog && <ProblematicComponent />}
        {/* <Loading /> */}
    </div>;
};

export default About;
