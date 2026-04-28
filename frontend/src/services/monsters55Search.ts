import { supabase } from "./supabaseClient";

export interface Monster55 {
  Name: string;
  CR: number | null;
  Type: string | null;
  Size: string | null;
  AC: number | null;
  HP: number | null;
  Speed: string | null;
  STR: number | null;
  DEX: number | null;
  CON: number | null;
  INT: number | null;
  WIS: number | null;
  CHA: number | null;
  Alignment: string | null;
  Legendary: boolean | null;
  Habitat: string | null;
  Source: string | null;
  "Image URL": string | null;
  Initiative: string | null;
  Skills: string | null;
  Senses: string | null;
  Languages: string | null;
  XP: number | null;
  Immunities: string | null;
  Resistances: string | null;
  Vulnerabilities: string | null;
  Treasure: string | null;
  Traits: string | null;
  Actions: string | null;
  "Bonus Actions": string | null;
  Reactions: string | null;
  "Legendary Actions": string | null;
}

export async function fetchMonster55ByName(name: string): Promise<Monster55> {
  const { data, error } = await supabase
    .from("Monsters")
    .select("*")
    .ilike("Name", name.trim())
    .single();

  if (error) throw new Error(`Monster "${name}" not found: ${error.message}`);
  return data as Monster55;
}

export async function searchMonsters55(
  query: string,
  limit = 20
): Promise<Monster55[]> {
  const { data, error } = await supabase
    .from("Monsters")
    .select("*")
    .ilike("Name", `%${query.trim()}%`)
    .order("Name")
    .limit(limit);

  if (error) throw new Error(`Monster search failed: ${error.message}`);
  return (data ?? []) as Monster55[];
}

export async function fetchMonsters55ByCR(cr: number): Promise<Monster55[]> {
  const { data, error } = await supabase
    .from("Monsters")
    .select("*")
    .eq("CR", cr)
    .order("Name");

  if (error) throw new Error(`CR lookup failed: ${error.message}`);
  return (data ?? []) as Monster55[];
}

export async function fetchMonsters55ForParty(
  maxCR: number,
  type?: string,
  habitat?: string,
  limit = 150
): Promise<Monster55[]> {
  let query = supabase
    .from("Monsters")
    .select("*")
    .lte("CR", maxCR)
    .order("Name")
    .limit(limit);

  if (type) query = query.ilike("Type", `%${type}%`);
  if (habitat) query = query.ilike("Habitat", `%${habitat}%`);

  const { data, error } = await query;
  if (error) throw new Error(`Party fetch failed: ${error.message}`);
  return (data ?? []) as Monster55[];
}

export async function fetchMonsters55ByType(type: string): Promise<Monster55[]> {
  const { data, error } = await supabase
    .from("Monsters")
    .select("*")
    .ilike("Type", `%${type.trim()}%`)
    .order("Name");

  if (error) throw new Error(`Type lookup failed: ${error.message}`);
  return (data ?? []) as Monster55[];
}
