import { MDXRemote } from 'next-mdx-remote'

import {PartData, PartProgressData} from '../lib/datas';
import Paper from '@material-ui/core/Paper'
import LockIcon from '@material-ui/icons/Lock';
import { useMemo, useState } from 'react';
import { findPartProgress, useUserDataContext } from './UserDataProvider';
import {mdxComponents} from './mdx-components'

interface PartProps {
  part: PartData, 
  partProgress: PartProgressData,
}

export default function Part({part, partProgress}: PartProps) {
  const userData = useUserDataContext();
  // const partProgress = findPartProgress(part.id, userData);

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
            <MDXRemote {...part.source} components={mdxComponents} scope={questScope} />
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