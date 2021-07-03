import {PartData, PartProgressData, Piece} from '../lib/datas';
import Paper from '@material-ui/core/Paper'
import LockIcon from '@material-ui/icons/Lock';
import { findPartProgress, useUserDataContext } from './UserDataProvider';
import {mdContainers, mdxComponents} from './mdx-components'
import { QuestData, QuestProgressData } from './quest/questData';
import MD from './quest/MD';

interface PartProps {
  part: PartData, 
  partProgress: PartProgressData,
}

export default function Part({part}: PartProps) {
  const userData = useUserDataContext();
  const partProgress = findPartProgress(part.id, userData);
  const isLocked = partProgress.isLocked;

  const updateQuestProgress = (newProg: QuestProgressData) => {
    userData.updateQuestProgress!(part.id, newProg);
  }

  return (<div className="root">
    {isLocked 
      ? (<Paper className="g-part-paper locked"  elevation={0}>
         <div className="lock"><LockIcon className="g-part-lock-icon" /></div>
        </Paper>)
      : (<Paper className="g-part-paper" elevation={1}>
          <div className="wrapper">
            <PiecesRenderer updateProgress={updateQuestProgress} partID={part.id} quest={part.quest} questProgress={partProgress.questProgress} pieces={part.pieces}></PiecesRenderer>
          </div>
        </Paper>)
    }
    <style jsx>{`
      .lock {
        text-align: center;
      }

      .root :global(.g-part-paper) {
        padding: 16px;
        margin-bottom: 16px;
      }

      .root :global(.locked) {
        background-color: darkgray;
      }

      .root :global(.g-part-lock-icon) {
        font-size: 32px;
        color: white;
      }
    `}</style>
  </div>);
}


interface PiecesRendererProps {
  partID: string,
  quest: QuestData,
  questProgress: QuestProgressData,
  pieces: Piece[],
  updateProgress: (questProgress: QuestProgressData) => void,
}

export function PiecesRenderer({partID, quest, questProgress, pieces, updateProgress}: PiecesRendererProps) {
  const genContent = () => {
    return pieces.map((piece, index) => {
      if (piece.type === 'md') {
        return <MD key={index}>{piece.innerContent}</MD>
      }

      if (piece.type === 'component') {
        const name = piece.componentName;
        const Comp = mdxComponents[piece.componentName];
        if (mdContainers.includes(name)) {
          return <Comp key={index} quest={quest} questProgress={questProgress} {...piece.props}>{piece.innerContent}</Comp>
        }

        return <Comp key={index} partID={partID} quest={quest} questProgress={questProgress} updateProgress={updateProgress} />
      }

      return <div key={index} className="unknown"></div>
    })
  }

  return <div>{genContent()}</div>
}