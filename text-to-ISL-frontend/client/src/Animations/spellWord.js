export const normalizeWordToken = (value) => {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z']/g, "")
    .replace(/^'+|'+$/g, "");
};

export const normalizePhraseToken = (value) => {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^'+|'+$/g, "");
};

export const queueSpelledWord = (word, ref, alphabets) => {
  const normalizedWord = normalizeWordToken(word).replace(/'/g, "");

  if (!normalizedWord) {
    return false;
  }

  ref.animations.push(["add-text", `${normalizedWord} `]);

  for (const character of normalizedWord) {
    const animation = alphabets[character];

    if (typeof animation === "function") {
      animation(ref);
    }
  }

  if (ref.pending === false) {
    ref.pending = true;
    ref.animate();
  }

  return true;
};