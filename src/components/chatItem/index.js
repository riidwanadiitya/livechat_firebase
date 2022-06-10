import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebaseConfig";
import Chat from "./Chat";

function ChatItem(props) {
  const { data } = props;
  const [contents, setContents] = useState(null);
  const [roomId, setroomId] = useState(null)

  const getDataId = () => {
    const dbRef = ref(db, `Chat/${data.id}`);
    onValue(dbRef, (chat) => {
      const res = chat.val();
      if (res.contents !== undefined) {
        const chatData = Object.values(res.contents).sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );
        setContents(chatData);
        setroomId(data.id)
      } else {
        setContents(null);
      }
    });
  };

  useEffect(() => {
    getDataId();
  }, [data]);

  return (
    <div style={{ height: "55vh", overflow: "hidden", overflowY: "auto" }}>
      
      <div>
        {contents !== null && (
          <>
            {contents.map((data, i) => {
              return <Chat key={i} data={data} roomId={roomId} />;
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default ChatItem;
