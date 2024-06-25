"use client";
import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { randomID } from "@/utils/helpers";
import { useRouter } from 'next/router';

interface Props {
  params: {
    id: string;
  };
}

const Page = ({ params }: Props) => {
  const router = useRouter();
  const roomID = params.id;
  const meetingContainerRef = useRef<HTMLDivElement | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady) {
      // Get username from query parameters
      const query = router.query;
      const usernameFromQuery = Array.isArray(query.username) ? query.username[0] : query.username || "DefaultUsername";
      setUsername(usernameFromQuery);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (username && meetingContainerRef.current) {
      const myMeeting = (element: HTMLDivElement) => {
        const appID = process.env.NEXT_PUBLIC_ZEGO_APP_ID;
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          Number(appID),
          serverSecret,
          roomID,
          randomID(5), // user ID
          username // username from URL
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: "Personal link",
              url: window.location.href,
            },
            {
              name: "Meeting ID",
              url: roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
          },
        });
      };

      myMeeting(meetingContainerRef.current);
    }
  }, [username, roomID]);

  return <div className="w-full h-[100vh]" ref={meetingContainerRef}></div>;
};

export default Page;
