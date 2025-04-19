import React, { useRef, useEffect } from 'react';
import styles from './star-background.module.scss';
import useStarfield from '@/hooks/useStarfield';

/**
 * 星空背景组件
 * 可复用的星空背景效果，包含星星和流星
 * 使用Canvas实现以提高性能
 */
const StarBackground = () => {
    const { stars, meteors, containerRef, handleMouseMove } = useStarfield();
    const canvasRef = useRef(null);

    // 使用Canvas绘制星空背景
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const container = containerRef.current;
        
        // 设置Canvas尺寸为容器尺寸
        const resizeCanvas = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        
        // 初始化Canvas尺寸
        resizeCanvas();
        
        // 监听窗口大小变化
        window.addEventListener('resize', resizeCanvas);
        
        // 绘制函数
        const draw = () => {
            // 清除画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 绘制星星
            stars.forEach(star => {
                // 计算实际位置（百分比转像素）
                const x = (star.x / 100) * canvas.width + star.offsetX;
                const y = (star.y / 100) * canvas.height + star.offsetY;
                
                // 设置星星样式
                ctx.fillStyle = star.color;
                
                // 计算星星闪烁效果的不透明度
                const now = Date.now() / 1000;
                const opacity = 0.3 + Math.abs(Math.sin(now / star.animationDuration)) * 0.7;
                ctx.globalAlpha = opacity;
                
                // 绘制星星（圆形）
                ctx.beginPath();
                ctx.arc(x, y, star.size / 2, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // 绘制流星
            meteors.forEach(meteor => {
                // 绘制流星头部
                const meteorX = (meteor.x / 100) * canvas.width;
                const meteorY = (meteor.y / 100) * canvas.height;
                
                ctx.fillStyle = meteor.color;
                ctx.globalAlpha = 1;
                ctx.beginPath();
                ctx.arc(meteorX, meteorY, meteor.size / 2, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制流星轨迹
                meteor.trail.forEach((point, index) => {
                    const pointX = (point.x / 100) * canvas.width;
                    const pointY = (point.y / 100) * canvas.height;
                    const sizeRatio = 1 - index / meteor.trail.length;
                    const size = meteor.size * sizeRatio;
                    
                    ctx.globalAlpha = sizeRatio * 0.6;
                    ctx.beginPath();
                    ctx.arc(pointX, pointY, size / 2, 0, Math.PI * 2);
                    ctx.fill();
                });
            });
            
            // 循环动画
            requestAnimationFrame(draw);
        };
        
        // 启动动画
        draw();
        
        // 清理函数
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [stars, meteors]);
    
    return (
        <div className={styles.starContainer} ref={containerRef} onMouseMove={handleMouseMove}>
            <canvas ref={canvasRef} className={styles.starCanvas} />
        </div>
    );
};

export default StarBackground;