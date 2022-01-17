import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getNowTvShow, getPopTvShow, IGetTvShow } from "../TVShow-api";
import { makeImage } from "../utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointUp } from "@fortawesome/free-solid-svg-icons";
import { faHandPointDown } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/Loader";

const Main = styled.main`
  @media screen and (max-width: 43em) {
    font-size: 0.875rem;
  }
`;

const Banner = styled(motion.div)<{ banner: string }>`
  padding: 0 1em;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(prop) => prop.banner});
  background-size: cover;
  background-position: center center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const BannerDescription = styled.div`
  width: 50%;
  height: 10em;
  color: ${(prop) => prop.theme.colors.white.dark};
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

const SliderTitle = styled.h1`
  padding: 0.5em 0.5em;
  font-size: 1.5rem;
  font-weight: 600;
  font-style: italic;
  color: ${(prop) => prop.theme.colors.active};
  @media screen and (max-width: 43em) {
    font-size: 0.875rem;
  }
`;

const SliderBox = styled.div`
  position: absolute;
  top: 70%;
  width: 100%;
  height: 12.5em;
`;

const NowShowSlider = styled.div`
  height: 100%;
`;

const NowShowRows = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.3em;
  width: 100%;
`;

const NowShowItem = styled(motion.div)<{ poster: string }>`
  cursor: pointer;
  background-image: url(${(props) => props.poster});
  background-size: cover;
  background-position: center center;
  height: 12.5em;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const TvRight = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.7);
  width: 3em;
  height: 12.5em;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
  svg {
    margin: auto;
    color: ${(props) => props.theme.colors.white.light};
    width: 30%;
    height: 30%;
  }
`;

const TvLeft = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.7);
  width: 3em;
  height: 12.5em;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
  svg {
    margin: auto;
    color: ${(props) => props.theme.colors.white.light};
    width: 30%;
    height: 30%;
  }
`;

const PopularSlider = styled.div`
  height: 100%;
`;

const PopularRows = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.3em;
  width: 100%;
`;

const PopShowItem = styled(motion.div)<{ poster: string }>`
  cursor: pointer;
  background-image: url(${(prop) => prop.poster});
  background-size: cover;
  background-position: center center;
  height: 12.5em;
  background-color: white;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

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

const nowShowRowsVariants = {
  initial: (isBack: boolean) => ({
    x: isBack ? window.outerWidth : -window.outerWidth,
  }),

  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth : window.outerWidth,
  }),
};

const NowOverLayer = styled(motion.div)`
  z-index: 2;
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
`;

const PopOverLayer = styled(motion.div)`
  z-index: 2;
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
`;

const BigNowTvShow = styled(motion.div)`
  z-index: 3;
  position: absolute;
  width: 25em;
  height: 30em;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: ${(prop) => prop.theme.colors.black.dark};
  border-radius: ${(prop) => prop.theme.borderRadius};
  overflow: hidden;
`;

const BigPopTvShow = styled(motion.div)`
  z-index: 3;
  position: absolute;
  width: 25em;
  height: 30em;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: ${(prop) => prop.theme.colors.black.dark};
  border-radius: ${(prop) => prop.theme.borderRadius};
  overflow: hidden;
`;

const BigNowTvImg = styled.div<{ tvPoster: string }>`
  background-image: url(${(prop) => prop.tvPoster});
  background-size: cover;
  background-position: center center;
  height: 50%;
`;

const BigPopTvImg = styled.div<{ popPoster: string }>`
  background-image: url(${(prop) => prop.popPoster});
  background-size: cover;
  background-position: center center;
  background-color: red;
  height: 50%;
`;

const TvInfo = styled.div`
  padding: 1em;
  display: flex;
  height: 50%;
`;

const TvDescription = styled.div`
  margin-top: 1.5em;
  height: 100%;
  width: 50%;
  color: ${(props) => props.theme.colors.white.dark};
`;

const TvTitle = styled.p`
  margin-top: 1.2em;
  color: ${(props) => props.theme.colors.active};
  font-size: 1.2rem;
  font-weight: 600;
  top: 44%;
  position: absolute;
  @media screen and (max-width: 40em) {
    font-size: 0.9rem;
  }
`;

const TvOverview = styled.p`
  overflow-y: scroll;
  font-size: 0.9rem;
  width: fit-content;
  height: 100%;
  @media screen and (max-width: 40em) {
    font-size: 0.8rem;
  }
`;

const TvMetaInfo = styled.div`
  width: 50%;
  height: 100%;
`;

