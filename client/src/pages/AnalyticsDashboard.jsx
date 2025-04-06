import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import ContentStrategyInsights from '../components/ContentStrategyInsights';
import axios from 'axios';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import MetricCard from '../components/MetricCard';
import { ThemeContext } from '../ThemeContext';

const YouTubeAnalyticsDashboard = () => {
    const [dateRange, setDateRange] = useState('Last 365 Days');
    const [contentStrategy, setContentStrategy] = useState(null);
    const [loadingStrategy, setLoadingStrategy] = useState(true);
    const { theme } = useContext(ThemeContext);
    const [dashboardData, setDashboardData] = useState({
        totalSubscribers: 0,
        subscribersGained: 0,
        subscribersGrowthPercent: 0,
        engagementRate: 0,
        engagementGrowthPercent: 0,
        totalViews: 0,
        viewsGrowthPercent: 0,
        impressions: 0,
        impressionsGrowthPercent: 0,
    });
    const [aiInsights, setAiInsights] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const email = "ntpjc2vinayak@gmail.com"
    const API_URL = "http://localhost:6001"

    // Fallback data
    const fallbackData = {
        totalSubscribers: 3250,
        subscribersGained: 450,
        subscribersGrowthPercent: 2.8,
        engagementRate: 4.2,
        engagementGrowthPercent: 0.9,
        totalViews: 152300,
        viewsGrowthPercent: 12.4,
        impressions: 312800,
        impressionsGrowthPercent: -1.2,
        audienceGrowthData: [
            { day: '1', subscribers: 3000 },
            { day: '7', subscribers: 3050 },
            { day: '14', subscribers: 3120 },
            { day: '21', subscribers: 3180 },
            { day: '28', subscribers: 3250 },
        ],
        contentPerformanceData: [
            { category: 'How-to', views: 42000 },
            { category: 'Reviews', views: 38000 },
            { category: 'Vlogs', views: 22000 },
            { category: 'Tutorials', views: 45000 },
            { category: 'Q&A', views: 32000 },
            { category: 'Shorts', views: 38000 },
        ],
        sentimentData: [
            { name: 'Positive', value: 80 },
            { name: 'Neutral', value: 15 },
            { name: 'Negative', value: 5 },
        ],
        topPerformingContent: [
            { title: 'Product Review: New Tech', likes: 8200 },
            { title: 'User Testimonial Video', likes: 6500 },
            { title: 'Behind the Scenes Tour', likes: 5400 },
        ],
    };

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64d79', '#674ea7'];
    const SENTIMENT_COLORS = ['#00C49F', '#FFBB28', '#FF4842'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [dashboardResponse, strategyResponse] = await Promise.all([
                    axios.get(`${API_URL}/api/dashboard`, {
                        params: { email, days: 365 }
                    }),
                    axios.get(`${API_URL}/api/content-strategy`, {
                        params: { email, days: 365 }
                    })
                ]); 
                console.log("Dashboard Response:", dashboardResponse.data);
                console.log("Strategy Response:", strategyResponse.data);

                if (dashboardResponse.data && dashboardResponse.data.dashboardData) {
                    setDashboardData(dashboardResponse.data.dashboardData);
                    if (dashboardResponse.data.aiRecommendation) {
                        setAiInsights({
                            aiRecommendation: dashboardResponse.data.aiRecommendation,
                            bestPostingTime: dashboardResponse.data.bestPostingTime || {},
                            topHashtag: dashboardResponse.data.topHashtag || {},
                            topDemographic: dashboardResponse.data.topDemographic || {},
                        });
                    }
                }

                if (strategyResponse.data && strategyResponse.data.contentStrategy) {
                    console.log("Setting content strategy:", strategyResponse.data.contentStrategy);
                    setContentStrategy(strategyResponse.data.contentStrategy);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message);
                // Use fallback data if API fails
                setDashboardData(fallbackData);
            } finally {
                setLoadingStrategy(false);
            }
        };

        setLoading(true);
        fetchDashboardData().finally(() => setLoading(false));
    }, [email]);

    // Helper function to get data with fallback
    const getData = (key, fallbackValue) => {
        try {
            return dashboardData[key] || fallbackValue;
        } catch (e) {
            return fallbackValue;
        }
    };

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading dashboard: {error}
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className={`ml-82 p-4 min-h-screen ${theme === 'dark' 
                ? 'bg-blue-900/20 text-white' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 text-black'}`}>
                {/* Header section with gradient background */}
                <div className={`p-6 rounded-xl shadow-sm mb-6 ${theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-gradient-to-r from-white to-blue-50 border border-blue-100'}`}>
                    <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Analytics Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-1">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">YouTube</button>
                            <button className={`px-4 py-2 rounded-lg transition-colors ${theme === 'dark'
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Instagram</button>
                            <button className={`px-4 py-2 rounded-lg transition-colors ${theme === 'dark'
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Bluesky</button>
                        </div>
                        <select 
                            className={`px-4 py-2 rounded-lg transition-colors ${theme === 'dark'
                                ? 'bg-gray-700 text-white border border-gray-600 hover:border-gray-500'
                                : 'bg-white text-black border border-gray-200 text-gray-700 hover:border-gray-300'}`}
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="Last 365 Days">Last 365 Days</option>
                            <option value="Last 90 Days">Last 90 Days</option>
                            <option value="Last 30 Days">Last 30 Days</option>
                            <option value="Last 7 Days">Last 7 Days</option>
                        </select>
                        <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${theme === 'dark'
                            ? 'bg-gray-700 text-white border border-gray-600 hover:border-gray-500'
                            : 'bg-white text-black border border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <MetricCard
                        title="Total Subscribers"
                        value={getData('totalSubscribers', 0).toLocaleString()}
                        growth={getData('subscribersGrowthPercent', 0)}
                        loading={loading}
                        icon={<SubscribersIcon />}
                        variant="success"
                        theme={theme}
                    />
                    <MetricCard
                        title="Engagement Rate"
                        value={`${getData('engagementRate', 0)}%`}
                        growth={getData('engagementGrowthPercent', 0)}
                        loading={loading}
                        icon={<EngagementIcon />}
                        variant="info"
                        theme={theme}
                    />
                    <MetricCard
                        title="Reach"
                        value={`${(getData('totalViews', 0) / 1000).toFixed(1)}K`}
                        growth={getData('viewsGrowthPercent', 0)}
                        loading={loading}
                        icon={<ReachIcon />}
                        variant="warning"
                        theme={theme}
                    />
                    <MetricCard
                        title="Impressions"
                        value={`${(getData('impressions', 0) / 1000).toFixed(1)}K`}
                        growth={getData('impressionsGrowthPercent', 0)}
                        loading={loading}
                        icon={<ImpressionsIcon />}
                        variant="danger"
                        theme={theme}
                    />
                </div>

                {/* Charts with loading states */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className={`p-6 rounded-xl shadow-sm ${theme === 'dark'
                        ? 'bg-gray-800 border border-gray-700 text-white'
                        : 'bg-white border border-gray-100 text-black'}`}>
                        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Audience Growth</h2>
                        {loading ? (
                            <div className="h-[250px] flex items-center justify-center">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <LineChart width={500} height={250} data={getData('audienceGrowthData', fallbackData.audienceGrowthData)}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                                <XAxis dataKey="day" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                                <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                                <Tooltip 
                                    contentStyle={theme === 'dark' 
                                        ? { backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' } 
                                        : undefined} 
                                />
                                <Line type="monotone" dataKey="subscribers" stroke="#6366F1" activeDot={{ r: 8 }} />
                            </LineChart>
                        )}
                    </div>

                    <div className={`p-6 rounded-xl shadow-sm ${theme === 'dark'
                        ? 'bg-gray-800 border border-gray-700 text-white'
                        : 'bg-white border border-gray-100 text-black'}`}>
                        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Content Performance</h2>
                        {loading ? (
                            <div className="h-[250px] flex items-center justify-center">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <BarChart width={500} height={250} data={getData('contentPerformanceData', fallbackData.contentPerformanceData)}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                                <XAxis dataKey="category" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                                <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                                <Tooltip 
                                    contentStyle={theme === 'dark' 
                                        ? { backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' } 
                                        : undefined} 
                                />
                                <Bar dataKey="views" fill="#6366F1">
                                    {getData('contentPerformanceData', fallbackData.contentPerformanceData).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </div>
                </div>

                {/* Bottom section with gradients */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className={`p-6 rounded-xl ${theme === 'dark'
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100'}`}>
                        <h2 className="text-lg font-semibold mb-4">Sentiment Analysis</h2>
                        <div className="flex items-center justify-center">
                            <PieChart width={200} height={200}>
                                <Pie
                                    data={getData('sentimentData', fallbackData.sentimentData)}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {getData('sentimentData', fallbackData.sentimentData).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={theme === 'dark' 
                                    ? { backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' } 
                                    : undefined} 
                                />
                            </PieChart>
                        </div>
                        <div className="grid grid-cols-3 text-center mt-4">
                            {getData('sentimentData', fallbackData.sentimentData).map((item, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: SENTIMENT_COLORS[index] }}></div>
                                    <div className="text-xs">{item.name} ({item.value}%)</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl ${theme === 'dark'
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100'}`}>
                        <h2 className="text-lg font-semibold mb-4">Top Performing Content</h2>
                        <div className="space-y-4">
                            {getData('topPerformingContent', fallbackData.topPerformingContent).map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-4 h-16 bg-red-500 mr-4"></div>
                                    <div className="flex-1">
                                        <div className="font-medium">{item.title}</div>
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {(item.likes / 1000).toFixed(1)}K Likes
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl ${theme === 'dark'
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Best Posting Time
                                </h3>
                                <p className="mt-1">{aiInsights?.bestPostingTime?.formatted || 'Not enough data'}</p>
                            </div>
                            <div>
                                <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Top Hashtag
                                </h3>
                                <p className="mt-1">
                                    {aiInsights?.topHashtag?.tag ? `#${aiInsights.topHashtag.tag} (${aiInsights.topHashtag.growth})` : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Top Demographic
                                </h3>
                                <p className="mt-1">{aiInsights?.topDemographic?.formatted || 'Not enough data'}</p>
                            </div>
                            <div>
                                <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    AI Recommendation
                                </h3>
                                <p className="mt-1 text-sm">{aiInsights?.aiRecommendation || 'Recommendations not available'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Strategy Section */}
                <ErrorBoundary>
                    <ContentStrategyInsights 
                        contentStrategy={contentStrategy} 
                        loading={loadingStrategy}
                        theme={theme} 
                    />
                </ErrorBoundary>
            </div>
        </ErrorBoundary>
    );
};

// Add icons components
const SubscribersIcon = () => (
    <svg className="w-6 h-6 text-blue-500" /* ...icon path... */ />
);
const EngagementIcon = () => (
    <svg className="w-6 h-6 text-green-500" /* ...icon path... */ />
);
const ReachIcon = () => (
    <svg className="w-6 h-6 text-yellow-500" /* ...icon path... */ />
);
const ImpressionsIcon = () => (
    <svg className="w-6 h-6 text-red-500" /* ...icon path... */ />
);

export default YouTubeAnalyticsDashboard;

