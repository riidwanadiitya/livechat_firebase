import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import Cookies from "js-cookie";

function LoginAs(props) {
  const [fromLogin, setFormLogin] = useState({});

  const onFinish = (values) => {
    const chatId = Math.random().toString(16).slice(2, 7);
    const user = { user_name: values.username, user_id: chatId };
    const cookieString = JSON.stringify(user);
    console.log("Success");
    Cookies.set("account", cookieString);
    setFormLogin(user);
    props.closeModal();
    props.getData();
    window.location.reload();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Form
        name="basic"
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 19,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
            {
              whitespace: true,
              message: "Nama tidak boleh hanya spasi!",
            },
            {
              min: 5,
              message: "Nama minimal 5 karakter.",
            },
            {
              max: 20,
              message: "Nama maksimal 20 karakter.",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginAs;
