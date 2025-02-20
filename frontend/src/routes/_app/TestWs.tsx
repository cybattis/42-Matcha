import {
  createFileRoute,
  useRouteContext,
  useRouter,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ChatMessage, wsUrl } from '@/websocket/Websocket.ts'
import useWebSocket from 'react-use-websocket'
import { Button } from '@/components/ui/button.tsx'
import {MyRooterContext} from "@/routes/__root.tsx";

export const Route = createFileRoute('/_app/TestWs')({
  component: RouteComponent,
})

function RouteComponent() {
  const context: MyRooterContext = useRouteContext({ from: '/_app/TestWs' })

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    'ws://localhost:5163/ws', 
  {
    // protocols: ["Authorization", context.auth.token!],
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      timeout: 60000, // 1 minute, if no response is received, the connection will be closed
      interval: 25000, // every 25 seconds, a ping message will be sent
    },
    shouldReconnect: (closeEvent) => true,
    onOpen: () => {
      console.log('opened')
      const connection = {
        message: 'connection',
      }
      sendMessage(JSON.stringify(connection));
    },
    onClose: () => console.log('closed'),
    onMessage: (event) => {
        console.log('message received: ', event.data)
        const message = JSON.parse(event.data)
        if (message.message === 'connection') {
          const authenticate = {
            Message: 'authenticate',
            data: context.auth.token!,
          }
          sendMessage(JSON.stringify(authenticate));
        }
    },
  })

  useEffect(() => {
    
  }, [])

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
        sendMessage(JSON.stringify(wsMessage))
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <>
      <div>Hello "/_app/TestWs"!</div>
      <Button onClick={() => handleMessage('Test message hello!')}>Send</Button>
    </>
  )
}
