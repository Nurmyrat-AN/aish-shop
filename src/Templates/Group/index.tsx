import React from "react";
import { GROUP_TEMPLATES_TYPE } from "../../Pages/HomePage/hometypes";
import HORIZONTAL_SCROLL from "./HORIZONTAL_SCROLL";
import SIMPLE from "./SIMPLE";
import { GroupPropsType } from "./types";

const GroupTemplates: React.FC<GroupPropsType & { template: GROUP_TEMPLATES_TYPE }> = ({ data, template }) => {
    switch (template) {
        case 'SIMPLE':
            return <SIMPLE data={data} />
        case 'HORIZONTAL_SCROLL':
            return <HORIZONTAL_SCROLL data={data} />
        default:
            return null
    }
}

export default GroupTemplates