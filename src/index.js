const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

const ENDPOINTS = {
  html: 'https://api.scrapingant.com/v2/general',
  markdown: 'https://api.scrapingant.com/v2/markdown',
  extract: 'https://api.scrapingant.com/v2/extract',
};

async function run() {
  const apiKey = core.getInput('api-key', { required: true });
  const url = core.getInput('url', { required: true });
  const outputType = core.getInput('output-type');
  const extractProperties = core.getInput('extract-properties');
  const browser = core.getInput('browser');
  const proxyType = core.getInput('proxy-type');
  const proxyCountry = core.getInput('proxy-country');
  const timeout = core.getInput('timeout');
  const outputFile = core.getInput('output-file');

  const endpoint = ENDPOINTS[outputType];
  if (!endpoint) {
    core.setFailed(`Invalid output-type "${outputType}". Must be one of: html, markdown, extract`);
    return;
  }

  const params = new URLSearchParams();
  params.set('url', url);
  params.set('x-api-key', apiKey);
  params.set('browser', browser);
  params.set('proxy_type', proxyType);
  if (proxyCountry) params.set('proxy_country', proxyCountry);
  params.set('timeout', timeout);
  if (outputType === 'extract' && extractProperties) {
    params.set('extract_properties', extractProperties);
  }

  const requestUrl = `${endpoint}?${params.toString()}`;
  core.info(`Scraping ${url} via ${outputType} endpoint...`);

  const response = await fetch(requestUrl);
  const status = response.status;
  core.setOutput('status-code', status.toString());

  if (status !== 200) {
    let detail = `HTTP ${status}`;
    try {
      const errorBody = await response.json();
      if (errorBody.detail) detail = errorBody.detail;
    } catch {
      // response wasn't JSON, use default
    }
    core.setFailed(`ScrapingAnt API error [${status}]: ${detail}`);
    return;
  }

  let content;

  if (outputType === 'html') {
    content = await response.text();
  } else if (outputType === 'markdown') {
    const body = await response.json();
    content = body.markdown;
    core.setOutput('url', body.url);
  } else if (outputType === 'extract') {
    const body = await response.json();
    content = JSON.stringify(body, null, 2);
  }

  core.setOutput('content', content);
  core.info(`Successfully scraped ${url} (${outputType})`);

  if (outputFile) {
    const filePath = path.resolve(outputFile);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
    core.info(`Output saved to ${outputFile}`);
  }
}

run().catch((error) => {
  core.setFailed(error.message);
});
