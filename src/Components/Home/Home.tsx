import React from "react"
import { useTranslation } from "react-i18next";

import { Dimmer, Footer, HomeContainer } from "./styles";
import ProductField from "./ProductField";
import CourseField from "../CourseField/CourseField";
import ImagesField from "../ImagesField/ImagesField";
import DetailsField from "../DetailsField/DetailsField";
import SponsorsField from "../SponsorsField/SponsorsField";
import { HeaderComponent } from "../Header/Header";
import PopUp from "../PopUp/PopUp";
import Records from "./Records";

const HOME_POPUP_STORAGE_KEY = 'osogovo_home_popup_visible';

const Home: React.FC = () => {
    const { t } = useTranslation();
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

    const popUpEnabled = false;

    return (
        <HomeContainer>
            <HeaderComponent video='https://media.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            {popUpEnabled && showPopUp && <Dimmer show={showPopUp} onClick={() => setShowPopUpAndPersist(false)} />}
            {popUpEnabled && showPopUp && 
                <PopUp showPopUp={showPopUp} closePopUp={setShowPopUpAndPersist}>
                    <p>{t('home:popup.date')}</p>
                    <p>{t('home:popup.registration')}</p>
                </PopUp>}
            <ProductField/>
            <Records />
            <CourseField/>
            <ImagesField/>
            <DetailsField/>
            <SponsorsField/>
            <Footer>{t('home:footer')}</Footer>
        </HomeContainer>
    );
}

export default Home