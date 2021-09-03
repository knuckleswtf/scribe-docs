import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export { TabItem };

export function AdonisExpressRestifyTabs({children}) {
    return (
        <Tabs
            defaultValue="adonis"
            values={[
                {label: 'AdonisJS', value: 'adonis'},
                {label: 'Express', value: 'express'},
                {label: 'Restify', value: 'restify'},
            ]}>
            {children}
        </Tabs>
    );
}