const InfoIcon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 20%;
`;

const ButtonBox = styled.div`
  button {
    border: none;
    color: ${(props) => props.theme.colors.white.dark};
    position: relative;
    transition: all 0.3s ease-in-out;
    font-size: 1.2rem;
    @media screen and (max-width: 40em) {
      font-size: 0.8rem;
    }
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
  width: 65%;
  height: 1px;
`;

const TvFirstOnAir = styled.div`
  margin-top: 2em;
  color: ${(prop) => prop.theme.colors.white.dark};
  font-size: 0.9rem;
  display: flex;
  justify-content: center;
  width: 100%;
  @media screen and (max-width: 40em) {
    font-size: 0.8rem;
  }
`;

const TvVote = styled.div`
  margin-top: 2em;
  color: ${(prop) => prop.theme.colors.white.dark};
  font-size: 0.9rem;
  display: flex;
  justify-content: center;
  width: 100%;
  @media screen and (max-width: 40em) {
    font-size: 0.8rem;
  }
`;

const OverlayerVariants = {
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

const OFFSET = 6;

const Tv = () => {
  const [isBack, setIsBack] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const nowTvMatch = useMatch("/tv/now/:tvId");
  const popTvMatch = useMatch("/tv/popular/:tvName");
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const { isLoading: popShowLoading, data: popShowData } = useQuery<IGetTvShow>(
    ["tvShows", "popShow"],
    getPopTvShow
  );
  const { isLoading: nowShowLoading, data: nowShowData } = useQuery<IGetTvShow>(
    ["tvShows", "nowShow"],
    getNowTvShow
  );

  const clickNowTv =
    nowTvMatch?.params.tvId &&
    nowShowData?.results.find(
      (tv) => tv.id === Number(nowTvMatch?.params.tvId)
    );

  const clickPopTv =
    popTvMatch?.params.tvName &&
    popShowData?.results.find((tv) => tv.name === popTvMatch?.params.tvName);

  const [nowPage, setNowPage] = useState(0);
  const [popPage, setPopPage] = useState(0);

  const nowShowingItems = () => {
    if (nowShowData) {
      if (leaving) return;
      toggleLeaving();
      const totalNowShow = nowShowData?.results.length - 1;
      const maxNowShowPage = Math.floor(totalNowShow / OFFSET - 1);
      setNowPage((nowPage) => (nowPage === maxNowShowPage ? 0 : nowPage + 1));
    }
  };

  const popShowingItems = () => {
    if (popShowData) {
      if (leaving) return;
      toggleLeaving();
      const totalPopShow = popShowData?.results.length;
      const maxPopsShowPage = Math.floor(totalPopShow / OFFSET - 1);
      isBack
        ? setPopPage((oldPage) =>
            oldPage === 0 ? maxPopsShowPage : oldPage - 1
          )
        : setPopPage((oldPage) =>
            oldPage === maxPopsShowPage ? 0 : oldPage + 1
          );
    }
    return;
  };

  const toggleLeaving = () => setLeaving((pre) => !pre);
  const toggleOverlayer = () => {
    navigate("/tv");
  };

  const nowShowingTvId = (tvId: number) => {
    navigate(`/tv/now/${tvId}`);
  };
  const popShowingTvId = (tvName: string) => {
    navigate(`/tv/popular/${tvName}`);
  };

  const rightDirection = () => {
    setIsBack(false);
  };

  const leftDirection = () => {
    setIsBack(true);
  };

  const isLoading = popShowLoading || nowShowLoading;

  return (
    <Main>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          {/* Banner */}
          <Banner
            banner={makeImage(nowShowData?.results[0].backdrop_path || "")}
          >
            <BannerDescription>
              <BannerTitle>{nowShowData?.results[0].name}</BannerTitle>
              <BannerOverview>
                {nowShowData?.results[0]?.overview
                  ? nowShowData?.results[0]?.overview
                  : null}
              </BannerOverview>
            </BannerDescription>
          </Banner>
          {/* Slider */}
          <SliderBox>
            {/* Now TV Show */}
            <SliderTitle>Now Playing</SliderTitle>
            <NowShowSlider>
              <AnimatePresence
                custom={isBack}
                initial={false}
                key="NowSlider"
                onExitComplete={toggleLeaving}
              >
                <NowShowRows
                  custom={isBack}
                  key={nowPage}
                  variants={nowShowRowsVariants}
                  initial="initial"
                  animate="visible"
                  exit="exit"
                  transition={{
                    type: "tween",
                    duration: 1,
                  }}
                >
                  {nowShowData?.results
                    .slice(OFFSET * nowPage, OFFSET * nowPage + OFFSET)
                    .map((show) => (
                      <NowShowItem
                        layoutId={show.id + ""}
                        onClick={() => nowShowingTvId(show.id)}
                        variants={rowItemVariants}
                        whileHover="hover"
                        key={show.id}
                        poster={makeImage(show?.poster_path)}
                      ></NowShowItem>
                    ))}
                </NowShowRows>
              </AnimatePresence>
              <TvRight
                onClick={() => {
                  nowShowingItems();
                  rightDirection();
                }}
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
              </TvRight>
              <TvLeft
                onClick={() => {
                  nowShowingItems();
                  leftDirection();
                }}
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
              </TvLeft>
            </NowShowSlider>
            {/* Popular TV Show */}
            <SliderTitle>Popular</SliderTitle>
            <PopularSlider>
              <AnimatePresence
                initial={false}
                key="PopularSlider"
                custom={isBack}
                onExitComplete={toggleLeaving}
              >
                <PopularRows
                  key={popPage}
                  variants={nowShowRowsVariants}
                  custom={isBack}
                  initial="initial"
                  animate="visible"
                  exit="exit"
                  transition={{
                    type: "tween",
                    duration: 1,
                  }}
                >
                  {popShowData?.results
                    .slice(1)
                    .slice(OFFSET * popPage, OFFSET * popPage + OFFSET)
                    .map((show) => (
                      <PopShowItem
                        layoutId={show.name}
                        onClick={() => popShowingTvId(show.name)}
                        variants={rowItemVariants}
                        whileHover="hover"
                        poster={makeImage(show.poster_path)}
                        key={show.name}
                      ></PopShowItem>
                    ))}
                </PopularRows>
              </AnimatePresence>
              <TvRight
                onClick={() => {
                  rightDirection();
                  popShowingItems();
                }}
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
              </TvRight>
              <TvLeft
                onClick={() => {
                  leftDirection();
                  popShowingItems();
                }}
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
              </TvLeft>
            </PopularSlider>
          </SliderBox>
        </>
      )}
      {/* Overlay */}
      <AnimatePresence>
        {nowTvMatch?.params.tvId ? (
          <>
            <NowOverLayer
              onClick={toggleOverlayer}
              variants={OverlayerVariants}
              initial="initial"
              animate="visible"
              exit="exit"
            ></NowOverLayer>
            <BigNowTvShow
              layoutId={nowTvMatch.params.tvId}
              transition={{ duration: 0.7 }}
              style={{ top: scrollY.get() + 200 }}
            >
              {clickNowTv && (
                <>
                  <BigNowTvImg
                    tvPoster={makeImage(clickNowTv.backdrop_path, "w500")}
                  ></BigNowTvImg>
                  <TvInfo>
                    <TvDescription>
                      <TvTitle>{clickNowTv.name}</TvTitle>
                      <TvOverview>{clickNowTv.overview}</TvOverview>
                    </TvDescription>

                    <TvMetaInfo>
                      <InfoIcon>
                        <ButtonBox>
                          <button>
                            <FontAwesomeIcon icon={faHeart} />
                          </button>
                          <button>
                            <FontAwesomeIcon icon={faHandPointUp} />
                          </button>
                          <button>
                            <FontAwesomeIcon icon={faHandPointDown} />
                          </button>
                        </ButtonBox>
                        <Line></Line>
                      </InfoIcon>
                      <TvFirstOnAir>
                        <p>First Air Date : {clickNowTv.first_air_date}</p>
                      </TvFirstOnAir>
                      <TvVote>
                        <p>Vote Average : {clickNowTv.vote_average}</p>
                      </TvVote>
                    </TvMetaInfo>
                  </TvInfo>
                </>
              )}
            </BigNowTvShow>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {popTvMatch?.params.tvName ? (
          <>
            <PopOverLayer
              onClick={toggleOverlayer}
              variants={OverlayerVariants}
              initial="initial"
              animate="visible"
              exit="exit"
            ></PopOverLayer>
            <BigPopTvShow
              layoutId={popTvMatch.params.tvName}
              transition={{ duration: 0.7 }}
              style={{ top: scrollY.get() + 200 }}
            >
              {clickPopTv && (
                <>
                  <BigPopTvImg
                    popPoster={makeImage(clickPopTv?.backdrop_path, "w500")}
                  ></BigPopTvImg>
                  <TvInfo>
                    <TvDescription>
                      <TvTitle>{clickPopTv.name}</TvTitle>
                      <TvOverview>{clickPopTv.overview}</TvOverview>
                    </TvDescription>

                    <TvMetaInfo>
                      <InfoIcon>
                        <ButtonBox>
                          <motion.button>
                            <FontAwesomeIcon icon={faHeart} />
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
                      <TvFirstOnAir>
                        <p>First Air Date : {clickPopTv.first_air_date}</p>
                      </TvFirstOnAir>
                      <TvVote>
                        <p>Vote Average : {clickPopTv.vote_average}</p>
                      </TvVote>
                    </TvMetaInfo>
                  </TvInfo>
                </>
              )}
            </BigPopTvShow>
          </>
        ) : null}
      </AnimatePresence>
    </Main>
  );
};

export default Tv;
