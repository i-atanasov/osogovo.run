import React from "react";
import { products, fullRoute } from "../../config/constants";
import { AnimatedSign, ProductFieldWrapper, ProductBoxContainer, ProductFieldContainer } from "./styles";
import ProductBox from "../ProductBox/ProductBox";

const ProductField = () => {
    return (
        <ProductFieldWrapper>
            <ProductFieldContainer>
                <h1>26 km<br/> 1700 m d+</h1>
                <AnimatedSign delay="4s" top="25%" left="33%">Студен<br/> Кладенец <span>1340 м</span></AnimatedSign>
                <AnimatedSign delay="5s" top="20%" left="50%" color="white">хижа<br/> Осогово <span>1640 м</span></AnimatedSign>
                <AnimatedSign delay="6s" top="19%" left="70%">Бег Бунар <br/><span>1842 м</span></AnimatedSign>
                <AnimatedSign delay="7s" top="10%" left="93%" color="white">Руен <br/> <span>2251 м</span></AnimatedSign>
                <div className="route-svg" dangerouslySetInnerHTML={{ __html: fullRoute }} />
                <img
                    src='https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/product-box-image.png'
                    alt="Route"
                />
            </ProductFieldContainer>
            <ProductBoxContainer>
                {products.map((product, index) => (
                    <ProductBox
                        key={index}
                        {...product}
                    />
                ))}
            </ProductBoxContainer>
        </ProductFieldWrapper>
    );
};

export default ProductField;