import React from 'react';
import Store, { ApplicationStore } from '../../store';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';

const height = 25;

const styles = theme => ({
    root: {
        width: 300,
        paddingBottom: 20,
        display: 'flex',
        alignItems: 'center',
        fontSize: 'small',
        justifyContent: 'space-around'
    },
    circle: {
        borderRadius: '50%',
        position: 'relative',
        width: height,
        margin: '0 3em',
        height,
        '&::before': {
            content: 'attr(title)',
            position: 'absolute',
            top: '100%',
            left: '50%',
            whiteSpace: 'nowrap',
            padding: 2,
            textAlign: 'center',
            transform: 'translate(-50%,0)'
        }
    },
    scale: {
        flexGrow: 1,
        height: height / 2,
        position: 'relative',
        '&::before': {
            content: 'attr(data-from)',
            position: 'absolute',
            top: '100%',
            left: 0,
            whiteSpace: 'nowrap',
            paddingTop: height / 4 + 2,
            textAlign: 'left'
        },
        '&::after': {
            content: 'attr(data-to)',
            position: 'absolute',
            top: '100%',
            right: 0,
            whiteSpace: 'nowrap',
            paddingTop: height / 4 + 2,
            textAlign: 'right'
        }
    }
});

@observer
class NodeColorLegend extends React.Component  {
    static contextType = Store;

    render() {
        const store = this.context;
        const { classes } = this.props;

        const circle = (title, color) => <div className={classes.circle} title={title} style={{ background: color }} />;
        
        const gradient = (domain) => {
            const gradientSamples = 10;
            // sample the color scale and create a gradient defintion out of it
            const scale = ApplicationStore.COLOR_SCALE.copy().domain([0, gradientSamples]);
            const samples = Array.from({ length: gradientSamples + 1 }).map((_, i) => `${scale(i)} ${Math.round(i * 100 / gradientSamples)}%`).join(',');
            // TODO proper value representation
            return <div className={classes.scale} data-from={Math.round(domain[0])} data-to={Math.round(domain[1])} style={{ background: `linear-gradient(to right, ${samples})` }} />;
        };

        switch (store.color) {
            case 'none':
                return null;
            case 'boolean':
                return <div className={classes.root}>
                    {circle('Discovered', ApplicationStore.EXISTS_COLOR)}
                    {circle('Hypothetical', ApplicationStore.NOT_EXISTENT_COLOR)}
                </div>;
            case 'undiscovered':
                return <div className={classes.root}>
                    {circle('Discovered', ApplicationStore.EXISTS_COLOR)}
                    {circle('Undiscovered', ApplicationStore.NOT_EXISTENT_COLOR)}
                </div>;
            case 'discovery':
                return <div className={classes.root}>
                    {gradient(ApplicationStore.yearSettings.range)}
                    {circle('Undiscovered', ApplicationStore.NOT_EXISTENT_COLOR)}
                </div>;
            default:
                return <div className={classes.root}>
                    {gradient(store.minMaxColorRange)}
                    {circle('Unknown', ApplicationStore.INVALID_VALUE_COLOR)}
                </div>;
        }
    }
}

export default withStyles(styles)(NodeColorLegend);
