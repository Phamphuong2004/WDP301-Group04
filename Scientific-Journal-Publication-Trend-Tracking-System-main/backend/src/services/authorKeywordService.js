const Author = require('../models/Author');
const Keyword = require('../models/Keyword');
const Journal = require('../models/Journal');

const normalizeKeywordText = text =>
  String(text || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const upsertKeyword = async (text, source = 'openalex') => {
  const normalizedText = normalizeKeywordText(text);
  if (!normalizedText) return null;

  let keyword = await Keyword.findOne({ normalizedText });
  if (!keyword) {
    keyword = await Keyword.create({
      name: normalizedText,
      normalizedText,
      source,
      lastUpdatedAt: new Date(),
    });
  }
  return keyword;
};

const upsertAuthors = async authorEntries => {
  const ids = [];
  for (let i = 0; i < (authorEntries || []).length; i += 1) {
    const entry = authorEntries[i];
    const fullName = entry?.name?.trim();
    if (!fullName) continue;

    const openalexId = entry.externalId
      ? entry.externalId.replace('https://openalex.org/', '')
      : null;

    let author = null;
    if (openalexId) {
      author = await Author.findOneAndUpdate(
        { openalexId },
        {
          fullName,
          openalexId,
          affiliation: entry.affiliations?.[0] || null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      author = await Author.findOneAndUpdate(
        { fullName },
        { fullName, affiliation: entry.affiliations?.[0] || null },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    ids.push({
      authorId: author._id,
      name: fullName,
      affiliations: entry.affiliations || [],
      externalId: entry.externalId,
      order: i + 1,
    });
  }
  return ids;
};

const linkPaperKeywords = async keywordTexts => {
  const keywordIds = [];
  for (const text of keywordTexts || []) {
    const kw = await upsertKeyword(text);
    if (kw) keywordIds.push(kw._id);
  }
  return keywordIds;
};

const upsertJournal = async (primaryLocation) => {
  const source = primaryLocation?.source;
  if (!source?.display_name) return null;

  const openalexId = source.id
    ? source.id.replace('https://openalex.org/', '')
    : null;

  const filter = openalexId
    ? { 'externalIds.openalex': openalexId }
    : { title: source.display_name };

  const update = {
    title: source.display_name,
    issn: source.issn_l || null,
    publisher: source.host_organization_name || null,
    source: 'openalex',
    lastSyncedAt: new Date(),
  };
  if (openalexId) update.externalIds = { openalex: openalexId };

  const journal = await Journal.findOneAndUpdate(filter, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  return journal;
};

module.exports = {
  normalizeKeywordText,
  upsertKeyword,
  upsertAuthors,
  linkPaperKeywords,
  upsertJournal,
};
