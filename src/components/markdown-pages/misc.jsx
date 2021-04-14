import React from 'react';

import MarkdownDisplay from '../markdown-display';

const content = `
### Pokemon Stuff

* [Type Effectiveness Flash Cards](/pokemon/flashcards)
* [Cram-o-matic Helper](/pokemon/cramomatic)

 Berry | Flavour | Confusion Stat
-- | -- | --
Figy | Spicy | Atk
Iapapa | Sour | Def
Wiki | Dry | SpA
Aguav | Bitter | SpD
Mago | Sweet | Spe

### Dungeons and Dragons Stuff

* [Druid Spellbook](/dnd/druidspellbook)
* [Paladin Spellbook](/dnd/paladinspellbook)
* [Wizard Spellbook](/dnd/wizardspellbook)

`;

export default function Misc() {
  return <MarkdownDisplay content={content} />;
}
