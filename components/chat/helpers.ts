export const scrollToPercentage = (
  percent: number,
  containerRef: React.RefObject<HTMLElement>,
) => {
  const container = containerRef.current;
  if (container) {
    const scrollPosition = container.scrollHeight * (percent / 100);
    container.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  }
};

export const scrollToEnd = (containerRef: React.RefObject<HTMLElement>) => {
  const container = containerRef.current;
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    }); //  might need to adjust this if there's a fixed header/footer.
  }
};
