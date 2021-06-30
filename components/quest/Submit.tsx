import Button from '@material-ui/core/Button';
import { QuestData, QuestProgressData } from './questData';

type SubmitPros = {
  onSubmit: () => void,
  quest: QuestData,
  questProgress: QuestProgressData,
  compareFunc?: ((a: any, b: any) => boolean),
}

export default function Submit({onSubmit, quest, questProgress, compareFunc}: SubmitPros) {
  if (!compareFunc) compareFunc = ((a, b) => (a === b));
  const {attemptsLeft, currentInput, attempts, status} = questProgress;
  const {correct} = quest;
  const isCorrect = (status === 'success');
  let disable = false;
  if (attemptsLeft === 0 || isCorrect) {
    disable = true;
  }
  if (!currentInput) disable = true;

  let wrongAttempt = false;
  const lastAttempt = (attempts.length > 0 ? attempts[attempts.length - 1] : null);
  wrongAttempt = (lastAttempt && !compareFunc(lastAttempt, correct))

  const statusWord = isCorrect ? '🎉🎊🥳 ✅' : '';
  const wrongAttemptWord = wrongAttempt ? '❌' : '';

  return (
    <div className="gt-submit">
      <Button variant="contained" color="primary" disabled={disable}
        onClick={()=> onSubmit()}>Submit Answer</Button>
      <div className="gt-submit-attempts">You have {attemptsLeft} attempts</div>
      <div className='status-icon'>
        {statusWord} {wrongAttemptWord}
      </div>
      <style jsx>{`
        .gt-submit {
          margin: 8px 0;
          display: flex;
          flex-flow: row-reverse;
          align-items: center;
        }

        .gt-submit-attempts {
          font-weight: bold;
          padding: 0 16px;
          font-size: small;
          color: gray;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}