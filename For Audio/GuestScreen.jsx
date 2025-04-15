import React, { useEffect, useRef } from 'react';

const GuestScreen = () => {
    const localRef = useRef();
    const socketRef = useRef();
    const peerRef = useRef();

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:3001");

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            localRef.current.srcObject = stream;

            peerRef.current = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
            });

            stream.getTracks().forEach(track => peerRef.current.addTrack(track, stream));

            peerRef.current.onicecandidate = (e) => {
                if (e.candidate) {
                    socketRef.current.send(JSON.stringify({ type: "candidate", candidate: e.candidate }));
                }
            };

            socketRef.current.onmessage = async (msg) => {
                const data = JSON.parse(msg.data);

                if (data.type === "offer") {
                    await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                    const answer = await peerRef.current.createAnswer();
                    await peerRef.current.setLocalDescription(answer);
                    socketRef.current.send(JSON.stringify({ type: "answer", answer }));
                } else if (data.type === "candidate") {
                    try {
                        await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                    } catch (err) {
                        console.error("Error adding candidate", err);
                    }
                }
            };
        });
    }, []);

    return (
        <div>
            <h3>Guest</h3>
            <audio ref={localRef} autoPlay controls />
        </div>
    );
};

export default GuestScreen;
