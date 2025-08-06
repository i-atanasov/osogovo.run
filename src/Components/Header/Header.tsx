import React, { useEffect, useRef } from 'react';
import { Date, Header, Logo } from "./styles";
import Button from '../Button/Button';

interface VideoProps {
    isMuted: boolean;
}

export const HeaderComponent: React.FC<{ hideDate?: boolean, video?: string; image?: string, children?: React.ReactNode }> = ({ hideDate, video, image, children }) => {
    const Video = ({ isMuted }: VideoProps) => {
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

            if (typeof video === "string") {
                refVideo.current.srcObject = null;
                refVideo.current.src = video;
            } else {
                refVideo.current.srcObject = video ?? null;
            }
    }, [video]);

    return (
        <video
            poster="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/10.jpg"
            ref={refVideo}
            autoPlay
            loop
            playsInline //FIX iOS black screen
        />
    );
    };

    return (
        <Header video={video} image={image}>
            {video && <Video isMuted={true} />}
            {image && <img src={image} alt="Header Image" />}
            {children}
            <Logo href="/" />
            <Button highlight={true} onClick={() => {
                window.location.href = '/register'
            }} label="Регистрирай се" />
            {!hideDate && <Date>28<br/> септември</Date>}
        </Header>
    );
}
