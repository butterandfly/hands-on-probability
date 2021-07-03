import { GetStaticProps, GetStaticPaths } from 'next'
import {PiecesRenderer} from '../../components/Part';
import Button from '@material-ui/core/Button'
import Link from 'next/link';

import { PartData, PartProgressData } from '../../lib/datas';
import { useState } from 'react';
import {DemoData, DemoProgressData, getAllDemoIDs, getDemoData, initDemoProgress} from '../../lib/demo-helper'
import {FixedHeaderLayout} from '../../components/layout/LessonLayout'
import Paper from '@material-ui/core/Paper'
import { QuestProgressData } from '../../components/quest/questData';

interface DemoProps {
  demo: DemoData, 
  progress: DemoProgressData, 
}

export default function Demo({demo, progress}: DemoProps) {
  const demoProg = progress;

  const section = demo.sections![demo.id];
  const sectionProg = demoProg.sectionProgresses[demo.id];
  const genParts = () => {
    return Object.values(section.parts!).map((partData) => {
      const partProg = {
        ...sectionProg.partProgresses[partData.id],
        isFinished: true,
        isLocked: false,
      } as PartProgressData;
      return <DemoPart key={partData.id} partProgress={partProg} part={partData} />
    })
  };

  return (
    <div className="root">
    <FixedHeaderLayout title={demo.title}>
    <div className="container">
      <div className="lessonNum">Section {section.id}</div>
      <h1 className="section-title">
        {section.title}
      </h1>
      <div>
        {genParts()}
      </div>
        <div className="next">
          <Link href="/"><Button className="next-btn" 
                  variant="outlined" color="primary">
            {'Back to Home'}
          </Button></Link>
        </div>
      <style jsx>{`
        .section-title {
          color: seagreen;
          margin-top: 8px;
        }
        .lessonNum {
          color: gray;
          font-size: 20px;
          font-style: italic;
          margin-bottom: 8px;
        }
        .next {
          text-align: center;
          margin-bottom: 32px;
        }
        .root :global(.next-btn) {
          height: 64px;
          width: 256px;
        }
        .container {
          width: 960px;
        }
    `}</style>
    </div>
    </FixedHeaderLayout>
    </div>
  )
}

interface PartProps {
  part: PartData, 
  partProgress: PartProgressData,
}

function DemoPart({part, partProgress}: PartProps) {
  const [prog, setProg] =  useState(partProgress.questProgress);

  const updateProgress = (newProg: QuestProgressData) => {
    setProg(newProg);
    return;
  }

  return (<div className="root">
    <Paper className="g-part-paper" elevation={1}>
      <div className="wrapper">
        <PiecesRenderer updateProgress={updateProgress} partID={part.id} quest={part.quest} questProgress={prog} pieces={part.pieces}></PiecesRenderer>
      </div>
    </Paper>
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


// Get all demos.
export const getStaticPaths: GetStaticPaths = async () => {
  const demoIDs = getAllDemoIDs();

  const paths = demoIDs.map((id: string) => {
    return {params: {did: id}}
  });

  return {
    paths: paths,
    fallback: false
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const did = context.params!.did as string;
  const demo = await getDemoData(did)
  const progress = await initDemoProgress(demo);

  return {
    props: {demo, progress }
  };
}
