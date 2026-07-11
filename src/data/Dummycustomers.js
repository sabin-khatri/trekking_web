const dummyCustomers = [
  {
    id: 'CUST-501', name: 'John Doe', email: 'john.doe@email.com', phone: '+1 555 204 8891',
    country: 'United States', totalTreks: 3, totalSpend: '$8,900', lastTrek: 'Everest Base Camp',
    joined: 'Mar 2024', type: 'returning',
    history: [
      { trek: 'Everest Base Camp', date: 'Oct 15, 2026', amount: '$3,200' },
      { trek: 'Gokyo Ri Trek', date: 'Apr 02, 2025', amount: '$2,700' },
      { trek: 'Poon Hill Trek', date: 'Nov 10, 2024', amount: '$3,000' },
    ]
  },
  {
    id: 'CUST-502', name: 'Sarah Smith', email: 'sarah.smith@email.com', phone: '+44 7700 900123',
    country: 'United Kingdom', totalTreks: 1, totalSpend: '$1,400', lastTrek: 'Annapurna Circuit',
    joined: 'Jun 2026', type: 'new',
    history: [
      { trek: 'Annapurna Circuit', date: 'Nov 02, 2026', amount: '$1,400' },
    ]
  },
  {
    id: 'CUST-503', name: 'Michael Chen', email: 'michael.chen@email.com', phone: '+1 415 233 7765',
    country: 'United States', totalTreks: 2, totalSpend: '$6,300', lastTrek: 'Langtang Valley',
    joined: 'Jan 2025', type: 'returning',
    history: [
      { trek: 'Langtang Valley', date: 'Oct 20, 2026', amount: '$3,600' },
      { trek: 'Mardi Himal Trek', date: 'Feb 14, 2025', amount: '$2,700' },
    ]
  },
  {
    id: 'CUST-504', name: 'Emma Wilson', email: 'emma.wilson@email.com', phone: '+61 412 555 908',
    country: 'Australia', totalTreks: 1, totalSpend: '$1,600', lastTrek: 'Mardi Himal Trek',
    joined: 'May 2026', type: 'new',
    history: [
      { trek: 'Mardi Himal Trek', date: 'Dec 05, 2026', amount: '$1,600' },
    ]
  },
  {
    id: 'CUST-505', name: 'David Brown', email: 'david.brown@email.com', phone: '+1 646 555 3321',
    country: 'United States', totalTreks: 4, totalSpend: '$14,200', lastTrek: 'Everest Base Camp',
    joined: 'Aug 2023', type: 'returning',
    history: [
      { trek: 'Everest Base Camp', date: 'Oct 18, 2026', amount: '$4,800' },
      { trek: 'Annapurna Base Camp', date: 'May 22, 2025', amount: '$3,400' },
      { trek: 'Langtang Valley', date: 'Sep 10, 2024', amount: '$3,000' },
      { trek: 'Poon Hill Trek', date: 'Dec 01, 2023', amount: '$3,000' },
    ]
  },
];

export default dummyCustomers;