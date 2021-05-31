import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
    {
        title: 'Designed for efficiency',
        Svg: require('../../static/img/undraw_working_remotely.svg').default,
        description: (
            <>
                Write your code,
                then run a single command to get a docs webpage, Postman collection, OpenAPI spec,
                and API tester out-of-the-box.
            </>
        ),
    },
    {
        title: 'Human-friendly',
        Svg: require('../../static/img/undraw_conversation.svg').default,
        description: (
            <>
                Scribe might be a machine, but your docs will be read by real people.
                Any generated text is tailored to feel natural to your readers.
            </>
        ),
    },
    {
        title: 'Customizable',
        Svg: require('../../static/img/undraw_building_websites.svg').default,
        description: (
            <>
                Customize Scribe's behaviour in several ways: config files, annotations,
                structured YAML and custom strategies.
            </>
        ),
    },
];

function Feature({Svg, title, description}) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} alt={title}/>
            </div>
            <div className="text--center padding-horiz--md">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
