import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DetailsPage from '@/ui/pages/application/top/DetailsPage';
import BankDetailsPage from '@/ui/pages/application/top/BankDetailsPage';
import OrganizationDetailsPage from '@/ui/pages/application/top/OrganizationDetailsPage';
import FilePage from '@/ui/pages/application/top/FilePage';

const Tab = createMaterialTopTabNavigator();

const TopNav = () => {
    return (
        <Tab.Navigator style={{ backgroundColor: "white" }}>
            <Tab.Screen name='Info' component={DetailsPage} />
            <Tab.Screen name='org' component={BankDetailsPage} />
            <Tab.Screen name='bank' component={OrganizationDetailsPage} />
            <Tab.Screen name='file' component={FilePage} />
        </Tab.Navigator>
    )
}

export default TopNav;