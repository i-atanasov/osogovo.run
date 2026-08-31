import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProductBoxWrapper, ImageWrapper, TextWrapper } from "./styles";
import Button from "../Button/Button";

export interface ProductBoxProps {
    distance: number;
    elevation: string;
    image: string;
    name: string;
    startingPoint: string;
    final: string;
    startingTime: string;
    totalDistance: string;
    cutOffTime: string;
    description: string;
    gpx: string;
    priceLabel: string;
    price: number;
    latePriceLabel?: string;
    latePrice?: number;
    tShirtPrice?: number;
    testProductPrice?: number;
}

const ProductBox = (product: ProductBoxProps) => {  
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <ProductBoxWrapper>
            <ImageWrapper href={`/register?product=${product.distance}`}>
                <img src={product.image} alt={product.name} />
            </ImageWrapper>
            <TextWrapper>
                <p dangerouslySetInnerHTML={{ __html: product.startingPoint }}></p>
                <p dangerouslySetInnerHTML={{ __html: product.final }}></p>
                <p dangerouslySetInnerHTML={{ __html: product.startingTime }}></p>
                <p dangerouslySetInnerHTML={{ __html: product.totalDistance }}></p>
                <p dangerouslySetInnerHTML={{ __html: product.elevation }}></p>
                <p dangerouslySetInnerHTML={{ __html: product.cutOffTime }}></p>
                <p className="highlight" dangerouslySetInnerHTML={{ __html: `${t('home:products.fee')}: €${product.price}` }}></p>
                {product.latePrice && <p className="highlight" dangerouslySetInnerHTML={{ __html: `${t('home:products.lateFee')}: €${product.latePrice}` }}></p>}
                {/* <a href="/participants">Виж регистрираните участници</a> */}
            </TextWrapper>
            <Button disabled={false} label={t('home:products.register')} onClick={() => {
                navigate(`/register?product=${product.distance}`);
            }} />
            <a className="gpx-path" href={product.gpx} download data-download-label={t('home:products.downloadGpx')}>{product.distance}k GPX</a>
        </ProductBoxWrapper>
    );
};

export default ProductBox;
