import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const Room = () => {
        const { roomID } = useParams();
        const userVideo = useRef();
        const userStream = useRef();
        const partnerVideo = useRef();
        const peerRef = useRef();
        const webSocketRef = useRef();

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
        const createPeer = () => {};
        const callUser = () => {
                console.log("Calling other users...");
                peerRef = createPeer();

                userStream.current.getTracks().forEach((track) => {
                        peerRef.current.addTrack(track, userStream.current);
                });
        };

        useEffect(() => {
                openCamera().then((stream) => {
                        userVideo.current.srcObject = stream;
                        userStream.current = stream;
                });

                webSocketRef.current = new WebSocket(
                        `ws://localhost:8080/api/v1/room/join?roomID=${roomID}`
                );
                webSocketRef.current.addEventListener("open", () => {
                        webSocketRef.current.send(
                                JSON.stringify({ join: "true" })
                        );
                });
                webSocketRef.current.addEventListener("message", (e) => {
                        const message = JSON.parse(e.data);
                        if (message.join) {
                                callUser();
                        }
                });
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
