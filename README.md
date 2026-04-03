# ScrapingAnt Web Scrape Action

Scrape any URL with rotating proxies, headless Chrome, and AI extraction. Returns HTML, Markdown, or structured AI-extracted data.

The first web scraping API available as a GitHub Marketplace action.

## Quick Start

```yaml
- name: Scrape a webpage
  uses: scrapingant/scrape-action@v1
  with:
    api-key: ${{ secrets.SCRAPINGANT_API_KEY }}
    url: 'https://example.com'
```

## Usage Modes

### 1. HTML Scraping

Get the full rendered HTML of any page.

```yaml
- name: Scrape HTML
  id: scrape
  uses: scrapingant/scrape-action@v1
  with:
    api-key: ${{ secrets.SCRAPINGANT_API_KEY }}
    url: 'https://example.com'
    output-type: 'html'
    browser: 'false'

- name: Use result
  run: echo "${{ steps.scrape.outputs.content }}" | head -20
```

### 2. Markdown (for LLM/AI pipelines)

Convert any page to clean Markdown, ready to feed into an LLM.

```yaml
- name: Get page as Markdown
  id: markdown
  uses: scrapingant/scrape-action@v1
  with:
    api-key: ${{ secrets.SCRAPINGANT_API_KEY }}
    url: 'https://example.com'
    output-type: 'markdown'

- name: Feed to AI
  run: echo "${{ steps.markdown.outputs.content }}"
```

### 3. AI Data Extraction

Extract structured JSON data from any page using AI.

```yaml
- name: Extract product data
  id: extract
  uses: scrapingant/scrape-action@v1
  with:
    api-key: ${{ secrets.SCRAPINGANT_API_KEY }}
    url: 'https://www.amazon.com/dp/B0EXAMPLE'
    output-type: 'extract'
    extract-properties: 'product title, price, rating, availability'

- name: Use extracted JSON
  run: echo "${{ steps.extract.outputs.content }}"
```

## Save Output to File

```yaml
- name: Scrape and save
  uses: scrapingant/scrape-action@v1
  with:
    api-key: ${{ secrets.SCRAPINGANT_API_KEY }}
    url: 'https://example.com'
    output-type: 'markdown'
    output-file: 'scraped-content.md'

- name: Commit scraped data
  run: |
    git add scraped-content.md
    git commit -m "Update scraped data"
    git push
```

## Real-World Use Cases

- **Competitor price monitoring** -- cron schedule scrapes product pages daily, saves to repo
- **Content change detection** -- scrape page, compare with previous version, alert on diff
- **AI-powered data pipeline** -- scrape, extract structured data, feed to LLM in next step
- **SEO monitoring** -- scrape your pages as Markdown, check for content issues
- **Uptime/render check** -- verify your deployed site renders correctly after deploy

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `api-key` | ScrapingAnt API key | Yes | |
| `url` | URL to scrape | Yes | |
| `output-type` | Response type: `html`, `markdown`, or `extract` | No | `html` |
| `extract-properties` | Comma-separated fields to extract (for `extract` mode) | No | |
| `browser` | Enable headless Chrome JS rendering | No | `true` |
| `proxy-type` | Proxy type: `datacenter` or `residential` | No | `datacenter` |
| `proxy-country` | Two-letter country code for geo-targeting (e.g. `us`, `uk`, `de`) | No | |
| `timeout` | Max request time in seconds (5-60) | No | `60` |
| `output-file` | File path to save output (e.g. `output.html`, `data.json`) | No | |

## Outputs

| Output | Description |
|--------|-------------|
| `content` | Scraped content (HTML, Markdown, or JSON depending on `output-type`) |
| `status-code` | HTTP status code from ScrapingAnt API |
| `url` | Final URL after redirects (for `markdown` output-type) |

## API Credits

- `browser: true` (default) costs **10 credits** per request
- `browser: false` costs **1 credit** per request
- Only successful responses are charged

Get a free API key with **10,000 credits/month** at [app.scrapingant.com/signup](https://app.scrapingant.com/signup).

## License

MIT
