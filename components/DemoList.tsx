import { LessonData, LessonProgressesMap } from "../lib/datas";
import LessonCard from "../components/LessonCard";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { DemoData } from "../lib/demo-helper";

export interface DemoListProps {
  demoLessons: DemoData[],
}

export function DemoList({demoLessons}: DemoListProps) {
  const genList = () => {
    return demoLessons.map((lesson: any) => {

      const href = '/demos/' + lesson.id;
      return <LessonCard key={lesson.id} lesson={lesson} href={href}></LessonCard> 
    })
  }

  return (
    <div className="root">
      <Container maxWidth="md">
        <h1>Demos 🃏</h1>
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
