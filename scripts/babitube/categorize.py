"""Step 3: add `categories` to every link and post, using hashtags, channel, title and YouTube's category.

Usage: python categorize.py <enriched.json> <out.json>
"""
import collections
import json
import re
import sys

OWN_CHANNELS = {'dagmawi babi', 'dagmawi babi clips', 'dagmawibabi'}
OWN_TAGS = {'myyoutube', 'mypodcast', 'mypodcasts', 'dagmawibabipodcast', 'dagmawibabiuniverse', 'babiindustries'}

RULES = {
    'music': {
        'tags': 'songs song albums album music livesperformances liveperformances synth synths stromae lofi mezmur singles concert bboytomy',
        'channels': 'kingdom sound|zeritu kebede|meskerem getu|nobel ?music|lofi girl|.*vevo|.* - topic|thetkns|elder studios|david hilowitz|benn jordan|doctor mix|bona|gosquala sew|tihitna',
        'title': r'\bmezmur\b|መዝሙር|ዘማሪ|official (music |lyric )?video|\blyrics?\b|\balbum\b|\bworship\b|\blofi\b|\bsong\b|\bsynth|\bmusic\b|\bsinger\b',
        'youtube': {'Music'},
    },
    'gaming': {
        'tags': 'games game minecraft gamedev gamejams gmtk rainworld chess snakegame mindustry tinyglade dream xbox playstation nintendo',
        'channels': "from scratch|chris uehlinger|battery tea|trolligarch|ign|thegameawards|/noclip|game maker's toolkit|dream|blackthornprod|unreal engine|devolverdigital|sammyuri|sebastian lague|grian|mumbo jumbo",
        'title': r'\bminecraft\b|\bgame(s|play)?\b|\bgaming\b|\bspeedrun|\bchess\b|\bflappy\b|\bminesweeper\b|\bsnake\b',
        'youtube': {'Gaming'},
    },
    'faith': {
        'tags': 'spiritual sermons sermon thebibleproject bibleproject scripture meskeremgetu jedidiahtilahun tesfatech tesfa hope fikireskemekabr aastuecsf halakpodcast church bible gospel',
        'channels': 'bibleproject|halwot emmanuel|tesfa broadcasting|vlad savchuk|equip media|tim mackie|gospel in life|kingdom sound|prophet tilahun|redeemed zoomer|god conscious|stonebridge bible|aastu ecsf|meskerem getu|zeritu kebede|semay',
        'title': r'\bbible\b|\bgospel\b|\bjesus\b|\bchrist(ian|ianity)?\b|\bchurch\b|\bsermon\b|\bprayer\b|\bgod\b|መዝሙር|ዘማሪ|ወንጌል|ኢየሱስ|እግዚአብሔር',
    },
    'ai': {
        'tags': 'ai aiml openai gpt ml evals lamda andrejkarpathy jarvis figure blakelemoine',
        'channels': 'openai|andrej karpathy|ai engineer|ai in context|lucy ai|two minute papers|anthropic|deepmind',
        'title': r'\bA\.?I\.?\b|\bGPT|\bLLMs?\b|\bchatgpt\b|machine learning|neural net|\bagents?\b|\bAGI\b|\bdeep learning\b|\bopenai\b|\bclaude\b|\bgemini\b',
    },
    'programming': {
        'tags': 'programming coding python flutter svelte sveltekit nextjs bun betterauth vercel codingchallenges cs dld cpu tutorials guillermorauch',
        'channels': 'the primetime|robi|ras mic|hyperplexed|syntax|solo codes|theo - t3|the coding train|freecodecamp|fireship|ben eater|chilitomatonoodle|software guy|hoog|sebastian lague|flutter|vercel|ndc|andreas kling|primeagen|tsoding|computerphile',
        'title': r'\bprogramming\b|\bcoding\b|\bcoder\b|\bjavascript\b|\btypescript\b|\bpython\b|\brust\b|\bflutter\b|\bdeveloper|\bsoftware\b|\bopen source\b|\breact\b|\bsvelte|\blinux\b|\bgit(hub)?\b|\balgorithms?\b|\bcpu\b|\bcomputer science\b',
    },
    'tech': {
        'tags': 'tech apple google tesla microsoft hardware nothing wwdc appleevent mkbhd bostondynamics applewatch iphone14 notion meta nvidia tools samsung',
        'channels': 'apple|cnet|marques brownlee|linus tech tips|mrwhosetheboss|boston dynamics|nvidia|meta|microsoft|made by google|google|techኢት|tesla|the verge|bloomberg tech|mattkc',
        'title': r'\biphone\b|\bmacbook\b|\bpixel\b|\bandroid\b|\bkeynote\b|\brobot|\btesla\b|\bgadget|\bpc\b|\bgpu\b|\bvr\b|\bheadset\b',
    },
    'science': {
        'tags': 'veritasium physics kurzgesagt 3blue1brown quantumcomputing blackholes spacex starship jwst timecrystal math science space history lemmino',
        'channels': 'hacksmith|angethegreat|zack freedman|chromalock|tom scott|tyler bell|rendyr|cambridge university|spencer hilbert|suits2boots|damilee|marti group|freethink|nature video|coldfusion|veritasium|kurzgesagt|3blue1brown|real engineering|sabine hossenfelder|seeker|nasaspaceflight|primal space|mark rober|smarter every day|vsauce|ted-ed|lemmino|half as interesting|mathologer|numberphile',
        'title': r'\bscience\b|\bphysics\b|\bmath\b|\bquantum\b|\bblack holes?\b|\bspace\b|\bnasa\b|\bspacex\b|\bstarship\b|\bastronaut|\bmars\b|\buniverse\b|\bocean\b|\bbrain\b',
    },
    'podcasts': {
        'tags': 'podcasts podcast mypodcast mypodcasts dagmawibabipodcast lexfridman ledfridman halakpodcast',
        'channels': 'lex fridman|dwarkesh patel|gugut podcast|tucker carlson',
        'title': r'\bpodcast\b|\binterview\b|\bep(isode)?\.? ?\d+',
    },
    'film-tv': {
        'tags': 'movies movie trailer trailers series shows shortfilms stopmotion animation marvel documentary oppenheimer webseries houseofthedragon phase4 blackpanther2 dhmis saladfingers kids mrfreeman',
        'channels': "short of the week|warner bros|alan becker|don't hug me|meatcanyon|hbo max|corridor crew|marvel entertainment|mr\\. freeman|netflix|a24|socially inept",
        'title': r'\btrailer\b|\bteaser\b|\bshort film\b|\banimation\b|\bdocumentary\b|\bmovie\b|\bfilm\b',
        'youtube': {'Film & Animation'},
    },
    'events': {
        'tags': 'events event techevents dagmawibabismeetup myevents launchweek talks tedx acla',
        'channels': 'gdg addis|gdsc',
        'title': r'\bmeetup\b|\bconference\b|\blive ?stream\b|\bsummit\b|\bdevday\b|\bwwdc\b',
        'youtube': {'Travel & Events'},
    },
    'motivation': {
        'tags': 'princeea spokenwords jimrohn jordanpeterson personaldevelopment poems motivation dearclassof2020 thoughts neroxman nerioxman',
        'channels': 'prince ea|jordan b peterson|ted$|never give up|tedx',
        'title': r'\bmotivation|\bsuccess(ful)?\b|\bspoken word\b|\bhow to be\b|\bhabits?\b',
    },
    'comedy': {
        'tags': 'comedy lastweektonight funny memes',
        'channels': 'lastweektonight|ohmyjoke|snl|key & peele',
        'title': r'\bcomedy\b|\bfunny\b|\bparody\b|\bsatire\b',
        'youtube': {'Comedy'},
    },
    'news': {
        'tags': 'news breakingnews queenelizabeth2 celebrity',
        'channels': 'johnny harris|live action|piers morgan|nbc news|bbc news|time$|the wall street journal|bloomberg|vox$|fana television|cnn|vice',
        'title': r'\bbreaking\b|\bnews\b|\belection\b',
        'youtube': {'News & Politics'},
    },
    'education': {
        'tags': 'resources courses tutorial books recommendations',
        'channels': 'muyalogy|khan academy|crash course|freecodecamp',
        'title': r'\bhow to\b|\btutorial\b|\bcourse\b|\bexplained\b|\blearn\b|\bguide\b',
    },
    'vlogs': {
        'tags': 'vlogs vlog wholesome dailylife yotuber youtuber channels channel',
        'channels': 'gabe bult|mkbhd vlog',
        'title': r'\bvlog\b|\bday in\b',
    },
    'entertainment': {
        'tags': 'mrbeast jubilee surrounded random celebrity',
        'channels': 'mrbeast|beast philanthropy|jubilee|jartoon|club shay shay|justan oval|neo|sleepy ghost|dave dee|mark rober|dude perfect|mattcolbo',
        'title': r'challenge|\$\d',
    },
    'design': {
        'tags': 'thumbnails fonts affinity design',
        'channels': 'juxtopposed|hyperplexed|notii|gawx art|designweg|dotphic',
        'title': r'redesign|ui|ux|design',
    },
    'business': {
        'tags': 'crypto ton startups business entrepreneurship',
        'channels': 'y combinator|founders',
        'title': r'\bstartups?\b|\bbusiness\b|\bcompany\b|\bentrepreneur|\bcrypto|\bbitcoin\b|ስታርት',
    },
}

