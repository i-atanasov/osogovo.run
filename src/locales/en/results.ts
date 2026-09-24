const results = {
    links: {
        participants: 'View participants',
    },
    title: '{{year}} Results',
    loading: 'Loading...',
    errors: {
        unavailableForYear: 'No results are available for {{year}}.',
        loadFailed: 'There was a problem loading the results. Please try again.',
    },
    table: {
        position: 'Position',
        name: 'Name',
        bib: 'Bib',
        result: 'Result',
        category: 'Category',
        team: 'Team',
        finish: 'Finish',
    },
    sections: {
        distanceTitle: '{{title}} - {{distance}} km',
        overallCurrent: 'Overall ranking',
        men: 'Men',
        womenCurrent: 'Women',
        menUnder20: 'Men under 20',
        womenUnder20: 'Women under 20',
        menOver40: 'Men over 40',
        womenOver40: 'Women over 40',
        overall: 'Overall ranking {{distance}} km',
        women: 'Women / {{distance}} km ranking',
        women40: 'Women 40+ / {{distance}} km ranking',
        men40: 'Men 40+ / {{distance}} km ranking',
        men20: 'Men under 20 / {{distance}} km ranking',
        women20: 'Women under 20 / {{distance}} km ranking',
    },
};

export default results;
