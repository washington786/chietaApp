import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DetailsPage from '@/ui/pages/application/top/DetailsPage';
import ApplicationDetails from '@/ui/pages/application/top/ApplicationDetails';
import BankDetailsPage from '@/ui/pages/application/top/BankDetailsPage';

const Tab = createMaterialTopTabNavigator();

const TopNav = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name='Client Info' component={DetailsPage} />
            <Tab.Screen name='Application Info' component={ApplicationDetails} />
            <Tab.Screen name='Payments' component={BankDetailsPage} />
        </Tab.Navigator>
    )
}

export default TopNav;