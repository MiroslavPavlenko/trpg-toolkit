import type { Combatant } from "./combatant";

export interface DndPlayer extends Combatant {
  id: string;
  level: number;
  class: string;
  race: string;
  strength: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  armor_class: number;
  max_hit_points: number;
  initiative_bonus?: number;
}
