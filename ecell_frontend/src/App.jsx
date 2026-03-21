import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Card, Typography, Button, Space } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './layouts/DashboardLayout';
import StartupPitchForm from './components/StartupPitchForm';
import { antTheme } from './theme';

const { Title, Paragraph } = Typography;

const queryClient = new QueryClient();

// Dummy Event Page for layout testing
const EventsPage = () => (
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <div>
      <Title level={2}>Upcoming Events</Title>
      <Paragraph type="secondary">Browse and register for our latest entrepreneurial events.</Paragraph>
    </div>
    
    <Card className="floating-card" bordered={false}>
      <Title level={4}>Startup Weekend 2024</Title>
      <Paragraph>Join us for a 48-hour hackathon where ideas come to life.</Paragraph>
      <Button type="primary" shape="round" size="large">Register Now</Button>
    </Card>
    
    <Card className="floating-card" bordered={false}>
      <Title level={4}>Founders Talk Series</Title>
      <Paragraph>Learn from experienced founders who have scaled their ventures globally.</Paragraph>
      <Button shape="round" size="large">View Details</Button>
    </Card>
  </Space>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/events" replace />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="pitches" element={<StartupPitchForm />} />
              <Route path="blog" element={<div><Title level={2}>Blog (Coming Soon)</Title></div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
