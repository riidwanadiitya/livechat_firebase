import { CloseOutlined} from "@ant-design/icons";
import { Button, Popover } from "antd";
import { ref,  update } from "firebase/database";
import moment from "moment";
import React, {  useState } from "react";
import { db } from "../../utils/firebaseConfig";
import Cookies from "js-cookie";

function Chat(props) {
  const { data, roomId } = props;
  const [popover, setPopover] = useState(false);
  const [userId] = useState(
    JSON.parse(Cookies.get("account"))["user_id"]
  );

  const show = (newVisible) => {
    setPopover(newVisible);
  };

  // const handleDel = () => {
  //   const dbRef = ref(db, `/Chat/${roomId}/contents/${data.id}`);
  //   remove(dbRef)
  //     .then(() => {
  //       alert("berhasil dihapus");
  //     })
  //     .catch((err) => {
  //       alert("oops, somthing wrong!");
  //     });
  //   setPopover(false);
  // };

  const handleRemove = () => {
    const dbRef = ref(db, `/Chat/${roomId}/contents/${data.id}`);
    update(dbRef, {
      is_delete: "1",
    })
      .then(() => {
        console.log("success");
        setPopover(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   console.log();
  // }, []);

  //   const handleEdit = (data) => {
  //     setIsEdit(true);
  //     setDataEdit(data);
  //   };

  //   const submitEdit = () => {
  //     setIsEdit(false);
  //   };

  //   const cancelEdit = () => {
  //     setIsEdit(false);
  //   };

  const content = (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Button onClick={() => setPopover(false)}>Batal</Button>
      <Button type="danger" onClick={handleRemove}>
        Hapus
      </Button>
    </div>
  );
  return (
    <div
      style={{
        border: "1px solid gray",
        borderRadius: "5px",
        padding: "5px 10px",
        width: "50vw",
        marginBottom: "10px",
        backgroundColor: data.userId.includes(userId) && "#D3EBCD",
      }}
    >
      {data.is_delete === "0" ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                {data.is_anonim === "0" ? data.username : "Anonymous"}
              </span>{" "}
              <span style={{ fontSize: "12px" }}>
                {moment(data.created).fromNow()}
              </span>
            </div>

            <div>
              {JSON.parse(Cookies.get("account"))["user_id"] === data.userId ? (
                <Popover
                  content={content}
                  title="Yakin dihapus?"
                  trigger="click"
                  visible={popover}
                  onVisibleChange={show}
                  placement="topRight"
                >
                  <CloseOutlined />
                </Popover>
              ) : null}
            </div>
          </div>
          <hr />
          <span style={{ fontSize: "16px" }}>{data.message}</span>
        </>
      ) : (
        <>
          <p style={{ color: "gray" }}>
            <i>Pesan telah dihapus</i>
          </p>
        </>
      )}
    </div>
  );
}

export default Chat;
