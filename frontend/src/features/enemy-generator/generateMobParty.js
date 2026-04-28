// Simple mock monster data (can later be replaced with API data)
const monsters = [
  { name: "Goblin", cr: 0.25, habitat: "Forest", type: "Humanoid", group: "Tribe" },
  { name: "Orc", cr: 0.5, habitat: "Mountain", type: "Humanoid", group: "Warband" },
  { name: "Skeleton", cr: 0.25, habitat: "Dungeon", type: "Undead", group: "Horde" },
  { name: "Zombie", cr: 0.25, habitat: "Swamp", type: "Undead", group: "Horde" },
  { name: "Bandit", cr: 0.125, habitat: "Road", type: "Humanoid", group: "Gang" },
];

// Selects and returns one random monster from a provided monster list
function getRandomMonster(monsterList) {
  const index = Math.floor(Math.random() * monsterList.length);
  return monsterList[index];
}

// Filters monsters based on selected habitat, type, and group
function filterMonsters(habitat, type, group) {
  return monsters.filter((monster) => {
    const matchesHabitat = habitat === "Any" || monster.habitat === habitat;
    const matchesType = type === "Any" || monster.type === type;
    const matchesGroup = group === "Any" || monster.group === group;

    return matchesHabitat && matchesType && matchesGroup;
  });
}

// Generates a random MOB party based on target CR, MOB count, and selected filters
export function generateMobParty(
  targetChallengeRating = 0.5,
  mobCount = 3,
  habitat = "Any",
  type = "Any",
  group = "Any"
) {
  const filteredMonsters = filterMonsters(habitat, type, group);
  let party = [];

  // If no monsters match the selected filters, return an empty party
  if (filteredMonsters.length === 0) {
    return party;
  }

  // Adds random monsters until the requested MOB count is reached
  // Target challenge rating is accepted as a parameter for future balancing logic
  while (party.length < mobCount) {
    const monster = getRandomMonster(filteredMonsters);
    party.push(monster);
  }

  return party;
}