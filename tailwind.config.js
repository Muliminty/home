// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                '24': 'repeat(24, minmax(0, 1fr))',
            },
            // 其他配置...
        },
    },
    plugins: [],
}