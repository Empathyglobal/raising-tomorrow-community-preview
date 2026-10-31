// Helper to parse changes that might be "A / B / C"
const parseMaterials = (optionStr) => {
  if (optionStr.includes('/')) {
    const parts = optionStr.split('/').map(s => s.trim());
    return {
      mat1: parts[0] || 'stuff',
      mat2: parts[1] || 'more stuff',
      mat3: parts[2] || 'weird stuff',
      all: optionStr
    };
  }
  return {
    mat1: optionStr,
    mat2: optionStr,
    mat3: optionStr,
    all: optionStr
  };
};

export function generateBedtimeStory({ storyKey, childName, childAge, changes, method }) {
  // changes is array of 3 strings corresponding to the 3 slots
  
  // Basic structure helpers
  const intro = "Once upon a bedtime…";
  
  let title = "A Story";
  let body = "";
  let closer = "";

  // Age-based complexity logic
  // 1-3: very short, simple, repetitive
  // 4-6: medium, playful
  // 7-9: longer, meta humor
  
  if (storyKey === 'three_pigs') {
    const villain = changes[0];
    const materials = parseMaterials(changes[1]);
    const twist = changes[2];
    
    title = `The Three Little Pigs and ${villain}`;
    
    if (childAge <= 3) {
      body = `One pig built a house of ${materials.mat1}. \nAnother pig built a house of ${materials.mat2}. \nThe third pig used ${materials.mat3}! \nThen came ${villain}. \n"Let me in!" said ${villain}. \nBut wait! ${twist}. \nYay! Everyone is happy.`;
    } else if (childAge <= 6) {
      body = `Three little pigs wanted to build houses. The first used ${materials.mat1}. "Sticky!" said the pig. The second used ${materials.mat2}. "Wobbly!" said the pig. The third used ${materials.mat3}. "Perfect!"\n\nSuddenly, ${villain} arrived! "I will huff and puff!" shouted ${villain}. But the pigs weren't scared.\n\nWhy? Because ${twist}. It was the best surprise ever.`;
    } else {
      body = `It was a busy day in the forest. Three pigs were construction consulting. The first pig chose ${materials.mat1} (bold choice). The second pig opted for ${materials.mat2} (classic). The third pig insisted on ${materials.mat3} because it was on sale.\n\nEnter the villain: ${villain}. Usually, this is the scary part. ${villain} tried to look intimidating, huffing and puffing.\n\nHowever, the plot twist arrived just in time: ${twist}. The pigs and ${villain} realized fighting is exhausting, so they stopped immediately.`;
    }
  } 
  
  else if (storyKey === 'goldilocks') {
    const protagonist = changes[0];
    const food = changes[1];
    const twist = changes[2];
    
    title = `${protagonist} and the Three Bears`;
    
    if (childAge <= 3) {
      body = `Once there was ${protagonist}. \n${protagonist} found a house. \nInside was ${food}! \nYum, yum, yum. \nThe bears came home! "Who is eating my ${food}?" \nSurprise! ${twist}. \nGoodnight bears!`;
    } else if (childAge <= 6) {
      body = `${protagonist} was walking in the woods and found a cottage. Knock knock! No answer. Inside, there were three bowls of ${food}.\n\n"Too hot!" said ${protagonist}. "Too cold!" But the tiny bowl of ${food} was just right. \n\nWhen the Three Bears came home, they were shocked. But then they realized: ${twist}. So everyone had a sleepover.`;
    } else {
      body = `${protagonist} was possibly trespassing, but we'll call it "exploring." They found a nice house that smelled like ${food}. Being very hungry, ${protagonist} tried all the bowls of ${food}.\n\nThe Three Bears returned from their walk. "Someone has been eating my ${food}!" said Papa Bear. It looked tense.\n\nBut luckily, it turned out that ${twist}. ${protagonist} and the bears agreed that naps are better than arguments.`;
    }
  }
  
  else if (storyKey === 'red_riding_hood') {
    const villain = changes[0];
    const basket = changes[1];
    const twist = changes[2];
    
    title = `Little Red and ${villain}`;
    
    if (childAge <= 3) {
      body = `Little Red went to Grandma's house. \nShe had ${basket} in her basket. \nShe met ${villain}. Hello! \n${villain} ran to the house. \nBut look! ${twist}. \nGrandma gave everyone a hug.`;
    } else if (childAge <= 6) {
      body = `Little Red Riding Hood skipped through the forest carrying ${basket}. "I hope Grandma likes these," she said. Suddenly, ${villain} jumped out!\n\n"Where are you going?" asked ${villain}. Red was brave. She went straight to Grandma's house.\n\nWhen she got there, something was different. Wait... ${twist}. It was a very silly day in the woods.`;
    } else {
      body = `Little Red was on a mission to deliver ${basket} to Grandma. It was a heavy basket. Along the way, she encountered ${villain}, who was trying to look suspicious but mostly looked ridiculous.\n\n${villain} tried the old "shortcut" trick. Red didn't fall for it. She arrived at the cottage ready for drama.\n\nInstead, she found a surprise: ${twist}. Everyone agreed this was much better than being eaten. They shared the ${basket} and took a nap.`;
    }
  }

  // Closers
  const closers = [
    "The end. Probably.",
    "Everyone went to sleep… except the glitter.",
    "And that’s why we don’t build houses out of spaghetti on a Tuesday.",
    "And then they all snored happily ever after.",
    "The end! (Unless you want to read it again.)",
    "Goodnight, sleep tight, don't let the plot holes bite."
  ];
  
  // Pick deterministic closer based on something or just random
  closer = closers[Math.floor(Math.random() * closers.length)];

  return {
    title,
    text: `${intro}\n\n${body}`,
    closer
  };
}