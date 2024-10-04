"use client";
import Header from "@/components/Header/header";
import { Avatar, Button, Col, Divider, Form, Input, Layout, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import "./styles.scss";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface ProfilePageProps {}

const ProfilePage = (props: ProfilePageProps): JSX.Element => {
  const [form] = Form.useForm();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    // TODO: Retrieve the user details via validate JWT token api

    // TODO: Set initial form value with the retrieved value above
    form.setFieldsValue({
      username: "",
      password: "",
      email: "",
    });
  }, [refresh]);

  return (
    <Layout className="layout">
      <Header selectedKey={undefined} />
      <Content className="content">
        <div className="content-card1">
          <div className="gradient-header"></div>
          <div className="profile-header">
            <div className="left-header">
              {/* TODO: Replace with the first initial of username */}
              <Avatar size={80} className="avatar">
                A
              </Avatar>
              <div className="name-container">
                {/* TODO: Set the value in field correctly within the useEffect above and this should work */}
                <div className="username">{form.getFieldValue("username")}</div>
                <div className="email">{form.getFieldValue("email")}</div>
              </div>
            </div>
            <div className="right-header">
              {isEditable && (
                <>
                  <Button
                    icon={<SaveOutlined />}
                    type="primary"
                    className="save-button"
                    htmlType="submit"
                  >
                    Save
                  </Button>
                  <Button
                    className="cancel-button"
                    onClick={() => {
                      setIsEditable(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {!isEditable && (
                <Button
                  icon={<EditOutlined />}
                  className="edit-button"
                  onClick={() => setIsEditable(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
          <div className="profile-form">
            <Form
              form={form}
              onFinish={(values) => {
                // TODO: Make PATCH api request to update user details here

                // TODO: On success show success notification message else display error notification

                // Set editable to false
                setIsEditable(false);

                // Refresh data
                setRefresh(!refresh);
              }}
              layout="vertical"
              disabled={!isEditable}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      {
                        required: true,
                        message: "Please enter valid username!",
                      },
                    ]}
                  >
                    <Input name="username" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter valid email!",
                      },
                    ]}
                  >
                    <Input name="email" type="email" disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter valid password!",
                      },
                    ]}
                  >
                    <Input.Password name="password" type="password" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ProfilePage;
