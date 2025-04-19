// 导入 React 钩子和动画库
import { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion'; // 使用 Framer Motion 实现动画
import styles from './neon-cursor.module.scss'; // 样式模块


/**
 * NeonCursor 组件 - 实现动态霓虹光标效果
 * 包含三个层级：主光标点、拖尾圆圈、外层发光效果
*/
const NeonCursor = () => {
    // 状态管理 ============================================================
    // 光标位置和状态
    const [position, setPosition] = useState({
        x: 0,       // X轴坐标
        y: 0,       // Y轴坐标
        scale: 1,   // 缩放比例
        opacity: 1  // 透明度
    });
    const [isClicking, setIsClicking] = useState(false);   // 鼠标按下状态
    const [isHovering, setIsHovering] = useState(false);  // 悬停交互状态

    // 动画控制器 ==========================================================
    const trailControls = useAnimation();  // 拖尾圆圈动画控制器
    const glowControls = useAnimation();   // 发光效果动画控制器

    // 事件处理函数 ========================================================
    // 鼠标移动事件：更新光标位置
    const handleMouseMove = useCallback((e) => {
        setPosition(prev => ({
            ...prev,
            x: e.clientX,  // 同步鼠标X坐标
            y: e.clientY   // 同步鼠标Y坐标
        }));
    }, []);

    // 鼠标按下/释放事件
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // 鼠标悬停事件：当悬停在可交互元素上时触发特效
    const handleMouseOver = useCallback((e) => {
        const target = e.target;
        // 匹配链接、按钮、输入框或自定义可交互元素
        if (target.matches('a, button, input, [data-hover="true"]')) {
            setIsHovering(true);
            // 启动拖尾动画：放大并改变边框颜色
            trailControls.start({
                scale: 1.5,
                borderColor: 'rgb(255, 150, 50)', // 悬停时橙色边框
                borderWidth: '3px'
            });
            // 启动发光动画：增强发光效果
            glowControls.start({
                scale: 2,
                opacity: 0.8
            });
        }
    }, [trailControls, glowControls]);

    // 鼠标移出事件：恢复默认状态
    const handleMouseOut = useCallback(() => {
        setIsHovering(false);
        // 重置拖尾动画
        trailControls.start({
            scale: 1,
            borderColor: 'rgb(236, 101, 23)', // 默认橙红色边框
            borderWidth: '2px'
        });
        // 重置发光动画
        glowControls.start({
            scale: 1,
            opacity: 0.4
        });
    }, [trailControls, glowControls]);

    // 副作用钩子 ==========================================================
    useEffect(() => {
        // 添加事件监听器
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);

        // 组件卸载时清理事件监听
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, [handleMouseMove, handleMouseOver, handleMouseOut]);

    // 组件渲染 ============================================================
    return (
        <div className={styles['neon-cursor-container']}>
            {/* 主光标点 */}
            <motion.div
                className={styles['cursor-main']}
                animate={{
                    // 位置计算：中心点对齐（-10px偏移）
                    x: position.x - 10,
                    y: position.y - 10,
                    // 缩放逻辑：点击时缩小，悬停时放大
                    scale: isClicking ? 0.8 : isHovering ? 1.2 : 1
                }}
                // 弹簧动画参数配置
                transition={{
                    type: 'spring',   // 使用弹簧物理模型
                    damping: 20,     // 阻尼系数（控制回弹力度）
                    stiffness: 400,  // 刚度系数（控制响应速度）
                    mass: 0.2        // 质量（影响惯性效果）
                }}
            />

            {/* 拖尾圆圈（中间层） */}
            <motion.div
                className={styles['cursor-trail']}
                animate={{
                    // 延迟跟随效果（-20px偏移）
                    x: position.x - 20,
                    y: position.y - 20
                }}
                // 更柔和的弹簧参数
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 200,
                    mass: 0.8
                }}
                initial={false}  // 禁用初始动画
            />

            {/* 外层发光效果（最延迟层） */}
            <motion.div
                className={styles['cursor-glow']}
                animate={{
                    // 最大延迟跟随（-30px偏移）
                    x: position.x - 30,
                    y: position.y - 30
                }}
                // 最缓和的弹簧参数
                transition={{
                    type: 'spring',
                    damping: 40,
                    stiffness: 150,
                    mass: 1
                }}
                initial={false}
            />
        </div>
    );
};

export default NeonCursor;