import {ReactChild, useState} from 'react'
import { useUserDataContext } from '../UserDataProvider';
import { QuestComponetPros, QuestData, QuestProgressData } from './questData';

interface SolutionProps extends QuestComponetPros {
  children?: any;
}

export default function Solution({children, partID}: SolutionProps) {
  const userData = useUserDataContext();
  const prog = userData.findQuestProgress!(partID);

  const [expandedState, setExpanded] = useState(false);
  const shouldHide = (prog.status === 'still');

  const onClick = () => {
    setExpanded(!expandedState);
  };

  const arrowIcon = expandedState ? `↑` : `↓` ;

  return <div className="root" hidden={shouldHide}>
    <div className="solution-btn" onClick={onClick}>{arrowIcon} Solution</div>
    {expandedState
      ? <div className="solution-content">{children}</div>
      : null
    }
    <style jsx>{`
      .root {
        border: 1px solid lightgray;
        padding: 16px 8px;
        border-radius: 5px;
        margin-top: 16px;
      }

      .solution-btn {
        cursor: pointer;
        text-align: right;
        color: steelblue;
        font-weight: bold;
      }
    `}</style>
  </div>;
}