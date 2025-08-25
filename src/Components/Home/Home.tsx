import React from "react"
import { Footer, HomeContainer } from "./styles";
import ProductField from "./ProductField";
import CourseField from "../CourseField/CourseField";
import ImagesField from "../ImagesField/ImagesField";
import Button from "../Button/Button";
import DetailsField from "../DetailsField/DetailsField";
import SponsorsField from "../SponsorsField/SponsorsField";
import { HeaderComponent } from "../Header/Header";

const Home: React.FC = () => {
    return (
        <HomeContainer >
            <HeaderComponent video='http://www.osogovo.run/osogovo-run%20-%20SD%20480p.mov' />
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