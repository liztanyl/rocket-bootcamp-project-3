module.exports = {
  up: async (queryInterface) => {
    const cards = [{
      name: 'Phua Chu Kang',
      description: 'An eccentric general contractor with trademark yellow boots, curly afro hair and large facial mole. "Best in Singapore, JB and some say Batam".',
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
      description: 'First Prime Minister of Singapore. Widely recognised as the founder of modern Singapore who oversaw its transformation into a developed country.',
      points: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'The cardboard policeman',
      description: 'A standee of a handsome man with the words "Shop theft is a crime", placed at entrances of shops as part of islandwide anti-crime efforts.',
      points: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Joseph Schooling',
      description: 'Singaporean competitive swimmer and gold medalist in the 100m butterfly at the 2016 Olympics. Achieved Singapore\'s first ever Olympic gold medal.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Fandi Ahmad',
      description: 'This national legend is regarded as one of Singapore\'s most successful footballers. He was noted for his humility, talent and love for the game.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Loh Kean Yew',
      description: 'Penang-born Singaporean badminton player, and Singapore\'s first ever badminton world champion',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Yip Pin Xu',
      description: 'National backstroke swimmer and five-time Paralympic gold medallist. She is Singapore\'s most decorated Paralympian.',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Adam Khoo',
      description: 'Singaporean entrepreneur and financial educator who leads learning camps and workshops to coach people on trading and investing skills.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Forrest Li',
      description: 'Chinese Singaporean billionaire businessman and founder of Garena and Shopee. He is one of the richest people in Singapore.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Liang Po Po',
      description: 'Lovable and feisty granny played by Jack Neo',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'iceiceice',
      description: 'Singaporean professional Dota 2 player whose real name is Daryl Koh Pei Xiang',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Cai Fan Aunty',
      description: 'Works at the mixed rice stall in coffeeshops. Her favourite nicknames for customers are \'shuai ge\' (handsome man) and \'mei nu\' (pretty lady).',
      points: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Form Teacher',
      description: 'The staff responsible for a particular class in school, monitoring students\' progress academically and socially, and helping them with any problems.',
      points: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'School Prefect',
      description: 'Students with good leadership qualities who are given additional responsibilities in school',
      points: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Food Delivery Rider',
      description: 'A type of gig worker who brings food and groceries to your doorstep. One accidentally joined the end of the NDP mobile column in Woodlands in 2020.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Tiger Mom',
      description: 'A very strict parent who pushes her children to attain high levels of academic achievement or success in extracurricular activities such as music or sports',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Safe Distancing Ambassador',
      description: 'Can be seen walking around malls and hawker centres during the pandemic to remind the public to adhere to COVID-19 measures, such as mask-wearing',
      points: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Safe Entry Officer',
      description: 'Sits at entrances of malls and places where people need to check-in and check-out, and performs checks on vaccination status',
      points: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Taufik Batisah',
      description: 'Singaporean singer, songwriter and music producer. Winner of the first season of \'Singapore Idol\'.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Benjamin Kheng',
      description: 'Singaporean musician, actor, writer, and former national swimmer. He made his music debut with the Singaporean band The Sam Willows.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Nathan Hartono',
      description: 'Indonesian Singaporean singer-songwriter and actor. He sang the NDP 2020 song \'Everything I Am\'. He finished as 1st runner-up in Season 1 of \'Sing! China\'.',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Jade Rasif',
      description: 'Singaporean DJ, YouTube personality and former actress. She is known for playing Sheila Oh on Tanglin, and is one of the highest paid DJs in Singapore.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Charles Yeo',
      description: 'Chairman of the Reform Party. He became an internet meme after attempting to deliver his party\'s broadcast in Mandarin in the 2020 General Election.',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Pritam Singh',
      description: 'Politician, lawyer and author who has been serving as Leader of the Opposition since 2020 and secretary-general of the Workers\' Party since 2018.',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Mas Selamat',
      description: 'Singapore\'s most wanted fugitive for over a year. Escaped a detention centre by climbing through a toilet ventilation shaft and later swam to Johor.',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Buangkok Samurai',
      description: 'After having swallowed unknown pills, this person wielded a sword and attacked passing vehicles and people in Buangkok.',
      points: 3,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Amos Yee',
      description: 'Singaporean-born sex offender, blogger and former YouTuber and child actor. Convicted in the US for child pornography and grooming charges.',
      points: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Sun Ho',
      description: 'Singaporean Christian pastor and co-founder of City Harvest Church. She was also a former Mandopop singer.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Hush-Hush Hannah',
      description: 'Cartoon commuter to encourage passengers to make public transport more pleasant. She keeps her volume down so others enjoy a quieter ride.',
      points: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Sneaky Sushii',
      description: 'Singaporean YouTuber and content creator known for his satirical videos and uncensored criticism of the local YouTube scene.',
      points: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'Sir Stamford Raffles',
      description: 'British statesman known for founding modern Singapore. There is a statue of him at North Bank, where he is believed to have landed in 1819.',
      points: 1,
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
