const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36";
const DEFAULT_METHOD = "GET";
const DEFAULT_HOSTNAME = "www.pixiv.net";

const https = require("https");
const loadUrl = require("url").parse;
const querystring = require("querystring");

const request = (options, callback) => {
  if (!options.method) options.method = DEFAULT_METHOD;
  if (!options.hostname) options.hostname = DEFAULT_HOSTNAME;
  if (!options.headers) options.headers = {};
  Object.assign(options.headers, {
    "User-Agent": options.userAgent || DEFAULT_USER_AGENT,
    "Accept-Language": "en-US"
  });
  if (options.pixSession)
    options.headers["Cookie"] = `PHPSESSID=${options.pixSession};`;
  if (options.referer) options.headers["Referer"] = options.referer;
  if (options.csrfToken) options.headers["x-csrf-token"] = options.csrfToken;
  if (options.query) options.path += "?" + querystring.stringify(options.query);
  https.request(options, callback).end();
};

const loadPage = callback => res => {
  let data = "";
  res.on("data", chunk => (data += chunk));
  res.on("end", () => {
    callback(data);
  });
};

const toJson = callback => res => {
  loadPage(data => callback(JSON.parse(data)))(res);
};

exports.info = ({ id }) =>
  new Promise((resolve, reject) =>
    request(
      {
        path: `/ajax/illust/${id}`
      },
      toJson(json => {
        if (!json.error) resolve(json.body);
        else reject();
      })
    )
  );

exports.similar = ({ id, session, limit }) =>
  new Promise((resolve, reject) =>
    request(
      {
        path: `/ajax/illust/${id}/recommend/init`,
        query: {
          limit: limit || 1
        },
        pixSession: session
      },
      toJson(json => {
        if (!json.error && json.body.illusts.length > 0) {
          const ids = json.body.nextIds;
          ids.unshift;
          resolve({
            ids: ids,
            length: ids.unshift(json.body.illusts[0].illustId)
          });
        } else reject();
      })
    )
  );

exports.shortGroupInfo = ({ ids, session }) =>
  new Promise((resolve, reject) =>
    request(
      {
        path: `/rpc/index.php`,
        query: {
          mode: "get_illust_detail_by_ids",
          illust_ids: ids.join(",")
        },
        pixSession: session
      },
      toJson(json => {
        if (!json.error) {
          const res = Object.values(json.body).map(pic => ({
            id: pic.illust_id,
            illustId: pic.illust_id,
            title: pic.illust_title,
            illustTitle: pic.illust_title,
            pageCount: parseInt(pic.illust_page_count),
            urls: pic.url
              ? {
                  original: pic.url.big,
                  medium: pic.url.m,
                  smaller: pic.url["240mw"]
                }
              : undefined
          }));
          resolve(res);
        } else reject();
      })
    )
  );

exports.recommender = ({ type, sample_illusts, count, session }) =>
  new Promise((resolve, reject) =>
    request(
      {
        path: "/rpc/recommender.php",
        query: {
          type: type || "illust",
          sample_illusts:
            (sample_illusts && sample_illusts.join(",")) || "auto",
          num_recommendations: count,
          page: !sample_illusts ? "discovery" : undefined,
          mode: "all"
        },
        pixSession: session,
        referer: "https://www.pixiv.net/discovery"
      },
      toJson(json => {
        if (json.recommendations) {
          resolve({
            ids: json.recommendations,
            length: json.recommendations.length
          });
        } else reject();
      })
    )
  );

exports.following = ({ page, session }) =>
  new Promise((resolve, reject) =>
    request(
      {
        path: "/bookmark_new_illust.php",
        query: {
          p: page
        },
        pixSession: session
      },
      loadPage(page_ => {
        const match = page_.match(/data-items="([^"]+)/);
        if (match) {
          const ids = JSON.parse(match[1].replace(/&quot;/g, '"')).map(pic =>
            parseInt(pic.illustId)
          );
          resolve({ ids: ids, length: ids.length, page: parseInt(page) });
        } else reject();
      })
    )
  );
