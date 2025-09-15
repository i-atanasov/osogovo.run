import React from "react"
import { CourseDescription, CourseFieldWrapper, CourseDescriptionWrapper, FeeDescription, MapWrapper, RegisterAction } from "./styles"
import { CourseDescription as CourseDescriptionData, products } from "../../config/constants"
import Button from "../Button/Button"
import { useNavigate } from "react-router-dom"

export const CourseField: React.FC = () => {
    const navigate = useNavigate();
    return (
        <CourseFieldWrapper>
            <CourseDescriptionWrapper>
                <CourseDescription>
                    <h2>{CourseDescriptionData.title}</h2>
                    <p>{CourseDescriptionData.description}</p>
                </CourseDescription>
                <FeeDescription>
                    <h2>Стартови такси</h2>
                    <table>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <th>{product.distance} км</th>
                                    <td><span>{product.price} лв</span> до  септември</td>
                                    {product.latePrice && (
                                        <td><span>{product.latePrice} лв</span> след 17 септември</td>
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
                <Button label="Регистрирай се" onClick={() => {
                    navigate("/register");
                }} />
            </RegisterAction>
        </CourseFieldWrapper>
    )
}

export default CourseField