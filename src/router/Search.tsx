import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearchItem, ISearch } from "../Search-api";
import { makeImage } from "../utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointUp } from "@fortawesome/free-solid-svg-icons";
import { faHandPointDown } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/Loader";

const Main = styled.div`
  display: flex;
  height: 100vh;
  @media screen and (max-width: 43em) {
    font-size: 0.8rem;
    flex-direction: column;
  }
`;

const Item = styled.div`
  flex-basis: 70%;
  margin-top: 3em;
  padding: 1em;
  @media screen and (max-width: 43em) {
    margin-top: 5em;
  }
`;

const ItemImg = styled.div<{ bgPoster: string }>`
  border-radius: ${(props) => props.theme.borderRadius};
  width: 100%;
  height: 70%;
  background-image: url(${(prop) => prop.bgPoster});
  background-size: cover;
  background-position: center center;
`;

const ItemInfo = styled.div`
  height: 30%;
  padding: 1em;
  @media screen and (max-width: 43em) {
    margin-top: 2em;
  }
`;

const ItemDescription = styled.div``;

const ItemTitle = styled.p`
  color: ${(prop) => prop.theme.colors.active};
  font-size: 1.2rem;
  font-weight: 600;
`;

const ItemIconBox = styled.div`
  margin-top: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    font-size: 1rem;
    color: ${(prop) => prop.theme.colors.white.dark};
    background-color: transparent;
    outline: none;
    border: none;
    transition: all 0.3s ease-in-out;
    &:hover {
      color: ${(prop) => prop.theme.colors.red};
    }
    span {
      display: block;
      padding: 0.3em 0;
      font-size: 0.8rem;
    }
  }
  @media screen and (max-width: 43em) {
    margin-top: 2em;
  }
`;

const Line = styled.div`
  margin-top: 1em;
  opacity: 0.3;
  background-color: ${(prop) => prop.theme.colors.active};
  width: 100%;
  height: 1px;
  @media screen and (max-width: 43em) {
    margin-top: 2em;
  }
`;

const OverView = styled.div`
  overflow-y: scroll;
  width: fit-content;
  margin-top: 1em;
  height: 5em;
  line-height: 1.5;
  p {
    font-size: 0.9rem;
    font-style: italic;
    color: ${(prop) => prop.theme.colors.white.dark};
  }
  @media screen and (max-width: 43em) {
    margin-top: 2em;
  }
`;

const ItemListUl = styled.ul`
  height: 100%;
  overflow-y: scroll;
  flex-basis: 30%;
  margin-top: 3em;
  padding: 1em;
  @media screen and (max-width: 43em) {
    display: none;
  }
`;

const ItemListLi = styled.li`
  height: 10em;
  margin-bottom: 0.5em;
`;

const ListImage = styled.div<{ bgImage: string }>`
  background-image: url(${(prop) => prop.bgImage});
  background-size: cover;
  background-position: center center;
  height: 100%;
`;

const ListTitle = styled.div`
  color: ${(props) => props.theme.colors.white.dark};
  height: 1em;
`;

const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { isLoading, data } = useQuery<ISearch>(["search", "multi"], () =>
    getSearchItem(keyword as string)
  );

  return isLoading ? (
    <Loader />
  ) : (
    <Main>
      {/* Item */}
      <Item>
        <ItemImg
          bgPoster={makeImage(
            data?.results[0]?.backdrop_path
              ? data?.results[0]?.backdrop_path
              : data?.results[0]?.poster_path || "",
            "w500"
          )}
        ></ItemImg>
        <ItemInfo>
          <ItemDescription>
            <ItemTitle>{data?.results[0]?.title}</ItemTitle>
            <ItemIconBox>
              <button>
                <FontAwesomeIcon icon={faSave} />
                <span>저장</span>
              </button>
              <button>
                <FontAwesomeIcon icon={faHandPointUp} />
                <span>좋아요</span>
              </button>
              <button>
                <FontAwesomeIcon icon={faHandPointDown} />
                <span>싫어요</span>
              </button>
              <button>
                <FontAwesomeIcon icon={faShare} />
                <span>공유</span>
              </button>
            </ItemIconBox>
            <Line></Line>
            <OverView>
              <p>{data?.results[0].overview}</p>
            </OverView>
          </ItemDescription>
        </ItemInfo>
      </Item>
      {/* Item-List */}
      <ItemListUl>
        {data?.results.map((item) => (
          <ItemListLi key={item.id}>
            <ListImage
              bgImage={makeImage(
                item.backdrop_path ? item.backdrop_path : item.poster_path
              )}
            ></ListImage>
            <ListTitle></ListTitle>
          </ItemListLi>
        ))}
      </ItemListUl>
    </Main>
  );
};

export default Search;
