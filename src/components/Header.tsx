import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Link, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Navbar = styled(motion.nav)`
  position: fixed;
  color: ${(props) => props.theme.colors.white.white};
  font-weight: 600;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${(props) => props.theme.colors.black.black};
  @media screen and (max-width: 43em) {
    font-size: 0.875rem;
  }
`;

const Column = styled.div`
  display: flex;

  align-items: center;
`;

const Log = styled(motion.svg)`
  color: red;
  width: 1.7rem;
  height: 1.7rem;
`;

const PageDivider = styled.div`
  display: flex;
  margin: 0 1em;
  font-size: 0.8rem;
  width: 100%;
`;

const HomePage = styled.div`
  margin-right: 1em;
`;

const TvPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PageMark = styled(motion.div)`
  margin: auto;
  margin-top: 0.2em;
  width: 0.3em;
  height: 0.3em;
  background-color: ${(props) => props.theme.colors.red};
  border-radius: 50%;
`;

const Search = styled.form`
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
`;

const SearchInput = styled(motion.input)`
  color: ${(props) => props.theme.colors.white.dark};
  position: absolute;
  left: -13em;
  height: 2em;
  padding: 0 0 0 2.3em;
  border-radius: ${(props) => props.theme.borderRadius};
  border: 1px solid ${(props) => props.theme.colors.white.white};
  background-color: transparent;
  transform-origin: right center;
  &::placeholder {
    font-size: 0.8rem;
  }
`;

const SearchIcon = styled(motion.svg)`
  cursor: pointer;
  position: absolute;
  z-index: 1;
  right: 0.5em;
  width: 1em;
  height: 1em;
`;

const logVariants = {
  end: {
    opacity: [1, 0, 1],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants = {
  top: {
    backgroundColor: "rgba(0,0,0,0)",
  },
  scroll: {
    backgroundColor: "rgba(0,0,0,1)",
  },
};

interface IForm {
  keyword: string;
}

const Header = () => {
  const navigate = useNavigate();
  const homeMatch = useMatch("/");
  const tvMatch = useMatch("/tv");
  const [showingSearch, setShowingSearch] = useState(false);
  const onShowingSearch = () => {
    setShowingSearch((pre) => !pre);
  };
  const { scrollY } = useViewportScroll();
  const navAnimation = useAnimation();

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 70) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation]);

  const { register, handleSubmit, setValue } = useForm<IForm>();

  const onValid = (data: IForm) => {
    setValue("keyword", "");
    navigate(`/search?keyword=${data.keyword}`);
  };

  return (
    <Navbar variants={navVariants} initial="top" animate={navAnimation}>
      <Column>
        <Log
          variants={logVariants}
          whileHover="end"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 536 512"
        >
          <path
            fill="currentColor"
            d="M508.55 171.51L362.18 150.2 296.77 17.81C290.89 5.98 279.42 0 267.95 0c-11.4 0-22.79 5.9-28.69 17.81l-65.43 132.38-146.38 21.29c-26.25 3.8-36.77 36.09-17.74 54.59l105.89 103-25.06 145.48C86.98 495.33 103.57 512 122.15 512c4.93 0 10-1.17 14.87-3.75l130.95-68.68 130.94 68.7c4.86 2.55 9.92 3.71 14.83 3.71 18.6 0 35.22-16.61 31.66-37.4l-25.03-145.49 105.91-102.98c19.04-18.5 8.52-50.8-17.73-54.6zm-121.74 123.2l-18.12 17.62 4.28 24.88 19.52 113.45-102.13-53.59-22.38-11.74.03-317.19 51.03 103.29 11.18 22.63 25.01 3.64 114.23 16.63-82.65 80.38z"
          ></path>
        </Log>
        <PageDivider>
          <Link to="/">
            <HomePage>
              Movie {homeMatch && <PageMark layoutId="circle" />}
            </HomePage>
          </Link>
          <Link to="/tv">
            <TvPage>
              TV Show
              {tvMatch && <PageMark layoutId="circle" />}
            </TvPage>
          </Link>
        </PageDivider>
      </Column>

      <Column>
        <Search onSubmit={handleSubmit(onValid)}>
          <SearchIcon
            onClick={onShowingSearch}
            animate={{ x: showingSearch ? -140 : 0 }}
            transition={{ type: "tween" }}
            focusable="false"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
            ></path>
          </SearchIcon>

          <SearchInput
            {...register("keyword", { required: true, minLength: 1 })}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: showingSearch ? 1 : 0 }}
            transition={{ type: "tween" }}
            placeholder="Search Movies or TV Shows"
          />
        </Search>
      </Column>
    </Navbar>
  );
};

export default Header;
