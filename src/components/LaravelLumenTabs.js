import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export { TabItem };

export function LaravelLumenTabs({children}) {
    return (
        <Tabs
            defaultValue="laravel"
            values={[
                {label: 'Laravel', value: 'laravel'},
                {label: 'Lumen', value: 'lumen'},
            ]}>
            {children}
        </Tabs>
    );
}