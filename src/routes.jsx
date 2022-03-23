import React from 'react';
import { BrowserRouter as Router, Switch, Route as R } from 'react-router-dom';

import css from './styles.css';

import Nav from './components/nav';
import OrientLastLayer from './components/rubiks-cube/orient-last-layer';
import PermuteLastLayerPage from './components/rubiks-cube/permute-last-layer';
import CubeTimer from './components/rubiks-cube/timer';
import CubeTimerSessionDetails from './components/rubiks-cube/timer/session-details';
import CubeSessionManager from './components/rubiks-cube/session-manager';
import Bookmarks from './components/bookmarks';
import Countdowns from './components/countdowns';
import Home from './components/home';
import Todos from './components/todos';
import WeddingPhotos from './components/wedding-photos';
import WeddingTagManager from './components/wedding-photos/tag-manager';
import WeddingPhotosGrantPermission from './components/wedding-photos/grant-permission';
import Location from './components/location';
import PokemonFlashCards from './components/pokemon/flash-cards';
// import PokemonEVHelper from './components/pokemon/ev-helper';
import PokemonCramomatic from './components/pokemon/cramomatic';
import DnDSpellBook from './components/dungeons-and-dragons/spell-book';
import BoxClicker from './components/box-clicker';
import BoxClickerReplayPlayer from './components/box-clicker/replay';
import Test from './components/test';
import Admin from './components/admin';
import AimTimeHelper from './components/csgo/aim-time-helper';
import MarkdownEditor from './components/markdown-editor';
import MarkdownViewer from './components/markdown-viewer';
import ConfettiStandAlone from './components/confetti-stand-alone';
import NumberTyper1 from './components/number-typer';
import NumberTyper from './components/number-typer-2';
import TypeTheAlphabet from './components/type-the-alphabet';
import Mastermind from './components/mastermind';
import ConfettiMaker from './components/confetti-maker';
import TextToSpeech from './components/text-to-speech';
import Timers from './components/timers';
import Misc from './components/markdown-pages/misc';

export default function App() {
  return (
    <Router>
      <div className={css.container}>
        <Nav />
        <div className={css.pageContent}>
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
        </div>
      </div>
    </Router>
  );
}
