import React, { useEffect, useState } from "react";
import { Room as RoomType } from "../mahjong";
import { useParams } from "react-router-dom";
import Room from "./Room";

type ConnectionState =
  | { state: "connecting" }
  | { state: "connected"; room: RoomType }
  | { state: "error" };

const Subscription: React.FC = () => {
  const { roomId }: { roomId: string } = useParams();
  const [state, setState] = useState<ConnectionState>({ state: "connecting" });

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${roomId}/live`);
    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        setState({ state: "error" });
      }
    };
    eventSource.onmessage = async (e) => {
      const room = JSON.parse(e.data);
      setState({ state: "connected", room: room });
    };
    return () => eventSource.close();
  }, [roomId]);

  switch (state.state) {
    case "connecting":
      return (
        <div>
          <h1>Connecting...</h1>
        </div>
      );
    case "connected":
      return <Room room={state.room} />;
    case "error":
      return (
        <div>
          <h1>Error</h1>
        </div>
      );
  }
};

export default Subscription;
