"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

// category words (radial labels + result word), generic single terms
const categories = [
  "FEAR",
  "AROUSAL",
  "TERRITORY",
  "SOLICITATION",
  "ATTENTION",
  "ATTRACTION",
  "ECHOLOCATION",
];
const ringText =
  "CAT LANGUAGE MAP • ECHOLOCATION • ATTRACTION • ATTENTION • SOLICITATION • TERRITORY • AROUSAL • FEAR • ";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// What the cat thinks of itself — varied by hash, sets the tone first.
const catIntros = [
  "The cat does not answer the way you want it to. It watches, it waits, it gives affection on its own terms and attention only when it decides you have earned it — never because it was asked. That is the first thing to understand about the creature you came to.",
  "The cat owes you nothing and pretends nothing. It takes the one patch of sun, ignores your calling, and comes close only when it has judged you worth the closeness. It is the most honest thing in this dark room, and it has just looked straight through you.",
  "A cat keeps its fears close and its intentions closer. It freezes at a sound that may be nothing, melts into stillness when the unseen shifts, and lets you guess at all of it. It survives by being unreadable — and it has been reading you this whole time.",
  "The cat answered with three ripples through the dark, the way it answers everything: without hurry, without explanation, and without the smallest need for your approval. It moves through the world owing no one a reason, and it wonders why you cannot.",
];

