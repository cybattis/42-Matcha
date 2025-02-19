import {createFileRoute, useRouteContext, useRouter} from '@tanstack/react-router'
import {useEffect} from "react";
import {ChatMessage, wsUrl} from "@/websocket/Websocket.ts";
import useWebSocket from 'react-use-websocket';
import {Button} from "@/components/ui/button.tsx";

export const Route = createFileRoute('/_app/TestWs')({
  component: RouteComponent,
  beforeLoad: async (context) => {
    console.log('beforeLoad', context);
    return context;
  }
})


function RouteComponent() {
  const userID = 1;
  console.log('userID', userID);
  const {sendMessage, lastMessage, readyState} = useWebSocket(wsUrl + '/' + userID,
    {
      heartbeat: {
        message: 'ping',
        returnMessage: 'pong',
        timeout: 60000, // 1 minute, if no response is received, the connection will be closed
        interval: 25000, // every 25 seconds, a ping message will be sent
      },
      shouldReconnect: (closeEvent) => true,
      onOpen: () => {
        console.log('opened')
        sendMessage('Hello');
      },
      onClose: () => console.log('closed'),
    }
  );

  useEffect(() => {

  }, []);

  function handleMessage(message: string) {
    if (readyState === 1) {
      const chatMessage: ChatMessage = {
        userId: 1,
        senderId: 1,
        receiverId: 2,
        message: message,
        timestamp: Date.now().toString(),
      }

      const wsMessage = {
        message: 'chat',
        data: chatMessage,
      }

      try {
        sendMessage(JSON.stringify(wsMessage));
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (<>
    <div>Hello "/_app/TestWs"!</div>
    <Button onClick={() => handleMessage('Test message hello!')}>Send</Button>
  </>)
}
