const participants = {
    links: {
        results: 'View results:',
        resultsYear: '2025',
        payment: 'Payment for already registered participants',
    },
    title: 'Participants list:',
    table: {
        name: 'Name',
        category: 'Category',
        distance: 'Distance',
        team: 'Team',
        finish: 'Finish',
        status: 'Status',
        loading: 'Loading...',
    },
    status: {
        paid: 'Paid',
        pending: 'Pending payment',
    },
    counts: {
        distance: '{{distance}} km distance: {{count}} {{label}}',
        participant: 'participant',
        participants: 'participants',
    },
    profile: {
        backToParticipants: 'Back to participants',
        title: 'Participations',
        sections: {
            incoming: 'Upcoming events',
            completed: 'Past events',
            badges: 'Badges',
            badgesDescription: 'Coming soon',
        },
        table: {
            year: 'Year',
            status: 'Type',
        },
        status: {
            incoming: 'Incoming',
            previous: 'Completed',
        },
        errors: {
            loadFailed: 'Could not load participant information.',
        },
    },
};

export default participants;
