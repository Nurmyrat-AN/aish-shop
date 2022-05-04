import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

type Props = {}

const Header: React.FC<Props> = () => {
    const history = useHistory()
    const location = useLocation()
    const handleTabChange = (event: React.SyntheticEvent<Element, Event>, value: any) => {
        if (value !== location.pathname) history.push(value)
    }

    return (
        <AppBar position='sticky' color='transparent' style={{ background: 'white' }}>
            <Tabs value={location.pathname} onChange={handleTabChange}>
                <Tab value={'/'} label='Harytlar' />
                <Tab value={'/groups'} label='Toparlar' />
                <Tab value={'/currencies'} label='Walýutalar' />
                <Tab value={'/baners'} label='Banerler' />
            </Tabs>
        </AppBar>
    )
}

export default Header