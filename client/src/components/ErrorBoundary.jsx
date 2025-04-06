
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Card className="my-4">
                    <CardHeader>
                        <CardTitle className="text-gray-700">Something went wrong</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500">We're working on fixing this. Please try again later.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;


