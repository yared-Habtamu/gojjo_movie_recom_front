import type { Movie, Genre } from "./types";

export const genres: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
  { id: 11111, name: "Biography" },
  { id: 22222, name: "Sports" },
];

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "The Dark Knight",
    overview:
      "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and DA Harvey Dent, but soon faces chaos unleashed by the Joker.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    release_date: "2008-07-18",
    vote_average: 8.5,
    vote_count: 32000,
    genre_ids: [28, 80, 18, 53],
    popularity: 98.5,
    runtime: 152,
    tagline: "Welcome to a world without rules.",
    cast: [
      {
        id: 1,
        name: "Christian Bale",
        character: "Bruce Wayne / Batman",
        profile_path: "/3qx2QFUbG6t6IlzR0F9k3Z6Yhf7.jpg",
        order: 0,
      },
      {
        id: 2,
        name: "Heath Ledger",
        character: "Joker",
        profile_path: "/5Y9HnYYa9jF4NunY9lSgJGjSe8E.jpg",
        order: 1,
      },
    ],
    videos: [
      {
        id: "1",
        key: "EXeTwQWrcwY",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  {
    id: 2,
    title: "Inception",
    overview:
      "A skilled thief who steals secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    release_date: "2010-07-16",
    vote_average: 8.3,
    vote_count: 35000,
    genre_ids: [28, 878, 53],
    popularity: 95.2,
    runtime: 148,
    tagline: "Your mind is the scene of the crime.",
    cast: [
      {
        id: 4,
        name: "Leonardo DiCaprio",
        character: "Dom Cobb",
        profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
        order: 0,
      },
      {
        id: 5,
        name: "Marion Cotillard",
        character: "Mal",
        profile_path: "/iVbUyahp6NAjGtyRvmFD7KHoQwK.jpg",
        order: 1,
      },
    ],
    videos: [
      {
        id: "2",
        key: "YoHD9XEInc0",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  {
    id: 3,
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/pbrkL804c8yAv3zBZR4QPWZAAn8.jpg",
    release_date: "2014-11-07",
    vote_average: 8.1,
    vote_count: 28000,
    genre_ids: [12, 18, 878],
    popularity: 89.7,
    runtime: 169,
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    cast: [
      {
        id: 6,
        name: "Matthew McConaughey",
        character: "Cooper",
        profile_path: "/sY2mwpafcwqyYS1sOySu1MENDse.jpg",
        order: 0,
      },
      {
        id: 7,
        name: "Anne Hathaway",
        character: "Brand",
        profile_path: "/di6Cp0LVjOGVMUaJcx4OJpQUu9w.jpg",
        order: 1,
      },
    ],
    videos: [
      {
        id: "3",
        key: "zSWdZVtXT7E",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  {
    id: 4,
    title: "The Matrix",
    overview:
      "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    release_date: "1999-03-31",
    vote_average: 8.2,
    vote_count: 25000,
    genre_ids: [28, 878],
    popularity: 87.3,
    runtime: 136,
    tagline: "The fight for the future begins.",
    cast: [
      {
        id: 8,
        name: "Keanu Reeves",
        character: "Neo",
        profile_path: "/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg",
        order: 0,
      },
      {
        id: 9,
        name: "Laurence Fishburne",
        character: "Morpheus",
        profile_path: "/8suOhUtJYlDWlmNVmuXrpKRq2JJ.jpg",
        order: 1,
      },
    ],
    videos: [
      {
        id: "4",
        key: "vKQi3bBA1y8",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  {
    id: 5,
    title: "Pulp Fiction",
    overview:
      "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
    release_date: "1994-10-14",
    vote_average: 8.9,
    vote_count: 27000,
    genre_ids: [80, 18],
    popularity: 92.1,
    runtime: 154,
    tagline:
      "Just because you are a character doesn't mean you have character.",
    cast: [
      {
        id: 10,
        name: "John Travolta",
        character: "Vincent Vega",
        profile_path: "/9GVufE87MMIrSn0CbJFLudkALdL.jpg",
        order: 0,
      },
      {
        id: 11,
        name: "Samuel L. Jackson",
        character: "Jules Winnfield",
        profile_path: "/AiAYAqwpM5xmiFrAIeQvUXDCVvo.jpg",
        order: 1,
      },
    ],
    videos: [
      {
        id: "5",
        key: "s7EdQ4FqbhY",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  {
    id: 6,
    title: "Avatar",
    overview:
      "A paraplegic Marine is dispatched to Pandora on a unique mission, but becomes torn between following orders and protecting the alien world.",
    poster_path: "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    backdrop_path: "/Yc9q6QuWrMp9nuDm5R8ExNqbEWU.jpg",
    release_date: "2009-12-18",
    vote_average: 7.6,
    vote_count: 30000,
    genre_ids: [28, 12, 14, 878],
    popularity: 94.8,
    runtime: 162,
    tagline: "Enter the World of Pandora.",
    cast: [
      {
        id: 12,
        name: "Sam Worthington",
        character: "Jake Sully",
        profile_path: "/yX1XgUIbGBenAocHqHQ4qWlk8Kg.jpg",
        order: 0,
      },
      {
        id: 13,
        name: "Zoe Saldana",
        character: "Neytiri",
        profile_path: "/vQBwmsSOAd0JDaEcZ5p43J9xzsY.jpg",
        order: 1,
      },
    ],
    videos: [
      {
        id: "6",
        key: "5PSNL1qE6VY",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  // ➕ Extra movies
  {
    id: 7,
    title: "Gladiator",
    overview:
      "A former Roman General seeks revenge against the corrupt emperor who murdered his family and sent him into slavery.",
    poster_path: "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    backdrop_path: "/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg",
    release_date: "2000-05-05",
    vote_average: 8.2,
    vote_count: 19000,
    genre_ids: [28, 12, 36, 18],
    popularity: 81.5,
    runtime: 155,
    tagline: "What we do in life echoes in eternity.",
    cast: [
      {
        id: 14,
        name: "Russell Crowe",
        character: "Maximus",
        profile_path: "/iNDAHvtiA3tmZzxMQnV0RFWzER.jpg",
        order: 0,
      },
    ],
    videos: [
      {
        id: "7",
        key: "owK1qxDselE",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  {
    id: 8,
    title: "Forrest Gump",
    overview:
      "The story of a man with a low IQ who unwittingly influences several historical events in the 20th century United States.",
    poster_path: "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
    backdrop_path: "/dYtA9i95tFnWrpmlVnzgnj0RY4p.jpg",
    release_date: "1994-07-06",
    vote_average: 8.8,
    vote_count: 24000,
    genre_ids: [18, 35, 10749],
    popularity: 88.9,
    runtime: 142,
    tagline:
      "Life is like a box of chocolates... you never know what you're gonna get.",
    cast: [
      {
        id: 15,
        name: "Tom Hanks",
        character: "Forrest Gump",
        profile_path: "/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg",
        order: 0,
      },
    ],
    videos: [
      {
        id: "8",
        key: "uPIEn0M8su0",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  {
    id: 9,
    title: "The Shawshank Redemption",
    overview:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop_path: "/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
    release_date: "1994-09-22",
    vote_average: 9.3,
    vote_count: 25000,
    genre_ids: [18, 80],
    popularity: 99.1,
    runtime: 142,
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    cast: [
      {
        id: 16,
        name: "Tim Robbins",
        character: "Andy Dufresne",
        profile_path: "/w3du7jlOZZHTl2xpJlrY7jx3Q7U.jpg",
        order: 0,
      },
      {
        id: 17,
        name: "Morgan Freeman",
        character: "Ellis Boyd 'Red' Redding",
        profile_path: "/oGJQhOpT8S1M56tvSsbEBePV5O1.jpg",
        order: 1,
      },
    ],
    videos: [
      {
        id: "9",
        key: "PLl99DlL6b4",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  {
    id: 10,
    title: "The Lion King",
    overview:
      "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
    poster_path: "/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    backdrop_path: "/bKPtXn9n4M4s8vvZrbw40mYsefB.jpg",
    release_date: "1994-06-24",
    vote_average: 8.5,
    vote_count: 22000,
    genre_ids: [16, 10751, 12],
    popularity: 84.3,
    runtime: 88,
    tagline:
      "Life's greatest adventure is finding your place in the Circle of Life.",
    cast: [
      {
        id: 18,
        name: "Matthew Broderick",
        character: "Simba (voice)",
        profile_path: "/zX8lYgxYkWwaP42QikIze8ihZkh.jpg",
        order: 0,
      },
    ],
    videos: [
      {
        id: "10",
        key: "4sj1MT05lAA",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  {
    id: 11,
    title: "Avengers: Endgame",
    overview:
      "After the devastating events of Avengers: Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    release_date: "2019-04-26",
    vote_average: 8.4,
    vote_count: 33000,
    genre_ids: [28, 12, 878],
    popularity: 97.2,
    runtime: 181,
    tagline: "Part of the journey is the end.",
    cast: [
      {
        id: 19,
        name: "Robert Downey Jr.",
        character: "Tony Stark / Iron Man",
        profile_path: "/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg",
        order: 0,
      },
      {
        id: 20,
        name: "Chris Evans",
        character: "Steve Rogers / Captain America",
        profile_path: "/3bOGNsHlrswhyW79uvIHH1V43JI.jpg",
        order: 1,
      },
    ],
    videos: [
      {
        id: "11",
        key: "TcMBFSGVi1c",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
];

export const movies = mockMovies;

export const getTrendingMovies = (): Movie[] => {
  return [...mockMovies]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);
};

export const getTopRatedMovies = (): Movie[] => {
  return [...mockMovies]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 10);
};

export const getMoviesByGenre = (genreId: number): Movie[] => {
  return mockMovies.filter((movie) => movie.genre_ids.includes(genreId));
};

export const searchMovies = (query: string): Movie[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockMovies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(lowercaseQuery) ||
      movie.overview.toLowerCase().includes(lowercaseQuery)
  );
};

export const getMovieById = (id: number): Movie | undefined => {
  return mockMovies.find((movie) => movie.id === id);
};

export const getSimilarMovies = (movieId: number): Movie[] => {
  const movie = getMovieById(movieId);
  if (!movie) return [];
  return mockMovies
    .filter(
      (m) =>
        m.id !== movieId && m.genre_ids.some((g) => movie.genre_ids.includes(g))
    )
    .slice(0, 6);
};
