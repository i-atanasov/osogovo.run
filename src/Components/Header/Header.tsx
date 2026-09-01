import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Date, Header, LanguageButton, LanguageSeparator, LanguageSwitcher, Logo, MenuButton, MenuDropdown, MenuIcon, MenuItem, MenuWrapper } from "./styles";
import { useAdminAuth } from '../Admin/AdminAuthContext';

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
    const { i18n, t } = useTranslation();
    const currentLanguage = i18n.resolvedLanguage || i18n.language;
    const menuItems = [
        { label: t('nav.home'), href: '/' },
        { label: t('nav.register'), href: '/register' },
        { label: t('nav.courses'), href: '/#courses' },
        { label: t('nav.conditions'), href: '/#conditions' },
        { label: t('nav.payment'), href: '/register/payment' },
        { label: t('nav.participants'), href: '/participants' },
        { label: t('nav.results'), href: '/results?year=2025' },
        { label: t('nav.records'), href: '/#records' },
        ...(admin ? [{ label: t('nav.admin'), href: '/admin' }] : []),
    ];

    const handleLanguageChange = (language: 'bg' | 'en') => {
        i18n.changeLanguage(language);
    };

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
            <MenuWrapper ref={menuRef}>
                <MenuButton
                    type="button"
                    aria-label={t('nav.toggleMenu')}
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
                        <LanguageSwitcher aria-label={t('language.switchLabel')}>
                            <LanguageButton
                                type="button"
                                active={currentLanguage === 'bg'}
                                onClick={() => handleLanguageChange('bg')}
                            >
                                {t('language.bg')}
                            </LanguageButton>
                            <LanguageSeparator>|</LanguageSeparator>
                            <LanguageButton
                                type="button"
                                active={currentLanguage === 'en'}
                                onClick={() => handleLanguageChange('en')}
                            >
                                {t('language.en')}
                            </LanguageButton>
                        </LanguageSwitcher>
                    </MenuDropdown>
                )}
            </MenuWrapper>
            {!hideDate && <Date>{t('eventDate.day')}<br/> {t('eventDate.month')}</Date>}
        </Header>
    );
}
