export interface SoundExample {
  french: string;
  english: string;
  pronunciation_hint: string;
  ipa?: string;
  syllables?: string[];
}

export interface MinimalPair {
  a: { french: string; english: string; ipa?: string };
  b: { french: string; english: string; ipa?: string };
}

export interface SoundCategory {
  id: string;
  title: string;
  subtitle: string;
  explanation: string;
  mouth_description: string;
  examples: SoundExample[];
  minimal_pairs: MinimalPair[];
  common_mistakes: string[];
  related_lesson_slug?: string;
}

export const soundCategories: SoundCategory[] = [
  {
    id: 'u-vs-ou',
    title: 'u vs ou',
    subtitle: 'The most common French vowel confusion',
    explanation:
      'French "u" (as in "tu") and "ou" (as in "vous") are two completely different vowel sounds. The "u" sound does not exist in English, which is why it trips up learners. Using the wrong one changes the meaning of the word entirely.',
    mouth_description:
      'For "u": round your lips tightly as if about to whistle, bring your tongue forward near your upper teeth, and try to say "ee". The sound sits at the front of your mouth. For "ou": relax your lips into a loose circle, pull your tongue back, and say "oo" as in "food". The difference is front versus back, tight versus loose.',
    examples: [
      { french: 'tu', english: 'you (informal)', pronunciation_hint: 'tü', ipa: 'ty', syllables: ['tu'] },
      { french: 'lune', english: 'moon', pronunciation_hint: 'lün', ipa: 'lyn', syllables: ['lune'] },
      { french: 'rue', english: 'street', pronunciation_hint: 'rü', ipa: 'ʁy', syllables: ['rue'] },
      { french: 'vous', english: 'you (formal/plural)', pronunciation_hint: 'voo', ipa: 'vu', syllables: ['vous'] },
      { french: 'jour', english: 'day', pronunciation_hint: 'zhoor', ipa: 'ʒuʁ', syllables: ['jour'] },
      { french: 'pour', english: 'for', pronunciation_hint: 'poor', ipa: 'puʁ', syllables: ['pour'] },
    ],
    minimal_pairs: [
      { a: { french: 'tu', english: 'you', ipa: 'ty' }, b: { french: 'tout', english: 'all / everything', ipa: 'tu' } },
      { a: { french: 'bu', english: 'drank (past)', ipa: 'by' }, b: { french: 'bout', english: 'end / tip', ipa: 'bu' } },
      { a: { french: 'nu', english: 'naked', ipa: 'ny' }, b: { french: 'nous', english: 'we', ipa: 'nu' } },
      { a: { french: 'vu', english: 'seen (past)', ipa: 'vy' }, b: { french: 'vous', english: 'you (formal)', ipa: 'vu' } },
      { a: { french: 'su', english: 'known (past)', ipa: 'sy' }, b: { french: 'sous', english: 'under', ipa: 'su' } },
    ],
    common_mistakes: [
      'Saying "tu" as "too" — the French "u" is tighter and more forward in the mouth than English "oo".',
      'Confusing "tu" and "tout" in writing or speech — they signal different grammar entirely.',
      'Relaxing the lips for "u" — they need to stay rounded and tight throughout the sound.',
    ],
    related_lesson_slug: 'french-alphabet-and-sounds',
  },

  {
    id: 'french-r',
    title: 'The French R',
    subtitle: 'Guttural, not rolled',
    explanation:
      'The French R is a uvular fricative produced at the back of the throat. It is not rolled like the Spanish R, and it is not the same as the American English R. It creates a soft friction near the uvula — the small flap of tissue at the back of your mouth.',
    mouth_description:
      'Open your mouth slightly. Pull the back of your tongue upward toward the soft palate (the back roof of your mouth). Breathe out and let the air create a gentle friction. It feels like a very soft gargle. Start by practicing "ah" then slowly narrow your throat until you feel that vibration. The sound should be effortless — not forced or raspy.',
    examples: [
      { french: 'rue', english: 'street', pronunciation_hint: 'rü', ipa: 'ʁy', syllables: ['rue'] },
      { french: 'rouge', english: 'red', pronunciation_hint: 'roozh', ipa: 'ʁuʒ', syllables: ['rouge'] },
      { french: 'merci', english: 'thank you', pronunciation_hint: 'mehr-see', ipa: 'mɛʁsi', syllables: ['mer', 'ci'] },
      { french: 'partir', english: 'to leave', pronunciation_hint: 'par-teer', ipa: 'paʁtiʁ', syllables: ['par', 'tir'] },
      { french: 'bonjour', english: 'hello', pronunciation_hint: 'bohn-zhoor', ipa: 'bɔ̃ʒuʁ', syllables: ['bon', 'jour'] },
      { french: 'regarder', english: 'to look / to watch', pronunciation_hint: 'ruh-gar-day', ipa: 'ʁəɡaʁde', syllables: ['re', 'gar', 'der'] },
    ],
    minimal_pairs: [
      { a: { french: 'rue', english: 'street', ipa: 'ʁy' }, b: { french: 'lue', english: 'read (past, f.)', ipa: 'ly' } },
      { a: { french: 'riz', english: 'rice', ipa: 'ʁi' }, b: { french: 'lit', english: 'bed', ipa: 'li' } },
      { a: { french: 'roue', english: 'wheel', ipa: 'ʁu' }, b: { french: 'loue', english: 'rents', ipa: 'lu' } },
      { a: { french: 'rare', english: 'rare', ipa: 'ʁaʁ' }, b: { french: 'lare', english: '(not a word — focus on the R)', ipa: '' } },
    ],
    common_mistakes: [
      'Using the American English R — the tongue moves too far forward.',
      'Using a rolled/trilled R as in Spanish — the French R does not trill at the front of the mouth.',
      'Making it too harsh or raspy — a good French R is soft and almost musical.',
      'Dropping the R entirely when it comes before a consonant, such as in "partir" or "merci".',
    ],
    related_lesson_slug: 'french-alphabet-and-sounds',
  },

  {
    id: 'e-acute-vs-e-grave',
    title: 'é vs è',
    subtitle: 'Closed and open E sounds',
    explanation:
      'French has two main "e" sounds: the closed é (as in "café") and the open è (as in "père"). The accent mark on each letter is a spelling guide telling you exactly how to pronounce it. Using the wrong one sounds unnatural to a native speaker.',
    mouth_description:
      'For é: smile slightly, keep your mouth fairly closed, and say "ay" — but do not glide at the end as in English. The sound is short and clean, like a quick "eh" with a smile. For è: drop your jaw a little more, relax your lips, and say "eh" as in the English word "bed". The key difference is jaw height: é has a higher jaw, è has a lower jaw.',
    examples: [
      { french: 'café', english: 'coffee', pronunciation_hint: 'kah-fay', ipa: 'kafe', syllables: ['ca', 'fé'] },
      { french: 'été', english: 'summer', pronunciation_hint: 'ay-tay', ipa: 'ete', syllables: ['é', 'té'] },
      { french: 'beauté', english: 'beauty', pronunciation_hint: 'boh-tay', ipa: 'bote', syllables: ['beau', 'té'] },
      { french: 'père', english: 'father', pronunciation_hint: 'pehr', ipa: 'pɛʁ', syllables: ['père'] },
      { french: 'mère', english: 'mother', pronunciation_hint: 'mehr', ipa: 'mɛʁ', syllables: ['mère'] },
      { french: 'après', english: 'after', pronunciation_hint: 'ah-preh', ipa: 'apʁɛ', syllables: ['a', 'près'] },
      { french: 'très', english: 'very', pronunciation_hint: 'treh', ipa: 'tʁɛ', syllables: ['très'] },
    ],
    minimal_pairs: [
      { a: { french: 'chanter', english: 'to sing', ipa: 'ʃɑ̃te' }, b: { french: 'chanté', english: 'sung (past part.)', ipa: 'ʃɑ̃te' } },
      { a: { french: 'parler', english: 'to speak', ipa: 'paʁle' }, b: { french: 'parlé', english: 'spoken (past part.)', ipa: 'paʁle' } },
      { a: { french: 'bébé', english: 'baby', ipa: 'bebe' }, b: { french: 'bête', english: 'beast / stupid', ipa: 'bɛt' } },
      { a: { french: 'fée', english: 'fairy', ipa: 'fe' }, b: { french: 'fait', english: 'fact / done', ipa: 'fɛ' } },
    ],
    common_mistakes: [
      'Pronouncing é with an English glide — say "ay" short and clean, not "ayee".',
      'Pronouncing the final unaccented "e" in words like "parle" or "mange" — it is almost silent.',
      'Mixing up the accent marks in writing, which can make your meaning unclear.',
    ],
    related_lesson_slug: 'french-alphabet-and-sounds',
  },

  {
    id: 'nasal-sounds',
    title: 'Nasal Sounds',
    subtitle: 'an, en, on, in, un',
    explanation:
      'French has four nasal vowel sounds. Unlike English nasal consonants (n, m), French nasals are vowels — the air flows through both the mouth and the nose at the same time. Critically, the nasal consonant that follows is not pronounced separately. You do not finish with an "n" sound — the whole vowel is nasal.',
    mouth_description:
      'Keep your mouth in the vowel position and let air flow through your nose simultaneously. Do not close your lips or press your tongue up to complete an "n". Try "bon": say "boh" and let air resonant through your nose — that humming sensation is the nasal vowel. Practice each with your hand under your nose: you should feel a slight breath of air when the nasal sound is correct.',
    examples: [
      { french: 'manger', english: 'to eat', pronunciation_hint: 'mahn-zhay', ipa: 'mɑ̃ʒe', syllables: ['man', 'ger'] },
      { french: 'enfant', english: 'child', pronunciation_hint: 'ahn-fahn', ipa: 'ɑ̃fɑ̃', syllables: ['en', 'fant'] },
      { french: 'bonjour', english: 'hello', pronunciation_hint: 'bohn-zhoor', ipa: 'bɔ̃ʒuʁ', syllables: ['bon', 'jour'] },
      { french: 'maison', english: 'house', pronunciation_hint: 'meh-zohn', ipa: 'mɛzɔ̃', syllables: ['mai', 'son'] },
      { french: 'vin', english: 'wine', pronunciation_hint: 'vahn', ipa: 'vɛ̃', syllables: ['vin'] },
      { french: 'demain', english: 'tomorrow', pronunciation_hint: 'duh-mahn', ipa: 'dəmɛ̃', syllables: ['de', 'main'] },
      { french: 'brun', english: 'brown (masculine)', pronunciation_hint: 'brahn', ipa: 'bʁɛ̃', syllables: ['brun'] },
      { french: 'lundi', english: 'Monday', pronunciation_hint: 'lahn-dee', ipa: 'lɛ̃di', syllables: ['lun', 'di'] },
    ],
    minimal_pairs: [
      { a: { french: 'beau', english: 'beautiful', ipa: 'bo' }, b: { french: 'bon', english: 'good', ipa: 'bɔ̃' } },
      { a: { french: 'fée', english: 'fairy', ipa: 'fe' }, b: { french: 'fin', english: 'end / fine', ipa: 'fɛ̃' } },
      { a: { french: 'ta', english: 'your (f.)', ipa: 'ta' }, b: { french: 'tant', english: 'so much', ipa: 'tɑ̃' } },
      { a: { french: 'beau', english: 'beautiful', ipa: 'bo' }, b: { french: 'bon', english: 'good', ipa: 'bɔ̃' } },
    ],
    common_mistakes: [
      'Adding a final "n" sound after the nasal vowel — "bon" sounds like "bohn", not "bonn".',
      'Not nasalizing enough — the vowel before n/m must be nasal, not the consonant itself.',
      'Confusing "an/en" (mahn/ahn) with "in" (ahn) — they use slightly different vowel positions.',
      'Pronouncing "un" as a separate sound from "in" — in modern Parisian French, these two have merged.',
    ],
  },

  {
    id: 'silent-letters',
    title: 'Silent Final Letters',
    subtitle: 'Most consonants at the end of a word are not pronounced',
    explanation:
      'In French, most consonants at the end of a word are completely silent. This is one of the biggest differences from English. The letters s, t, x, z, d, and p are almost always silent at the end of a word. A helpful memory tool: consonants CaReFuL (C, R, F, L) are usually pronounced. Everything else is typically silent.',
    mouth_description:
      'When you reach the final consonant of a word, simply stop. Do not let your mouth close for the consonant — end on the vowel that precedes it. In "chat" (cat), your mouth ends open on the "a" sound — you do not close on the "t". Practice shortening words mentally: see a final s, t, x, z, or p and mentally cross it out.',
    examples: [
      { french: 'Paris', english: 'Paris', pronunciation_hint: 'pah-ree', ipa: 'paʁi', syllables: ['Pa', 'ris'] },
      { french: 'vous', english: 'you (formal)', pronunciation_hint: 'voo', ipa: 'vu', syllables: ['vous'] },
      { french: 'chat', english: 'cat', pronunciation_hint: 'sha', ipa: 'ʃa', syllables: ['chat'] },
      { french: 'est', english: 'is', pronunciation_hint: 'eh', ipa: 'ɛ', syllables: ['est'] },
      { french: 'beaucoup', english: 'a lot', pronunciation_hint: 'boh-koo', ipa: 'boku', syllables: ['beau', 'coup'] },
      { french: 'trop', english: 'too much', pronunciation_hint: 'troh', ipa: 'tʁo', syllables: ['trop'] },
      { french: 'les', english: 'the (plural)', pronunciation_hint: 'lay', ipa: 'le', syllables: ['les'] },
      { french: 'grand', english: 'big / tall', pronunciation_hint: 'grahn', ipa: 'ɡʁɑ̃', syllables: ['grand'] },
    ],
    minimal_pairs: [
      { a: { french: 'les (silent s)', english: 'the (plural) — "lay"', ipa: 'le' }, b: { french: 'les amis (liaison)', english: 'the friends — "lay-zamee"', ipa: 'le‿z‿ami' } },
      { a: { french: 'chat', english: 'cat — "sha"', ipa: 'ʃa' }, b: { french: 'chasse', english: 'hunt — "shaas"', ipa: 'ʃas' } },
    ],
    common_mistakes: [
      'Pronouncing the final "s" in "Paris", "vous", or "les" — all three are silent.',
      'Pronouncing the final "t" in "est", "fait", or "chat" — all three are silent.',
      'Not knowing the CaReFuL rule — the final C in "avec" is pronounced, and the final R in "finir" is pronounced.',
      'Dropping the final R in -ir and -re infinitives — "finir" ends with a clear R sound.',
    ],
    related_lesson_slug: 'french-alphabet-and-sounds',
  },

  {
    id: 'liaison',
    title: 'Liaison',
    subtitle: 'When a silent consonant comes to life',
    explanation:
      'Liaison is the pronunciation of a normally-silent final consonant when the next word begins with a vowel or silent h. It links words together and gives spoken French its smooth, connected flow. Some liaisons are mandatory, some are optional, and some are completely forbidden.',
    mouth_description:
      'Treat a liaison like one long word. When you see "les amis", do not pause between the two words — glide directly from "lay" into "zamee", as if it were one word "layzamee". The s becomes a z sound before a vowel. Similarly, "vous avez" flows as "voozavay". Practice by covering the word boundary and treating the phrase as a single unit.',
    examples: [
      { french: 'les amis', english: 'the friends', pronunciation_hint: 'lay-zamee', ipa: 'le‿z‿ami', syllables: ['les', 'a', 'mis'] },
      { french: 'vous avez', english: 'you have', pronunciation_hint: 'voo-zavay', ipa: 'vu‿z‿ave', syllables: ['vous', 'a', 'vez'] },
      { french: 'un ami', english: 'a friend', pronunciation_hint: 'uhn-nami', ipa: 'ɛ̃‿n‿ami', syllables: ['un', 'a', 'mi'] },
      { french: 'ils ont', english: 'they have', pronunciation_hint: 'eel-zohn', ipa: 'il‿z‿ɔ̃', syllables: ['ils', 'ont'] },
      { french: 'nous avons', english: 'we have', pronunciation_hint: 'noo-zavohn', ipa: 'nu‿z‿avɔ̃', syllables: ['nous', 'a', 'vons'] },
      { french: 'mon ami', english: 'my friend', pronunciation_hint: 'mohn-nami', ipa: 'mɔ̃‿n‿ami', syllables: ['mon', 'a', 'mi'] },
    ],
    minimal_pairs: [
      { a: { french: 'les enfants (liaison)', english: 'the children — "lay-zahn-fahn"', ipa: 'le‿z‿ɑ̃fɑ̃' }, b: { french: 'les haricots (no liaison)', english: 'the green beans — "lay aricoh"', ipa: 'le aʁiko' } },
    ],
    common_mistakes: [
      'Making liaison before an aspirate h — "les haricots" is "lay aricoh", not "lay-zaricoh".',
      'Skipping required liaisons, especially after articles (les, des, ces) and pronouns (vous, nous, ils).',
      'Making optional liaisons sound forced — in casual speech, many optional liaisons are skipped.',
      'Forgetting that s and x become a /z/ sound, and t and d become a /t/ sound in liaison.',
    ],
  },

  {
    id: 'elision',
    title: 'Elision',
    subtitle: 'Dropping the final vowel before another vowel',
    explanation:
      'Elision is when the final vowel of a short function word (le, la, je, de, ne, que, ce, me, te, se) is dropped before a word beginning with a vowel or silent h. The dropped vowel is replaced with an apostrophe. Unlike liaison, elision is not optional — it is always required.',
    mouth_description:
      'Do not attempt to say both vowels. Drop the first vowel entirely and flow straight into the next word. "Je aime" never occurs in French — it is always "j\'aime", said as one syllable "zhehm". Think of elision as stitching two words together and removing the seam. Your voice moves from the consonant before the apostrophe directly to the vowel of the next word.',
    examples: [
      { french: "j'aime", english: 'I love', pronunciation_hint: 'zhehm', ipa: 'ʒɛm', syllables: ["j'", 'aime'] },
      { french: "l'ami", english: 'the friend', pronunciation_hint: 'lami', ipa: 'lami', syllables: ["l'", 'a', 'mi'] },
      { french: "c'est", english: 'it is / this is', pronunciation_hint: 'seh', ipa: 'sɛ', syllables: ["c'", 'est'] },
      { french: "n'est pas", english: 'is not', pronunciation_hint: 'neh-pa', ipa: 'nɛ pa', syllables: ["n'", 'est', 'pas'] },
      { french: "l'hôtel", english: 'the hotel', pronunciation_hint: 'loh-tel', ipa: 'lotɛl', syllables: ["l'", 'hô', 'tel'] },
      { french: "qu'il", english: 'that he', pronunciation_hint: 'keel', ipa: 'kil', syllables: ["qu'", 'il'] },
      { french: "m'a dit", english: 'told me', pronunciation_hint: 'ma-dee', ipa: 'ma di', syllables: ["m'", 'a', 'dit'] },
    ],
    minimal_pairs: [
      { a: { french: "le ami (incorrect)", english: 'Wrong — never said', ipa: 'lə ami' }, b: { french: "l'ami (correct)", english: 'the friend — always', ipa: 'lami' } },
      { a: { french: "je aime (incorrect)", english: 'Wrong — never written or said', ipa: 'ʒə ɛm' }, b: { french: "j'aime (correct)", english: 'I love — always', ipa: 'ʒɛm' } },
    ],
    common_mistakes: [
      'Saying "le ami" instead of "l\'ami" — elision is mandatory, not a stylistic choice.',
      'Forgetting elision with "ce" — "ce est" must become "c\'est".',
      'Applying elision before an aspirate h — "le hibou" stays as two words, not "l\'hibou".',
      'Forgetting elision with "que" in conjunctions — "parce que il" must be "parce qu\'il".',
    ],
  },

  {
    id: 'rhythm-intonation',
    title: 'Rhythm and Intonation',
    subtitle: 'French stress patterns and melody',
    explanation:
      'French rhythm is fundamentally different from English. In English, some syllables are stressed and others are reduced, creating a bouncy, uneven rhythm. In French, all syllables have roughly equal weight, with a slight stress on the final syllable of each word group or phrase. This gives French its smooth, even flow.',
    mouth_description:
      'Tap a steady beat and try to fit one syllable per beat — evenly spaced. Resist the English urge to stress some syllables and swallow others. For statements, let your voice drop on the final syllable of the sentence. For yes/no questions, let your voice rise on the final syllable. For questions with "est-ce que", your voice rises at the very end.',
    examples: [
      { french: 'bonjour', english: 'hello', pronunciation_hint: 'bohn-ZHOOR (stress on last syllable)', ipa: 'bɔ̃ʒuʁ', syllables: ['bon', 'jour'] },
      { french: 'Je parle français.', english: 'I speak French.', pronunciation_hint: 'zhuh-parl-frahn-SAY (even rhythm, stress on -SAY)', ipa: 'ʒə paʁl fʁɑ̃sɛ', syllables: ['Je', 'par', 'le', 'fran', 'çais'] },
      { french: 'Vous parlez français?', english: 'Do you speak French?', pronunciation_hint: 'voice rises on -SAY at end', ipa: 'vu paʁle fʁɑ̃sɛ', syllables: ['Vous', 'par', 'lez', 'fran', 'çais'] },
      { french: "C'est une belle journée.", english: "It's a beautiful day.", pronunciation_hint: 'voice falls at end: -NAY', ipa: 'sɛt yn bɛl ʒuʁne', syllables: ['C\'est', 'u', 'ne', 'bel', 'le', 'jour', 'née'] },
      { french: "Je m'appelle Marie.", english: 'My name is Marie.', pronunciation_hint: 'even beat: zhuh-ma-pell-ma-REE', ipa: 'ʒə mapɛl maʁi', syllables: ['Je', "m'ap", 'pelle', 'Ma', 'rie'] },
    ],
    minimal_pairs: [
      { a: { french: 'Tu viens? (rising)', english: 'Are you coming? — voice rises on -viens' }, b: { french: 'Tu viens. (falling)', english: "You're coming. — voice falls on -viens" } },
      { a: { french: "C'est bon? (rising)", english: "Is it good? — voice rises" }, b: { french: "C'est bon. (falling)", english: "It's good. — voice falls" } },
    ],
    common_mistakes: [
      'Stressing the first syllable of words — English puts stress early, French puts it at the end of a phrase.',
      'Reducing unstressed syllables as in English — every French syllable deserves roughly equal length.',
      'Forgetting to rise on yes/no questions — without the rising pitch, a question sounds like a statement.',
      'Over-emphasizing individual words — French stresses phrase groups, not individual word stress.',
    ],
  },
];
