module.exports = {
  up: async (queryInterface) => {
    const cards = [{
      name: 'Phua Chu Kang',
      description: 'An eccentric general contractor with trademark yellow boots, curly afro hair and large facial mole. He boasts he is the "Best in Singapore, JB and some say Batam". His favourite catchphrase is "Don\'t play play" (pronounced as "pray pray" according to his articulation).',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Joakim Gomez',
      description: 'A Singaporean radio producer, presenter and host. He hosts \'The Shock Circuit\' on 987FM with Sonia Chew (as of September 2019).',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'The Muttons',
      description: 'A Singaporean duo comprising of radio presenters Justin Ang and Vernon Anthonisz.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Lee Kuan Yew',
      description: 'First Prime Minister of Singapore. Widely recognised as the founder of modern Singapore, this person oversaw its transformation into a developed country with a high-income economy within a single generation.',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'The cardboard policeman',
      description: 'A standee with the words "Shop theft is a crime", placed at entrances of shops as part of islandwide anti-crime efforts.',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Joseph Schooling',
      description: 'Singaporean competitive swimmer. This person was the gold medalist in the 100m butterfly at the 2016 Olympics, achieving Singapore\'s first ever Olympic gold medal.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
    ];

    await queryInterface.bulkInsert('cards', cards);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('cards', null, {});
  },
};
