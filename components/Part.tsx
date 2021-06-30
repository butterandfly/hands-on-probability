import { MDXRemote } from 'next-mdx-remote'

import {MCQuest, MCQuestData, MCQuestProgressData} from './quest/MCQuest';

import Solution from './quest/Solution';
import {PartData, PartProgressData} from '../lib/datas';
import Paper from '@material-ui/core/Paper'
import LockIcon from '@material-ui/icons/Lock';
import { useMemo, useState } from 'react';
import { findPartProgress, useUserDataContext } from './UserDataProvider';
import GotIt from './quest/GotIt';
import {Axiom, Definition, Theorem} from './quest/MathBox';
import BFQuest from './quest/BFQuest';

const comps = {
  MCQuest: MCQuest,
  BFQuest: BFQuest,
  Solution: Solution,
  GotIt: GotIt,
  Definition: Definition,
  Theorem: Theorem,
  Axiom: Axiom,
}


type PartProps = {
  part: PartData, 
}

export default function Part({part}: PartProps) {
  const userData = useUserDataContext();
  const partProgress = findPartProgress(part.id, userData);

  const isLocked = partProgress.isLocked;

  const questScope = useMemo(() => {
    return {
      partID: part.id,
      quest: part.quest,
    }
  
  }, [part.content, part.id])

  return (<div className="root">
    {isLocked 
      ? (<Paper className="g-part-paper locked"  elevation={0}>
         <div className="lock"><LockIcon className="g-part-lock-icon" /></div>
        </Paper>)
      : (<Paper className="g-part-paper" elevation={1}>
          <div className="wrapper">
            <MDXRemote {...part.source} components={comps} scope={questScope} />
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