import { Button, Switch } from "antd";
import React, { useState } from "react";
import { db } from "../../utils/firebaseConfig";
import { set, ref } from "firebase/database";
import moment from "moment";
import Cookies from "js-cookie";

const Send = (props) => {
  const { dataRoomChat, account } = props;
  const [message, setMessage] = useState("");
  const [isAnonim, setisAnonim] = useState(true);

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "message") {
      setMessage(value);
    } 
  };

  const onSend = () => {
    if (Cookies.get("account") === undefined) {
      window.location.reload();
    } else {
      const today = moment().format();
      const chatId = Math.random().toString(16).slice(2);
      const dbRef = ref(db, `Chat/${dataRoomChat.id}/contents/${chatId}`);
      set(dbRef, {
        id: chatId,
        userId: JSON.parse(Cookies.get("account"))["user_id"],
        username: JSON.parse(Cookies.get("account"))["user_name"],
        message: message,
        created: today,
        is_anonim: isAnonim ? "1" : "0",
        is_delete: "0",
      })
        .then(() => {
          console.log("success");
          setMessage("");
        })
        .catch((err) => {
          window.location.reload();
        });
    }
  };

  const handleAnonim = () => {
    setisAnonim(!isAnonim);
  };

  return (
    <>
      {account !== null && (
        <>
          <form
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (message !== "") {
                  onSend();
                }
              }
            }}
            style={{
              border: "1px solid gray",
              borderRadius: "5px",
              padding: "10px",
              width: "50vw",
            }}
          >
            <div>
              Anonymous : <Switch onChange={handleAnonim} checked={isAnonim} />
            </div>
            <input
              type="text"
              placeholder="tulis pesan"
              onChange={onChange}
              name="message"
              value={message}
              style={{ width: "100%", margin: "10px 0px" }}
            />
            <div>
              <Button disabled={message === "" ? true : false} onClick={onSend}>
                Kirim
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default Send;
