import React, { useEffect, useState } from 'react';
import AnimeCard, { AnimeCardProps } from '../components/AnimeCard.tsx';


interface Anime {
  mal_id: number;
  title: string;
  rating?: string;
  score?: number;     //added score property to hold the anime's score
  imageUrl?: string   //contains the image url, this should be displayed above the anime
}
interface Review {
  review: string;
}

interface Genre {
  mal_id: number;
  name: string;
}

//global promise queue to help stagger API calls
//API is limited to 3 requests per second
//if we violate that it will return a 429 error and break the app
//this queue will help us avoid that
let lastFetchPromise = Promise.resolve();

// Helper sleep function
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const rateLimitedFetch = async (url: string) => {
  //we can increase the delay here if we need
  lastFetchPromise = lastFetchPromise.then(() => sleep(500));
  await lastFetchPromise;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res;
};

const Home: React.FC = () => {
  //Top Anime State
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Reviews Modal State
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  //Top Genres State
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genresLoading, setGenresLoading] = useState(true);
  const [genresError, setGenresError] = useState<string | null>(null);

  //Genre Modal State (to display top 10 anime in that genre)
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [genreAnimes, setGenreAnimes] = useState<Anime[]>([]);
  const [genreAnimesLoading, setGenreAnimesLoading] = useState(false);
  const [genreAnimesError, setGenreAnimesError] = useState<string | null>(null);

  //state for selected anime details
  const [selectedAnimeDetails, setSelectedAnimeDetails] = useState<AnimeCardProps | null>(null);


  //trunacate text to avoid word limits
  const truncate = (text: string, wordLimit: number): string => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  //fetch Top Anime and filter out Rx rated.
  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        const res = await rateLimitedFetch("https://api.jikan.moe/v4/top/anime");
        const data = await res.json();
        const mappedAnime = data.data
        .filter((anime: any) => anime.rating !== "Rx - Hentai")
        .map((anime: any) => ({
          mal_id: anime.mal_id,
          title: anime.title,
          rating: anime.rating,
          score: anime.score,
          imageUrl: anime.images?.jpg?.image_url, //extract jpg
        }));
        setTopAnime(mappedAnime.slice(0, 50));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch top anime");
        setLoading(false);
      }
    };
    fetchTopAnime();
  }, []);

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

  //handler for anime click (shows top 5 reviews for that anime)
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

  const handleViewAnimeCard = async () => {
    if (!selectedAnime) return;
    try {
      const res = await rateLimitedFetch(`https://api.jikan.moe/v4/anime/${selectedAnime.mal_id}`);
      const data = await res.json();
      const detail = data.data;
      const animeCardProps: AnimeCardProps = {
        mal_id: detail.mal_id,
        title: detail.title,
        description: detail.synopsis || "No description available.",
        score: detail.score,
        imageUrl: detail.images?.jpg?.image_url,
      };
      setSelectedAnimeDetails(animeCardProps);
    } catch (err) {
      console.error(err);
    }
  };  

  //click handler for genres (shows top 10 anime for that genre, filtering Rx rated).
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
  const handleGenreAnimeClick = async (anime: Anime) => {
    try {
      const res = await rateLimitedFetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}`);
      const data = await res.json();
      const detail = data.data;
      const animeCardProps: AnimeCardProps = {
        mal_id: detail.mal_id,
        title: detail.title,
        description: detail.synopsis || "No description available.",
        score: detail.score,
        imageUrl: detail.images?.jpg?.image_url,
      };
      setSelectedAnimeDetails(animeCardProps);
      setSelectedGenre(null);
    } catch (err) {
      console.error(err);
    }
  };

  //Modal close handlers.
  const closeAnimeCardModal = () => setSelectedAnimeDetails(null);
  const closeModal = () => setSelectedAnime(null);
  const closeReviewModal = () => setSelectedReview(null);
  const closeGenreModal = () => setSelectedGenre(null);

  if (loading) return <div>Finding the best anime for you!</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="text-center p-4">
      {/* top genres section */}
      {!genresLoading && !genresError && genres.filter(genre => {   
        const lowerName = genre.name.toLowerCase();
        return !lowerName.includes("hentai") && !lowerName.includes("erotica"); //we dont want to display genres with "hentai" or "erotica" in their name
      }).length > 0 && (
        <>
          <h1 className="text-2xl font-bold mb-4">Top Genres</h1>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {genres
              .filter(genre => {
                const lowerName = genre.name.toLowerCase();
                return !lowerName.includes("hentai") && !lowerName.includes("erotica");
              })
              .map((genre) => (
                <div
                  key={genre.mal_id}
                  className="flex-shrink-0 bg-indigo-200 p-4 rounded shadow-md min-w-[150px] cursor-pointer hover:bg-indigo-300"
                  onClick={() => handleGenreClick(genre)}
                >
                  <h2 className="text-lg font-semibold">{genre.name}</h2>
                </div>
              ))}
          </div>
        </>
      )}
  
      {/* top anime section */}
      <h1 className="text-2xl font-bold mb-4">Top Anime</h1>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {topAnime.map((anime) => (
          <div
            key={anime.mal_id}
            className="flex-shrink-0 bg-gray-200 p-4 rounded shadow-md min-w-[200px] cursor-pointer hover:bg-gray-300"
            onClick={() => handleAnimeClick(anime)}
          >
            {anime.imageUrl && (
              <img
                src={anime.imageUrl}
                alt={`${anime.title} cover`}
                className="w-[200px] h-[300px] object-cover mb-2 rounded"
              />
            )}
            <h2 className="text-lg font-semibold w-[200px] break-words">
              {anime.title}
            </h2>
          </div>
        ))}
      </div>
  
      {/* review modal */}
      {selectedAnime && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedAnime.title} - Top 5 Reviews
              </h2>
              <button onClick={closeModal} className="text-red-500 text-lg">
                X
              </button>
            </div>
            {selectedAnime.score !== undefined && (
              <p className="text-lg mb-4">
                Overall Score: {selectedAnime.score}
              </p>
            )}
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
            <div className="mt-4">
              <button
                onClick={handleViewAnimeCard}
                className="py-2 px-4 bg-green-500 text-white rounded"
              >
                View Anime Card
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Anime Card Modal */}
      {selectedAnimeDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl overflow-y-auto">
            <button onClick={closeAnimeCardModal} className="text-red-500 text-lg float-right">
              X
            </button>
            <AnimeCard {...selectedAnimeDetails} />
          </div>
        </div>
      )}
      {/* Modal for Full Review */}
      {selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Full Review</h2>
              <button onClick={closeReviewModal} className="text-red-500 text-lg">
                X
              </button>
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
              <h2 className="text-xl font-bold">
                Top 10 Anime in {selectedGenre.name}
              </h2>
              <button onClick={closeGenreModal} className="text-red-500 text-lg">
                X
              </button>
            </div>
            {genreAnimesLoading && <p>Loading anime...</p>}
            {genreAnimesError && <p>{genreAnimesError}</p>}
            {!genreAnimesLoading && !genreAnimesError && (
              <>
                {genreAnimes.length > 0 ? (
                  <ul className="space-y-2">
                    {genreAnimes.map((anime) => (
                      <li 
                        key={anime.mal_id} 
                        className="border-b pb-2 cursor-pointer hover:bg-gray-100 p-2"
                        onClick={() => handleGenreAnimeClick(anime)}
                      >
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
}



export default Home;