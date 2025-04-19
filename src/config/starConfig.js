// 星空效果配置文件
export const starConfig = {
    // 基础星星配置
    stars: {
        count: 150, // 星星数量
        sizeRange: [1, 4], // 星星大小范围 [最小值, 最大值]
        animationDurationRange: [2, 5], // 闪烁动画持续时间范围 [最小值, 最大值]
        colors: ['#ffffff', '#f0f8ff', '#fffafa'], // 星星可能的颜色
        opacity: [0.3, 1], // 透明度变化范围 [最小值, 最大值]
    },

    // 鼠标交互配置
    mouseInteraction: {
        enabled: true, // 是否启用鼠标交互
        maxDistance: 500, // 最大影响距离
        intensity: 20, // 移动强度
    },

    // 星星不规则运动配置
    randomMotion: {
        enabled: true, // 是否启用不规则运动
        speed: 0.3, // 移动速度
        range: 20, // 移动范围（像素）
        updateInterval: 2000, // 更新方向间隔（毫秒）
    },

    // 流星配置
    meteors: {
        enabled: true, // 是否启用流星
        count: 50, // 同时出现的最大流星数
        sizeRange: [2, 4], // 流星大小范围
        speedRange: [10, 20], // 速度范围
        trailLength: 50, // 拖尾长度
        interval: [1000, 2000], // 新流星生成间隔范围（毫秒）
        angle: [-30, -60], // 流星角度范围（度）
        colors: ['#ffffff', '#f0f8ff'], // 流星可能的颜色
    }
};