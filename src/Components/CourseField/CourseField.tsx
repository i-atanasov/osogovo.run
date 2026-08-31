import React from "react"
import { CourseDescription, CourseFieldWrapper, CourseDescriptionWrapper, FeeDescription, MapWrapper, RegisterAction } from "./styles"
import { products } from "../../config/constants"
import Button from "../Button/Button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export const CourseField: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <CourseFieldWrapper id="courses">
            <CourseDescriptionWrapper>
                <CourseDescription>
                    <h2>{t('home:course.title')}</h2>
                    <p>{t('home:course.description')}</p>
                </CourseDescription>
                <FeeDescription>
                    <h2>{t('home:course.feesTitle')}</h2>
                    <table>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <th>{t('home:course.distanceLabel', { distance: product.distance })}</th>
                                {/* <td><span>{product.price} eur</span> до  септември</td> */}
                                {product.price && (
                                    <td><span>{product.price} eur</span> {t('home:course.earlyFee')}</td>
                                )}
                                {product.price && (
                                    <td><span>{product.price + 5} eur</span> {t('home:course.lateFee')}</td>
                                )}
                            </tr>
                        ))}
                    </table>
                </FeeDescription>
            </CourseDescriptionWrapper>
            <MapWrapper>   
                <iframe src="https://www.google.com/maps/d/embed?mid=1O6PSW30-PqjukzHPEQ76V_90Y0mZ48k&ehbc=2E312F"></iframe>
            </MapWrapper>
            <RegisterAction>
                <img src='https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/Profile_Race_OR.png' alt="Course Profile" className="course-profile" />
                <Button disabled={false} label={t('home:course.register')} onClick={() => {
                    navigate("/register");
                }} />
            </RegisterAction>
        </CourseFieldWrapper>
    )
}

export default CourseField