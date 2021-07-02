// import Head from 'next/head'
// import Image from 'next/image'
import {getAllLessonMetas, initProgresses} from '../lib/lesson-helper'
import Link from 'next/link';
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { genSectionUrl } from '../lib/utils';
import { LessonData, LessonProgressesMap } from '../lib/datas';
import { useEffect } from 'react';
import { useUserDataContext } from '../components/UserDataProvider';
import LessonCard from '../components/LessonCard';
import { DemoList } from '../components/DemoList';
import { DemoData, getAllDemoMetas } from '../lib/demo-helper';

interface HomeProps {
  lessons: LessonData[],
  demos: DemoData[],
  initializedProcesses: LessonProgressesMap,
}

export default function Home({ lessons, demos, initializedProcesses }: HomeProps) {
  const userData = useUserDataContext();

  useEffect(() => {
    if (Object.keys(userData.progresses).length === 0) {
      userData.updateProgresses!(initializedProcesses);
    }
  }, [userData])

  if (Object.keys(userData.progresses).length === 0) {
    return <div>loading...</div>
  }

  return (
    <div className="root">
      <Head>
        <title>Hands-On 🤲 Probability 🎲</title>
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" /> */}
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Banner></Banner>
      <LessonsList lessons={lessons} progresses={userData.progresses}></LessonsList>
      <DemoList demoLessons={demos}></DemoList>
      <style jsx>{`
        .root {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: start;
          align-items: center;
          height: 100vh;
        }
      `}</style>
    </div>
  )
}

interface LessonsListProps {
  lessons: LessonData[];
  progresses: LessonProgressesMap,
}

function LessonsList({lessons, progresses}: LessonsListProps) {
  const genList = () => {
    return lessons.map((lesson: any) => {

      const href = genSectionUrl(progresses[lesson.id].activeSection);
      return <LessonCard key={lesson.id} lesson={lesson} href={href}></LessonCard> 
    })
  }

  return (
    <div className="root">
      <Container maxWidth="md">
        <h1>Lessons 📚</h1>
        <hr />
        <Grid container spacing={3}>
          {genList()}
        </Grid>
      </Container>
      <style jsx>{`
        .root {
          width: 100vw;
          margin-top: 8px;
        }

        h1 {
          margin-bottom: 8px;
        }

        hr {
          color: gray;
          opacity: 0.4;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  )
}

function Banner() {
  return (
    <div className="root">
      <Container maxWidth="md">
        <div className="banner">Hands-On 🤲 Probability 🎲</div>
        <div className="sub">A modern way to learn probability.</div>
      </Container>
      <style jsx>{`
        .root {
          width: 100vw;
        }
        .banner {
          padding: 16px 0;
          color: seagreen;
          font-size: 3rem;
          font-weight: bold;
        }
        .sub {
          color: #517564;
          margin-bottom: 16px;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}

export const getStaticProps = async () => {
  const lessonDatas = await getAllLessonMetas();
  const demoDatas = getAllDemoMetas();
  const initializedProcesses = await initProgresses();
  return {
    props: {
      lessons: lessonDatas,
      demos: demoDatas,
      initializedProcesses 
    }
  }
}
