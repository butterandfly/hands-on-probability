import Container from '@material-ui/core/Container';
import Link from 'next/link';
import LockIcon from '@material-ui/icons/LockOutlined';
import StopIcon from '@material-ui/icons/Stop';
import {LessonProgressData, SectionProgressData, LessonData, SectionData, SectionProgressesMap} from '../../lib/datas'
import {useUserDataContext, findLessonProgress} from '../UserDataProvider'
import { genSectionUrl } from '../../lib/utils';
import LessonHeader from './LessonHeader'

type LessonLayoutProps = {
  lessonData: LessonData,
  children?: any,
  activeSectionID: string,
}

export function FixedHeaderLayout({title, children}: {title: string, children?: any}) {
  return (
    <div className="root">
      {/* <Header></Header> */}
      <div className="header-wrapper">
        <LessonHeader title={title}></LessonHeader>
      </div>
      <Container className="body-wrapper" maxWidth="lg">
      {children}
      </Container>
      <style jsx>{`
        .root {
          display: flex;
          flex-flow: column;
        }

        .header-wrapper {
          position: fixed;
          background: white;
          z-index: 10;
        }

        .root :global(.body-wrapper) {
          margin-top: 65px;
          display: flex;
          flex-flow: row;
          justify-content: center;
        }
      `}</style>
    </div>
  ) 
}

export default function LessonLayout({lessonData, children, activeSectionID}: LessonLayoutProps) {

  return (
    <div className="root">
      {/* <Header></Header> */}
      <div className="header-wrapper">
        <LessonHeader title={'' + lessonData.title}></LessonHeader>
      </div>
      <Container className="body-wrapper" maxWidth="lg">
        <div className="left">{children}</div>
        <div className="right">
          <div className="fixed-nav">
            <LessonProgress activeSectionID={activeSectionID} lessonID={lessonData.id} />
          </div>
          </div>
      </Container>
      <style jsx>{`
        .root {
          display: flex;
          flex-flow: column;
        }

        .header-wrapper {
          position: fixed;
          background: white;
          z-index: 10;
        }

        .root :global(.body-wrapper) {
          margin-top: 65px;
          display: flex;
          flex-flow: row;
          justify-content: center;
        }

        .fixed-nav {
          position: fixed;
          width: 300px;
        }

        .left {
          padding: 16px;
          flex-grow: 1;
        }

        .right {
          width: 300px;
          margin-left: 48px;
        }
      `}</style>
    </div>
  )
}

const LessonProgress = ({lessonID, activeSectionID}: {lessonID: string, activeSectionID: string}) => {
  const userData = useUserDataContext();
  const lessonProg = findLessonProgress(lessonID, userData);
  if (!lessonProg) return <div>Loading...</div>

  const sectionProgresses = lessonProg.sectionProgresses;
  const genSectionProgressList = () => {
    return Object.values(sectionProgresses).map((sectionProgress, index) => {
      const isActive = (sectionProgress.sectionID === activeSectionID ? true : false);
      {index === 0 ? null : <div><span className="connect"></span></div>}
      return <SectionProgressItem key={sectionProgress.sectionID} {...{sectionProgress, isActive, isFirst: index === 0, onClick: userData.activateSection!}}/>
    })
  }

  return (<div className="root">
    <div className="lesson-title">
      <div className="num">Lesson {lessonID}</div>
      <h3>{lessonProg.lessonTitle}</h3>
    </div>
    <div className="list">
      {genSectionProgressList()}
    </div>
    <style jsx>{`
      .root {
        margin: 16px 0;
        padding: 16px 8px;
      }

      .lesson-title .num {
        color: gray;
        font-style: italic;
      }

      .lesson-title h3 {
        margin: 8px 0;
      }

      .list {
        margin: 16px 0;
      }
    `}
    </style>
  </div>);
}

interface SectionProgressItemProps {
  sectionProgress: SectionProgressData,
  isActive: boolean,
  isFirst: boolean,
  onClick: (id: string) => void,
}

function SectionProgressItem({sectionProgress, isActive, isFirst, onClick}: SectionProgressItemProps) {
  const {isLocked, isFinished} = sectionProgress;

  let statusName = '';
  if (isLocked) statusName = 'locked';
  if (!isFinished && !isLocked) statusName = 'onprocess';
  if (isFinished) statusName = 'finished';

  const classes = [statusName];
  if (isActive) classes.push('active');

  const click = () => {
    if (isLocked) return;
    onClick(sectionProgress.sectionID);
  }

  const href = genSectionUrl(sectionProgress.sectionID);

  return <div className={classes.join(' ')} key={sectionProgress.sectionID}>
    {isFirst ? null : <div><span className="connect"></span></div>}
    {isLocked  
      ? (<div className="section">
          {<LockIcon htmlColor="gray"/>}
        <span className="section-title">{sectionProgress.sectionTitle}</span>
        </div>)
      : (<Link href={href}>
          <a onClick={click} className="section">
            {<StopIcon />}
            <span className="section-title">{sectionProgress.sectionTitle}</span>
          </a>
        </Link>)
    }
    <style jsx>{`
      .section {
        display: flex;
        flex-flow: row;
        align-items: center;
      }

      .finished .section {
        color: seagreen;
      }
      .active .section {
        text-decoration: underline;
      }
      :not(.locked) .section:hover {
        text-decoration: underline;
        cursor: pointer;
      }
      .onprocess .section {
        color: steelblue;
      }
      .locked .section {
        color: gray;
      }
      .section-title {
        font-weight: bold;
        padding-left: 4px;
      }
      .connect {
        border-left: 2px solid seagreen;
        margin: 2px 11px;
        display: inline-block;
        height: 20px;
      }

      .locked .connect {
        border-left: 2px solid gray;
      }

    `}</style>
  </div>
}