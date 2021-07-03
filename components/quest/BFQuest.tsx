import TextField from '@material-ui/core/TextField'
import { QuestComponetPros, QuestData, QuestProgressData, QuestBuilder, checkAnswer, isQuestFinished } from './questData';
import Submit from './Submit'
import { Piece } from '../../lib/datas';

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

export default function BFQuest({quest, questProgress, updateProgress}: BFQuestProps) {
  const prog = questProgress;

  const {status, attempts, currentInput} = prog;
  const disabled = isQuestFinished(status);
  let wrong = false;
  if (attempts.includes(currentInput)) {
    wrong = !compare(currentInput,quest.correct);
  }

  const changeCurrentInput = (val: string) => {
    const newProg: QuestProgressData = {
      ...prog,
      currentInput: val,
    };
    updateProgress(newProg)
  }

  const submit = () => {
    const newProg = checkAnswer(quest.correct, prog, compare);
    updateProgress(newProg)
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
export function createBFQuestData(piece: Piece): BFQuestData {
  const props = piece.props;
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
}