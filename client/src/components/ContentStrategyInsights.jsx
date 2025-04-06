
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import LoadingSpinner from './LoadingSpinner';

const ContentStrategyInsights = ({ contentStrategy, loading }) => {
    if (loading) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mt-6">
                <div className="space-y-6">
                    <div className="animate-pulse bg-gray-100 h-8 w-48 rounded"></div>
                    <div className="grid grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-gray-50 rounded-lg animate-pulse">
                                <div className="h-4 bg-gray-100 rounded w-3/4 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-100 rounded"></div>
                                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!contentStrategy) {
        return (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Content Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">No strategy insights available yet. Keep creating content and check back later!</p>
                </CardContent>
            </Card>
        );
    }

    const {
        ai_content_recommendation = {},
        ai_posting_strategy = {},
        ai_audience_retention_tips = {},
        ai_growth_opportunities = {}
    } = contentStrategy;

    return (
        <div className="space-y-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Content Strategy Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        {/* Content Recommendations */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">Key Recommendations</h3>
                            <p className="text-gray-700 mb-3">{ai_content_recommendation?.analysis || 'Analysis not available'}</p>
                            <ul className="space-y-2">
                                {(ai_content_recommendation?.recommendations || ['Start creating content', 'Analyze performance regularly']).map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Posting Strategy */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {Object.entries(ai_posting_strategy).map(([key, value]) => (
                                <div key={key} className="bg-white border border-gray-100 shadow-sm p-4 rounded-lg hover:shadow-md transition-shadow">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2 capitalize">
                                        {key.replace(/_/g, ' ')}
                                    </h4>
                                    <p className="text-gray-800">{value || 'Not available'}</p>
                                </div>
                            ))}
                        </div>

                        {/* Retention Tips & Growth Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg text-purple-700">Retention Tips</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-3">
                                    {Object.entries(ai_audience_retention_tips).map(([key, value]) => (
                                        <div key={key} className="bg-purple-50 p-3 rounded-lg">
                                            <h4 className="text-sm font-medium text-purple-900 mb-1 capitalize">
                                                {key.replace(/_/g, ' ')}
                                            </h4>
                                            <p className="text-sm text-purple-700">{value || 'Tip not available'}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg text-green-700">Growth Opportunities</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-3">
                                    {Object.entries(ai_growth_opportunities).map(([key, value]) => (
                                        <div key={key} className="bg-green-50 p-3 rounded-lg">
                                            <h4 className="text-sm font-medium text-green-900 mb-1 capitalize">
                                                {key.replace(/_/g, ' ')}
                                            </h4>
                                            <p className="text-sm text-green-700">{value || 'Opportunity not available'}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContentStrategyInsights;

