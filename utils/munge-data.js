export function mungeGiphy (giphyStuff) {
  return giphyStuff.data.map(gif => {
    return {
      preview: gif.images.preview.mp4,
      gif: gif.images.original.url,
      giphy_id: gif.id,
      url: gif.bitly_url
    };
  });
}