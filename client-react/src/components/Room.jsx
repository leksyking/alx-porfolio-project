import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const Room = () => {
        const { roomID } = useParams();
        const userVideo = useRef();
        const userStream = useRef();
        const partnerVideo = useRef();
        const peerRef = useRef();
        const WebSocketRef = useRef();

        const openCamera = async () => {
                const constraints = {
                        audio: true,
                        video: true,
                };
                try {
                        const mydevice =
                                await navigator.mediaDevices.getUserMedia(
                                        constraints
                                );
                        return mydevice;
                } catch (error) {
                        console.log(error);
                }
        };

        useEffect(() => {
                openCamera().then((stream) => {});
        });
        return (
                <div>
                        <video autoPlay controls={true} ref={userVideo}></video>
                        <video
                                autoPlay
                                controls={true}
                                ref={partnerVideo}
                        ></video>
                </div>
        );
};
export default Room;

// const ws = new WebSocket(
//         `ws://localhost:8080/api/v1/room/join?roomID=${roomID}`
// );
// ws.addEventListener("open", () => {
//         console.log("Sending");
//         ws.send(JSON.stringify({ join: "true" }));
// });
// ws.addEventListener("message", (e) => {
//         console.log(e.data);
// });
