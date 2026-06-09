import React from "react"

import { Dimmer, Footer, HomeContainer } from "./styles";
import ProductField from "./ProductField";
import CourseField from "../CourseField/CourseField";
import ImagesField from "../ImagesField/ImagesField";
import Button from "../Button/Button";
import DetailsField from "../DetailsField/DetailsField";
import SponsorsField from "../SponsorsField/SponsorsField";
import { HeaderComponent } from "../Header/Header";
import PopUp from "../PopUp/PopUp";
import { useNavigate } from "react-router-dom";

const HOME_POPUP_STORAGE_KEY = 'osogovo_home_popup_visible';

const Home: React.FC = () => {
    const [ showPopUp, setShowPopUp ] = React.useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return true;
        }

        const storedValue = window.localStorage.getItem(HOME_POPUP_STORAGE_KEY);
        if (storedValue === null) {
            return true;
        }

        return storedValue === 'true';
    });

    const setShowPopUpAndPersist: React.Dispatch<React.SetStateAction<boolean>> = (nextValue) => {
        setShowPopUp((previousValue) => {
            const resolvedValue = typeof nextValue === 'function' ? nextValue(previousValue) : nextValue;

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(HOME_POPUP_STORAGE_KEY, String(resolvedValue));
            }

            return resolvedValue;
        });
    };

    // Navigate is used in the popup sometimes
    // const navigate = useNavigate()

    return (
        <HomeContainer>
            <HeaderComponent video='http://www.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            {showPopUp && <Dimmer show={showPopUp} onClick={() => setShowPopUpAndPersist(false)} />}
            {showPopUp && 
                <PopUp showPopUp={showPopUp} closePopUp={setShowPopUpAndPersist}>
                    <p>Новата дата за Осогово Рън е 27 септември 2026!</p>
                    <p>Регистрацията ще бъде отворена скоро.</p>
                </PopUp>}
            <ProductField/>
            <CourseField/>
            <ImagesField/>
            <DetailsField/>
            <SponsorsField/>
            <Footer>Copyright © 2025 Osogovo Run</Footer>
        </HomeContainer>
    );
}

export default Home