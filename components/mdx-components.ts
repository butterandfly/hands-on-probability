
import GotIt from './quest/GotIt';
import {Axiom, Definition, Theorem} from './quest/MathBox';
import BFQuest from './quest/BFQuest';
import {MCQuest} from './quest/MCQuest';
import Solution from './quest/Solution';
import {MCQuestBuilder} from '../components/quest/MCQuest'
import { GotItBuilder, } from '../components/quest/GotIt';
import { BFQuestBuilder } from '../components/quest/BFQuest';
import { QuestBuilder } from '../components/quest/questData'

export const mdxComponents: {[key: string]: any} = {
  MCQuest: MCQuest,
  BFQuest: BFQuest,
  Solution: Solution,
  GotIt: GotIt,
  Definition: Definition,
  Theorem: Theorem,
  Axiom: Axiom,
}

export const questComponents = [
  'MCQuest',
  'GotIt',
  'BFQuest',
];

export const mdContainers = [
  'Solution',
  'Definition',
  'Theorem',
  'Axiom',
]


export const buildersMap: {[key: string]: QuestBuilder} = {
  'MCQuest': MCQuestBuilder,
  'GotIt': GotItBuilder,
  'BFQuest': BFQuestBuilder,
}

// export const mdxContainerCompNames = [
//   'Solution',
//   'Definition',
//   'Theorem',
//   'Axiom',
// ]