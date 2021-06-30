import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Submit from './Submit'
import MD from './MD'
import { QuestComponetPros, QuestData, QuestProgressData, QuestBuilder, checkAnswer } from './questData';
import {useUserDataContext} from '../UserDataProvider';
import {getPropsFromSyntax} from '../../lib/utils'

export interface MCQuestData extends QuestData {
  correct: string;
  options: string[];
}

export interface MCQuestProgressData extends QuestProgressData {
  currentInput: string;
  attempts: string[];
}

function genLetterByIndex(index: number) {
  return String.fromCharCode(65 + index);
}

export interface MCQuestProps extends QuestComponetPros {
  quest: MCQuestData,
}


export function MCQuest({partID, quest}: MCQuestProps) {
  const userData = useUserDataContext();
  const prog = userData.findQuestProgress!(partID);

  const changeCurrentInput = (optionVal: string) => {
    const newQuestProg: QuestProgressData = {
      ...prog,
      currentInput: optionVal,
    };
    userData.updateQuestProgress!(partID, newQuestProg);
  }

  const submit = () => {
    const newProg = checkAnswer(quest.correct, prog);
    userData.updateQuestProgress!(partID, newProg);
  }

  const genOptions = () => {
    return quest.options.map((mdContent: string, index: number) => {
      const optionVal = genLetterByIndex(index)
      return <RadioOption val={optionVal} key={optionVal} correct={quest.correct}
        onChangeAnswer={() => changeCurrentInput(optionVal)} status={prog.status} 
        currentInput={prog.currentInput} attempts={prog.attempts}>
          {mdContent}
      </RadioOption>
    });
  }

  return (
    <div>
      {genOptions()}
      <Submit onSubmit={submit} quest={quest} questProgress={prog} ></Submit>
    </div>
  )
}

type RadioOptionProps = {
  val: string;
  onChangeAnswer: any;
  children?: any;
  status: string;
  attempts: string[];
  currentInput: string;
  correct: string;
}

function RadioOption({val, onChangeAnswer, children, status, attempts, currentInput, correct}: RadioOptionProps) {
  const checked = (currentInput === val)
  let borderClass = '';
  if (attempts.includes(val)) {
    if (val === correct) borderClass = 'correct';
    else borderClass = 'wrong'
  }

  let disable = false;
  if (['success', 'failure'].includes(status)) disable = true;

  return (
    <div className={`gt-radio-option ${borderClass}`}>
      <FormControlLabel
        value={val}
        onChange={() => onChangeAnswer(val)}
        checked={checked}
        control={<Radio color="primary" name="val" />}
        disabled={disable}
        label={
          <MD>{children}</MD>
        }
      />
      <style jsx>{`
        .gt-radio-option {
          display: flex;
          padding: 0px 8px;
          margin: 2px 0;
        }

        .gt-radio-option.correct {
          /* border: 2px solid seagreen; */
          border-radius: 4px;
          background-color: #c1e2d6;
        }

        .gt-radio-option.wrong {
          /* border: 2px solid #f50057; */
          border-radius: 4px;
          background-color: #ecb2b2;
        }

      `}</style>
    </div>
  )
}

`
<MCQuestEditor correct="A" attemptsLeft="2" >
* Option A
* Option B
</MCQuestEditor>
`
export function createMCQuestData(node: any): MCQuestData {
  const optionStrings = node.value.match(/^\* .*$/gm);
  const options = optionStrings.map((str: string) => {
    return str.substring(2);
  });

  const props = getPropsFromSyntax(node);
  console.dir(props)

  return {
    questType: 'MCQuest',
    correct: props.correct,
    options: options,
    totalAttempts: +props.totalAttempts,
  };
}

export function initMCQuestProgressData(quest: MCQuestData): MCQuestProgressData {
  return {
    questType: quest.questType,
    currentInput: '',
    status: 'still',
    attemptsLeft: quest.totalAttempts,
    totalAttempts: quest.totalAttempts,
    attempts: [],
  }
}

export const MCQuestBuilder: QuestBuilder = {
  createQuestData: createMCQuestData,
  initQuestProgressData: initMCQuestProgressData,
  replacer: (node: any) => {
    node.value = `<MCQuest partID={partID} quest={quest} />`;
  }
}