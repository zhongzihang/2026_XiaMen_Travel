(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.XiamenMapGeometry = api;
})(globalThis, function () {
  function projectPoint(point, bounds, viewport) {
    const values = [point?.lat, point?.lng, bounds?.north, bounds?.south, bounds?.east, bounds?.west,
      viewport?.width, viewport?.height, viewport?.padding];
    if (!values.every(Number.isFinite) || bounds.north > 90 || bounds.south < -90 || bounds.east > 180 || bounds.west < -180 ||
        point.lat > 90 || point.lat < -90 || point.lng > 180 || point.lng < -180 ||
        bounds.north <= bounds.south || bounds.east <= bounds.west || viewport.padding < 0 ||
        viewport.width <= viewport.padding * 2 || viewport.height <= viewport.padding * 2 ||
        point.lat < bounds.south || point.lat > bounds.north || point.lng < bounds.west || point.lng > bounds.east) {
      throw new RangeError('Point, bounds, or viewport are outside the supported map extent');
    }
    const usableWidth = viewport.width - viewport.padding * 2;
    const usableHeight = viewport.height - viewport.padding * 2;
    return {
      x: viewport.padding + ((point.lng - bounds.west) / (bounds.east - bounds.west)) * usableWidth,
      y: viewport.padding + ((bounds.north - point.lat) / (bounds.north - bounds.south)) * usableHeight
    };
  }
  function fitViewBox(points, bounds, viewport, options = {}) {
    const { paddingPx = 56, minWidth = 180, minHeight = 140 } = options;
    if (!Array.isArray(points) || points.length === 0 ||
        !Number.isFinite(paddingPx) || paddingPx < 0 ||
        !Number.isFinite(minWidth) || minWidth <= 0 ||
        !Number.isFinite(minHeight) || minHeight <= 0) {
      throw new RangeError('Invalid route points or viewBox options');
    }

    const projected = points.map(point => projectPoint(point, bounds, viewport));
    const xs = projected.map(point => point.x);
    const ys = projected.map(point => point.y);
    const ratio = viewport.width / viewport.height;
    let width = Math.max(Math.max(...xs) - Math.min(...xs) + paddingPx * 2, minWidth);
    let height = Math.max(Math.max(...ys) - Math.min(...ys) + paddingPx * 2, minHeight);
    if (width / height < ratio) width = height * ratio;
    else height = width / ratio;

    const scale = Math.min(1, viewport.width / width, viewport.height / height);
    width *= scale;
    height *= scale;
    const x = Math.max(0, Math.min(viewport.width - width,
      (Math.min(...xs) + Math.max(...xs) - width) / 2));
    const y = Math.max(0, Math.min(viewport.height - height,
      (Math.min(...ys) + Math.max(...ys) - height) / 2));
    return { x, y, width, height };
  }

  return { projectPoint, fitViewBox };
});
