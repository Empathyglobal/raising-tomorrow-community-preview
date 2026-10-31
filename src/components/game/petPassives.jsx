// Yearly passive effects for pets (applied once per species, not per pet)
// Each species has baseline effects + optional mishap (funny popup with negative consequence)

export const PET_PASSIVES = {
  cat: {
    baseline: { stressDelta: -1 },
    mishap: {
      chance: 0.20,
      buildEvent: ({ petName, childName }) => ({
        title: "The Cat Chooses Violence",
        body: `At the local bookstore café, ${petName} decides your lap is a throne… and your thigh is a betrayal. You stand up with a new "modern art" scratch pattern. The barista offers you a napkin like this happens daily.`,
        choices: [{ text: "Apply a bandage & pretend you're fine", effects: { stress: 3 } }]
      })
    }
  },
  dog: {
    baseline: { stressDelta: -1, deltas: { discipline: 0.2, empathy: 0.2 } },
    mishap: {
      chance: 0.15,
      buildEvent: ({ petName, childName }) => ({
        title: "Hot Dog Stand Incident",
        body: `At the park's hot dog stand, ${petName} achieves Olympian-level sneak. One second you're paying, the next… your child is apologizing to a stranger while holding a bun like evidence.`,
        choices: [{ text: "Buy a replacement hot dog (for the human)", effects: { stress: 2, moneyDelta: -25 } }]
      })
    }
  },
  rabbit: {
    baseline: { stressDelta: -1, deltas: { empathy: 0.3 } },
    mishap: {
      chance: 0.12,
      buildEvent: ({ petName }) => ({
        title: "Farmers Market Lettuce Heist",
        body: `At the farmers market, ${petName} escapes and cannonballs into a pyramid of artisanal lettuce. A vendor whispers, "That rabbit has a plan." You do not.`,
        choices: [{ text: "Pay the lettuce apology tax", effects: { stress: 2, moneyDelta: -40 } }]
      })
    }
  },
  fish: {
    baseline: { stressDelta: -1, deltas: { discipline: 0.2 } },
    mishap: {
      chance: 0.18,
      buildEvent: ({ childName }) => ({
        title: "Aquarium Tsunami",
        body: `In your living room at 2:13am, the filter makes a noise it definitely shouldn't. Suddenly it's "Indoor Water Park: Deluxe Edition." ${childName} calmly asks if fish like towels.`,
        choices: [{ text: "Mop like your ancestors are watching", effects: { stress: 2, moneyDelta: -60 } }]
      })
    }
  },
  bird: {
    baseline: { deltas: { social: 0.2, confidence: 0.2 } },
    mishap: {
      chance: 0.10,
      buildEvent: ({ petName }) => ({
        title: "PTA Meeting, Featuring Your Bird",
        body: `At the school parking lot pickup line, ${petName} loudly repeats the exact phrase you muttered earlier: "We are thriving. Definitely thriving." Three parents nod like it's a support group.`,
        choices: [{ text: "Smile like you meant it", effects: { stress: 2 } }]
      })
    }
  },
  snake: {
    baseline: { deltas: { confidence: 0.3 } },
    mishap: {
      chance: 0.08,
      buildEvent: ({ petName }) => ({
        title: "Snake: Surprise Guest Star",
        body: `At your friend's backyard BBQ, someone opens the travel carrier wrong. ${petName} explores freedom for 7.4 seconds. That's long enough to invent seven new phobias.`,
        choices: [{ text: "Apologize to everyone's nervous system", effects: { stress: 4 } }]
      })
    }
  },
  turtle: {
    baseline: { stressDelta: -1, deltas: { discipline: 0.3 } },
    mishap: {
      chance: 0.10,
      buildEvent: ({ petName }) => ({
        title: "The Slowest Escape Attempt",
        body: `At the library, you look down and realize ${petName} has been "escaping" at a heroic speed of 0.0003 mph. A librarian whispers, "Respect the hustle."`,
        choices: [{ text: "Put the adventurer back", effects: { stress: 1 } }]
      })
    }
  },
  hamster: {
    baseline: { stressDelta: -1, deltas: { happiness: 0.2 } },
    mishap: {
      chance: 0.16,
      buildEvent: ({ petName }) => ({
        title: "Hamster in the Vents",
        body: `In your apartment hallway, you hear tiny footsteps above you. ${petName} has entered the ventilation system and is apparently auditioning for an action movie.`,
        choices: [{ text: "Become a part-time HVAC detective", effects: { stress: 2, moneyDelta: -80 } }]
      })
    }
  },
  goat: {
    baseline: { deltas: { responsibility: 0.2 } },
    mishap: {
      chance: 0.12,
      buildEvent: ({ petName }) => ({
        title: "Landscaping Is a Suggestion",
        body: `At your neighbor's front yard, ${petName} eats decorative plants like it's a tasting menu. The neighbor stares at you like they're drafting legal documents with their eyes.`,
        choices: [{ text: "Pay the 'my goat has opinions' fee", effects: { stress: 3, moneyDelta: -200 } }]
      })
    }
  },
  horse: {
    baseline: { stressDelta: -1, deltas: { confidence: 0.4, fitness: 0.2 } },
    mishap: {
      chance: 0.10,
      buildEvent: ({ petName }) => ({
        title: "Drive-Thru Horse Traffic Jam",
        body: `At the drive-thru, ${petName} decides the speaker box is suspicious. The line behind you becomes a live podcast called "Why Is There A Horse."`,
        choices: [{ text: "Tip the staff for emotional damages", effects: { stress: 2, moneyDelta: -30 } }]
      })
    }
  },
  lizard: {
    baseline: { deltas: { curiosity: 0.2 } },
    mishap: {
      chance: 0.14,
      buildEvent: ({ petName }) => ({
        title: "Heat Lamp Drama",
        body: `In your kitchen, you smell something that can only be described as "plastic regret." ${petName} is fine. The heat lamp… is doing interpretive dance.`,
        choices: [{ text: "Replace the lamp & your remaining peace", effects: { stress: 2, moneyDelta: -90 } }]
      })
    }
  },
  chickens: {
    baseline: { deltas: { responsibility: 0.2, discipline: 0.1 }, moneyDelta: 200 },
    mishap: {
      chance: 0.12,
      buildEvent: ({ childName }) => ({
        title: "Chicken Sunrise Protest",
        body: `At 5:02am, your backyard becomes a concert venue. A neighbor texts: "Are you running a rooster nightclub?" ${childName} says, "They're expressing themselves."`,
        choices: [{ text: "Pay the 'sorry about the dawn' peace offering", effects: { stress: 2, moneyDelta: -50 } }]
      })
    }
  },
  unicorn: {
    baseline: { stressDelta: -2, deltas: { happiness: 0.3, confidence: 0.3 } },
    mishap: {
      chance: 0.10,
      buildEvent: ({ petName }) => ({
        title: "Glitter Infestation: City Edition",
        body: `At the DMV, ${petName} shakes once. The air becomes glitter. A clerk slowly removes glitter from their eyelashes and says, "This is a new one."`,
        choices: [{ text: "Pay for emergency glitter removal", effects: { stress: 4, moneyDelta: -500 } }]
      })
    }
  },
  dragon: {
    baseline: { stressDelta: -1, deltas: { confidence: 0.6, discipline: 0.3 } },
    mishap: {
      chance: 0.08,
      buildEvent: ({ petName, hasFireInsurance }) => {
        const moneyHit = hasFireInsurance ? -5000 : -50000;
        const stressHit = hasFireInsurance ? 2 : 5;
        return {
          title: "The Grocery Store Barbecue",
          body: `At the local grocery store, ${petName} sneezes. It's… spicy. One aisle becomes a very brief "charcoal aesthetic." The manager asks if dragons are covered under "no outside food."`,
          choices: [{ 
            text: hasFireInsurance ? "Hand over the insurance card like a seasoned adult" : "Pay $50,000 and dissociate politely", 
            effects: { stress: stressHit, moneyDelta: moneyHit } 
          }]
        };
      }
    }
  }
};