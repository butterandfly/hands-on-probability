// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { InferGetStaticPropsType } from 'next'
import {getAllLessonMetas} from '../lib/lesson'
import Link from 'next/link';
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { genSectionUrl } from '../lib/utils';


export default function Home({ lessons }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="root">
      <Head>
        <title>Hands-On 🤲 Probability 🎲</title>
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" /> */}
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Banner></Banner>
      <LessonsList lessons={lessons}></LessonsList>
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

function LessonsList({lessons}: any) {
  const genList = () => {
    return lessons.map((lesson: any) => {
      return <LessonCard key={lesson.id} lesson={lesson} currentSection="01-01"></LessonCard> 
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

function LessonCard({lesson, currentSection}: any) {
  const classes = `container ${lesson.isActive === true ? 'active' : ''}`

  let href = '';
  if (lesson.isActive) {
    href = genSectionUrl(currentSection);
  }

  return (
    <Grid key={lesson.id} item xs={6}>
      <Link href={href}>
      <div className={classes}>
          <p className="title"><b>Lesson {lesson.id}, {lesson.title}</b></p>
          <p className="sub">{lesson.desc}</p>
      </div>
      </Link>
      <style jsx>{`
        .container {
          border: 2px solid #b9d0c3;
          border-radius: 5px;
          padding: 16px;
        }

        .active:hover {
          border: 2px solid seagreen;
        }

        .active {
          cursor: pointer;
        }

        .sub{
          color: gray;
        }
      `}</style>
    </Grid>
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
  return {
    props: {
      lessons: lessonDatas
    }
  }
}
