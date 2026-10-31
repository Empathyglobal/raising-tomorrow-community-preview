// src/components/game/culturalNamePicker.js
const NAME_POOLS = {
  AMERICAN_US: {
    male: ["Liam", "Noah", "James", "Henry", "Benjamin", "Lucas", "Ethan", "Mason", "Logan", "Alexander", "Michael", "Daniel", "Matthew", "Jackson", "David", "Joseph", "Carter", "Owen", "Luke", "Gabriel", "Anthony", "Dylan", "Isaac", "Samuel", "John", "Nathan", "Christopher", "Joshua", "Andrew", "Ryan", "Zachary", "Tyler", "Kevin", "Brandon", "Eric", "Aaron", "Thomas", "Connor", "Cameron", "Hunter", "Adam", "Robert", "Wyatt", "Nicholas", "Charles", "Isaiah", "Caleb", "Julian", "Eli", "Austin", "Sebastian"],
    female: ["Olivia", "Emma", "Ava", "Sophia", "Mia", "Amelia", "Isabella", "Charlotte", "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth", "Sofia", "Avery", "Ella", "Scarlett", "Grace", "Chloe", "Victoria", "Riley", "Aria", "Lily", "Aubrey", "Zoey", "Penelope", "Lillian", "Addison", "Layla", "Natalie", "Camila", "Hannah", "Brooklyn", "Zoe", "Nora", "Leah", "Savannah", "Audrey", "Claire", "Eleanor", "Skylar", "Ellie", "Samantha", "Stella", "Paisley", "Violet", "Mila", "Allison", "Hazel", "Lucy"],
  },
  BRITISH_IRISH: {
    male: ["Oliver", "George", "Arthur", "Harry", "Jack", "Oscar", "Noah", "Charlie", "Leo", "Alfie", "Freddie", "Thomas", "William", "Henry", "James", "Archie", "Joshua", "Edward", "Isaac", "Theo", "Alexander", "Jacob", "Sebastian", "Lucas", "Max", "Benjamin", "Dylan", "Finn", "Muhammad", "Adam", "Ethan", "Logan", "Joseph", "Samuel", "Daniel", "Lewis", "Elijah", "Reuben", "Jude", "Harrison", "Elliot", "Toby", "Luca", "Caleb", "Nathan", "Matthew", "Liam", "Mason", "Riley", "Jonah"],
    female: ["Olivia", "Amelia", "Isla", "Ava", "Mia", "Ivy", "Lily", "Isabella", "Rosie", "Sophia", "Grace", "Freya", "Charlotte", "Ella", "Poppy", "Evie", "Sophie", "Phoebe", "Emily", "Daisy", "Florence", "Isabelle", "Evelyn", "Elsie", "Lucy", "Willow", "Ruby", "Sienna", "Layla", "Matilda", "Maya", "Millie", "Emilia", "Eva", "Harriet", "Penelope", "Zara", "Eliza", "Thea", "Maisie", "Alice", "Lola", "Violet", "Esme", "Clara", "Imogen", "Luna", "Aurora", "Bonnie", "Hannah"],
  },
  FRENCH: {
    male: ["Léo", "Gabriel", "Raphaël", "Arthur", "Louis", "Hugo", "Jules", "Adam", "Lucas", "Maël", "Noah", "Nathan", "Tom", "Ethan", "Sacha", "Maxime", "Pierre", "Antoine", "Alexandre", "Victor", "Paul", "Théo", "Simon", "Mathis", "Clément", "Baptiste", "Enzo", "Romain", "Julien", "Benjamin", "Nicolas", "Valentin", "Yanis", "Axel", "Thomas", "Matthieu", "Quentin", "Adrien", "Baptiste", "Mathéo", "Nolan", "Timéo", "Robin", "Samuel", "Eliott", "Noé", "Léon", "Eden", "Aaron", "Gabin"],
    female: ["Jade", "Louise", "Emma", "Alice", "Rose", "Anna", "Chloé", "Léa", "Manon", "Camille", "Sarah", "Inès", "Juliette", "Zoé", "Lola", "Lina", "Nina", "Clara", "Léna", "Eva", "Lucie", "Charlotte", "Margaux", "Romane", "Anaïs", "Laura", "Mathilde", "Marie", "Julie", "Pauline", "Sofia", "Mila", "Océane", "Lisa", "Justine", "Ambre", "Elise", "Alicia", "Maëlys", "Victoria", "Eléonore", "Iris", "Lou", "Elsa", "Agathe", "Capucine", "Apolline", "Victoire", "Adèle", "Margot"],
  },
  GERMAN: {
    male: ["Noah", "Elias", "Leon", "Paul", "Finn", "Jonas", "Ben", "Felix", "Lukas", "Henry", "Emil", "Oskar", "Maximilian", "Theo", "Luca", "Anton", "Moritz", "Louis", "Max", "Julian", "David", "Jakob", "Alexander", "Philipp", "Tim", "Jonathan", "Lennard", "Niklas", "Samuel", "Fabian", "Simon", "Matthias", "Tom", "Leonard", "Jannik", "Luis", "Jan", "Leo", "Constantin", "Johann", "Erik", "Vincent", "Adrian", "Johannes", "Raphael", "Gabriel", "Tobias", "Valentin", "Florian", "Milo"],
    female: ["Mia", "Emilia", "Hannah", "Emma", "Lina", "Lea", "Sophia", "Anna", "Marie", "Lena", "Leonie", "Emily", "Mila", "Charlotte", "Johanna", "Laura", "Luisa", "Clara", "Lisa", "Maja", "Sarah", "Amelie", "Klara", "Nina", "Paula", "Frieda", "Greta", "Mathilda", "Nele", "Ella", "Julia", "Lara", "Ida", "Sophie", "Katharina", "Helena", "Lia", "Marlene", "Elisabeth", "Theresa", "Isabella", "Antonia", "Carla", "Romy", "Victoria", "Nora", "Zoe", "Emilie", "Rosa", "Josephine"],
  },
  MEXICAN: {
    male: ["Santiago", "Mateo", "Diego", "Daniel", "Miguel", "Emiliano", "Sebastián", "Leonardo", "Alejandro", "Matías", "Ángel", "José", "David", "Carlos", "Luis", "Andrés", "Fernando", "Juan", "Gabriel", "Rafael", "Antonio", "Ricardo", "Eduardo", "Javier", "Jorge", "Francisco", "Roberto", "Manuel", "Pedro", "Alberto", "Raúl", "Sergio", "Hugo", "Pablo", "Óscar", "Adrián", "Rodrigo", "Arturo", "César", "Enrique", "Héctor", "Iván", "Julio", "Ramón", "Samuel", "Vicente", "Xavier", "Enzo", "Gael", "Joaquín"],
    female: ["Sofía", "Valentina", "Regina", "Camila", "Valeria", "Renata", "Isabella", "María", "Luciana", "Victoria", "Mariana", "Daniela", "Jimena", "Ximena", "Gabriela", "Fernanda", "Natalia", "Andrea", "Paula", "Carolina", "Melissa", "Adriana", "Ana", "Laura", "Elena", "Catalina", "Beatriz", "Carmen", "Diana", "Alejandra", "Raquel", "Sara", "Teresa", "Verónica", "Patricia", "Rosa", "Silvia", "Rocío", "Mónica", "Emilia", "Esmeralda", "Guadalupe", "Paloma", "Pilar", "Dulce", "Lupita", "Frida", "Abril", "Luna", "Jade"],
  },
  BRAZILIAN: {
    male: ["Miguel", "Arthur", "Gabriel", "Bernardo", "Samuel", "Theo", "Pedro", "Davi", "Heitor", "Lorenzo", "Matheus", "Lucas", "Rafael", "Enzo", "João", "Gustavo", "Henrique", "Felipe", "Bruno", "Daniel", "Leonardo", "Eduardo", "Vinicius", "Thiago", "Rodrigo", "Guilherme", "Diego", "Caio", "Renato", "André", "Fernando", "Marcelo", "Paulo", "Ricardo", "Carlos", "Antônio", "José", "Francisco", "Luiz", "Roberto", "Sérgio", "Jorge", "Márcio", "Júlio", "César", "Hugo", "Otávio", "Benjamin", "Nicolas", "Isaac"],
    female: ["Helena", "Alice", "Laura", "Sophia", "Isabella", "Cecília", "Valentina", "Maria", "Manuela", "Heloísa", "Beatriz", "Julia", "Luiza", "Mariana", "Giovanna", "Ana", "Lívia", "Melissa", "Gabriela", "Juliana", "Bianca", "Larissa", "Camila", "Natália", "Rafaela", "Carolina", "Amanda", "Patrícia", "Fernanda", "Isabela", "Letícia", "Vitória", "Lorena", "Eduarda", "Marina", "Paula", "Aline", "Bruna", "Débora", "Flávia", "Renata", "Tatiana", "Vanessa", "Elisa", "Bárbara", "Clara", "Luna", "Antonella", "Rebeca", "Sara"],
  },
  INDIAN: {
    male: ["Aarav", "Arjun", "Ishaan", "Vihaan", "Aditya", "Reyansh", "Vivaan", "Ayaan", "Krishna", "Arnav", "Ansh", "Shaurya", "Atharv", "Aryan", "Kabir", "Dhruv", "Aadhya", "Shivansh", "Dev", "Rudra", "Pranav", "Aarush", "Kian", "Rohan", "Ved", "Yash", "Armaan", "Sai", "Advait", "Anirudh", "Rajat", "Samar", "Tanish", "Veer", "Rishabh", "Kunal", "Manav", "Nikhil", "Aakash", "Laksh", "Parth", "Siddharth", "Varun", "Virat", "Akshay", "Harsh", "Karan", "Mohit", "Ronak", "Sahil"],
    female: ["Aanya", "Diya", "Saanvi", "Ananya", "Kiara", "Myra", "Aadhya", "Pari", "Anvi", "Anika", "Navya", "Angel", "Avni", "Sara", "Ira", "Riya", "Aditi", "Ishita", "Kavya", "Mishka", "Prisha", "Siya", "Tara", "Vanya", "Aisha", "Arya", "Aarushi", "Gauri", "Meera", "Nisha", "Priya", "Radhika", "Shreya", "Tanvi", "Tanya", "Anjali", "Divya", "Jiya", "Khushi", "Mahika", "Naina", "Pooja", "Roshni", "Simran", "Sneha", "Trisha", "Vedika", "Zara", "Disha", "Ishani"],
  },
  CHINESE: {
    male: ["Wei", "Jun", "Ming", "Hao", "Lei", "Tao", "Feng", "Chen", "Yang", "Li", "Kai", "Jian", "Rui", "Cheng", "Xin", "Yong", "Bo", "Han", "Peng", "Lin", "Xiang", "Yun", "Qiang", "Jiang", "Guo", "Hong", "Shen", "Long", "Hui", "Dong", "Hua", "Jin", "Kun", "Liang", "Ming", "Qing", "Shu", "Tian", "Wen", "Xi", "Yu", "Zhi", "An", "Bao", "Chang", "De", "Fang", "Gang", "Jie", "Kang"],
    female: ["Mei", "Ling", "Xiu", "Yan", "Jia", "Lian", "Hui", "Fang", "Yun", "Qing", "Na", "Li", "Ying", "Xue", "Rong", "Yu", "Jing", "Wen", "Lan", "Xia", "Ping", "Hong", "Min", "Juan", "Shu", "Hua", "Yue", "Xin", "Lei", "Jie", "Ning", "Qian", "Feng", "Ru", "Mei", "Zhen", "Yi", "Ai", "Bi", "Chen", "Dan", "Fei", "Gui", "He", "Jin", "Kun", "Lu", "Meng", "Qin", "Shan"],
  },
  JAPANESE: {
    male: ["Haruto", "Riku", "Sora", "Ren", "Yuto", "Minato", "Yuuto", "Kaito", "Hayato", "Souta", "Hinata", "Yuuma", "Ryouta", "Kouki", "Takumi", "Shouta", "Haruki", "Daiki", "Ryuu", "Itsuki", "Asahi", "Yuuki", "Hiroto", "Aoi", "Tsubasa", "Raito", "Kazuki", "Akira", "Yamato", "Kenta", "Ryuusei", "Shou", "Taiga", "Yuu", "Hibiki", "Kouta", "Touma", "Shun", "Reo", "Jin", "Kouhei", "Satoshi", "Takeshi", "Daichi", "Naoki", "Makoto", "Ryousuke", "Kei", "Tatsuya", "Shinji"],
    female: ["Hina", "Yui", "Mei", "Sakura", "Mio", "Riko", "Aoi", "Akari", "Yuna", "Himari", "Koharu", "Ichika", "Hana", "Rin", "Yuzuki", "Saki", "Nanami", "Honoka", "Kanna", "Misaki", "Sara", "Ayaka", "Yume", "Kaede", "Nozomi", "Haruka", "Mana", "Risa", "Shiori", "Miyu", "Kaho", "Hinata", "Yuri", "Ema", "Asuka", "Nana", "Chihiro", "Miho", "Airi", "Sayaka", "Rina", "Kotone", "Miki", "Aya", "Natsuki", "Reina", "Yui", "Yukari", "Ami", "Kiyomi"],
  },
  KOREAN: {
    male: ["Minjun", "Jiho", "Seojun", "Hyunwoo", "Junseo", "Taehyun", "Siwoo", "Yejun", "Minjae", "Junwoo", "Juwon", "Seungjun", "Hyunjun", "Jihoon", "Dohyun", "Sunwoo", "Minseok", "Yoonwoo", "Seonwoo", "Hajun", "Jaewon", "Jaemin", "Kyungmin", "Sanghyun", "Dongwoo", "Woojin", "Youngjae", "Jinwoo", "Sunghoon", "Hyunseok", "Taewoo", "Seungwoo", "Minho", "Chanwoo", "Jungwoo", "Kihyun", "Jihwan", "Yonghoon", "Donghyun", "Seunghyun", "Jiwon", "Hojin", "Daehyun", "Younghoon", "Jaehyun", "Sangwoo", "Mingyu", "Wonwoo", "Seokjin", "Taehyung"],
    female: ["Seo-yeon", "Jiwoo", "Haeun", "Minseo", "Suhyun", "Yuna", "Seoyun", "Chaewon", "Yewon", "Jiyeon", "Chaeyoung", "Nayeon", "Jisoo", "Somin", "Yujin", "Seohyun", "Dahyun", "Eunji", "Hyejin", "Mina", "Soyeon", "Yoojung", "Yeri", "Jimin", "Jieun", "Hyun", "Seulgi", "Jennie", "Sooyoung", "Taeyeon", "Jessica", "Yoona", "Soojin", "Yubin", "Siyeon", "Dami", "Yoohyeon", "Minji", "Hanni", "Danielle", "Haerin", "Hyein", "Chaerin", "Bora", "Jooyeon", "Saerom", "Nagyung", "Jiwon", "Hayoung", "Jiheon"],
  },
  ARAB: {
    male: ["Omar", "Ali", "Hassan", "Yusuf", "Khalid", "Zayd", "Ahmed", "Mohammed", "Abdullah", "Ibrahim", "Hamza", "Adam", "Tariq", "Bilal", "Karim", "Faisal", "Rashid", "Nasser", "Jamal", "Samir", "Rami", "Mansour", "Fahad", "Majid", "Waleed", "Salim", "Basim", "Adil", "Nadir", "Hakim", "Zaid", "Ammar", "Imran", "Ishaq", "Kareem", "Mahmoud", "Mustafa", "Qasim", "Saleh", "Sami", "Tarek", "Usama", "Yasir", "Zain", "Amir", "Fares", "Malik", "Nasir", "Rayan", "Sufyan"],
    female: ["Amina", "Layla", "Noor", "Sara", "Mariam", "Fatima", "Zahra", "Aisha", "Zainab", "Yasmin", "Lina", "Hana", "Rana", "Noura", "Reem", "Salma", "Dina", "Jana", "Farah", "Leila", "Mona", "Nadia", "Rania", "Samira", "Hala", "Iman", "Jamila", "Karima", "Latifa", "Malak", "Nabila", "Rahma", "Safiya", "Suha", "Tahira", "Wafaa", "Zaynab", "Amani", "Basma", "Dalal", "Fadia", "Ghada", "Huda", "Inaya", "Jawaher", "Lamya", "Maysa", "Nawal", "Rasha", "Sumaya"],
  },
  NIGERIAN_WEST_AFRICAN: {
    male: ["Chinedu", "Emeka", "Tunde", "Ayo", "Kelechi", "Ibrahim", "Chibuike", "Ikenna", "Obinna", "Adebayo", "Oluwaseun", "Chukwuemeka", "Babajide", "Olumide", "Femi", "Segun", "Taiwo", "Kehinde", "Damilola", "Ayodeji", "Bolaji", "Chidi", "Ebenezer", "Fela", "Gbenga", "Ifeanyi", "Jide", "Kunle", "Lanre", "Musa", "Nnamdi", "Olusegun", "Rotimi", "Sola", "Tobi", "Uche", "Victor", "Wale", "Yemi", "Zubair", "Adamu", "Bashir", "Chike", "Emeka", "Fidelis", "Godfrey", "Habib", "Ismail", "Joseph", "Kingsley"],
    female: ["Ada", "Amaka", "Zainab", "Tola", "Kemi", "Chioma", "Ngozi", "Ifeoma", "Adaobi", "Bukola", "Funmilayo", "Omolara", "Yetunde", "Titilayo", "Shade", "Adeola", "Busola", "Chinenye", "Ebere", "Folake", "Gloria", "Hauwa", "Ijeoma", "Jumoke", "Kehinde", "Lola", "Modupe", "Nneka", "Oluchi", "Precious", "Queen", "Ronke", "Sade", "Taiwo", "Uchechi", "Victoria", "Wuraola", "Yewande", "Zara", "Abigail", "Blessing", "Chinasa", "Damilola", "Esther", "Faith", "Grace", "Hope", "Ife", "Joy", "Khadijah"],
  },
  INDONESIAN: {
    male: ["Muhammad", "Rizky", "Budi", "Adi", "Putra", "Eko", "Agus", "Ahmad", "Andika", "Arif", "Bayu", "Deni", "Dimas", "Fajar", "Hadi", "Ilham", "Irfan", "Joko", "Kurniawan", "Lukman", "Muhamad", "Nur", "Reza", "Slamet", "Wahyu", "Yanto", "Yoga", "Bagus", "Chandra", "Fikri", "Gilang", "Hendra", "Indra", "Jefri", "Krisna", "Lukas", "Maulana", "Nanda", "Rangga", "Satria", "Teguh", "Vino", "Widi", "Yuda", "Zaky", "Arya", "Bambang", "Cahya", "Doni", "Eko"],
    female: ["Siti", "Nur", "Sri", "Dewi", "Putri", "Ayu", "Ani", "Ari", "Bunga", "Diah", "Eka", "Fitri", "Hana", "Indah", "Kartika", "Lestari", "Maya", "Ningrum", "Puspita", "Ratna", "Sari", "Tri", "Wati", "Yuni", "Zahra", "Amelia", "Bella", "Citra", "Devi", "Elsa", "Farah", "Gita", "Hesti", "Ika", "Jennie", "Kirana", "Linda", "Mira", "Nadia", "Olivia", "Permata", "Rani", "Shinta", "Tiara", "Umi", "Vina", "Wulan", "Yessi", "Zahra", "Azzahra"],
  },
  CARIBBEAN: {
    male: ["Jean", "Pierre", "Emmanuel", "Gabriel", "Junior", "Stanley", "Marc", "Louis", "André", "Jacques", "Claude", "Henri", "Paul", "François", "Michel", "Antoine", "Philippe", "Yves", "René", "Georges", "Joseph", "Robert", "David", "Daniel", "Thomas", "Charles", "Richard", "Christopher", "James", "John", "Mark", "Luke", "Matthew", "Peter", "Patrick", "Kevin", "Brian", "Steven", "Timothy", "Gregory", "Kenneth", "Raymond", "Eric", "Samuel", "Vincent", "Gerald", "Harold", "Ronald", "Dennis", "Jerry"],
    female: ["Marie", "Sarah", "Esther", "Vanessa", "Nadia", "Roselaure", "Anne", "Josette", "Claudette", "Sylvie", "Monique", "Denise", "Nicole", "Michelle", "Christine", "Françoise", "Catherine", "Isabelle", "Sophie", "Julie", "Caroline", "Véronique", "Stéphanie", "Sandrine", "Céline", "Patricia", "Barbara", "Susan", "Margaret", "Karen", "Linda", "Donna", "Carol", "Sharon", "Nancy", "Janet", "Deborah", "Jennifer", "Lisa", "Sandra", "Kimberly", "Melissa", "Angela", "Michelle", "Stephanie", "Rebecca", "Laura", "Amy", "Rachel", "Jessica"],
  },
  SOUTH_AFRICAN: {
    male: ["Thabo", "Siyabonga", "Melusi", "Bongani", "Sibusiso", "Bandile", "Themba", "Sipho", "Mandla", "Nkululeko", "Sandile", "Dumisani", "Lucky", "Gift", "Blessing", "Justice", "Emmanuel", "Prince", "Michael", "David", "John", "Peter", "James", "Joseph", "Simon", "Daniel", "Samuel", "Joshua", "Andrew", "Benjamin", "Elijah", "Isaac", "Jacob", "Matthew", "Christopher", "Thomas", "Richard", "Robert", "William", "Charles", "George", "Edward", "Henry", "Patrick", "Raymond", "Vincent", "Kenneth", "Gerald", "Harold", "Ronald"],
    female: ["Mbali", "Nosipho", "Nonhlanhla", "Thandi", "Zanele", "Precious", "Nombuso", "Nokuthula", "Siphokazi", "Lindiwe", "Ntombi", "Busisiwe", "Nokwanda", "Sindisiwe", "Thandeka", "Zandile", "Ayanda", "Bongiwe", "Duduzile", "Fikile", "Gugu", "Hlengiwe", "Innocent", "Jabu", "Khanyisile", "Lungile", "Mandisa", "Nelisiwe", "Phindile", "Rejoice", "Sibongile", "Thabisile", "Vuyiswa", "Zodwa", "Faith", "Grace", "Hope", "Joy", "Peace", "Patience", "Prudence", "Charity", "Mercy", "Blessing", "Gift", "Queen", "Princess", "Angel", "Beauty", "Happiness"],
  },
  AUS_NZ: {
    male: ["Oliver", "Noah", "Jack", "William", "Leo", "Henry", "Charlie", "Lucas", "Liam", "Thomas", "James", "Harrison", "Cooper", "Oscar", "Alexander", "Hudson", "Archie", "Mason", "Ethan", "Max", "Benjamin", "Sebastian", "Samuel", "Isaac", "Jacob", "Joshua", "Ryan", "Lachlan", "Hunter", "Xavier", "Zachary", "Tyler", "Angus", "Finn", "George", "Harry", "Edward", "Arthur", "Elliot", "Theo", "Hugo", "Felix", "Louis", "Jasper", "Ryder", "Archer", "Lincoln", "Austin", "Blake", "Caleb"],
    female: ["Charlotte", "Olivia", "Isla", "Amelia", "Mia", "Matilda", "Ava", "Chloe", "Ella", "Grace", "Sophie", "Emily", "Ruby", "Harper", "Zoe", "Lily", "Lucy", "Ivy", "Isabella", "Sienna", "Poppy", "Isabelle", "Hannah", "Mila", "Willow", "Aria", "Scarlett", "Emma", "Layla", "Evelyn", "Georgia", "Hazel", "Aurora", "Bonnie", "Sadie", "Ellie", "Piper", "Freya", "Mackenzie", "Madison", "Evie", "Abigail", "Alice", "Maya", "Phoebe", "Violet", "Luna", "Sophia", "Stella", "Penelope"],
  },
  OTHER_CUSTOM: {
    male: ["Jakob", "Emil", "Filip", "Henrik", "Oskar", "Noah", "Lukas", "Oliver", "Anton", "Alexander", "Viktor", "Elias", "William", "Lucas", "Liam", "Isak", "Axel", "Hugo", "Theo", "Adam", "Leo", "Albin", "Gustav", "Olle", "Vincent", "Nils", "Elliot", "Benjamin", "Sebastian", "Simon", "Felix", "Jonathan", "Rasmus", "Marcus", "Ludvig", "Arvid", "Edvin", "Leon", "Alfred", "Max", "Carl", "Erik", "Samuel", "Daniel", "Gabriel", "Viggo", "Malte", "August", "Melvin", "Adrian"],
    female: ["Nora", "Sofie", "Ella", "Ingrid", "Emilie", "Maja", "Alma", "Astrid", "Linnea", "Ebba", "Elsa", "Wilma", "Alice", "Olivia", "Alva", "Julia", "Saga", "Agnes", "Freja", "Clara", "Ellie", "Stella", "Vera", "Molly", "Sigrid", "Signe", "Selma", "Ester", "Iris", "Ellen", "Liv", "Tuva", "Sara", "Matilda", "Amanda", "Emma", "Elin", "Hanna", "Frida", "Ida", "Isabelle", "Klara", "Linnéa", "Moa", "Nova", "Thea", "Tyra", "Ulla", "Vilda", "Ylva"],
  },
};

