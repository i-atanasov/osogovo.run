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

const Home: React.FC = () => {
    const [ showPopUp, setShowPopUp ] = React.useState(true);
    const navigate = useNavigate()

    return (
        <HomeContainer>
            <HeaderComponent video='http://www.osogovo.run/media/osogovo-run-21-sec-low.mp4' />
            {showPopUp && <Dimmer show={showPopUp} onClick={() => setShowPopUp(false)} />}
            {showPopUp && 
                <PopUp showPopUp={showPopUp} closePopUp={setShowPopUp}>
                    <p>Инструкции за стартовия ден, вижте тук:</p>
                    <Button label='Инструкции за състезателния ден' onClick={() => navigate('/race-day')} />
                    <p>Класиране на живо, следете тук:</p>
                    <Button label='Класиране на живо' onClick={() => navigate('/results')} />
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