COMPILED = {
    name: {
        'tags': set(rule['tags'].split()),
        'channels': re.compile(rf"^(?:{rule['channels']})(?!\w)", re.I),
        'title': re.compile(rule['title'], re.I if name != 'ai' else 0),
        'youtube': rule.get('youtube', set()),
    }
    for name, rule in RULES.items()
}


# Videos the rules can't place because they have no useful title or a one-off channel.
OVERRIDES = {
    'XY9DtpHBiB4': ['faith'], 'yEe10qMxfLM': ['faith'], 'nbkbmy-MGmc': ['faith'], 'RUGcqX_9jWU': ['faith', 'education'],
    'hs8EGgoJpdQ': ['programming', 'events'], 'HVhT7MgSyUE': ['programming', 'events'], '_mL1uaOgGvc': ['programming'],
    '3ZTGwcHQfLY': ['science'], 'Vhf6n9_f9RA': ['science'], 'OC7sNfNuTNU': ['science'], 'RTOARC-yeMc': ['science', 'tech'],
    'YPx6-BIwZpI': ['entertainment'], 's9SgnEfFmMs': ['entertainment'], '8e5K6fMLB30': ['comedy'], 'MFR6SMV64h4': ['entertainment'],
    'sjdHj3P18B0': ['entertainment'], 'hh3JCjOHG_E': ['entertainment'], '7rd6HWqvaHQ': ['entertainment'], 'k3bkCTy9rLk': ['film-tv'],
    'O42Vz0488fs': ['music'], 'kOD9rMhn4f4': ['ai'], 'K7Q7FESRHJY': ['ai', 'tech'], 'r0AyzvfTRLo': ['tech'], 'F4LOf_eleAM': ['tech'],
    'TDLZKbhz2Y4': ['ai', 'business'], 'YJQSuUZdcV4': ['news'], 'UnmN0DpFU6s': ['news'], 'fe1usI58XuU': ['news'], 'hJ-rRXWhElI': ['business'],
    'FCEl2eMiYPg': ['motivation'], 'd7YfFd1gYAE': ['film-tv'], 'BioaCADh5uw': ['vlogs'], 'CrWaCxNPr3k': ['vlogs'], 'YwmJTP5X1c0': ['education'],
}


