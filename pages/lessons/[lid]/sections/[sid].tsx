import { getAllLessonIds, getLessonMeta, initLessonProgressData, getAllSectionMeta, getSectionData} from '../../../../lib/lesson';
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'

import LessonLayout from '../../../../components/Layout';
import { LessonData, LessonProgressData, SectionData, SectionProgressData} from '../../../../lib/datas';
import { useEffect } from 'react';
import { findLastSectionProgress, findLessonProgress, findNextSectionProgress, findSectionProgress, findUnfinishedSection, useUserDataContext } from '../../../../components/UserDataProvider';
import Part from '../../../../components/Part';
import Button from '@material-ui/core/Button'
import Link from 'next/link';
import { genSectionUrl } from '../../../../lib/utils';
import LockIcon from '@material-ui/icons/Lock';


export default function Lesson({lesson, lessonProgress, section}: {lesson: LessonData, lessonProgress: LessonProgressData, section: SectionData}) {
  const userData = useUserDataContext();

  useEffect(() => {
    if (!userData.progresses[lesson.id]) {
      userData.updateLessonProgress(lessonProgress);
    }
  }, [userData])


  const lessonProg = findLessonProgress(lesson.id, userData);

  let activeSectionID:string = '';
  if (lessonProg) {
    activeSectionID = lessonProg.activeSection;
  }

  const genContent = () => {
    if (!lessonProg) return <div>loading...</div>

    return (
      <div>
        <Section section={section} />
      </div>
    )
  }

  return (
    <div>
      <LessonLayout activeSectionID={section.id} lessonData={lesson}>
        {genContent()}
      </LessonLayout>
      <style jsx>{`
      `}</style>
    </div>
  )
}

function Section({section}: {section: SectionData,}) {
  const userData = useUserDataContext();
  const sectionProg = findSectionProgress(section.id, userData) as SectionProgressData;

  if (sectionProg.isLocked) {
    return (<div className="root">
      <LockIcon className="icon" />
      <style jsx>{`
        .root {
          text-align: center;
          padding: 48px;
        }
        .root :global(.icon) {
          font-size: 64px;
          color: gray;
        }
      `}</style>
    </div>);
  }

  const genParts = () => {
    return Object.values(section.parts!).map((partData) => {
      return <Part key={partData.id} part={partData} />
    })
  };

  const lessonID = section.id.substring(0, 2);
  const lessonProg = findLessonProgress(lessonID, userData);
  const lastSectionProg = findLastSectionProgress(lessonProg);
  const isLastSection = (lastSectionProg.sectionID === section.id);

  let href = '#';
  if (isLastSection) href = '/';
  else if (sectionProg.isFinished) {
    const nextSectionProg = findNextSectionProgress(section.id, userData);
    href= genSectionUrl(nextSectionProg.sectionID);
  }
  const click = () => {
    if (!isLastSection) {
      const nextSectionProg = findNextSectionProgress(section.id, userData);
      userData.activateSection!(nextSectionProg.sectionID);
    }
  }

  return (
    <div className="root">
      <div className="lessonNum">Section {section.id}</div>
      <h1 className="section-title">
        {section.title}
      </h1>
      <div>
        {genParts()}
      </div>
        <div className="next">
          <Link href={href}><Button className="next-btn" disabled={!sectionProg.isFinished} 
                  variant="outlined" color="primary"
                  onClick={click}>
            {isLastSection ? 'Back to Home' : 'Next Section'}
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
    `}</style>
    </div>
  )
}


// Get all lessons
export const getStaticPaths: GetStaticPaths = async () => {
  const paths:any[] = [];
  const lessonIDs = getAllLessonIds();

  lessonIDs.forEach((lessonID) => {
    const sections = getAllSectionMeta(lessonID);
    Object.keys(sections).forEach((sectionID) => {
      paths.push({
        params: {lid: lessonID, sid: sectionID}
      })
    })
  });
  return {
    paths: paths,
    fallback: false
}
}

interface Params extends ParsedUrlQuery {
  lid: string,
  sid: string,
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params as Params;
  const lesson = await getLessonMeta(params.lid)
  const lessonProgress = await initLessonProgressData(params.lid);
  const section = await getSectionData(params.sid);

  return {
    props: {lesson, lessonProgress, section}
  };
}