import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { ref, set } from "firebase/database";
import { db } from "../../utils/firebaseConfig";
import moment from "moment";
import Cookies from "js-cookie";

function NewRoom(props) {
  const [disableBtn, setDisableBtn] = useState(false);
  const onFinish = (values) => {
    setDisableBtn(true);
    const today = moment().format();
    const roomId = Math.random().toString(16).slice(2);
    const dbRef = ref(db, `Chat/${roomId}`);
    set(dbRef, {
      id: roomId,
      room_name: values.room_name,
      created: today,
      createdBy: JSON.parse(Cookies.get("account"))["user_id"],
    })
      .then(() => {
        setDisableBtn(false);
        console.log("success");
        props.closeModal();
      })
      .catch((err) => {
        console.log(err);
        setDisableBtn(false);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Room Name"
          name="room_name"
          rules={[
            {
              required: true,
              message: "Please input Room Name!",
            },
            {
              min: 5,
              message: "Min 5 character",
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
          <Button disabled={disableBtn} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default NewRoom;