function hash32(str) {
  let h = 2166136261;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Normalize gender labels (prevents "woman/girl" from breaking male/female pool selection)
function normalizeGenderKey(g) {
  const key = String(g || "").trim().toLowerCase();
  if (["female", "woman", "girl", "f"].includes(key)) return "female";
  if (["male", "man", "boy", "m"].includes(key)) return "male";
  return "neutral";
}

export function pickGenderEmoji(gender) {
  const norm = normalizeGenderKey(gender);
  if (norm === "female") return "👩";
  if (norm === "male") return "👨";
  return "🧑";
}

export function pickCulturalFirstName({ cultures = [], gender = "neutral", seed = "", avoidNames = [] }) {
  const ids = Array.isArray(cultures) ? cultures.filter(Boolean) : [];
  const culturesUsed = ids.length > 0 ? ids : ["AMERICAN_US"];
  
  // Normalize gender to prevent mismatched pool access
  const genderNorm = normalizeGenderKey(gender);
  
  // Build combined name pool from ALL cultures provided (deduplicated)
  const combinedNames = new Set();
  for (const cultureId of culturesUsed) {
    const pool = NAME_POOLS[cultureId] || NAME_POOLS.AMERICAN_US;
    const list = genderNorm === "female" ? pool.female : genderNorm === "male" ? pool.male : [...pool.female, ...pool.male];
    if (Array.isArray(list)) list.forEach(n => combinedNames.add(n));
  }
  
  const nameList = Array.from(combinedNames);
  if (!nameList.length) return "Alex";
  
  // Normalize avoidNames for case-insensitive comparison
  const avoidSet = new Set((Array.isArray(avoidNames) ? avoidNames : []).map(n => String(n).trim().toLowerCase()));
  
  // Try up to 20 deterministic attempts with seed variations
  for (let attempt = 0; attempt < 20; attempt++) {
    const trySeed = attempt === 0 ? seed : `${seed}|try:${attempt}`;
    const idx = hash32(trySeed) % nameList.length;
    const candidate = nameList[idx];
    
    // Check if candidate is in avoid list (case-insensitive)
    if (!avoidSet.has(String(candidate).trim().toLowerCase())) {
      return candidate;
    }
  }
  
  // Exhausted attempts: return first non-avoided name; if all avoided, allow duplicate
  const firstNonAvoided = nameList.find(n => !avoidSet.has(String(n).trim().toLowerCase()));
  return firstNonAvoided || nameList[0] || "Alex";
}

// Export list of available culture IDs for Start.jsx to use
export const CULTURE_IDS = Object.keys(NAME_POOLS);