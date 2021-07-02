import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import { LessonData } from '../lib/datas';

export default function LessonCard({lesson, href}: {lesson: LessonData, href: string}) {
  const classes = `container ${lesson.isActive === true ? 'active' : ''}`

  if (!lesson.isActive) {
    href = '';
  }

  return (
    <Grid key={lesson.id} item xs={6}>
      <Link href={href}>
      <a className={classes}>
          <p className="title"><b>{lesson.title}</b></p>
          <p className="sub">{lesson.desc}</p>
      </a>
      </Link>
      <style jsx>{`
        .container {
          border: 2px solid #b9d0c3;
          border-radius: 5px;
          padding: 16px;
          display: block;
          cursor: inherit;
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