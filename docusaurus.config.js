/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'Scribe',
    tagline: 'Generate API documentation for humans from your codebase.',
    url: 'https://scribe.knuckles.wtf',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'knuckleswtf',
    projectName: 'scribe-docs',
    themeConfig: {
        navbar: {
            style: 'dark',
            title: 'Scribe',
            logo: {
                alt: 'Scribe Logo',
                src: 'img/logo.png',
            },
            items: [
                {
                    to: '/laravel/intro',
                    label: 'Laravel',
                },
                {
                    to: 'nodejs/intro',
                    label: 'Node.js',
                },
                {
                    to: '/blog',
                    label: 'Blog',
                    position: 'right',
                },
                {
                    href: 'https://github.com/knuckleswtf/',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    items: [
                        {
                            label: 'Laravel',
                            to: '/laravel/intro',
                        },
                    ],
                },
                {
                    items: [
                        {
                            label: 'Node.js',
                            to: '/nodejs/intro',
                        },
                    ],
                },
                {
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/knuckleswtf',
                        },
                    ],
                },
                {
                    items: [
                        {
                            label: 'Blog',
                            to: '/blog',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Shalvah. Built with Docusaurus.`,
        },
        prism: {
            additionalLanguages: ['php'],
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    path: 'laravel',
                    routeBasePath: 'laravel',
                    editUrl:
                        'https://github.com/knuckleswtf/scribe-docs/edit/master/laravel/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
    plugins: [
        [
            '@docusaurus/plugin-content-docs',
            {
                sidebarPath: require.resolve('./sidebars.js'),
                id: 'nodejs',
                path: 'nodejs',
                routeBasePath: 'nodejs',
                editUrl: 'https://github.com/knuckleswtf/scribe-docs/edit/master/nodejs/',
            },
        ],
    ],
};
