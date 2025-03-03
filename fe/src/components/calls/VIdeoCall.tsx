import { useEffect, useRef, useState } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";

const VideoCall = () => {
  const videoCallRef = useRef<HTMLDivElement>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>('https://quickgate.daily.co/hello-daily');
  const dailyRef = useRef<DailyCall | null>(null);

  useEffect(() => {
    const createRoom = async () => {
      try {
        const response = await fetch("/api/create-room", { method: "POST" });
        const data = await response.json();
        setRoomUrl(data.roomUrl);
      } catch (error) {
        console.error("Error creating room:", error);
      }
    };

    createRoom();
  }, []);

  useEffect(() => {
    if (roomUrl && videoCallRef.current && !dailyRef.current) {
      dailyRef.current = DailyIframe.createFrame(videoCallRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "0",
        },
      });

      dailyRef.current.join({ url: roomUrl });
    }
  }, [roomUrl]);

  return (
    <div
      ref={videoCallRef}
      style={{ width: "800px", height: "600px", border: "1px solid black" }}
    />
  );
};

export default VideoCall;