# Uploaders often leave these at a default, so they only count when nothing more specific matched.
BROAD_YOUTUBE_CATEGORIES = {
    'Science & Technology': 'tech',
    'Education': 'education',
    'Howto & Style': 'education',
    'Entertainment': 'entertainment',
    'People & Blogs': 'vlogs',
}


def categorize(link, post):
    yt = link.get('youtube') or {}
    if link.get('videoId') in OVERRIDES:
        return OVERRIDES[link['videoId']]
    tags = {t.lower() for t in post['tags']}
    channel = (yt.get('channelTitle') or '').strip()
    title = yt.get('title') or link.get('displayText') or ''
    # Unavailable videos have no title, so fall back to what the post said about them.
    if not title and len(post['youtubeLinks']) == 1:
        title = post['content'][:200]

    found = []
    for name, rule in COMPILED.items():
        if tags & rule['tags'] or (channel and rule['channels'].search(channel)) or (title and rule['title'].search(title)) or yt.get('category') in rule['youtube']:
            found.append(name)
    if not found and yt.get('category') in BROAD_YOUTUBE_CATEGORIES:
        found.append(BROAD_YOUTUBE_CATEGORIES[yt['category']])

    if channel.lower() in OWN_CHANNELS or tags & OWN_TAGS or link.get('isOwnChannel'):
        found.insert(0, 'my-channel')
    if 'communityshowcase' in tags:
        found.append('community')
    if link.get('isShort') or 'shorts' in tags or ((yt.get('durationSeconds') or 999) <= 60 and yt.get('source') == 'data-api-v3'):
        found.append('shorts')
    if link.get('isPlaylist'):
        found.append('playlists')
    return found or ['general']


def main(src, dst):
    sys.stdout.reconfigure(encoding='utf-8')
    with open(src, encoding='utf-8') as f:
        doc = json.load(f)
    counts = collections.Counter()
    for post in doc['posts']:
        merged = []
        for link in post['youtubeLinks']:
            link['categories'] = categorize(link, post)
            counts.update(link['categories'])
            merged.extend(link['categories'])
        post['categories'] = list(dict.fromkeys(merged))
    doc['meta']['categoryCounts'] = dict(counts.most_common())
    doc['meta']['exportLastPostAt'] = doc['channel']['lastPostAt']
    doc['meta']['exportLastPostUrl'] = doc['channel']['lastPostUrl']
    dates = [p['postedAtLocal'] for p in doc['posts']]
    doc['meta']['firstPostAt'], doc['meta']['lastPostAt'] = min(dates), max(dates)
    with open(dst, 'w', encoding='utf-8') as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
    print(counts.most_common())


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
