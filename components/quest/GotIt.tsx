import Button from '@material-ui/core/Button'
import { Piece } from '../../lib/datas';
import { useUserDataContext } from '../UserDataProvider';
import { QuestProgressData, QuestComponetPros, QuestData, QuestBuilder } from './questData'

export default function GotIt({questProgress, updateProgress}: QuestComponetPros) {
  // const userData = useUserDataContext();
  // const prog = userData.findQuestProgress!(partID);

  const disabled = ['success', 'failure'].includes(questProgress.status) ? true : false;

  const onSubmit = () => {
    const newQuestProg: QuestProgressData = {
      ...questProgress,
      status: 'success',
      attemptsLeft: 0,
      attempts: [''],
    };
    updateProgress(newQuestProg);
    // userData.updateQuestProgress!(partID, newQuestProg);
  }

  return (<div className="root">
    <Button onClick={onSubmit} variant="contained" color="primary" disabled={disabled} disableElevation>Got It!</Button>
    <style jsx>{`
      .root {
        text-align: right;
      }
    `}</style>
  </div>)
}

export function createGotItData(_: Piece): QuestData {
  return {
    questType: 'GotIt',
    correct: '',
    totalAttempts: 1,
  };
}

export function initGotItProgressData(quest: QuestData): QuestProgressData {
  return {
    questType: 'GotIt',
    currentInput: '',
    status: 'still',
    attemptsLeft: quest.totalAttempts,
    totalAttempts: quest.totalAttempts,
    attempts: [],
  }
}

export const GotItBuilder: QuestBuilder = {
  createQuestData: createGotItData,
  initQuestProgressData: initGotItProgressData,
  // replacer: (node: any) => {
  //   node.value = `<GotIt partID={partID} />`
  // }
}