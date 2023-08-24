// Manually build version dropdowns, because we need to change the label
const laravelVersions = ['4.x', '3.x'];
const nodejsVersions = ['2.x'];
const laravelVersionDropdown = laravelVersions.map((version, idx) => ({
    to: `laravel/${idx === 0 ? '' : version}`,
    label: `Laravel: ${version}${idx === 0 ? ' (current)' : ''}`,
}));
laravelVersionDropdown.push({
    to: 'https://scribe.rtfd.io',
    label: 'Laravel: 2.x',
});
const nodejsVersionDropdown = nodejsVersions.map((version, idx) => ({
    to: `nodejs/${idx === 0 ? '' : version}`,
    label: `Node.js: ${version}${idx === 0 ? ' (unmaintained)' : ''}`,
}));
const versionDropdown = {
    label: 'Switch version',
    position: 'right',
    items: [...laravelVersionDropdown, ...nodejsVersionDropdown],
};


/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'Scribe',
    tagline: 'Generate API documentation for humans from your Laravel codebase.',
    url: 'https://scribe.knuckles.wtf',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'throw',
    favicon: 'img/favicon.ico',
    organizationName: 'knuckleswtf',
    projectName: 'scribe-docs',
    themeConfig: {
        colorMode: {
            defaultMode: 'dark',
        },
        image: 'img/og-image-scribe.png',
        navbar: {
            hideOnScroll: true,
            style: 'dark',
            title: 'Scribe',
            logo: {
                alt: 'Scribe Logo',
                src: 'img/logo.png',
            },
            items: [
                {
                    to: '/laravel',
                    label: 'Laravel',
                },
                versionDropdown,
                {
                    to: '/blog',
                    label: 'Blog',
                    position: 'right',
                },
                {
                    href: 'https://github.com/knuckleswtf/scribe/',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Laravel',
                            to: '/laravel',
                        },
                    ],
                },
                {
                    title: 'GitHub',
                    items: [
                        {
                            label: 'Scribe',
                            href: 'https://github.com/knuckleswtf/scribe',
                        },
                        {
                            label: 'Scribe Docs',
                            href: 'https://github.com/knuckleswtf/scribe-docs',
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
        algolia: {
            appId: 'WMFPPEFVT6',
            apiKey: '6fc653b221399821574f6c08538d0ab7',
            indexName: 'scribe',
            contextualSearch: true,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebarsLaravel.js'),
                    id: 'laravel',
                    path: 'laravel',
                    routeBasePath: 'laravel',
                    editUrl: ({locale, versionDocsDirPath, docPath}) =>
                        `https://github.com/knuckleswtf/scribe-docs/edit/master/${versionDocsDirPath}/${docPath}`,
                    lastVersion: "current",
                    versions: {
                        current: {
                            label: "Laravel: 4.x (current)",
                            badge: true,
                        },
                        "3.x": {
                            label: "Laravel: 3.x",
                            badge: true,
                            banner: 'unmaintained',
                            path: '/3.x',
                        }
                    },
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
                sidebarPath: require.resolve('./sidebarsNodejs.js'),
                id: 'nodejs',
                path: 'nodejs',
                routeBasePath: 'nodejs',
                editUrl: ({locale, versionDocsDirPath, docPath}) =>
                    `https://github.com/knuckleswtf/scribe-docs/edit/master/${versionDocsDirPath}/${docPath}`,
                lastVersion: "current",
                versions: {
                    current: {
                        label: "Node.js: 2.x (unmaintained)",
                        badge: true,
                    }
                },
                onlyIncludeVersions: ["current"],
            },
        ],
    ],
};
