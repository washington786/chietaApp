import React from 'react'
import ParentNavigation from './ParentNavigation'
import RootStack from './RootStack'

const MainNavigation = () => {
    return (
        <ParentNavigation>
            <RootStack />
        </ParentNavigation>
    )
}

export default MainNavigation