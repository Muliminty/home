import { useState, useEffect, useRef } from 'react';
import { starConfig } from '@/config/starConfig';

/**
 * 星空效果自定义Hook
 * 处理星星生成、不规则运动和流星效果
 */
const useStarfield = () => {
    const [stars, setStars] = useState([]);
    const [meteors, setMeteors] = useState([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const lastUpdateTimeRef = useRef({});

    // 生成随机星星
    const generateStars = () => {
        const newStars = [];
        const { count, sizeRange, animationDurationRange, colors } = starConfig.stars;

        for (let i = 0; i < count; i++) {
            newStars.push({
                id: i,
                x: Math.random() * 100, // 随机x位置（百分比）
                y: Math.random() * 100, // 随机y位置（百分比）
                size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
                animationDuration: Math.random() * (animationDurationRange[1] - animationDurationRange[0]) + animationDurationRange[0],
                color: colors[Math.floor(Math.random() * colors.length)],
                // 不规则运动参数
                offsetX: 0,
                offsetY: 0,
                directionX: Math.random() * 2 - 1,
                directionY: Math.random() * 2 - 1,
                nextUpdateTime: Date.now() + Math.random() * starConfig.randomMotion.updateInterval
            });
        }

        setStars(newStars);
    };

    // 创建新流星
    const createMeteor = () => {
        const { sizeRange, speedRange, trailLength, angle, colors } = starConfig.meteors;

        // 随机位置（从屏幕顶部或右侧开始）
        const startFromTop = Math.random() > 0.5;
        const x = startFromTop ? Math.random() * 100 : 100;
        const y = startFromTop ? 0 : Math.random() * 50;

        // 随机角度（转换为弧度）
        const angleRad = (Math.random() * (angle[1] - angle[0]) + angle[0]) * Math.PI / 180;

        // 速度
        const speed = Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0];

        return {
            id: Date.now(),
            x,
            y,
            size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
            speed,
            angle: angleRad,
            trailLength,
            color: colors[Math.floor(Math.random() * colors.length)],
            trail: [], // 存储轨迹点
        };
    };

    // 更新流星位置
    const updateMeteors = () => {
        setMeteors(prevMeteors => {
            // 移除已经离开屏幕的流星
            const activeMeteors = prevMeteors.filter(meteor =>
                meteor.x > -10 && meteor.y < 110);

            // 如果流星数量少于配置的数量，且随机条件满足，则创建新流星
            if (activeMeteors.length < starConfig.meteors.count &&
                Math.random() < 0.01) { // 每帧有1%的概率创建新流星
                activeMeteors.push(createMeteor());
            }

            // 更新每个流星的位置
            return activeMeteors.map(meteor => {
                // 根据角度和速度计算新位置
                const newX = meteor.x + Math.cos(meteor.angle) * meteor.speed * 0.1;
                const newY = meteor.y - Math.sin(meteor.angle) * meteor.speed * 0.1;

                // 更新轨迹
                const newTrail = [...meteor.trail, { x: meteor.x, y: meteor.y }];
                if (newTrail.length > meteor.trailLength) {
                    newTrail.shift(); // 移除最老的轨迹点
                }

                return {
                    ...meteor,
                    x: newX,
                    y: newY,
                    trail: newTrail
                };
            });
        });
    };

    // 更新星星的不规则运动
    const updateStarsRandomMotion = () => {
        const now = Date.now();
        const { speed, range, updateInterval } = starConfig.randomMotion;

        setStars(prevStars =>
            prevStars.map(star => {
                // 检查是否需要更新方向
                if (now >= star.nextUpdateTime) {
                    return {
                        ...star,
                        directionX: Math.random() * 2 - 1,
                        directionY: Math.random() * 2 - 1,
                        nextUpdateTime: now + Math.random() * updateInterval
                    };
                }

                // 更新偏移量
                let newOffsetX = star.offsetX + star.directionX * speed * 0.05;
                let newOffsetY = star.offsetY + star.directionY * speed * 0.05;

                // 限制偏移范围
                if (Math.abs(newOffsetX) > range) {
                    newOffsetX = Math.sign(newOffsetX) * range;
                    star.directionX *= -1; // 反向
                }
                if (Math.abs(newOffsetY) > range) {
                    newOffsetY = Math.sign(newOffsetY) * range;
                    star.directionY *= -1; // 反向
                }

                return {
                    ...star,
                    offsetX: newOffsetX,
                    offsetY: newOffsetY
                };
            })
        );
    };

    // 动画循环
    const animationLoop = () => {
        if (starConfig.randomMotion.enabled) {
            updateStarsRandomMotion();
        }

        if (starConfig.mouseInteraction.enabled) {
            updateStarsPosition();
        }

        if (starConfig.meteors.enabled) {
            updateMeteors();
        }

        animationFrameRef.current = requestAnimationFrame(animationLoop);
    };

    // 处理鼠标移动事件
    const handleMouseMove = (e) => {
        if (!containerRef.current || !starConfig.mouseInteraction.enabled) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePosition({ x, y });
    };

    // 更新星星位置（包含鼠标交互效果）
    const updateStarsPosition = () => {
        if (!containerRef.current || !starConfig.mouseInteraction.enabled) return;

        const { maxDistance, intensity } = starConfig.mouseInteraction;
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const containerHeight = containerRef.current?.offsetHeight || 0;

        setStars(prevStars => 
            prevStars.map(star => {
                // 计算星星与鼠标的距离
                const starX = star.x / 100 * containerWidth;
                const starY = star.y / 100 * containerHeight;
                const dx = starX - mousePosition.x;
                const dy = starY - mousePosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 根据距离计算移动效果
                const moveIntensity = Math.max(0, 1 - distance / maxDistance) * intensity;

                // 计算移动方向（远离鼠标）
                const moveX = distance > 0 ? (dx / distance) * moveIntensity : 0;
                const moveY = distance > 0 ? (dy / distance) * moveIntensity : 0;

                return {
                    ...star,
                    offsetX: star.offsetX + moveX * 0.1, // 平滑过渡
                    offsetY: star.offsetY + moveY * 0.1  // 平滑过渡
                };
            })
        );
    };

    // 初始化
    useEffect(() => {
        generateStars();

        // 启动动画循环
        animationFrameRef.current = requestAnimationFrame(animationLoop);

        // 清理函数
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return {
        stars,
        meteors,
        containerRef,
        handleMouseMove
    };
};

export default useStarfield;