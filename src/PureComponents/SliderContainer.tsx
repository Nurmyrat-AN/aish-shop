import React from 'react'

type Props = {
    autoSlide: boolean
    children?: any
}

const SliderContainer: React.FC<Props> = ({ autoSlide, children }) => {
    const [index, setIndex] = React.useState(0)
    React.useEffect(() => {
        let timer: any = null
        if (autoSlide && React.Children.count(children) > 0) {
            setIndex(1)
            timer = setInterval(() => setIndex(index => index + 1), 2000)
        }

        return () => timer && clearInterval(timer)
    }, [autoSlide, children])
    return <>
        {React.Children.map(children, (child, idx) => autoSlide ? (index % React.Children.count(children)) === idx ? child : null : idx === 0 ? child : null)}
    </>
}

export default SliderContainer