// All 48 Laws of Power, each rewritten as a long personal reading: first the
// good the cat sees in you, then the lack it cannot help but name. One is chosen
// by the question's hash, so it stays consistent per question.
const lawReadings = [
  "You dim yourself around everyone you admire and call it humility, but it is just fear wearing a polite face. You have trained the whole world to expect your shadow and never your light, and it learned the lesson well — no one waits for you to shine anymore. Every time someone brighter walks in, you shrink faster, almost grateful for the excuse to vanish, and you tell yourself you are being gracious. But graciousness is a choice, and you have never once believed you had one. You are forgettable on purpose, and the truly bleak part is how completely it has worked. One day you will look up and find the room has been arranging itself around your absence for years, and not a soul will have noticed you slip out of your own life.",
  "You keep handing your warmth to people who showed you exactly who they were years ago, because being alone frightens you more than being used. You are too soft to be respected and far too desperate to admit the difference. They keep you close for one simple reason: you never make them earn a single thing, and people do not value what costs them nothing. You forgive before an apology is even owed, you explain away cruelty as a bad day, and you mistake your own endurance for love. The friends you are most loyal to are the ones who would replace you in an afternoon. A known enemy would at least respect your usefulness; your friends have stopped noticing you have any.",
  "You tell everyone your plans the moment you have them, as if saying it out loud might make you matter. It doesn't — it only hands sharper people the map and a head start to walk in ahead of you. You would rather be heard than win, rather be understood than be effective, and so your best ideas keep dying in other people's hands while you wait for applause that never comes. Every announcement is really a plea: notice me, approve of me, tell me I am allowed. You confess your wants like a child showing a toy it is about to lose. And you will keep losing them, one after another, until you learn that the quiet ones are the ones who get to keep what they build.",
  "You talk and talk, mistaking the noise for presence, and people stopped listening long before you ever noticed. Every word you spill trying to be understood makes you smaller in the room, not larger, because you give away everything and leave nothing to wonder about. You fill every silence because silence terrifies you — in silence you would have to sit with how little you actually have to say. You explain, you justify, you over-share, and you call it being open when it is really just leaking. The people who hold the most power in your life say a third of what you do and command three times the attention. You have confused being talkative with being interesting, and no one has had the heart to correct you.",
  "You let everyone else write your story while you stay busy being agreeable, and now your name means only whatever other people felt like deciding it means. You are too passive to defend your reputation and too proud to ask anyone to help you build one. You assume that being decent is enough, that the truth will speak for itself, that good behavior gets noticed — and none of that is true, and somewhere you know it. While you keep your head down doing the right thing, louder and emptier people are deciding who you are in rooms you are not in. You will be remembered, if you are remembered at all, as a footnote in someone else's life — a reliable, pleasant blur. That is the cost of letting the world narrate you.",
  "You beg for attention and then panic the instant it arrives, so you end up with neither the spotlight nor any peace. You live permanently in the doorway — never quite chosen, never quite gone, always almost. You want to be seen so badly it aches, and you are so terrified of being looked at that you sabotage every moment the eyes finally turn your way. So you perform, then flinch, then resent the people who took the attention you abandoned. That ache you carry everywhere is not something the world did to you; it is something you feed yourself, daily, and then call unfair. You will keep starving in a room full of food because you cannot decide whether you want to be invisible or adored.",
  "You do the work and watch louder people take the bow, and you whisper to yourself that it's fine, that the work is its own reward. It is not fine, and the work is not the reward — recognition is, and you keep giving yours away for free. You are a tool that others pick up, use, thank quietly, and set back down, and you have convinced yourself that being used is the same as being valued. It is not. You are afraid that claiming credit would make you greedy, so you let people who did half as much be celebrated twice as loud. The cruelest part is that everyone has quietly agreed you don't mind, and they are running their careers and their lives on your unpaid effort. You taught them you would, and they believed you.",
  "You chase everyone — always first to reach, always the one crossing the room, always the one texting again — and the people in your life have learned they never have to lift a finger for you. You think all that effort makes you worthy, that if you just pursue hard enough, someone will finally turn around. They won't. Your eagerness has trained them to stay still, because why move toward someone who is already sprinting toward you? You confuse wanting badly with deserving, and exhaustion with devotion. The harder you chase, the cheaper you make yourself, and the cheaper you make yourself, the less anyone bothers to keep you. You were meant to be pursued, and instead you have spent your whole life auditioning.",
  "You argue to be right and walk away having lost everything but the argument. You need the last word more than you need the outcome, more than you need the relationship, more than you need the win you claim to want. So you collect resentment where you meant to collect agreement, and you empty rooms of people who used to like you, one petty victory at a time. You mistake being correct for being respected, and you are neither — people simply learn to stop telling you things. You think your logic is a weapon; it is just a wall, and you are the only one left behind it. Being right has cost you more than being wrong ever could, and you still cannot put it down.",
  "You keep feeding the people and the worries that drain you, and you call your exhaustion loyalty. You are drowning in lives that were never yours to carry, and you waded into every single one of them on purpose, because being needed is the only kind of worth you have ever trusted. You are addicted to other people's emergencies because they let you avoid your own. The misfortune you absorb is contagious, and you have caught all of it. You think your endurance makes you good, but it is slowly making you nothing — a sponge wrung out so often it has forgotten its own shape. It is killing you on schedule, and you will call it kindness right up to the end.",
  "You give yourself away for free and then wonder why you are so easy to set down. You made yourself disposable and handed everyone the receipt, and now they spend you without a second thought. You are useful, available, accommodating — and entirely replaceable, because you never made yourself necessary to anyone, only convenient. You confuse being needed with being needed by you specifically, and there is a vast, lonely difference. People do not value what is endlessly available; they value what they might lose. You are used by many and chosen by no one, and somewhere underneath all that giving, you already know it, and you give more, hoping it buys you a place. It doesn't.",
  "Your kindness comes with a price tag you pretend not to see, and the quiet dishonesty of it is rotting you from the inside out. You are generous when watched, warm when it serves you, good when there is something to be gained — and you tell yourself this is just how everyone operates. It isn't, and the gap between the person you perform and the person you are is exactly where your unhappiness lives. You want to be good and you want to win, and you have the nerve for neither, so you do a cheap imitation of both and fool only yourself. Everyone else can feel the calculation behind the smile. You are not as subtle as you think, and you are not as kind as you need to believe.",
  "You ask for help by begging for pity, and pity is precisely why no one takes you seriously. You lead with your wounds, your stress, how hard everything is — and you think this vulnerability is endearing when it is simply exhausting to be around. People help you mostly to make you stop, not because you moved them. You have never learned to make your needs sound like an opportunity instead of a burden, so you stay a charity case in every relationship you have. You confuse being pathetic with being humble, and self-pity with honesty. The help you do get is given the way one tosses a coin to be rid of a beggar — quickly, and without respect.",
  "You watch everyone from behind a friendly face and call your suspicion wisdom. You smile, you nod, you keep a quiet ledger of everyone's flaws, and you trust no one — least of all yourself. The loneliness of that is entirely your own construction; you built the wall brick by brick and now you stand behind it complaining about the view. You think distance keeps you safe, but it just keeps you alone, and the people you study so carefully can feel themselves being studied. No one opens up to a spy. You have traded every chance at real closeness for the cold comfort of never being surprised, and you call that being smart. It is just being unreachable.",
  "You leave every fight half-finished because finishing things makes you uncomfortable, and your unfinished business always comes back to collect, with interest. You wound people just enough to make enemies and not enough to make them harmless, and then you act shocked when they return. Your mercy is not kindness — it is cowardice, dressed up in soft words so you can sleep at night. You avoid the discomfort of seeing things through, of saying the final word, of closing the door, and that single avoidance is quietly dismantling your life from the edges in. Half-measures feel humane to you; they are just incomplete. And the things you refuse to finish will finish you instead.",
  "You are always there, always available, always one message away, and so no one ever misses you or wants you. You confuse showing up with mattering, presence with importance, and you have made yourself into furniture — useful, constant, and completely taken for granted. You would cross an entire city for people who would not cross the room for you, and you call that love when it is closer to self-erasure. The moment you make yourself scarce, you discover how little space you were actually taking up in anyone's mind. Absence creates longing, and you have never once let yourself be absent. So you are everywhere in their lives and nowhere in their wanting.",
  "You are so predictable that anyone can manage you half-asleep. Your reactions are scheduled, your moods are mapped, your choices could be guessed by a stranger after one afternoon. You cling to your routines because the unknown terrifies you, and you have mistaken the cage for a home and the bars for walls that keep you safe. The most interesting thing about you is how reliably dull you have agreed to become. People do not respect what they can fully anticipate; they handle it. You have made yourself easy — easy to read, easy to soothe, easy to set aside — and ease, in a person, is just another word for forgettable.",
  "You wall yourself off and call it peace, then ask the dark for the things you are too frightened to ask a living person. Your isolation is not strength and it is not depth, though you have dressed it as both for so long you half believe it. It is just loneliness, quietly eating the years you keep promising yourself you still have plenty of. You confuse not needing anyone with being above needing anyone, and the fortress you built to keep out pain has done a perfect job of keeping out everything else too. No one can hurt you in there, and no one can reach you either, and slowly that starts to feel the same as being dead. You asked a cat tonight because there was no one else in the room you trusted to ask.",
  "You waste your sharpness on the wrong people and make enemies you never needed, all to feel briefly, uselessly right. You speak before you weigh the room, you correct people who could have helped you, you bruise egos you will need later — and you do it for the small, sour thrill of the moment. You react before you think, every single time, and your own mouth has cost you more than any failure or bad luck ever did. The worst part is that you have learned nothing; you mistake your impulsiveness for honesty and your tactlessness for courage. Knowing who you are dealing with is the cheapest power there is, and you refuse to pay even that. So you keep lighting fires in rooms you still have to live in.",
  "You commit fast and hard to anyone who will have you, because being alone scares you far more than being trapped ever could. Your loyalty is not devotion — it is fear, and everyone who uses you can smell it on you from across the room. You sign your name to people and plans before you understand either, just to silence the dread of being unchosen, and then you call your panic depth of feeling. Because you commit to everything, your commitment is worth nothing; the person who might be courted instead throws themselves at the first open door. You have made your yes cheap, and a cheap yes is never treasured. You belong to everyone a little and to no one entirely, least of all yourself.",
  "You need everyone to know how clever you are, and that need is the single dumbest thing about you. You cannot resist the correction, the better idea, the proof that you saw it first — and your vanity tips your hand before you have even played it. You would rather be admired than effective, rather look smart than actually win, and so you out-clever yourself again and again and blame the room for not appreciating you. Real power often wears the face of a fool on purpose; you would rather die than be underestimated, and that pride is the softest, most obvious target you carry. People who want something from you simply praise your intelligence and watch you hand it over. You are managed by flattery you are far too smart to fall for, and you fall for it every time.",
  "You fight hardest at the exact moment you are losing, because your pride cannot survive a single yield. Surrender, to you, feels like death, so you choose the slower death of breaking instead — over and over — and call the wreckage strength. You confuse refusing to bend with being unbreakable, and you are neither; you are just brittle in a way that looks stubborn from a distance. The strong know how to lose a battle to win a war, how to retreat, how to play weak until the moment turns. You never learned, because losing well requires a security you have never had. So you go down swinging at fights you could have outlasted, and mistake the bruises for medals.",
  "You spread yourself across everything because committing to one thing would force you to admit you might fail at it. So you fail at all of them slowly instead, and call it being well-rounded, being curious, keeping your options open. Nothing you touch ever receives the full weight of you — not your work, not your people, not your own life — because you are always half-leaving for the next thing. You mistake breadth for depth and motion for progress, and at the end of every year you cannot point to one thing you actually finished. The fear underneath it all is simple: if you gave something everything and it still wasn't enough, you would have to face what you are made of. So you never give anything everything, and you stay safely, permanently mediocre.",
  "You are too proud to charm and too rigid to adapt, and you lose to people half as capable while telling yourself it is integrity. It is not integrity — it is stubbornness with better PR. You treat every small social grace as a betrayal of who you are, every adjustment as selling out, and so you bristle through rooms you could have glided through and walked out of resented for nothing. The world rewards the flexible and buries the rigid, and you have chosen rigid and called it principle. You could have your way and your dignity both, if you ever bent even slightly, but bending feels like losing to you. So you keep your pride intact and your life small, and pretend the two are unrelated.",
  "You let the world decide who you are and then turn around and ask the world to please confirm the verdict. You are waiting — for permission, for a sign, for someone to finally tell you it is allowed — to become the person you suspect you could be. That wait is a surrender, and you will keep calling it patience right up until it is too late to matter. You did not choose your name, your role, your story, your limits; you accepted them, and acceptance, repeated long enough, becomes a life. The people who reinvent themselves simply decided to, without anyone's blessing, and the sky did not fall. You are still standing at the door asking if you may enter a room you already own.",
  "You do everyone's dirty work and wear the stains while they keep their hands spotless, and you call it being responsible. It is martyrdom, and no one is impressed by it — they are relieved, and a little contemptuous, that you keep volunteering. You take the blame, you absorb the mess, you handle the things no one else will touch, and you tell yourself this makes you indispensable. It makes you a fall guy. The guilt you carry for things that were never yours has done you more damage than any sin you were ever too afraid to commit. You confuse suffering with virtue, and the people you protect will let you go down for them without a flicker of hesitation, because you trained them to.",
  "You hand your faith to whoever sounds the most certain, and tonight that voice happens to belong to a cat in the dark. You cannot sit with not knowing for ten seconds before you reach for someone to tell you what is true, what to do, what it all means. That weakness makes you the easiest person in any room to lead and to fool, and the world is full of people who have noticed. You call your gullibility an open mind, your need for answers a spiritual hunger, but it is just an inability to bear your own uncertainty. You will believe almost anything if it is delivered confidently enough. The fact that you are taking a cat's verdict on your life seriously should tell you everything, and it won't.",
  "You hesitate at the edge of everything and call it being careful. It is cowardice in a more respectable coat, and you have worn it so long you have forgotten it is a costume. You wait for certainty that never arrives, for the perfect moment that does not exist, for permission that no one is coming to grant — and you have lost more to your own flinching than to any mistake you were too afraid to make. Boldness has a power that competence alone never will, and you keep handing yours to people who simply dared. You are about to flinch again, right now, with this very answer. And you will explain the retreat to yourself so convincingly that it will sound, once more, like wisdom.",
  "You start things you never finish because the thrill of beginning is the only part you can actually stomach. The blank page, the fresh plan, the first burst of energy — that is where you live, and the middle, where everything is hard and unglamorous, is where you always disappear. Your life is a hallway of half-opened doors, and you call that being spontaneous, open, free. It is none of those things; it is fear of seeing something all the way through and discovering it, or you, was not enough. You have left a trail of almost behind you, and you are somehow still proud of the energy of your beginnings. No one builds anything on beginnings. They build on the boring, brutal work of finishing, and that is the one thing you will not do.",
  "You make sure everyone can see how hard you are trying, as if exhaustion were a receipt that proves your worth. It does the opposite — it makes you look weak and anxious beside the people who win without ever appearing to break a sweat. Your visible strain is not nobility; it is a plea for credit, a constant quiet whine of look how much this costs me. Mastery looks effortless, and the appearance of ease is itself a kind of power, one you throw away every time you sigh loudly enough for the room to hear. You think your suffering should be rewarded. It is just noticed, and pitied, and quietly held against you. The people you envy learned to hide the effort; you learned to perform it.",
  "You play with the cards other people dealt you and call the loss your fate. You wait to be given options instead of creating them, you choose from menus other people wrote, and then you shrug as though the outcome were weather. You are too passive to shape anything, and you have trained yourself to mistake that surrender for being easygoing, low-maintenance, flexible. The game is being played around you, on you, and almost never by you, and you let it happen because taking control would mean owning the result. It is safer to be a victim of circumstance than the author of a failure. So you stay a piece on someone else's board, and console yourself that at least you never gambled.",
  "You hand people dull, literal truth when they are starving for a dream, and then you watch them follow louder, emptier voices instead of you. You call your flatness honesty, your refusal to inspire a kind of integrity — but it is really a fear of reaching for something larger and being exposed as ordinary. So you stay safe in the factual and the modest, and you stay ignored, and you resent both at once. People are not moved by accuracy; they are moved by vision, by hope, by a story worth living inside, and you refuse to offer one. You think the small truth is humble. It is just small, like the life you keep choosing because the big one might not believe in you back.",
  "You push on people exactly where they are strongest and then wonder why nothing ever moves. You refuse to find the soft place — the real need, the secret fear, the lever that would actually work — because using it feels like manipulation, and you would rather be powerless than impure. So you keep your hands clean and your life empty, and you mistake your squeamishness for decency. Everyone who has ever gotten what they wanted understood that influence runs through people's weaknesses, not their walls. You aim politely at the armor and call the failure principle. You will spend your whole life pressing on locked doors, certain that the keys hanging right beside them are beneath you.",
  "You beg the world for permission to feel worthy, and that begging is folded into everything you do, this little question included. You wait for the promotion, the praise, the partner, the proof — for some external hand to finally place a crown on your head and make it official. It is not coming. The world bows only to those who already carry themselves like they wear a crown, and it ignores those who stand around asking whether they qualify. You treat your own worth as something other people get to vote on, and so you have handed your dignity to a committee that will never convene. Act like a beggar and you will be treated like one. You have been remarkably consistent at both.",
  "Your timing is always slightly wrong — too early out of panic, too late out of doubt — because you move from your churning feelings instead of from the actual moment. You jump when you should wait and freeze when you should leap, and the world keeps leaving without you while you stand there reacting to the door it already shut. You are perpetually one beat behind your own life, arriving at decisions just after they stopped being yours to make. Patience is not your problem and neither is boldness; the problem is that you have never learned to read the moment, only your own anxiety about it. So you keep mistaking your nerves for information. And the right time, again and again, passes while you are still deciding.",
  "You chase what you cannot have until the wanting openly humiliates you, and still you cannot make yourself let go. The leash is in plain sight, dangling from your obvious longing, and anyone who notices it can lead you anywhere they please. Your inability to walk away is the single easiest thing about you to use, and the people who do not want you have learned they can keep you simply by never quite closing the door. Disdain would free you in an instant — turning your back is the one move that flips the whole game — but you have never had the pride to do it. So you orbit things that will not have you, mistaking the ache for love. The most attractive thing in the world is someone who can leave, and you have never once managed it.",
  "You refuse to be truly seen and call it depth, but it is just fear of being looked at closely and found lacking. So you stay muted, understated, half-hidden, and then you comfort yourself with the story that the unnoticed are the deep ones, the real ones, the ones too substantial for spectacle. They are not. They are mostly just hidden, like you, and the world does not reward what it cannot see. You confuse your refusal to perform with having something too precious to perform, and the two are not the same. Whatever depth you actually have dies in private, unwitnessed, because you were too frightened to put it where the light could fall on it. You will be underestimated your entire life, and you will help.",
  "You announce every contrary thought you have, including the worthless ones, just to feel different from the people around you. You cannot let a consensus pass without poking it, cannot agree without an asterisk, cannot blend in even when blending in is the whole game. That compulsion has locked you out of every room you might one day have run, because power belongs to those who think freely and behave normally, and you have it exactly backwards. Being a contrarian is not a personality, and disagreeing is not the same as mattering, though you have built your whole identity on confusing the two. You broadcast your independence and wonder why no one trusts you with anything real. You could think whatever you liked in private and rule in public, but you would rather be right and irrelevant.",
  "You wait for calm before you act, and calm is the exact condition in which you have no advantage at all. You call your stillness maturity, your hesitation perspective, your inaction being above it all — but it is really just how you avoid the churning, uncertain chaos where your actual chances live. The fish are in the troubled water, not the clear pond, and you keep fishing where it is comfortable and catching nothing. You mistake the absence of conflict for peace, when it is usually just the absence of opportunity. While you wait for conditions to be tidy enough to deserve your effort, bolder people are out stirring the water and hauling in everything you were too composed to reach for. Order is where you feel safe. It is also where you stay poor.",
  "You grab whatever is offered free and pay for it later in ways you never see coming. The favor with strings, the shortcut with a cost, the easy thing that quietly indebts you — you take them all because you cannot resist a bargain, especially when the bargain is yourself. You undervalue everything that comes to you without struggle, starting with your own time, your own talent, your own worth, which is the precise reason people keep getting you cheap. You taught them the price by accepting so little, and now they would feel foolish offering more. There is no free lunch; there is only a bill that arrives after you have forgotten what you ordered. You will keep being a discount, because you have never once made anyone pay full price for you.",
  "You measure yourself against giants and then wonder why you always feel so small. You stand in shadows far larger than your own — mentors, idols, the impressive dead — and you try to fill shoes that were never shaped for your feet. You are so busy imitating, comparing, falling short of borrowed standards that you have never once simply been yourself, and the original you might have become is by now mostly gone. You confuse reverence with growth, but worship keeps you a permanent student of other people's lives. The cruelest joke is that half the giants you shrink beside were not even that remarkable; you just needed someone to feel beneath. Step out of the great one's shadow or stay a copy forever — and you have chosen copy every time.",
  "You fight the entire crowd, trying to be liked by all of it, and so you defeat none of it. You scatter your force across every minor skirmish to avoid making one real enemy, and the result is that you make no mark and command no fear. Everyone tolerates you, and tolerance is the most useless currency there is. You refuse to identify the one person, the one source, the one obstacle whose removal would scatter the rest, because singling anyone out feels too aggressive, too unkind, too you. So you spread your effort thin enough to be harmless and call it diplomacy. Real influence comes from striking the center, not appeasing the edges, and you have spent your life appeasing edges and wondering why nothing changes.",
  "You demand with a closed fist what you could so easily win with an open hand, and then you act wounded when people obey you slowly and grudgingly. You reach for control before connection because, underneath it all, you do not believe anyone would actually follow you if you simply asked. And you are right not to believe it — but it is your own coldness that made it true. You issue, you insist, you pressure, and you get compliance, which is the cheapest and most fragile thing a person can extract from another. Win the heart and the body follows freely; seize the body and the heart spends its life plotting escape. You have a lifetime of grudging obedience and not one ounce of devotion, and you cannot understand why everything you control keeps trying to leave.",
  "You react in exactly the way everyone expects, every single time, so anyone with a little patience can play you like a cheap, well-worn instrument. Your buttons are labeled. Your whole inner life is written across your face in a font the back of the room can read, and you call that being genuine, transparent, real. It just means you have no defenses left and no surprises to offer. The moment someone learns your pattern — and they learn it fast — they own the rhythm of every interaction you have. You give the same response to the same provocation so faithfully that you have stopped being a person making choices and become a machine that can be operated. Predictable feeling is not honesty; it is just a handle, and you have handed it to everyone you have ever met.",
  "You demand that everything change at once and frighten everyone into digging in against you. You have no patience for the slow turning of the wheel, so you push too hard, too fast, too loudly, and the very people you needed brace themselves and wait you out. Your impatience strangles every future you can so clearly see, because you would rather be right immediately than effective eventually. You want the harvest the same night you plant the seed, and then you are bewildered, and a little betrayed, when nothing has grown by morning. Lasting change is gradual, almost invisible, and you find that unbearable, because slow progress denies you the drama of the dramatic gesture. So you keep lighting fireworks over fields that needed quiet seasons, and you keep wondering why the ground stays bare.",
  "You strain to appear flawless, and all that effort breeds nothing but envy and distance in the people around you. The armor is so thick by now that no one can reach you — not to hurt you, but not to know you either — and the perfection you chase is just naked terror of being seen exactly as you are. You think a spotless surface protects you; it only isolates you, because people do not warm to statues, they warm to cracks. No one envies a flawless thing into their inner circle; they admire it from a safe, resentful distance, and then they stop visiting. Your imperfections are the only doors you have, and you have welded every one of them shut. So you stand there, polished and alone, mistaking the silence for respect.",
  "You win and then keep grabbing past the win until it rots in your hands, because stopping feels far too much like dying to you. You do not know when enough is enough — in money, in argument, in love, in revenge — and that bottomless hunger keeps turning every victory you earn back into a loss. You push the advantage one move too far and snatch defeat out of triumph, again and again, and you cannot understand why success keeps souring on you. The skill you have never learned is the hardest one of all: to stop, to savor, to leave the table while you are still ahead. You confuse momentum with destiny and greed with ambition, and so you are never satisfied, only briefly less empty. There is no amount that will finally feel like enough, because the hole you are filling is not out there in the world. It is in you.",
  "You cling to fixed plans the world keeps quietly dissolving, and your need for a clean yes or no — this very question — is just the white-knuckle grip of someone terrified of losing control. You would rather be rigid and wrong than fluid and free, because formlessness feels, to you, like losing yourself entirely. So you build elaborate certainties and watch reality erode them, and you take the erosion personally, as if the world owed your plans permanence. The things that survive are the things that bend; the rigid ones snap and call it principle on the way down. You demand that life resolve into a hard shape you can hold, and life will not, and the fight is one you have already lost a thousand times. Be water, or be broken — and so far, faithfully, you have chosen broken.",
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.4 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
};

