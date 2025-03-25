import React, { useEffect, useState } from 'react';

interface Anime {
  mal_id: number;
  title: string;
  rating?: string;
  // additional fields if needed
}

interface Review {
  review: string;
  // additional fields if needed
}

interface Genre {
  mal_id: number;
  name: string;
  // additional fields if needed
}

// Global promise queue to help stagger API calls
let lastFetchPromise = Promise.resolve();

// Helper sleep function
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Rate-limited fetch that queues each request and checks for errors.
const rateLimitedFetch = async (url: string) => {
  // Increase delay if needed (e.g., from 350 to 500)
  lastFetchPromise = lastFetchPromise.then(() => sleep(500));
  await lastFetchPromise;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res;
};

const Home: React.FC = () => {
  // Top Anime State
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reviews Modal State
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Top Genres State
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genresLoading, setGenresLoading] = useState(true);
  const [genresError, setGenresError] = useState<string | null>(null);

  // Genre Modal State (to display top 10 anime in that genre)
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [genreAnimes, setGenreAnimes] = useState<Anime[]>([]);
  const [genreAnimesLoading, setGenreAnimesLoading] = useState(false);
  const [genreAnimesError, setGenreAnimesError] = useState<string | null>(null);

  // Helper function to truncate text.
  const truncate = (text: string, wordLimit: number): string => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Fetch Top Anime and filter out Rx rated.
  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        const res = await rateLimitedFetch("https://api.jikan.moe/v4/top/anime");
        const data = await res.json();
        const filteredAnime = data.data.filter((anime: Anime) => anime.rating !== "Rx - Hentai");
        setTopAnime(filteredAnime.slice(0, 50));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch top anime");
        setLoading(false);
      }
    };
    fetchTopAnime();
  }, []);

  // Fetch Top Genres with explicit check.
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await rateLimitedFetch("https://api.jikan.moe/v4/genres/anime");
        const data = await res.json();
        console.log("Genres API response:", data);
        const fetchedGenres = Array.isArray(data.data) ? data.data : [];
        setGenres(fetchedGenres);
        setGenresLoading(false);
      } catch (err) {
        console.error(err);
        setGenresError("Failed to fetch genres");
        setGenresLoading(false);
      }
    };
    fetchGenres();
  }, []);

  // Click handler for an anime (shows reviews).
  const handleAnimeClick = async (anime: Anime) => {
    setSelectedAnime(anime);
    setReviews([]);
    setReviewsError(null);
    setReviewsLoading(true);
    try {
      const res = await rateLimitedFetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/reviews`);
      const data = await res.json();
      setReviews(data.data.slice(0, 5));
      setReviewsLoading(false);
    } catch {
      setReviewsError("Failed to fetch reviews");
      setReviewsLoading(false);
    }
  };

  // Click handler for a genre (shows top 10 anime for that genre, filtering Rx rated).
  const handleGenreClick = async (genre: Genre) => {
    setSelectedGenre(genre);
    setGenreAnimes([]);
    setGenreAnimesError(null);
    setGenreAnimesLoading(true);
    try {
      const res = await rateLimitedFetch(`https://api.jikan.moe/v4/anime?genres=${genre.mal_id}&order_by=score&sort=desc&limit=10`);
      const data = await res.json();
      const filteredAnime = data.data.filter((anime: Anime) => anime.rating !== "Rx - Hentai");
      setGenreAnimes(filteredAnime.slice(0, 10));
      setGenreAnimesLoading(false);
    } catch {
      setGenreAnimesError("Failed to fetch anime for this genre");
      setGenreAnimesLoading(false);
    }
  };

  // Modal close handlers.
  const closeModal = () => setSelectedAnime(null);
  const closeReviewModal = () => setSelectedReview(null);
  const closeGenreModal = () => setSelectedGenre(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="text-center p-4">
      {/* Top Anime Section */}
      <h1 className="text-2xl font-bold mb-4">Top Anime</h1>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {topAnime.map((anime) => (
          <div
            key={anime.mal_id}
            className="flex-shrink-0 bg-gray-200 p-4 rounded shadow-md min-w-[200px] cursor-pointer hover:bg-gray-300"
            onClick={() => handleAnimeClick(anime)}
          >
            <h2 className="text-lg font-semibold">{anime.title}</h2>
          </div>
        ))}
      </div>

      {/* Top Genres Section */}
      <h1 className="text-2xl font-bold mb-4">Top Genres</h1>
      {genresLoading && <p>Loading genres...</p>}
      {genresError && <p>{genresError}</p>}
      {!genresLoading && !genresError && genres.length > 0 && (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {genres.map((genre) => (
            <div
              key={genre.mal_id}
              className="flex-shrink-0 bg-indigo-200 p-4 rounded shadow-md min-w-[150px] cursor-pointer hover:bg-indigo-300"
              onClick={() => handleGenreClick(genre)}
            >
              <h2 className="text-lg font-semibold">{genre.name}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Reviews */}
      {selectedAnime && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedAnime.title} - Top 5 Reviews
              </h2>
              <button onClick={closeModal} className="text-red-500 text-lg">X</button>
            </div>
            {reviewsLoading && <p>Loading reviews...</p>}
            {reviewsError && <p>{reviewsError}</p>}
            {!reviewsLoading && !reviewsError && (
              <>
                {reviews.length > 0 ? (
                  <ul className="space-y-2">
                    {reviews.map((review, index) => (
                      <li key={index} className="border-b pb-2">
                        <p>{truncate(review.review, 25)}</p>
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="text-blue-500 text-sm mt-1"
                        >
                          Read Entire Review
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No reviews available</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal for Full Review */}
      {selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Full Review</h2>
              <button onClick={closeReviewModal} className="text-red-500 text-lg">X</button>
            </div>
            <p>{selectedReview.review}</p>
          </div>
        </div>
      )}

      {/* Modal for Genre's Top 10 Anime */}
      {selectedGenre && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Top 10 Anime in {selectedGenre.name}</h2>
              <button onClick={closeGenreModal} className="text-red-500 text-lg">X</button>
            </div>
            {genreAnimesLoading && <p>Loading anime...</p>}
            {genreAnimesError && <p>{genreAnimesError}</p>}
            {!genreAnimesLoading && !genreAnimesError && (
              <>
                {genreAnimes.length > 0 ? (
                  <ul className="space-y-2">
                    {genreAnimes.map((anime) => (
                      <li key={anime.mal_id} className="border-b pb-2">
                        <p className="text-lg font-semibold">{anime.title}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No anime available for this genre</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;