import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export { TabItem };

export function AttributesTagsTabs({children}) {
    return (
        <Tabs
            defaultValue="tags"
            values={[
                {label: 'Docblock', value: 'tags'},
                {label: 'Attributes', value: 'attributes'},
            ]}>
            {children}
        </Tabs>
    );
}
