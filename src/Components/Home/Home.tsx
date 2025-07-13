import React from "react"
import { useNavigate } from "react-router-dom";

import { HomeContainer } from "./styles";
import ProductField from "./ProductField";
import CourseField from "../CourseField/CourseField";
import ImagesField from "../ImagesField/ImagesField";
import Button from "../Button/Button";
import DetailsField from "../DetailsField/DetailsField";
import SponsorsField from "../SponsorsField/SponsorsField";

const Home: React.FC = () => {
    const navigate = useNavigate();
    return (
        <HomeContainer >
            <ProductField/>
            <CourseField/>
            <Button label="Регистрирай се" onClick={() => {
                navigate("/register");
            }} />
            <ImagesField/>
            <DetailsField/>
            <SponsorsField/>
        </HomeContainer>
    );
}

export default Home