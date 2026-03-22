import React, { useState } from 'react';
import { Steps, Form, Input, Button, Card, Typography, message } from 'antd';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const StartupPitchForm = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

const onFinish = async (values) => {
  try {
    const response = await fetch(
      "https://ecell-q711.onrender.com/api/pitches/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit pitch");
    }

    message.success("Pitch submitted successfully!");
    setCurrent(0);
    form.resetFields();

  } catch (error) {
    console.error(error);
    message.error("Error submitting pitch ❌");
  }
};

  const steps = [
    {
      title: 'Startup Info',
      content: (
        <div style={{ padding: '24px 0' }}>
          <Form.Item label="Startup Name" name="startup_name" rules={[{ required: true }]}>
            <Input size="large" placeholder="E.g., AeroTech" />
          </Form.Item>
          <Form.Item label="Tagline" name="tagline" rules={[{ required: true }]}>
            <Input size="large" placeholder="Innovation in the skies" />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Problem & Solution',
      content: (
        <div style={{ padding: '24px 0' }}>
          <Form.Item label="Problem Statement" name="problem_statement" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Describe the problem you are solving" />
          </Form.Item>
          <Form.Item label="Solution" name="solution" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="How does your startup solve this problem?" />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Review & Submit',
      content: (
        <div style={{ padding: '24px 0' }}>
          <Paragraph>Please review your information before submitting. Once submitted, your pitch will be reviewed by the admin team.</Paragraph>
        </div>
      ),
    },
  ];

  return (
    <Card className="floating-card" bordered={false} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: 32 }}>Submit a Startup Pitch</Title>
      <Steps current={current} items={steps.map(item => ({ key: item.title, title: item.title }))} />
      
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
        {steps[current].content}
        
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" htmlType="submit">
              Submit Pitch
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
};

export default StartupPitchForm;
