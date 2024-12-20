import React from "react";
import { Helmet } from "react-helmet";

const ChatboxMarshall = () => {
  return (
    <div>
      <Helmet>
        <script
          src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"
        ></script>
      </Helmet>
      <df-messenger
        intent="WELCOME"
        chat-title="CHATBOX-MARSHALL"
        agent-id="4c3d8dce-107d-4a0d-9ca8-7f80a44f3ab2"
        language-code="en"
      ></df-messenger>
    </div>
  );
};

export default ChatboxMarshall;
