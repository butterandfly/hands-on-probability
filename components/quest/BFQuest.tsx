import TextField from '@material-ui/core/TextField'
import { QuestComponetPros, QuestData, QuestProgressData, QuestBuilder, checkAnswer, isQuestFinished } from './questData';
import {useUserDataContext} from '../UserDataProvider';
import Submit from './Submit'
import { getPropsFromSyntax } from '../../lib/utils';

export interface BFQuestData extends QuestData {
  correct: string;
}

export interface BFQuestProgressData extends QuestProgressData {
  currentInput: string;
  attempts: string[];
}

export interface BFQuestProps extends QuestComponetPros {
  quest: BFQuestData,
}

export default function BFQuest({partID, quest}: BFQuestProps) {
  const userData = useUserDataContext();
  const prog = userData.findQuestProgress!(partID);

  const {status, attempts, currentInput} = prog;
  const disabled = isQuestFinished(status);
  let wrong = false;
  if (attempts.includes(currentInput)) {
    wrong = !compare(currentInput,quest.correct);
  }

  const changeCurrentInput = (val: string) => {
    const newQuestProg: QuestProgressData = {
      ...prog,
      currentInput: val,
    };
    userData.updateQuestProgress!(partID, newQuestProg);
  }

  const submit = () => {
    const newProg = checkAnswer(quest.correct, prog, compare);
    userData.updateQuestProgress!(partID, newProg);
  };

  return (<div>
    <div>
      <TextField onChange={(event) => changeCurrentInput(event.target.value)} disabled={disabled}
                 value={prog.currentInput} id="standard-basic" label="Your Answer" error={wrong} />
    </div>
    <Submit onSubmit={submit} quest={quest} questProgress={prog} compareFunc={compare} ></Submit>
    <style jsx>{`

    `}</style>
  </div>);
}

function compare(a: string, b: string) {
  return (a.trim().toLowerCase() === b.trim().toLowerCase());
}


`
<BFQuest correct="Probability" attemptsLeft="2" />
`
export function createBFQuestData(node: any): BFQuestData {
  const props = getPropsFromSyntax(node);
  console.dir(props)

  return {
    questType: 'BFQuest',
    correct: props.correct,
    totalAttempts: +props.totalAttempts,
  };
}

export function initBFQuestProgressData(quest: BFQuestData): BFQuestProgressData {
  return {
    questType: quest.questType,
    currentInput: '',
    status: 'still',
    attemptsLeft: quest.totalAttempts,
    totalAttempts: quest.totalAttempts,
    attempts: [],
  }
}

export const BFQuestBuilder: QuestBuilder = {
  createQuestData: createBFQuestData,
  initQuestProgressData: initBFQuestProgressData,
  replacer: (node: any) => {
    node.value = `<BFQuest partID={partID} quest={quest} />`;
  }
}