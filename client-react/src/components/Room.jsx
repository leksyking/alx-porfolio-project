import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const Room = () => {
        const { roomID } = useParams();
        useEffect(() => {
                const ws = new WebSocket(
                        `ws://localhost:8080/api/v1/room/join?roomID=${roomID}`
                );
                ws.addEventListener("open", () => {
                        ws.send(JSON.stringify({ join: "true" }));
                });
        });
        return (
                <div>
                        <video autoPlay controls={true}></video>
                        <video autoPlay controls={true}></video>
                </div>
        );
};
export default Room;
