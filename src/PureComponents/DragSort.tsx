import React from 'react'

type Props = {
    onChange: (indexes: number[]) => void
    children?: any
}

const DragSort: React.FC<Props> = ({ children, onChange }) => {
    const [drag, setDrag] = React.useState<null | number>(null)

    const handleDrop = (over: number) => {
        if (drag !== over) {
            const dragged = drag || 0
            const count = React.Children.count(children)
            const initialArray = Array.from(Array(count).keys())
            initialArray.splice(dragged, 1)
            initialArray.splice(over, 0, dragged)
            onChange(initialArray)
        }
        setDrag(null)
    }

    return <>{React.Children.map(children, (child, idx) => React.isValidElement(child) && React.cloneElement(child, {
        //@ts-ignore
        draggable: true,
        onDragStart: () => drag === null ? setDrag(idx) : null,
        onDragOver: (e: any) => { e.preventDefault() },
        onDrop: () => handleDrop(idx),
    }))}</>
}

export default DragSort