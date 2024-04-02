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

        const handleIceCandidateEvent = async () => {
                console.log("Creating offer...");
                try {
                        const myOffer = peerRef.current.createOffer();
                        await peerRef.current.setLocalDescription(myOffer);

                        webSocketRef.current.send(
                                JSON.stringify({
                                        offer: peerRef.current.LocalDescription,
                                })
                        );
                } catch (error) {}
        };
        const handleNegotiationNeeded = async (e) => {
                console.log("Found Ice Candidate");
                if (e.candidate) {
                        console.log(e.candidate);
                        webSocketRef.current.send({
                                iceCandidate: e.candidate,
                        });
                }
        };
        const handleTrackEvent = async (e) => {
                console.log("Received Tracks");
                partnerVideo.current.srcObject = e.streams[0];
        };

        const createPeer = () => {
                console.log("creating peer connection...");
                const peer = new RTCPeerConnection({
                        iceServers: [{ urls: "'stun:stun.l.google.com:19302" }],
                });
                peer.onicecandidate = handleNegotiationNeeded;
                peer.onnegotiationneeded = handleIceCandidateEvent;
                peer.ontrack = handleTrackEvent;

                return peer;
        };

        const callUser = () => {
                console.log("Calling other users...");
                peerRef.current = createPeer();

                userStream.current.getTracks().forEach((track) => {
                        peerRef.current.addTrack(track, userStream.current);
                });
        };
        const handleOffer = async (offer) => {
                console.log("Received offer, now creating answer...");
                peerRef.current = createPeer();

                await peerRef.current.setRemoteDescription(
                        new RTCSessionDescription(offer)
                );

                userStream.current.getTracks().forEach((track) => {
                        peerRef.current.addTrack(track, userStream.current);
                });

                const answer = await peerRef.current.createAnswer();
                await peerRef.current.setLocalDescription(answer);

                webSocketRef.current.send(
                        JSON.stringify({
                                answer: peerRef.current.localDescription,
                        })
                );
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
                webSocketRef.current.addEventListener("message", async (e) => {
                        const message = JSON.parse(e.data);
                        if (message.join) {
                                callUser();
                        }
                        if (message.iceCandidate) {
                                console.log(
                                        "Received and Adding ICE Candidate"
                                );
                                try {
                                        await peerRef.current.addIceCandidate(
                                                message.iceCandidate
                                        );
                                } catch (error) {
                                        console.log(
                                                "Error Receiving ICE Candidate",
                                                error
                                        );
                                }
                        }
                        if (message.offer) {
                                handleOffer(message.offer);
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
