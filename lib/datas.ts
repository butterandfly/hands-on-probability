import { QuestData } from "../components/quest/questData"

export type LessonData = {
  id: string,
  title: string,
  isActive: boolean,
  desc: string,
  sections?: SectionsMap,
}

export type LessonProgressData = {
  lessonID: string, // '01'
  lessonTitle: string,
  isFinished: boolean,
  activeSection: string, // ID of the active section
  sectionProgresses: SectionProgressesMap,
}

export type SectionData = {
  id: string,
  title: string,
  parts: PartsMap,
}

export type SectionProgressData = {
  sectionID: string, // '01-02'
  sectionTitle: string,
  isFinished: boolean,
  isLocked: boolean,
  partProgresses: PartProgressesMap,
}

export type PartData = {
  id: string,
  quest: QuestData,
  content?: string,
  source?: any,
  pieces: Piece[],
}

export type PartProgressData = {
  partID: string, // '01-02.01'
  isLocked: boolean,
  isFinished: boolean,
  questProgress?: any,
}

export type PartsMap = {
  [key: string]: PartData
}

export type SectionsMap = {
  [key: string]: SectionData
}

export type PartProgressesMap = {
  [key: string]: PartProgressData
}

export type SectionProgressesMap = {
  [key: string]: SectionProgressData
}

export type LessonProgressesMap = {
  [key: string]: LessonProgressData
}

// type PieceType = 'md' | 'quest' | 'showcase';
export type PieceType = 'md' | 'component';


export interface Piece {
  type: PieceType,
  content: string,
  componentName: string,
  innerContent: string,
  props: {[key: string]: string},
}