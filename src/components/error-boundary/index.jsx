import React, { Component } from 'react'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        // 更新状态以显示错误界面
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // 可以将错误日志上报到服务器
        console.error("Error caught by ErrorBoundary:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // 自定义的错误信息界面
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h1>Something went wrong.</h1>
                    <p>We're sorry for the inconvenience. Please try again later.</p>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
