import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route as R } from 'react-router-dom';

import css from './styles.css';

import Nav from './components/nav';
import Loading from './components/loading';
const OrientLastLayer = lazy(() =>
  import('./components/rubiks-cube/orient-last-layer')
);
const PermuteLastLayerPage = lazy(() =>
  import('./components/rubiks-cube/permute-last-layer')
);
const CubeTimer = lazy(() => import('./components/rubiks-cube/timer'));
const CubeTimerSessionDetails = lazy(() =>
  import('./components/rubiks-cube/timer/session-details')
);
const CubeSessionManager = lazy(() =>
  import('./components/rubiks-cube/session-manager')
);
const Bookmarks = lazy(() => import('./components/bookmarks'));
const Countdowns = lazy(() => import('./components/countdowns'));
const Home = lazy(() => import('./components/home'));
const Todos = lazy(() => import('./components/todos'));
const WeddingPhotos = lazy(() => import('./components/wedding-photos'));
const WeddingTagManager = lazy(() =>
  import('./components/wedding-photos/tag-manager')
);
const WeddingPhotosGrantPermission = lazy(() =>
  import('./components/wedding-photos/grant-permission')
);
const Location = lazy(() => import('./components/location'));
const PokemonFlashCards = lazy(() =>
  import('./components/pokemon/flash-cards')
);
// const PokemonEVHelper = lazy(() => import( './components/pokemon/ev-helper'));
const PokemonCramomatic = lazy(() => import('./components/pokemon/cramomatic'));
const DnDSpellBook = lazy(() =>
  import('./components/dungeons-and-dragons/spell-book')
);
const BoxClicker = lazy(() => import('./components/box-clicker'));
const BoxClickerReplayPlayer = lazy(() =>
  import('./components/box-clicker/replay')
);
const Test = lazy(() => import('./components/test'));
const Admin = lazy(() => import('./components/admin'));
const AimTimeHelper = lazy(() => import('./components/csgo/aim-time-helper'));
const MarkdownEditor = lazy(() => import('./components/markdown-editor'));
const MarkdownViewer = lazy(() => import('./components/markdown-viewer'));
const ConfettiStandAlone = lazy(() =>
  import('./components/confetti-stand-alone')
);
const NumberTyper1 = lazy(() => import('./components/number-typer'));
const NumberTyper = lazy(() => import('./components/number-typer-2'));
const TypeTheAlphabet = lazy(() => import('./components/type-the-alphabet'));
const Mastermind = lazy(() => import('./components/mastermind'));
const Numberdle = lazy(() => import('./components/numberdle'));
const ConfettiMaker = lazy(() => import('./components/confetti-maker'));
const TextToSpeech = lazy(() => import('./components/text-to-speech'));
const Timers = lazy(() => import('./components/timers'));
const Misc = lazy(() => import('./components/markdown-pages/misc'));

export default function App() {
  return (
    <Router>
      <div className={css.container}>
        <Nav />
        <div className={css.pageContent}>
          <Suspense fallback={<Loading />}>
            <Switch>
              <R path="/weddingphotos">
                <WeddingPhotos />
              </R>
              <R path="/wedding/tag-manager">
                <WeddingTagManager />
              </R>
              <R path="/wedding">
                <WeddingPhotos />
              </R>
              <R path="/wedding-permission">
                <WeddingPhotosGrantPermission />
              </R>
              <R path="/pll">
                <PermuteLastLayerPage />
              </R>
              <R path="/oll">
                <OrientLastLayer />
              </R>
              <R path="/sessiondetails">
                <CubeTimerSessionDetails />
              </R>
              <R path="/cubetimer">
                <CubeTimer />
              </R>
              <R path="/cubesessionmanager">
                <CubeSessionManager />
              </R>
              <R path="/bookmarks">
                <Bookmarks />
              </R>
              <R path="/countdowns">
                <Countdowns />
              </R>
              <R path="/location">
                <Location />
              </R>
              {/* <R path="/pokemon/evhelper">
                            <PokemonEVHelper />
                        </R> */}
              <R path="/pokemon/flashcards">
                <PokemonFlashCards />
              </R>
              <R path="/pokemon/cramomatic">
                <PokemonCramomatic />
              </R>
              <R path="/dnd/druidspellbook">
                <DnDSpellBook casterClass="druid" key="druid" />
              </R>
              <R path="/dnd/paladinspellbook">
                <DnDSpellBook casterClass="paladin" key="paladin" />
              </R>
              <R path="/dnd/wizardspellbook">
                <DnDSpellBook casterClass="wizard" key="wizard" />
              </R>
              <R path="/dione">
                <Todos />
              </R>
              <R path={['/boxclicker/replay/:replayId', '/boxclicker/replay']}>
                <BoxClickerReplayPlayer />
              </R>
              <R exact path="/boxclicker">
                <BoxClicker />
              </R>
              <R path="/test">
                <Test />
              </R>
              <R path="/admin">
                <Admin />
              </R>
              <R path="/csgoaim">
                <AimTimeHelper />
              </R>
              <R path={['/markdown-editor/:documentId', '/markdown-editor']}>
                <MarkdownEditor />
              </R>
              <R path={['/notes/:documentId', '/notes']}>
                <MarkdownEditor notesOnly />
              </R>
              <R path="/view/:uri">
                <MarkdownViewer />
              </R>
              <R path="/confetti">
                <ConfettiStandAlone />
              </R>
              <R path="/confetti-maker">
                <ConfettiMaker />
              </R>
              <R path="/numbertyper1">
                <NumberTyper1 />
              </R>
              <R path="/numbertyper">
                <NumberTyper />
              </R>
              <R path="/alphabet">
                <TypeTheAlphabet />
              </R>
              <R path="/mastermind">
                <Mastermind />
              </R>
              <R path="/numberdle">
                <Numberdle />
              </R>
              <R path="/texttospeech">
                <TextToSpeech />
              </R>
              <R path="/timers">
                <Timers />
              </R>
              <R path="/misc">
                <Misc />
              </R>
              <R path="/">
                <Home />
              </R>
            </Switch>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}
