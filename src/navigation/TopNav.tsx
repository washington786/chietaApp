import React, { FC } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DetailsPage from '@/ui/pages/application/top/DetailsPage';
import ApplicationDetails from '@/ui/pages/application/top/ApplicationDetails';
import BankDetailsPage from '@/ui/pages/application/top/BankDetailsPage';
import DgApplicationDetails from '@/ui/pages/application/top/DgApplicationDetails';

const Tab = createMaterialTopTabNavigator();

interface prop {
    type: string;
    appId: string;
    orgId: string;
    item?: any;
}

const TopNav: FC<prop> = ({ type, appId, orgId, item }) => {
    return (
        <Tab.Navigator>
            <Tab.Screen name='Client Info' component={DetailsPage} initialParams={{ appId, orgId, item }} />
            <Tab.Screen name='Application Info' component={type === 'mg-app' ? ApplicationDetails : DgApplicationDetails} initialParams={{ appId, orgId, item }} />
            <Tab.Screen name='Payments' component={BankDetailsPage} initialParams={{ appId, orgId, item }} />
        </Tab.Navigator>
    )
}

export default TopNav;