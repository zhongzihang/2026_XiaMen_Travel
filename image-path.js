(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SiteImages = api;
})(globalThis, function () {
  function resolveImagePath(source, assetPrefix = 'assets/') {
    if (typeof source !== 'string' || !source.trim()) return '';
    const value = source.trim();
    if (/^(?:https?:|data:|\/)/i.test(value) || value.startsWith(assetPrefix)) return value;
    return assetPrefix + value.replace(/^\.\//, '');
  }
  function previewImagePath(source, assetPrefix = 'assets/') {
    const original = resolveImagePath(source, assetPrefix);
    return globalThis.XiamenImagePreviews?.[original] || original;
  }
  return { resolveImagePath, previewImagePath };
});
