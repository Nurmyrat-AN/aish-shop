import React from "react";
import { BANER_TEMPLATES_TYPE } from "../../Pages/HomePage/hometypes";
import CUSTOM_WITH_BIG_IMAGE from "./CUSTOM_WITH_BIG_IMAGE";
import GRID_LIST from "./GRID_LIST";
import SLIDER from "./SLIDER";
import { BanerPropsType } from "./types";

const BanerTemplates: React.FC<BanerPropsType & { template: BANER_TEMPLATES_TYPE }> = ({ data, template }) => {
    switch (template) {
        case 'SLIDER':
            return <SLIDER data={data} />
        case 'GRID_LIST':
            return <GRID_LIST data={data} />
        case 'CUSTOM_WITH_BIG_IMAGE':
            return <CUSTOM_WITH_BIG_IMAGE data={data} />
        default:
            return null
    }
}

export default BanerTemplates