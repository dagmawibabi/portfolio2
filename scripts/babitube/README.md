# /babitube data pipeline

Turns a Telegram channel export into the dataset behind `/babitube`. Python 3 standard library only.

```bash
DATA=D:/Projects/VibeCoded/ytdata          # channel export
COMMENTS=C:/Users/1babi/Downloads/dbc      # discussion group export

python extract.py    $DATA/result.json          $DATA/step1_extracted.json
python enrich.py     $DATA/step1_extracted.json $DATA/step2_enriched.json $DATA/youtube_cache.json
python categorize.py $DATA/step2_enriched.json  ../../src/lib/assets/youtube_posts.json
python comments.py   $DATA/result.json $COMMENTS/result.json ../../src/lib/assets/youtube_posts.json ../../src/lib/assets/youtube_comments.json
python build_site.py ../../src/lib/assets/youtube_posts.json ../../static/babitube-data ../../src/lib/assets/youtube_comments.json
```

`src/lib/assets/youtube_posts.json` is the full dataset, and `src/lib/assets/youtube_comments.json` holds the comments on those posts, keyed by post id. `static/babitube-data/` is the slimmed copy the site loads.

## YouTube metadata

`enrich.py` uses whichever official source is available:

- **`YOUTUBE_API_KEY` set:** YouTube Data API v3 gives upload date, description, duration, views, likes, comments, tags, category and channel avatars. A full run costs under 200 quota units of the free 10,000 per day: videos are batched, but each linked channel is its own request, so the first run takes several minutes.
- **No key:** the public oEmbed endpoint gives title, channel and thumbnail only.

Results are cached, so re-running with a key upgrades existing entries. The UI picks up the extra fields automatically.
