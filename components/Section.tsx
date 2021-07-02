import Part from './Part';
import Button from '@material-ui/core/Button'
import Link from 'next/link';
import { genSectionUrl } from '../lib/utils';
import LockIcon from '@material-ui/icons/Lock';
import { findLastSectionProgress, findLessonProgress, findNextSectionProgress, findSectionProgress, useUserDataContext } from './UserDataProvider';
import { SectionData, SectionProgressData } from '../lib/datas';

export default function Section({section}: {section: SectionData}) {
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
      // return <Part key={partData.id} part={partData} />
      return <Part key={partData.id} partProgress={sectionProg.partProgresses[partData.id]} part={partData} />
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
