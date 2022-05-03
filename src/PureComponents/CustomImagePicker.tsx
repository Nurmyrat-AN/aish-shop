import ImageOutlined from '@mui/icons-material/ImageOutlined'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import React from 'react'

type singleImg = {
    img?: string
    onChange: (img: string) => void
    multiple: false | undefined
}

type multipleImg = {
    img?: string[]
    onChange: (img: string[]) => void
    multiple: true
}
type Props = {
    width?: number
    height?: number
    multiple?: boolean
} & (singleImg | multipleImg)

const CustomImagePicker: React.FC<Props> = ({ width = 120, height = 120, img, onChange, multiple = false }) => {

    const handleInputChange = async (event: any) => {
        let files = event.target.files;
        if (files.length > 0) {
            const promises: any[] = []
            for (let i = 0; i < files.length; i++) {
                promises.push(new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(files[i]);
                    reader.onload = (e: any) => {
                        resolve(e.target.result)
                    }
                    reader.onerror = () => reject()
                }))
            }
            if (event.target && event.target.value)
                event.target.value = null
            const results = await Promise.all(promises)
            onChange(multiple ? results : results[0])
        }
    }

    return (
        <Card className='img-preview' style={{ width, height, position: 'relative', backgroundImage: `url(${img})`, display: 'flex' }}>
            {!img && <Avatar style={{ margin: 'auto' }}><ImageOutlined /></Avatar>}
            <input multiple={multiple} onChange={handleInputChange} type='file' accept='.jpeg, .png, .web, .jpg' style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0 }} />
        </Card>
    )
}

export default CustomImagePicker