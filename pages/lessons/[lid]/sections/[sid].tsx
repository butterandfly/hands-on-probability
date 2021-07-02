import { getAllLessonIds, getLessonMeta, initLessonProgressData, getAllSectionMeta, getSectionData, initProgresses} from '../../../../lib/lesson-helper';
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'

import LessonLayout from '../../../../components/layout/LessonLayout';
import { LessonData, LessonProgressData, LessonProgressesMap, SectionData, SectionProgressData} from '../../../../lib/datas';
import { useEffect } from 'react';
import { findLessonProgress, useUserDataContext } from '../../../../components/UserDataProvider';
import Section from '../../../../components/Section'

interface LessonProps {
  lesson: LessonData, 
  initializedProcesses: LessonProgressesMap, 
  section: SectionData
}

export default function Lesson({lesson, initializedProcesses, section}: LessonProps) {
  const userData = useUserDataContext();

  useEffect(() => {
    if (Object.keys(userData.progresses).length === 0) {
      userData.updateProgresses!(initializedProcesses);
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
  const initializedProcesses = await initProgresses();
  const section = await getSectionData(params.sid);

  return {
    props: {lesson, initializedProcesses , section}
  };
}