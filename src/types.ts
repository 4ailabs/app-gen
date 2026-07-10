export type Gender = 'male' | 'female' | 'unknown' | 'pregnancy' | 'miscarriage' | 'abortion' | 'stillbirth' | 'twins';
export type Status = 'alive' | 'deceased';

export type EventCategory = 
  | 'death_loss'
  | 'abandonment_rejection'
  | 'betrayal_deceit'
  | 'violence'
  | 'humiliation_exclusion'
  | 'accident_illness'
  | 'secret'
  | 'crisis';

export interface LifeEvent {
  id: string;
  date: string;
  description: string;
  category: EventCategory;
  ageAtEvent?: number;
}

export interface PersonData {
  id: string;
  name: string;
  gender: Gender;
  status: Status;
  birthDate?: string;
  birthDateUnknown?: boolean;
  deathDate?: string;
  deathDateUnknown?: boolean;
  roleOrTrade?: string;
  events: LifeEvent[];
  notes?: string;
  hasUnknownInfo?: boolean;
}

export type RelationshipType = 
  | 'relationship'
  | 'marriage'
  | 'divorce'
  | 'separation'
  | 'cutoff'
  | 'parent_child'
  | 'adopted'
  | 'twins'
  | 'conflict'
  | 'close';

export interface RelationshipData {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  date?: string;
}

// React Flow Types
export interface NodeData extends PersonData, Record<string, unknown> {
  onEdit?: (id: string) => void;
  isGenosociogramMode?: boolean;
}

export interface EdgeData extends Record<string, unknown> {
  type: RelationshipType;
  label?: string;
}
