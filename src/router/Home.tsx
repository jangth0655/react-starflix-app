import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getNowMovies, IGetMovie } from "../Movie-api";
import Loader from "../components/Loader";
import { makeImage } from "../utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointUp } from "@fortawesome/free-solid-svg-icons";
import { faHandPointDown } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Main = styled.div`
  @media screen and (max-width: 43em) {
    font-size: 0.875rem;
  }
`;

const Banner = styled.div<{ bgPhoto: string }>`
  padding: 0 1em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
`;

const BannerDescription = styled.div`
  width: 50%;
  line-height: 1.2;
  color: ${(props) => props.theme.colors.white.light};
`;

const BannerTitle = styled.p`
  font-weight: 600;
  font-size: 2rem;
`;
const BannerOverview = styled.p`
  margin-top: 1em;
  @media screen and (max-height: 50em) {
    display: none;
  }
`;

const Slide = styled.div`
  display: flex;
  z-index: 1;
  position: relative;
  top: -12em;
`;

const RowItems = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.3em;
  width: 100%;
`;

const RowItem = styled(motion.div)<{ poster: string }>`
  cursor: pointer;
  background-color: white;
  height: 12.5em;
  width: 100%;
  position: relative;
  background-image: url(${(prop) => prop.poster});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const ChangeRightItem = styled(motion.div)`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 2;
  right: 0em;
  bottom: -12.5em;
  background-color: rgba(0, 0, 0, 0.7);
  width: 3em;
  height: 12.5em;
  opacity: 0.7;
  svg {
    margin: auto;
    color: ${(props) => props.theme.colors.white.light};
    width: 30%;
    height: 30%;
  }
`;

const ChangeLeftItem = styled(motion.div)`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 2;
  left: 0em;
  bottom: -12.5em;
  background-color: rgba(0, 0, 0, 0.7);
  width: 3em;
  height: 12.5em;
  opacity: 0.7;
  svg {
    margin: auto;
    color: ${(props) => props.theme.colors.white.light};
    width: 30%;
    height: 30%;
  }
`;

const changeRightItemVariants = {
  initial: {
    opacity: 0.5,
  },
  hover: {
    opacity: 1,
  },
};

const changeLeftItemVariants = {
  initial: {
    opacity: 0.5,
  },
  hover: {
    opacity: 1,
  },
};

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth : window.outerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth : -window.outerWidth,
  }),
};

const rowItemVariants = {
  hover: {
    scale: 1.2,
    y: -50,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};

const Overlay = styled(motion.div)`
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const BigMovie = styled(motion.div)`
  z-index: 2;
  width: 25em;
  max-height: 30em;
  background-color: ${(props) => props.theme.colors.black.dark};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: ${(props) => props.theme.borderRadius};
  overflow: hidden;
`;

const BigMovieImg = styled.div<{ moviePoster: string }>`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.moviePoster});
  background-size: cover;
  background-position: center center;
  height: 50%;
`;

const BigMovieDescription = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`;

const BigMovieInfo = styled.div`
  color: ${(props) => props.theme.colors.white.dark};
  padding: 1em;
  width: 50%;
  height: 50%;
`;

const BigMovieMetaInfo = styled.div`
  color: ${(props) => props.theme.colors.white.dark};
  width: 50%;
  height: 50%;
  padding: 1em;
`;

const InfoIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonBox = styled.div`
  button {
    position: relative;
    transition: all 0.3s ease-in-out;
    font-size: 1.2rem;
    border: none;
  }
  button:hover {
    color: ${(prop) => prop.theme.colors.active};
  }

  button:first-child:hover {
    color: ${(props) => props.theme.colors.red};
  }
  button:nth-child(2) {
    margin: 0 1em;
  }
`;

const Line = styled.div`
  margin-top: 1em;
  opacity: 0.3;
  background-color: ${(prop) => prop.theme.colors.active};
  width: 80%;
  height: 1px;
`;

const HeartBtn = styled(motion.div)`
  z-index: 1;
  position: absolute;
  top: 0;
`;

const InfoGenre = styled.div`
  margin-top: 1em;
`;

const InfoTitle = styled.p`
  color: ${(props) => props.theme.colors.active};
  font-size: 1.2rem;
  font-weight: 600;
  top: 47%;
  position: absolute;
`;

const InfoOverview = styled.p`
  overflow-y: scroll;
  font-size: 0.9rem;
  width: fit-content;
  height: 100%;
`;

const OverlayVariants = {
  initial: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  visible: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  exit: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
};

const infoHeartBtn = {
  click: {
    fontSize: "12px",
    y: -40,
  },
};

