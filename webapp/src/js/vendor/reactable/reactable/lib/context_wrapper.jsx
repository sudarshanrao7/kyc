import React from 'react';
import createReactClass from 'create-react-class';

export function contextWrapper(context, contextTypes, child) {
    let ContextWrapper = createReactClass({
        displayName: 'ContextWrapper',
        childContextTypes: contextTypes,
        getChildContext() { return context; },
        render() { return child; }
    });

    return <ContextWrapper/>;
}
