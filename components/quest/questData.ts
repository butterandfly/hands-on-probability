export interface QuestData {
  questType: string,
  correct: any;
  totalAttempts: number;
}

export interface QuestProgressData {
  questType: string,
  currentInput: any;
  status: string; // 'still', 'success', 'failure'
  attempts: any[];
  totalAttempts: number;
  attemptsLeft: number;
}

export interface QuestComponetPros {
  partID: string,
  quest: QuestData,
}

export function isQuestFinished(status: string) {
  if (['success', 'failure'].includes(status)) return true;
  return false;
}

export interface QuestBuilder {
  createQuestData: (node: any) => QuestData,
  initQuestProgressData: (node: any) => QuestProgressData,
  replacer: (node: any) => void,
}

// Check the answer, then return a new quest progress.
// Status, attemptsLeft and attempts will be updated.
export function checkAnswer(correct: any, oldProg: QuestProgressData, compareFunc: ((a: any, b: any) => boolean) = (a, b) => (a === b)) {
  let {attemptsLeft, status, attempts, currentInput} = oldProg;
  attemptsLeft--;
  const newAttempts = attempts.concat([oldProg.currentInput]);

  if (compareFunc(currentInput, correct)) {
    status = 'success';
  } else {
    if (attemptsLeft === 0) status = 'failure';
  }

  const newProg = {
    ...oldProg,
    attemptsLeft,
    status,
    attempts: newAttempts,
  }
  return newProg;
}