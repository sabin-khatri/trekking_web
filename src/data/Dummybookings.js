const dummyBookings = [
  { 
    id: 'BKG-1029', name: 'John Doe', trek: 'Everest Base Camp', date: 'Oct 15, 2026', pax: 2, status: 'confirmed', amount: '$3,200',
    email: 'john.doe@email.com', phone: '+1 555 204 8891', duration: '14 Days', difficulty: 'Strenuous',
    startPoint: 'Lukla', paymentMethod: 'Credit Card', paid: '$3,200', due: '$0',
    notes: 'Requested vegetarian meals throughout the trek.'
  },
  { 
    id: 'BKG-1030', name: 'Sarah Smith', trek: 'Annapurna Circuit', date: 'Nov 02, 2026', pax: 1, status: 'pending', amount: '$1,400',
    email: 'sarah.smith@email.com', phone: '+44 7700 900123', duration: '12 Days', difficulty: 'Moderate',
    startPoint: 'Besisahar', paymentMethod: 'Bank Transfer', paid: '$500', due: '$900',
    notes: 'Awaiting deposit confirmation from bank.'
  },
  { 
    id: 'BKG-1031', name: 'Michael Chen', trek: 'Langtang Valley', date: 'Oct 20, 2026', pax: 4, status: 'confirmed', amount: '$3,600',
    email: 'michael.chen@email.com', phone: '+1 415 233 7765', duration: '9 Days', difficulty: 'Moderate',
    startPoint: 'Syabrubesi', paymentMethod: 'Credit Card', paid: '$3,600', due: '$0',
    notes: 'Group booking — traveling with family, needs 2 twin rooms.'
  },
  { 
    id: 'BKG-1032', name: 'Emma Wilson', trek: 'Mardi Himal Trek', date: 'Dec 05, 2026', pax: 2, status: 'cancelled', amount: '$1,600',
    email: 'emma.wilson@email.com', phone: '+61 412 555 908', duration: '6 Days', difficulty: 'Easy',
    startPoint: 'Kande', paymentMethod: 'PayPal', paid: '$0', due: '$0',
    notes: 'Cancelled due to flight rescheduling. Refund processed.'
  },
  { 
    id: 'BKG-1033', name: 'David Brown', trek: 'Everest Base Camp', date: 'Oct 18, 2026', pax: 3, status: 'pending', amount: '$4,800',
    email: 'david.brown@email.com', phone: '+1 646 555 3321', duration: '14 Days', difficulty: 'Strenuous',
    startPoint: 'Lukla', paymentMethod: 'Credit Card', paid: '$1,000', due: '$3,800',
    notes: 'Needs confirmation on acclimatization day itinerary.'
  },
];

export default dummyBookings;