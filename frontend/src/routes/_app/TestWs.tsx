import { createFileRoute } from '@tanstack/react-router'
import {useEffect} from "react";

export const Route = createFileRoute('/_app/TestWs')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5163/ws")

    // Connection opened
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      socket.send("Connection established");
    };

    socket.onclose = () => {
        console.log("WebSocket closed");
     };
    
    socket.onmessage = (event) => {
      console.log("Message from server ", event.data);
    };

    return () => {
      socket.close();
    }
  }, []);
  return <div>Hello "/_app/TestWs"!</div>
}
