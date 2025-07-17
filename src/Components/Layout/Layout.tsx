import React, { useRef, useEffect } from "react"
import { Footer, Header, LayoutContainer, Logo } from "./styles"
import Button from "../Button/Button";

interface VideoProps {
    src: MediaStream | string;
    isMuted: boolean;
}

function Video({ src, isMuted }: VideoProps) {
    const refVideo = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (!refVideo.current) {
            return;
        }

        if (isMuted) {
            //open bug since 2017 that you cannot set muted in video element https://github.com/facebook/react/issues/10389
            refVideo.current.defaultMuted = true;
            refVideo.current.muted = true;
        }

        if (typeof src === "string") {
            refVideo.current.srcObject = null;
            refVideo.current.src = src;
        } else {
            refVideo.current.srcObject = src;
        }
    }, [src]);

    return (
        <video
            ref={refVideo}
            autoPlay
            loop
            playsInline //FIX iOS black screen
        />
    );
}


const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

  return (
    <html lang="bg">
      <head>
        <title>Osogovo run</title>
        <meta name="description" content="Welcome to Osogovo run" />
        <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes'
        />
        <link rel="icon" sizes="192x192" href='https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/osogovo-run-logo.svg' />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <LayoutContainer>
            <Header>
                <Video src='https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/osogovo-run-21-sec.mp4' isMuted={true} />
                <Logo href="/" />
                <Button highlight={true} onClick={() => {
                    window.location.href = '/register'
                }} label="Регистрирай се" />
            </Header>
            <main>{children}</main>
            <Footer>Copyright © 2025 Osogovo Run</Footer>
        </LayoutContainer>
    </html>
  );
};

export default Layout;
