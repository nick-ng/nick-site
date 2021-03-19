import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Controls = styled.table``;

const TextInput = styled.input`
  width: 20vw;
`;

const TextEditor = styled.textarea`
  width: 93%;
  height: 50vh;
  resize: none;
`;

const StyledReactMarkdown = styled(ReactMarkdown)`
  table {
    border-collapse: collapse;

    th,
    td {
      padding: 0.5em;
      border: 1px solid lightgrey;
    }

    tr:nth-child(odd) {
      td {
        background-color: white;
      }
    }

    tr:nth-child(even) {
      td {
        background-color: #f5f5f5;
      }
    }
  }
`;

export default function MarkdownEditor(props) {
  const { documentId } = useParams();
  const [name, setName] = useState('');
  const [content, setContent] = useState(`# <~April 2021 League>

  ## Info

  - Team Name:
  - Duration: 9 days
  - Loot Split: 1 share each. Gear used by characters is excluded from the split. Split includes unsold items.

## Roles

  | Player                   | Mark                                           | David                                    | Jac                                     | Nick                                |
  | ------------------------ | ---------------------------------------------- | ---------------------------------------- | --------------------------------------- | ----------------------------------- |
  | Loot Split               | 1 share                                        | 1 share                                  | 1 share                                 | 1 share                             |
  | Role                     | Carry                                          | Aura Support                             | Curse Support                           | ES Support                          |
  | Class                    | Shadow                                         | Scion                                    | Witch                                   | Templar                             |
  | Leveling                 | Storm Brand                                    | Lightning Trap                           | Freezing Pulse                          | Cremation, Armageddon Brand         |
  | Leveling 3-Links         | BBB, BBG                                       | BBG                                      | BGG, BBG                                | BBB, BBG                            |
  | Leveling 4-Link          | BBBB                                           | RRRB                                     | BBBG                                    | BBBR                                |
  | Other Leveling Stuff     | 2 x light. craft                               | Generosity                               | 2 x cold craft                          | 2 x fire craft                      |
  | End Game                 | Penance Brand                                  | 10+ Auras                                | 6 Hexes                                 | ES Support                          |
  | Respec Criteria          | Holy Conquest                                  | 4-Link                                   | 100+ Atlas Bonus                        | 6 Stalwart Commander                |
  | Points to Respec         | 16                                             | 26                                       | 31                                      | ~120(!)                             |
  | Regrets (~18 from story) | 0                                              | 8                                        | 13                                      | 100                                 |
  | Path of Building         | [Penance Brand](https://pastebin.com/kHpNSBHs) | [Auras](https://pastebin.com/xFxGNVEg)   | [Curses](https://pastebin.com/wf2dTcd8) | [ES](https://pastebin.com/uZCkVLcG) |
  | Leveling Tree            | [Storm Brand](http://poeurl.com/dcCJ)          | [Lightning Trap](http://poeurl.com/dcCL) | [Freeze Pulse](http://poeurl.com/dcCH)  | Totems                              |
  | Final Tree               | [Penance Brand](http://poeurl.com/dcCK)        | [Auras](http://poeurl.com/dcCN)          | [Curses](http://poeurl.com/dcCI)        | [ES]()                              |

  ## Notes

  - 0 Call: Light > Cold > Chaos
  - 1 Call: Cold > Light > Chaos
  - 2 Call: Cold > Chaos > Fire

  ## Links

  - [4-Person Story Route Act 1-5](https://github.com/nick-ng/poe-map-team/blob/main/story-route/4-player-part-1.md)
  - [Searches](https://github.com/nick-ng/poe-map-team/wiki/Searches)
  - [Mapping](https://github.com/nick-ng/poe-map-team/wiki/Mapping)
  - [Skill Gem Planner](https://old.reddit.com/r/pathofexile/comments/kxgtws/313_league_start_skill_gem_planner/)
  `);
  const [status, setStatus] = useState('private');
  const [publishAt, setPublishAt] = useState();
  const [uri, setUri] = useState();

  return (
    <Container>
      <div>
        <h2>Editor{documentId && ` - ${documentId}`}</h2>
        <Controls>
          <tbody>
            <tr>
              <td colSpan={2}>
                <button>Save</button>
              </td>
            </tr>
            <tr>
              <td>Name</td>
              <td>
                <TextInput
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Visibility</td>
              <td>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="published">Published</option>
                </select>
              </td>
            </tr>
            {status === 'published' && (
              <tr>
                <td>Publish Date</td>
                <td>
                  <input type="date" />
                </td>
              </tr>
            )}
            {status !== 'private' && (
              <tr>
                <td>URI</td>
                <td>
                  <TextInput
                    value={uri}
                    onChange={(e) => {
                      setUri(e.target.value);
                    }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </Controls>
        <TextEditor
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </div>
      <div>
        <h2>Preview</h2>
        <StyledReactMarkdown plugins={[gfm]}>{content}</StyledReactMarkdown>
      </div>
    </Container>
  );
}
