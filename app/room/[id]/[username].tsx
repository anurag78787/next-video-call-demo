
"use client";
import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { randomID } from "@/utils/helpers";
import { useRouter } from 'next/router';

const Page = () => {
  const router = useRouter();
  const { id: roomID, username } = router.query;
  const meetingContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (router.isReady && roomID && username) {
      const myMeeting = (element: HTMLDivElement) => {
        const appID = process.env.NEXT_PUBLIC_ZEGO_APP_ID;
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          Number(appID),
          serverSecret,
          roomID as string,
          randomID(5), // user ID
          username as string // username from URL
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
              url: roomID as string,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
          },
        });
      };

      if (meetingContainerRef.current) {
        myMeeting(meetingContainerRef.current);
      }
    }
  }, [router.isReady, roomID, username]);

  return <div className="w-full h-[100vh]" ref={meetingContainerRef}></div>;
};

export default Page;
