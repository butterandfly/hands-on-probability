import Container from '@material-ui/core/Container';
import Link from 'next/link';

export default function LessonHeader({title}: any) {
  return (
    <div className="root">
      <Container maxWidth="lg">
        <div className="bread">
          <Link href="/"><a>Hands-On 🤲 Probability 🎲</a></Link>
          <span className="slash"> / </span>
          <div className="title">{title}</div>
        </div>
      </Container>
      
      <style jsx>{`
        .root {
          box-shadow: 0px 1px 5px grey;
          border-bottom: 0px solid seagreen;
          width: 100vw;
          color: black;
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
          flex-flow: row;
          padding: 16px;
        }

        a {
          color: seagreen;
        }

        .slash {
          padding: 0 8px;
        }

        .bread {
          display: flex;
          flex-flow: row;
          align-items: center;
        }

        .title {
          font-size: 20px;
        }

        a:hover {
          text-decoration: underline;
        }

      `}</style>
    </div>
  );
}

function Header({title}: any) {
  return (
    <div className="root">
      <Container maxWidth="lg">
        <Link href="/"><a>Hands-On 🤲 Probability 🎲</a></Link>
        <div className="title">{title}</div>
      </Container>
      
      <style jsx>{`
        .root {
          background-color: seagreen;
          width: 100vw;
          color: white;
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
          flex-flow: row;
          padding: 16px;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          margin-top: 16px;
        }

        a:hover {
          text-decoration: underline;
        }

      `}</style>
    </div>
  );
}