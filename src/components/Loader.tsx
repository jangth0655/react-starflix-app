import styled from "styled-components";

const Loading = styled.div`
  background-color: ${(props) => props.theme.colors.black.dark};
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingCircle = styled.div`
  width: 3em;
  height: 3em;
  border-radius: 50%;
  border: 3.5px solid white;
  animation: 0.2s linear infinite spinner;

  @keyframes spinner {
    0% {
      border-top: ${(props) => props.theme.colors.red};
    }
    25% {
      border-right: ${(props) => props.theme.colors.active};
    }
    50% {
      border-bottom: ${(props) => props.theme.colors.red};
    }
    75% {
      border-left: ${(props) => props.theme.colors.red};
    }
    100% {
      border-top: ${(props) => props.theme.colors.red};
    }
  }
`;

const Title = styled.p`
  margin-top: 3em;
  color: ${(props) => props.theme.colors.white.dark};
  font-size: 2rem;
  font-weight: 600;
  font-style: italic;
`;

const Loader = () => {
  return (
    <Loading>
      <LoadingCircle></LoadingCircle>
      <Title>Loading ...</Title>
    </Loading>
  );
};

export default Loader;