const OFFSET = 6;

const Home = () => {
  const { scrollY } = useViewportScroll();
  const navigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId");
  const [back, setBack] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [page, setPage] = useState(0);
  const { isLoading: nowPlayingLoading, data: nowPlaying } =
    useQuery<IGetMovie>(["movies", "nowPlaying"], getNowMovies);

  const clickMovie =
    movieMatch?.params.movieId &&
    nowPlaying?.results.find(
      (movie) => movie.id === Number(movieMatch?.params.movieId)
    );

  console.log(nowPlayingLoading);

  const onPage = () => {
    if (nowPlaying) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowPlaying.results.length - 1;
      const maxPage = Math.floor(totalMovies / OFFSET) - 1;
      back
        ? setPage((oldPage) => (oldPage === maxPage ? 0 : page + 1))
        : setPage((oldPage) => (oldPage === 0 ? maxPage : page - 1));
    }
  };

  const rightPress = () => setBack(true);
  const leftPress = () => setBack(false);

  const toggleLeaving = () => setLeaving((pre) => !pre);

  const showingBigMovie = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => {
    navigate("/");
  };

  const isLoading = nowPlayingLoading;

  return (
    <Main>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImage(nowPlaying?.results[0].backdrop_path || "")}
          >
            <BannerDescription>
              <BannerTitle>
                {clickMovie ? clickMovie?.title : nowPlaying?.results[0].title}
              </BannerTitle>
              <BannerOverview>
                {clickMovie
                  ? clickMovie?.title
                  : nowPlaying?.results[0].overview}
              </BannerOverview>
            </BannerDescription>
          </Banner>
          <Slide>
            <AnimatePresence
              custom={back}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <RowItems
                key={page}
                custom={back}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {nowPlaying?.results
                  .slice(1)
                  .slice(OFFSET * page, OFFSET * page + OFFSET)
                  .map((movie) => (
                    <>
                      <RowItem
                        onClick={() => showingBigMovie(movie.id)}
                        layoutId={movie.id + ""}
                        variants={rowItemVariants}
                        whileHover="hover"
                        key={movie.id}
                        poster={makeImage(movie.poster_path, "w500")}
                      ></RowItem>
                    </>
                  ))}
              </RowItems>

              {/* direction - right */}
              <ChangeRightItem
                onClick={() => {
                  onPage();
                  rightPress();
                }}
                key="right"
                variants={changeRightItemVariants}
                initial="initial"
                whileHover="hover"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="currentColor"
                    d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
                  ></path>
                </svg>
              </ChangeRightItem>
              {/* direction - left */}
              <ChangeLeftItem
                onClick={() => {
                  onPage();
                  leftPress();
                }}
                variants={changeLeftItemVariants}
                initial="initial"
                whileHover="hover"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="currentColor"
                    d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"
                  ></path>
                </svg>
              </ChangeLeftItem>
            </AnimatePresence>
          </Slide>

          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  variants={OverlayVariants}
                  initial="initial"
                  animate="visible"
                  exit="exit"
                  onClick={onOverlayClick}
                ></Overlay>
                <BigMovie
                  style={{ top: scrollY.get() }}
                  layoutId={movieMatch?.params.movieId}
                  transition={{
                    duration: 1,
                  }}
                >
                  {clickMovie && (
                    <>
                      <BigMovieImg
                        moviePoster={makeImage(
                          clickMovie?.backdrop_path,
                          "w500"
                        )}
                      ></BigMovieImg>
                      <BigMovieDescription>
                        <BigMovieInfo>
                          <InfoTitle>{clickMovie?.title}</InfoTitle>
                          <InfoOverview>{clickMovie?.overview}</InfoOverview>
                        </BigMovieInfo>

                        <BigMovieMetaInfo>
                          <InfoIcon>
                            <ButtonBox>
                              <motion.button>
                                <FontAwesomeIcon icon={faHeart} />
                                <HeartBtn
                                  variants={infoHeartBtn}
                                  initial="initial"
                                  animate="animate"
                                  exit="exit"
                                  whileTap="click"
                                >
                                  <FontAwesomeIcon icon={faHeart} />
                                </HeartBtn>
                              </motion.button>
                              <button>
                                <FontAwesomeIcon icon={faHandPointUp} />
                              </button>
                              <button>
                                <FontAwesomeIcon icon={faHandPointDown} />
                              </button>
                            </ButtonBox>
                            <Line></Line>
                          </InfoIcon>
                          <InfoGenre></InfoGenre>
                        </BigMovieMetaInfo>
                      </BigMovieDescription>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Main>
  );
};

export default Home;