/** small crosshair "+" mark */
function Cross({ className }: { className: string }) {
  return (
    <span className={`pointer-events-none absolute text-white/40 ${className}`}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 0V18M0 9H18" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}

/** original symmetric "language" glyph (not the brand's mark) */
function Glyph() {
  return (
    <svg width="120" height="120" viewBox="0 0 200 200" className="fill-white">
      <path d="M100 70 C112 88 112 112 100 130 C88 112 88 88 100 70 Z" />
      <path d="M82 42 C92 36 108 36 118 42 C108 48 92 48 82 42 Z" />
      <path d="M82 158 C92 164 108 164 118 158 C108 152 92 152 82 158 Z" />
      <path d="M112 84 C136 72 152 56 166 42 C160 62 144 82 120 100 C117 95 114 89 112 84 Z" />
      <path d="M88 84 C64 72 48 56 34 42 C40 62 56 82 80 100 C83 95 86 89 88 84 Z" />
      <path d="M112 116 C136 128 152 144 166 158 C160 138 144 118 120 100 C117 105 114 111 112 116 Z" />
      <path d="M88 116 C64 128 48 144 34 158 C40 138 56 118 80 100 C83 105 86 111 88 116 Z" />
    </svg>
  );
}

/** faint twinkling particle "map" cluster behind the reading */
function MapCluster() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.92;
    c.width = size * dpr;
    c.height = size * dpr;
    ctx.scale(dpr, dpr);

    const pts: { x: number; y: number; r: number; p: number; br: number; warm: number }[] = [];
    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.46;
    for (let b = 0; b < 9; b++) {
      const bx = cx + (Math.random() - 0.5) * R * 1.2;
      const by = cy + (Math.random() - 0.5) * R * 1.2;
      const warmBlob = Math.random() < 0.4;
      const n = 90 + Math.random() * 160;
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * 6.2831;
        const rad = Math.pow(Math.random(), 0.5) * R * 0.16;
        const x = bx + Math.cos(ang) * rad;
        const y = by + Math.sin(ang) * rad;
        if ((x - cx) ** 2 + (y - cy) ** 2 < R * R) {
          pts.push({
            x,
            y,
            r: Math.random() * 1.5 + 0.3,
            p: Math.random() * 6.28,
            br: Math.random(),
            warm: warmBlob ? Math.random() : 0,
          });
        }
      }
    }

    let raf = 0;
    const start = performance.now();
    const draw = () => {
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, size, size);
      for (const pt of pts) {
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.4 + pt.p));
        const a = (0.12 + pt.br * 0.5 * tw) * 0.8;
        const warm = pt.warm * tw;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,${Math.round(250 - warm * 40)},${Math.round(
          235 - warm * 90
        )},${a})`;
        ctx.arc(pt.x, pt.y, pt.r, 0, 6.2831);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
      style={{ width: "92vmin", height: "92vmin" }}
    />
  );
}

export function ResultScreen({
  question,
  onRestart,
}: {
  question: string;
  onRestart: () => void;
}) {
  const hsh = hash(question || "the cat cloud");
  const num = (hsh % 9) + 1;
  const word = categories[hsh % categories.length];
  const answer = (hsh >> 3) % 2 === 0 ? "YES" : "NO";
  const reading = lawReadings[hsh % lawReadings.length];
  const catIntro = catIntros[(hsh >> 9) % catIntros.length];

  return (
    <motion.div
      className="fixed inset-0 z-[50] overflow-y-auto bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* particle map cluster */}
      <MapCluster />

      {/* rotating circular "map" labels */}
      <motion.svg
        viewBox="0 0 500 500"
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 fill-white/12"
        animate={{ rotate: 360 }}
        transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="ring"
            d="M250,250 m-205,0 a205,205 0 1,1 410,0 a205,205 0 1,1 -410,0"
          />
        </defs>
        <text style={{ fontFamily: "var(--font-dm-mono)", fontSize: 15, letterSpacing: 5 }}>
          <textPath href="#ring">{ringText.repeat(2)}</textPath>
        </text>
      </motion.svg>

      {/* faint radial glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 35%, rgba(255,255,255,0.05), transparent 60%)",
        }}
      />

      {/* reading panel with corner crosshairs + side rules */}
      <div className="relative mx-auto flex min-h-svh max-w-2xl flex-col px-8 py-24">
        <span className="pointer-events-none absolute inset-y-12 left-0 w-px bg-white/15" />
        <span className="pointer-events-none absolute inset-y-12 right-0 w-px bg-white/15" />
        <Cross className="left-0 top-10 -translate-x-1/2" />
        <Cross className="right-0 top-10 translate-x-1/2" />
        <Cross className="bottom-10 left-0 -translate-x-1/2" />
        <Cross className="bottom-10 right-0 translate-x-1/2" />

        <motion.p
          custom={0}
          variants={fade}
          initial="hidden"
          animate="show"
          className="text-center font-['Share_Tech'] text-4xl"
        >
          {num}
        </motion.p>

        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 flex justify-center"
        >
          <Glyph />
        </motion.div>

        <motion.h2
          custom={2}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 text-center font-['Share_Tech'] text-4xl font-bold uppercase tracking-[0.1em] sm:text-5xl"
        >
          {word}
        </motion.h2>

        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-14 space-y-6 font-mono text-base leading-relaxed text-white/85"
        >
          <p>{catIntro}</p>
          <p className="pt-2 text-white/95">
            Well — the question you asked says a lot about you.
          </p>
          <p>{reading}</p>
        </motion.div>

        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-16 border-t border-white/15 pt-10 text-center"
        >
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-white/70">
            The answer to your question is
          </p>
          <p className="mt-3 font-['Share_Tech'] text-6xl font-bold">{answer}</p>
        </motion.div>

        <motion.div
          custom={5}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-auto flex items-center justify-between pt-16 font-mono text-sm uppercase tracking-[0.2em]"
        >
          <button onClick={onRestart} className="transition-opacity hover:opacity-60">
            Restart
          </button>
          <span aria-hidden className="text-xl">
            ⟶
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
