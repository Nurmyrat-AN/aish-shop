import React from "react";
import SliderContainer from "../../PureComponents/SliderContainer";
import { BanerPropsType } from "./types";

const SLIDER: React.FC<BanerPropsType> = (props) => {
    return (
        <div style={{ width: '100%', height: 200 }}>
            <SliderContainer
                autoSlide>
                {props.data.map(item => <div className="img-preview" style={{ backgroundImage: `url(${item.src})`, width: '100%', height: '100%' }} />)}
            </SliderContainer>
        </div>
    )
}

export default SLIDER