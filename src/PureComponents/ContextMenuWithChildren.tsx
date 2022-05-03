import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

type Props = {
    options: { onClick: (...args: any) => void, label?: string, customTitle?: any }[]
    [x: string]: any
}

let oldShadow = ''
const ContextMenuWithChildren: React.FC<Props> = (props) => {
    const { options, children, ...rest } = props
    const [contextMenu, setContextMenu] = React.useState<any>(null)
    const onContextMenu = (e: any) => {
        e.preventDefault()
        setContextMenu(
            contextMenu === null
                ? {
                    e,
                    mouseX: e.clientX - 2,
                    mouseY: e.clientY - 4,
                } : null)
    }
    const onClose = () => {
        setContextMenu(null)
    }

    return (<>
        {React.Children.map(props.children, (child, index) => React.isValidElement(child) ? React.cloneElement<any>(child, { ...rest, onContextMenu }) : child)}
        {contextMenu && <Menu
            open={contextMenu !== null}
            onClose={onClose}
            onContextMenu={(e) => { e.preventDefault(); onClose() }}
            onClick={onClose}
            anchorReference="anchorPosition"
            anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
            }
        >
            {props.options?.map((item, idx) => <MenuItem key={idx} onClick={item.onClick}>{item.label ? item.label : item.customTitle || null}</MenuItem>)}
        </Menu>}
    </>)
}

export default ContextMenuWithChildren