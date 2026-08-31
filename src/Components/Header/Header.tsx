import React, { useEffect, useRef, useState } from 'react';
import { Date, Header, Logo, MenuButton, MenuDropdown, MenuIcon, MenuItem, MenuWrapper } from "./styles";
import { useAdminAuth } from '../Admin/AdminAuthContext';
import Button from '../Button/Button';

interface VideoProps {
    isMuted: boolean;
    video?: string;
}

const HeaderVideo = ({ isMuted, video }: VideoProps) => {
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
    }, [isMuted, video]);

    return (
        <video
            poster="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/home_26_02.jpg"
            ref={refVideo}
            autoPlay
            loop
            playsInline //FIX iOS black screen
        />
    );
};

export const HeaderComponent: React.FC<{ hideDate?: boolean, video?: string; image?: string, children?: React.ReactNode }> = ({ hideDate, video, image, children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { admin } = useAdminAuth();
    const menuItems = [
        { label: 'Начало', href: '/' },
        { label: 'Регистрирай се', href: '/register' },
        { label: 'Информация за трасетата', href: '/#courses' },
        { label: 'Условия за участие', href: '/#conditions' },
        { label: 'Плащане', href: '/register/payment' },
        { label: 'Участници', href: '/participants' },
        { label: 'Класиране', href: '/results?year=2025' },
        ...(admin ? [{ label: 'Админ', href: '/admin' }] : []),
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <Header video={video} image={image}>
            {video && <HeaderVideo isMuted={true} video={video} />}
            {image && <img src={image} alt="Header Image" />}
            {children}
            <Logo href="/" />
            <Button disabled={false} highlight={true} onClick={() => {
                window.location.href = '/register'
            }} label="Регистрирай се" />
            <MenuWrapper ref={menuRef}>
                <MenuButton
                    type="button"
                    aria-label="Отвори меню"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                >
                    <MenuIcon />
                </MenuButton>
                {isMenuOpen && (
                    <MenuDropdown>
                        {menuItems.map((item) => (
                            <MenuItem key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                                {item.label}
                            </MenuItem>
                        ))}
                    </MenuDropdown>
                )}
            </MenuWrapper>
            {!hideDate && <Date>27<br/> септември</Date>}
        </Header>
    );
}
