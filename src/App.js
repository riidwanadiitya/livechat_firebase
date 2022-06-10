import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Affix, Button, Col, Layout, Modal, Popover, Row } from "antd";
import { onValue, ref, remove } from "firebase/database";
import React, { useEffect, useState } from "react";
import ChatItem from "./components/chatItem";
import LoginAs from "./components/form/LoginAs";
import NewRoom from "./components/form/NewRoom";
import Send from "./components/form/Send";
import { db } from "./utils/firebaseConfig";
import Cookies from "js-cookie";
import moment from "moment";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [chatData, setChatData] = useState(null);
  const [selectedRoomChat, setSelectedRoomChat] = useState(null);
  const [top, setTop] = useState(10);
  const [visible, setVisible] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [account, setAccount] = useState(null);
  const [popover, setPopover] = useState(false);
  const [choosenData, setChoosenData] = useState(null);

  const showModalLogin = () => {
    setModalLogin(true);
  };

  const hideModalLogin = () => {
    setModalLogin(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const getData = () => {
    onValue(ref(db, "Chat"), (data) => {
      const chatData = data.val();
      const newChat = Object.values(chatData).sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
      setChatData(newChat);
    });
  };

  const getChatId = (data) => {
    setSelectedRoomChat(data);
  };

  const delRoomChat = (roomId) => {
    const dbRef = ref(db, `/Chat/${roomId}`);
    remove(dbRef)
      .then(() => {
        console.log("Room chat berhasil dihapus");
        setChoosenData(null)
        setPopover(false)
        window.location.reload()
      })
      .catch((err) => {
        console.log("Oops, something wrong!");
      });
  };

  useEffect(() => {
    if (!Cookies.get("account")) {
      showModalLogin();
    } else {
      const data = JSON.parse(Cookies.get("account"));
      // console.log(data)
      setAccount(data);
      getData();
    }
  }, []);

  const show = (data) => {
    setPopover(!popover);
    // console.log(data)
    setChoosenData(data);
  };

  const content = (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Button onClick={() => setPopover(false)}>Batal</Button>
      <Button type="danger" onClick={() => delRoomChat(choosenData)}>
        Hapus
      </Button>
    </div>
  );

  return (
    <>
      <Layout>
        <Sider trigger={null} style={{ height: "100vh" }}>
          <Header style={{ color: "white", height: "10vh" }}>Live Chat!</Header>
          <div>
            <Button
              onClick={showModal}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              New Room Chat <PlusOutlined style={{ marginLeft: 20 }} />
            </Button>
          </div>
          {chatData?.map((data, i) => {
            return (
              <Row
                key={i}
                style={{
                  color: "white",
                  border: "1px solid white",
                  borderRadius: "5px",
                  margin: "5px",
                }}
              >
                <Col span={18}>
                  <Button
                    onClick={() => getChatId(data)}
                    type="text"
                    style={{ width: "100%", color: "white" }}
                  >
                    {data.room_name}
                  </Button>
                </Col>
                <Col>
                  {data.createdBy === account.user_id && (
                    <Popover
                      content={content}
                      title="Yakin dihapus?"
                      trigger="click"
                      visible={popover}
                      onVisibleChange={() => show(data.id)}
                      placement="topRight"
                    >
                      <Button
                        // onClick={() => delRoomChat(data.id)}
                        type="text"
                        style={{ color: "white" }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Popover>
                  )}
                </Col>
              </Row>
            );
          })}
        </Sider>
        <Layout>
          <Header style={{ height: "10vh", backgroundColor: "grey" }}>
            {selectedRoomChat !== null && (
              <>
                <div style={{ color: "white" }}>
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {selectedRoomChat.room_name}
                  </span>{" "}
                  <span style={{ fontSize: "12px" }}>
                    Created:{" "}
                    {moment(selectedRoomChat.created).format("YYYY-MM-DD")}
                  </span>
                </div>
              </>
            )}
          </Header>
          <Content style={{ margin: "20px 20px" }}>
            {selectedRoomChat !== null ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "white",
                }}
              >
                <Affix offsetTop={top}>
                  <Row justify="center">
                    <Col>
                      <Send dataRoomChat={selectedRoomChat} account={account} />
                    </Col>
                  </Row>
                </Affix>
                <Row justify="center" style={{ marginTop: "50px" }}>
                  <Col>
                    <ChatItem data={selectedRoomChat} />
                  </Col>
                </Row>
              </div>
            ) : (
              <Row>
                <Col>
                  <h3>Buat Room Chat Baru?</h3>
                </Col>
              </Row>
            )}
          </Content>
        </Layout>
      </Layout>

      {/* modal new chat*/}
      <Modal
        title="New Room Chat"
        visible={visible}
        okText="Create"
        cancelText="Cancel"
        onCancel={hideModal}
        maskClosable={false}
        footer={null}
      >
        <NewRoom closeModal={hideModal} />
      </Modal>

      {/* modal input name */}
      <Modal
        title="Masuk sebagai?"
        visible={modalLogin}
        okText="Create"
        cancelText="Cancel"
        onCancel={hideModalLogin}
        maskClosable={false}
        closable={false}
        footer={null}
      >
        <LoginAs closeModal={hideModalLogin} getData={getData} />
      </Modal>
    </>
  );
};

export default App;
