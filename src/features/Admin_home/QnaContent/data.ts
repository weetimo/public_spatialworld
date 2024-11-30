export const mockData = {
  multipleChoice: [
    {
      question: 'What interests you most about the redevelopment?',
      responses: [
        { answer: 'Heritage', count: 13 },
        { answer: 'Sustainability', count: 26 },
        { answer: 'Urban Resilience', count: 19 },
        { answer: 'Technology', count: 30 },
        { answer: 'Greenery', count: 18 }
      ]
    },
    {
      question: 'Have you visited this SUTD green space or its surrounding areas before?',
      responses: [
        { answer: 'Yes!', count: 13 },
        { answer: "No, I don't have a chance.", count: 26 },
        { answer: "I'm not sure", count: 19 },
        { answer: 'Where is it?', count: 30 }
      ]
    },
    {
      question: 'How often would you use this space if it was redeveloped?',
      responses: [
        { answer: 'Daily', count: 35 },
        { answer: '2-3 times a week', count: 28 },
        { answer: 'Once a week', count: 15 },
        { answer: 'Occasionally', count: 22 },
        { answer: 'Rarely', count: 8 }
      ]
    }
  ],
  openEnded: [
    {
      question: 'What are some of the daily issues you face?',
      categories: [
        {
          topic: 'Environmental Concerns',
          responses: [
            'The sun is too hot, especially during afternoon hours',
            'It is not walkable after it rains because the grass gets too wet',
            'Not enough sheltered areas during rainy weather',
            'Poor ventilation in some areas makes it uncomfortable',
            'No shade protection during peak sun hours',
            'The space gets really humid in the afternoon',
            'Wind tunnel effect between buildings',
            'Standing water after heavy rain makes paths unusable',
            'Limited natural shade from trees',
            'Heat reflection from surrounding buildings'
          ]
        },
        {
          topic: 'Accessibility',
          responses: [
            'Too far from main campus buildings',
            'Need more parking lots near the area',
            'Limited wheelchair accessibility',
            'No clear pathways to navigate the space',
            'Difficult to access during peak hours',
            'Poor connectivity to public transport',
            'Lack of proper signage for navigation',
            'Uneven ground makes it hard to walk',
            'No dedicated drop-off points',
            'Limited access points to the space'
          ]
        },
        {
          topic: 'Amenities',
          responses: [
            'No food options available after 7pm',
            'Needs more diverse food choices',
            'Limited seating areas for eating',
            'Lack of water fountains',
            'No restroom facilities nearby',
            'Insufficient waste bins',
            'No recycling facilities',
            'Limited phone charging points',
            'No indoor dining options',
            'Absence of convenience stores'
          ]
        }
      ]
    },
    {
      question: 'What amenities would you like to see in the redeveloped space?',
      categories: [
        {
          topic: 'Study & Work',
          responses: [
            'Study areas with power outlets',
            'Better lighting for evening use',
            'Individual study pods for focused work',
            'Group discussion spaces with whiteboards',
            'Quiet zones for intensive study',
            'High-speed WiFi coverage throughout',
            'Standing desk options for variety',
            'Weather-protected study areas',
            'Bookable project rooms',
            'Print and scan facilities'
          ]
        },
        {
          topic: 'Infrastructure',
          responses: [
            'More covered walkways connecting buildings',
            'Bicycle parking facilities with security cameras',
            'Flexible event space for community activities',
            'Smart lockers for temporary storage',
            'Better lighting along pathways',
            'Dedicated lanes for bikes and pedestrians',
            'All-weather shelters at key points',
            'Digital information boards',
            'Sustainable energy features (solar panels)',
            'Improved drainage systems'
          ]
        },
        {
          topic: 'Facilities & Services',
          responses: [
            'Modern outdoor fitness equipment',
            'Water fountains with bottle filling stations',
            'Smart vending machines with healthy options',
            'First aid station',
            '24/7 security presence',
            'Mobile device charging stations',
            'Interactive digital maps',
            'Automated external defibrillator (AED)',
            'Bicycle sharing station',
            'Smart recycling bins with sorting'
          ]
        }
      ]
    }
  ]
};
