import { getAllLessonIds, getLessonMeta, initLessonProgressData, getAllSectionMeta, getSectionData, initProgresses} from '../../lib/lesson-helper';
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Part from '../../components/Part';
import Button from '@material-ui/core/Button'
import Link from 'next/link';

import { LessonData, LessonProgressData, LessonProgressesMap, PartProgressData, SectionData, SectionProgressData} from '../../lib/datas';
import { useEffect } from 'react';
import { findLessonProgress, useUserDataContext } from '../../components/UserDataProvider';
import Section from '../../components/Section'
import {DemoData, DemoProgressData, getAllDemoIDs, getDemoData, initDemoProgress} from '../../lib/demo-helper'
import LessonHeader from '../../components/layout/LessonHeader'
import {FixedHeaderLayout} from '../../components/layout/LessonLayout'

interface DemoProps {
  demo: DemoData, 
  progress: DemoProgressData, 
}

export default function Demo({demo, progress}: DemoProps) {
  const userData = useUserDataContext();

  useEffect(() => {
    userData.updateDemoProcess!(progress);
  }, [userData.demoProgress?.demoID])

  const demoProg = userData.demoProgress!;

  if (!demoProg || (demoProg.demoID !== demo.id)) return <div>loading...</div>

  const section = demo.sections![demo.id];
  const sectionProg = demoProg.sectionProgresses[demo.id];
  const genParts = () => {
    return Object.values(section.parts!).map((partData) => {
      const partProg = {
        ...sectionProg.partProgresses[partData.id],
        isFinished: true,
        isLocked: false,
      } as PartProgressData;
      return <Part key={partData.id} partProgress={partProg} part={partData} />
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
