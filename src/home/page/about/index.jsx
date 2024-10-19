import React, { useState } from 'react';
import Loading from '../../components/Loading/index';

const About = () => {

    const links = [
        { href: 'https://www.yuque.com/muliminty', label: '语雀' },
        { href: 'https://github.com/Muliminty', label: 'GitHub' },
        { href: 'https://www.cnblogs.com/Muliminty/', label: '博客园' },
    ];

    return (
        <div>
            <div style={{ padding: '24px' }}>
                <div> 
                    小郑：4年前端
                    <br /> 
                    <br /> 技术栈：
                    <br /> JavaScript, HTML, CSS, React, Antd,Redux, MobX
                    <br /> node, express,Sass, Less
                    <br /> Axios, Git, Webpack, Vite
                    <br />
                    <br />其他：
                    <div style={{ display: 'flex', }}>
                        {links.map((link, index) => (
                            <div key={index} style={{ marginRight: '5px' }}>
                                <a href={link.href} target="_blank" rel="noopener noreferrer">
                                    {link.label}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
